import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdminClient } from '@/lib/supabase-admin';
import { sendEmail, generateConsumerWelcomeEmail, generateOwnerWelcomeEmail } from '@/lib/email';
import { RateLimiter } from '@/lib/rate-limiter';

export const dynamic = 'force-dynamic';

// Use build-safe admin client
const supabase = supabaseAdminClient;

// Rate limiter: 5 requests per minute per IP
const rateLimiter = new RateLimiter({
    maxRequests: 5,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many subscription requests. Please try again later.',
});

interface SubscribeRequest {
    email: string;
    type: 'owner' | 'consumer';
    source?: string;
    parkName?: string;
    location?: string;
}

export async function POST(req: NextRequest) {
    try {
        if (!supabase) {
            console.error('Supabase client not initialized - check environment variables');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        // Get IP for rate limiting
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ||
            req.headers.get('x-real-ip') ||
            'unknown';

        // Check rate limit
        const rateLimitResult = rateLimiter.check(ip);
        if (!rateLimitResult.allowed) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }

        // Parse request body (support both JSON fetch and plain HTML form posts)
        const contentType = req.headers.get('content-type') || '';
        let email: string | undefined;
        let type: 'owner' | 'consumer' | undefined;
        let source: string | undefined;
        let parkName: string | undefined;
        let location: string | undefined;

        if (contentType.includes('application/json')) {
            const body = await req.json() as SubscribeRequest;
            email = body.email;
            type = body.type;
            source = body.source;
            parkName = body.parkName;
            location = body.location;
        } else {
            const form = await req.formData();
            email = typeof form.get('email') === 'string' ? String(form.get('email')) : undefined;
            const rawType = typeof form.get('type') === 'string' ? String(form.get('type')) : 'consumer';
            type = rawType === 'owner' ? 'owner' : 'consumer';
            source = typeof form.get('source') === 'string' ? String(form.get('source')) : undefined;
            parkName = typeof form.get('parkName') === 'string' ? String(form.get('parkName')) : undefined;
            location = typeof form.get('location') === 'string' ? String(form.get('location')) : undefined;
        }

        // Validate inputs
        if (!email || !type) {
            return NextResponse.json(
                { error: 'Email and type are required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Validate type
        if (type !== 'owner' && type !== 'consumer') {
            return NextResponse.json(
                { error: 'Type must be either "owner" or "consumer"' },
                { status: 400 }
            );
        }

        // Handle additional fields for owners
        const metadata: Record<string, string> = {};
        if (type === 'owner') {
            if (parkName) metadata.parkName = parkName;
            if (location) metadata.location = location;
        }

        // Check if subscriber already exists
        const { data: existingSubscriber } = await supabase
            .from('subscribers')
            .select('id, status, metadata')
            .eq('email', email.toLowerCase())
            .single();

        // If subscriber exists and is active, return success (idempotent)
        if (existingSubscriber) {
            // Merge new metadata with existing
            const updatedMetadata = { ...existingSubscriber.metadata as object, ...metadata };

            // Should we update metadata for existing users? Yes, might as well capture it.
            if (Object.keys(metadata).length > 0 || existingSubscriber.status !== 'active') {
                await supabase
                    .from('subscribers')
                    .update({
                        status: 'active',
                        updated_at: new Date().toISOString(),
                        metadata: updatedMetadata
                    })
                    .eq('email', email.toLowerCase());
            }

            if (existingSubscriber.status === 'active') {
                return NextResponse.json({
                    success: true,
                    message: 'Already subscribed',
                    alreadySubscribed: true,
                });
            } else {
                return NextResponse.json({
                    success: true,
                    message: 'Subscription reactivated',
                });
            }
        }

        // Insert new subscriber
        const { error: insertError } = await supabase
            .from('subscribers')
            .insert({
                email: email.toLowerCase(),
                type,
                source: source || 'unknown',
                status: 'active',
                metadata,
            });

        if (insertError) {
            console.error('Error inserting subscriber to Supabase (bypassing due to restrictions):', insertError);
            // We intentionally do NOT return a 500 error here. 
            // Since Supabase is restricted, we just log the error and continue 
            // so the subscriber still gets added to Beehiiv!
        }

        // ==========================================
        // BEEHIIV INTEGRATION
        // ==========================================
        const beehiivApiKey = process.env.BEEHIIV_API_KEY;
        const beehiivPubId = process.env.BEEHIIV_PUBLICATION_ID;

        if (beehiivApiKey && beehiivPubId) {
            try {
                // Format custom fields for Beehiiv
                const customFields = [
                    { name: 'type', value: type },
                    { name: 'source', value: source || 'website' }
                ];
                if (parkName) customFields.push({ name: 'parkName', value: parkName });
                if (location) customFields.push({ name: 'location', value: location });

                const beehiivResponse = await fetch(`https://api.beehiiv.com/v2/publications/${beehiivPubId}/subscriptions`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${beehiivApiKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email.toLowerCase(),
                        reactivate_existing: true,
                        send_welcome_email: false, // We send our own welcome email below
                        utm_source: source || 'indoordogpark_website',
                        custom_fields: customFields
                    })
                });

                if (!beehiivResponse.ok) {
                    const errText = await beehiivResponse.text();
                    console.error('Failed to sync with Beehiiv:', errText);
                } else {
                    console.log(`Successfully synced ${email} to Beehiiv`);
                }
            } catch (err) {
                console.error('Error syncing to Beehiiv:', err);
                // Don't fail the request if Beehiiv sync fails
            }
        }

        // Send welcome email based on type
        const welcomeHtml =
            type === 'consumer'
                ? await generateConsumerWelcomeEmail(email)
                : await generateOwnerWelcomeEmail();

        const emailSubject = type === 'consumer'
            ? '🐕 Welcome to IndoorDogPark.org!'
            : '🤝 Welcome to Our Partner Network!';

        // Send email (non-blocking - don't fail if email fails)
        await sendEmail({
            to: email,
            subject: emailSubject,
            html: welcomeHtml,
            replyTo: 'media@indoordogpark.org'
        }).catch((error) => {
            console.error('Failed to send welcome email:', error);
            // Log but don't fail the request
        });

        return NextResponse.json({
            success: true,
            message: 'Successfully subscribed! Check your email for a welcome message.',
        });

    } catch (error) {
        console.error('Newsletter subscribe error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}

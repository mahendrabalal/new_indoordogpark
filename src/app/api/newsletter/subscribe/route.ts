import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail, generateConsumerWelcomeEmail, generateOwnerWelcomeEmail } from '@/lib/email';
import { RateLimiter } from '@/lib/rate-limiter';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
}

export async function POST(req: NextRequest) {
    try {
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

        // Parse request body
        const body = await req.json() as SubscribeRequest;
        const { email, type, source } = body;

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

        // Check if subscriber already exists
        const { data: existingSubscriber } = await supabase
            .from('subscribers')
            .select('id, status')
            .eq('email', email.toLowerCase())
            .single();

        // If subscriber exists and is active, return success (idempotent)
        if (existingSubscriber) {
            if (existingSubscriber.status === 'active') {
                return NextResponse.json({
                    success: true,
                    message: 'Already subscribed',
                    alreadySubscribed: true,
                });
            } else {
                // Reactivate if they were unsubscribed
                await supabase
                    .from('subscribers')
                    .update({ status: 'active', updated_at: new Date().toISOString() })
                    .eq('email', email.toLowerCase());

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
            });

        if (insertError) {
            console.error('Error inserting subscriber:', insertError);
            return NextResponse.json(
                { error: 'Failed to subscribe. Please try again.' },
                { status: 500 }
            );
        }

        // Send welcome email based on type
        const welcomeEmailHtml = type === 'consumer'
            ? generateConsumerWelcomeEmail(email)
            : generateOwnerWelcomeEmail(email);

        const emailSubject = type === 'consumer'
            ? '🐕 Welcome to IndoorDogPark.org!'
            : '🤝 Welcome to Our Partner Network!';

        // Send email (non-blocking - don't fail if email fails)
        sendEmail({
            to: email,
            subject: emailSubject,
            html: welcomeEmailHtml,
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

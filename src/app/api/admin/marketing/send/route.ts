
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import BlogPostEmail from '@/emails/BlogPostEmail';
import MarketingEmail from '@/emails/MarketingEmail';
import { fetchPostBySlug } from '@/lib/sanity-api';
import { createClient } from '@supabase/supabase-js';

// Initialize Clients
const resend = new Resend(process.env.RESEND_API_KEY);

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // Allow 5 minutes for execution (if on Pro, otherwise 10s limit might apply)

export async function POST(request: NextRequest) {
    try {
        // 1. Auth Check
        const supabase = createServerClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userMetadata = user.user_metadata as { role?: string } | undefined;
        if (userMetadata?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // 2. Parse Body
        const body = await request.json();
        const { template, segment, data, testEmail } = body;

        if (!template || !segment) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 3. Prepare Email Content
        let emailHtml = '';
        let subject = '';

        if (template === 'blog') {
            const { slug } = data;
            const post = await fetchPostBySlug(slug);

            if (!post) {
                console.error(`[marketing:send] Blog post not found: ${slug}`);
                return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
            }

            subject = `New Post: ${post.title}`;

            // Use featured image URL directly if available
            const imageUrl = post.featuredImage?.source_url;

            const emailComponent = BlogPostEmail({
                title: post.title,
                excerpt: post.excerpt || 'Read our latest article!',
                slug: post.slug,
                imageUrl,
                email: '{{email}}', // Placeholder
            });

            try {
                emailHtml = await render(emailComponent);
            } catch (renderError) {
                console.error('[marketing:send] Render error (blog):', renderError);
                throw renderError;
            }

        } else if (template === 'marketing') {
            const { headline, bodyContent, ctaText, ctaUrl, imageUrl } = data;
            subject = data.subject || headline;

            const emailComponent = MarketingEmail({
                headline,
                bodyContent,
                ctaText,
                ctaUrl,
                imageUrl,
                email: '{{email}}', // Placeholder
            });

            try {
                emailHtml = await render(emailComponent);
            } catch (renderError) {
                console.error('[marketing:send] Render error (marketing):', renderError);
                throw renderError;
            }
        } else {
            return NextResponse.json({ error: 'Invalid template type' }, { status: 400 });
        }

        // 4. Determine Recipients
        let recipients: { email: string; id?: string }[] = [];

        if (testEmail) {
            recipients = [{ email: testEmail }];
        } else {
            // Fetch from Supabase based on segment
            const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

            if (!serviceRoleKey || !supabaseUrl) {
                return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
            }

            const adminClient = createClient(supabaseUrl, serviceRoleKey);

            let query = adminClient.from('subscribers').select('email, id').eq('status', 'active');

            if (segment === 'owners') {
                query = query.eq('type', 'owner');
            } else if (segment === 'consumers') {
                query = query.eq('type', 'consumer');
            }
            // 'all' needs no filter on type

            const { data: subscribers, error } = await query;

            if (error) {
                console.error('Database error:', error);
                return NextResponse.json({ error: 'Database error' }, { status: 500 });
            }

            recipients = subscribers || [];
        }

        if (recipients.length === 0) {
            return NextResponse.json({ message: 'No recipients found', sent: 0 });
        }

        // 5. Send Emails (Batching)
        // Vercel limit is strict. We'll do a simple loop but acknowledge this might timeout for >50 users.
        // For 'Pro' verification, we should implement a Queue, but for this 'MVP', we loop.

        // 5. Send Emails (Sequential with Delay for Rate Limiting)
        // User is on a tier limiting to 2 req/s. We will send 1 per second to be safe.
        let successCount = 0;
        let failCount = 0;
        const details: { email: string; status: 'success' | 'failed'; error?: string }[] = [];

        for (const recipient of recipients) {
            try {
                // Handle both literal and URL-encoded placeholders
                const personalizedHtml = emailHtml
                    .replace(/\{\{email\}\}/g, encodeURIComponent(recipient.email))
                    .replace(/%7B%7Bemail%7D%7D/g, encodeURIComponent(recipient.email));

                const { error: sendError } = await resend.emails.send({
                    from: 'IndoorDogPark <newsletter@indoordogpark.org>',
                    to: recipient.email,
                    subject: subject,
                    html: personalizedHtml,
                    replyTo: 'media@indoordogpark.org',
                });

                if (sendError) {
                    console.error(`Failed to send to ${recipient.email}:`, sendError);
                    failCount++;
                    details.push({ email: recipient.email, status: 'failed', error: sendError.message });

                    // If rate limit hit, wait longer
                    if (sendError.message.includes('Too many requests')) {
                        await new Promise(r => setTimeout(r, 2000));
                    }
                } else {
                    successCount++;
                    details.push({ email: recipient.email, status: 'success' });
                }
            } catch (e: unknown) {
                const errorMessage = e instanceof Error ? e.message : 'Unknown error';
                console.error(`Exception sending to ${recipient.email}:`, e);
                failCount++;
                details.push({ email: recipient.email, status: 'failed', error: errorMessage });
            }

            // Strict rate limiting: Wait 1 second between emails
            // This ensures we never exceed ~1 req/sec, safely under the 2 req/sec limit.
            await new Promise(r => setTimeout(r, 1000));
        }

        return NextResponse.json({
            success: true,
            message: `Sent to ${successCount} recipients. Failed: ${failCount}`,
            total: recipients.length,
            details: details
        });

    } catch (error) {
        console.error('Marketing send error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

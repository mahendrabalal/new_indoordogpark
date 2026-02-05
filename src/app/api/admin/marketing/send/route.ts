
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import BlogPostEmail from '@/emails/BlogPostEmail';
import MarketingEmail from '@/emails/MarketingEmail';
import ParkOutreachEmail from '@/emails/ParkOutreachEmail';
import { fetchPostBySlug } from '@/lib/sanity-api';
import { createClient } from '@supabase/supabase-js';
import * as React from 'react';

interface Recipient {
    email: string;
    id?: string;
}

interface SubscriberMetadata {
    parkName?: string;
    location?: string;
}

interface EmailLogDetail {
    email: string;
    status: 'success' | 'failed';
    error?: string;
}

// Initialize Clients
const resend = new Resend(process.env.RESEND_API_KEY);

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        // 1. Auth Check
        const supabase = await createServerClient();
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
                return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
            }

            subject = `New Post: ${post.title}`;

            const emailComponent = React.createElement(BlogPostEmail, {
                title: post.title,
                excerpt: post.excerpt || 'Read our latest article!',
                slug: post.slug,
                imageUrl: post.featuredImage?.source_url,
                email: '{{email}}',
            });

            emailHtml = await render(emailComponent);

        } else if (template === 'outreach') {
            const { parkId, personalizedNote } = data;

            const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const adminClient = createClient(supabaseUrl!, serviceRoleKey!);

            // Try park_submissions first
            const { data: initialPark, error: parkError } = await adminClient
                .from('park_submissions')
                .select('*')
                .eq('id', parkId)
                .single();

            let park = initialPark;

            // If not found, try subscribers
            if (parkError || !park) {
                const { data: subscriber, error: subscriberError } = await adminClient
                    .from('subscribers')
                    .select('*')
                    .eq('id', parkId)
                    .single();

                if (subscriberError || !subscriber) {
                    return NextResponse.json({ error: 'Park not found' }, { status: 404 });
                }

                // Map subscriber format to park format for the email template
                const metadata = subscriber.metadata as SubscriberMetadata | null;
                park = {
                    id: subscriber.id,
                    name: metadata?.parkName || subscriber.email,
                    city: metadata?.location?.split(',')[0]?.trim() || '',
                    state: metadata?.location?.split(',')[1]?.trim() || '',
                    email: subscriber.email,
                };
            }

            subject = `Partner with IndoorDogPark.org - Increase Visibility for ${park.name}`;

            const emailComponent = React.createElement(ParkOutreachEmail, {
                parkName: park.name,
                parkCity: park.city,
                parkState: park.state,
                parkEmail: park.email,
                personalizedNote: personalizedNote,
                baseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://indoordogpark.org',
            });

            emailHtml = await render(emailComponent);

        } else if (template === 'marketing' || template === 'generic') {
            const { headline, bodyContent, ctaText, ctaUrl, imageUrl } = data;
            subject = data.subject || headline;

            const emailComponent = React.createElement(MarketingEmail, {
                headline,
                bodyContent,
                ctaText,
                ctaUrl,
                imageUrl,
                email: '{{email}}',
            });

            emailHtml = await render(emailComponent);
        } else {
            return NextResponse.json({ error: 'Invalid template type' }, { status: 400 });
        }

        // 4. Determine Recipients
        let recipients: Recipient[] = [];

        if (testEmail) {
            recipients = [{ email: testEmail }];
        } else if (segment === 'specific-park') {
            const { parkId } = data;
            const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const adminClient = createClient(supabaseUrl!, serviceRoleKey!);

            // Check park_submissions
            const { data: park } = await adminClient
                .from('park_submissions')
                .select('email, id')
                .eq('id', parkId)
                .single();

            if (park && park.email) {
                recipients = [{ email: park.email, id: park.id }];
            } else {
                // Check subscribers if not found in submissions
                const { data: subscriber } = await adminClient
                    .from('subscribers')
                    .select('email, id')
                    .eq('id', parkId)
                    .single();

                if (subscriber && subscriber.email) {
                    recipients = [{ email: subscriber.email, id: subscriber.id }];
                }
            }
        } else {
            const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const adminClient = createClient(supabaseUrl!, serviceRoleKey!);

            let query = adminClient.from('subscribers').select('email, id').eq('status', 'active');

            if (segment === 'owners') {
                query = query.eq('type', 'owner');
            } else if (segment === 'consumers') {
                query = query.eq('type', 'consumer');
            }

            const { data: subscribers, error } = await query;
            if (error) throw error;
            recipients = subscribers || [];
        }

        if (recipients.length === 0) {
            return NextResponse.json({ message: 'No recipients found', sent: 0 });
        }

        // 5. Send Emails
        let successCount = 0;
        let failCount = 0;
        const details: EmailLogDetail[] = [];

        for (const recipient of recipients) {
            try {
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
                    failCount++;
                    details.push({ email: recipient.email, status: 'failed', error: sendError.message });
                } else if (!testEmail) {
                    successCount++;
                    details.push({ email: recipient.email, status: 'success' });

                    // Prepare admin client for updates
                    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
                    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
                    const adminClient = createClient(supabaseUrl!, serviceRoleKey!);

                    // Record outreach tracking if it's an outreach template and from park_submissions
                    if (template === 'outreach' && segment === 'specific-park' && recipient.id) {
                        try {
                            await adminClient
                                .from('park_submissions')
                                .update({
                                    last_outreach_sent_at: new Date().toISOString(),
                                    outreach_status: 'sent'
                                })
                                .eq('id', recipient.id);

                            // Also try to update subscribers table if they exist there too
                            await adminClient
                                .from('subscribers')
                                .update({
                                    last_outreach_sent_at: new Date().toISOString(),
                                    outreach_status: 'sent'
                                })
                                .eq('email', recipient.email.toLowerCase().trim());
                        } catch (updateError) {
                            console.error('Failed to update outreach tracking:', updateError);
                        }
                    }
                    // Record tracking for general subscribers (broadcasts)
                    else if (recipient.email) {
                        try {
                            await adminClient
                                .from('subscribers')
                                .update({
                                    last_outreach_sent_at: new Date().toISOString(),
                                    outreach_status: 'sent'
                                })
                                .eq('email', recipient.email.toLowerCase().trim());
                        } catch (updateError) {
                            console.error('Failed to update subscriber tracking:', updateError);
                        }
                    }
                }
            } catch (e) {
                const error = e as Error;
                failCount++;
                details.push({ email: recipient.email, status: 'failed', error: error.message });
            }
            await new Promise(r => setTimeout(r, 1000));
        }

        return NextResponse.json({
            success: true,
            message: `Sent to ${successCount} recipients. Failed: ${failCount}`,
            total: recipients.length,
            details: details
        });

    } catch (error) {
        const e = error as Error;
        console.error('Marketing send error:', e);
        return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
    }
}

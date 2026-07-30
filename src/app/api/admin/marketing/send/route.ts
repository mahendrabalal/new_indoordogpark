
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import BlogPostEmail from '@/emails/BlogPostEmail';
import MarketingEmail from '@/emails/MarketingEmail';
import ParkOutreachEmail from '@/emails/ParkOutreachEmail';
import { fetchPostBySlug } from '@/lib/sanity-api';
import { supabaseAdminClient } from '@/lib/supabase-admin';
import * as React from 'react';

interface Recipient {
    email: string;
    id?: string;
    metadata?: any;
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

const resendApiKey = process.env.RESEND_API_KEY;

// Validate API key - only throw if not in build environment
if (!resendApiKey) {
    if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PHASE && !process.env.OPEN_NEXT) {
        console.warn('Missing RESEND_API_KEY. Emails will not be sent.');
    }
}

const resend = resendApiKey
    ? new Resend(resendApiKey)
    : new Proxy({} as any, {
        get: (target, prop) => {
            return () => {
                console.warn(`Resend client method ${String(prop)} called during build or without configuration`);
                return Promise.resolve({ data: null, error: null });
            };
        }
    }) as unknown as Resend;

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

            if (segment !== 'bulk-outreach') {
                const adminClient = supabaseAdminClient;

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
                        slug: (metadata as any)?.parkSlug,
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
                    parkSlug: park.slug || park.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                    personalizedNote: personalizedNote,
                    baseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://indoordogpark.org',
                });

                emailHtml = await render(emailComponent);
            }

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
            const adminClient = supabaseAdminClient;

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
        } else if (segment === 'bulk-outreach') {
            const adminClient = supabaseAdminClient;
            
            // 1. Fetch all owners
            const { data: subscriberParks } = await adminClient
                .from('subscribers')
                .select('*')
                .eq('type', 'owner')
                .not('email', 'is', null);

            // 2. Fetch logs to exclude already sent
            const { data: campaignLogs } = await adminClient
                .from('email_campaign_logs')
                .select('recipient_email')
                .eq('campaign_name', 'badge_outreach');
                
            const badgeSentEmails = new Set((campaignLogs || []).map((log: any) => log.recipient_email.toLowerCase()));

            recipients = (subscriberParks || []).filter((park: any) => !badgeSentEmails.has(park.email.toLowerCase()));
            
            if (testEmail) {
                recipients = recipients.slice(0, 1);
                if (recipients.length > 0) {
                    recipients[0].email = testEmail;
                } else {
                    recipients = [{ email: testEmail, id: 'test-id' }];
                }
            }
        } else if (segment === 'single') {
            const { singleEmailAddress, singleEmailType, metadata } = data;
            if (!singleEmailAddress) {
                return NextResponse.json({ error: 'Email address is required for single subscriber' }, { status: 400 });
            }

            const email = singleEmailAddress.toLowerCase().trim();
            const adminClient = supabaseAdminClient;

            // Check if subscriber exists
            const { data: existingSubscriber } = await adminClient
                .from('subscribers')
                .select('id, email, status, metadata')
                .eq('email', email)
                .single();

            if (existingSubscriber) {
                if (existingSubscriber.status === 'unsubscribed') {
                    return NextResponse.json({ error: 'Cannot send to an unsubscribed email address' }, { status: 400 });
                }
                
                // Update metadata if provided
                if (metadata) {
                    await adminClient
                        .from('subscribers')
                        .update({ metadata: { ...((existingSubscriber.metadata as object) || {}), ...metadata } })
                        .eq('id', existingSubscriber.id);
                }
                
                recipients = [{ email: existingSubscriber.email, id: existingSubscriber.id }];
            } else {
                // Insert new subscriber
                const insertData: any = {
                    email: email,
                    type: singleEmailType || 'consumer',
                    source: 'manual_crm',
                    status: 'active'
                };
                
                if (metadata) {
                    insertData.metadata = metadata;
                }
                
                const { data: newSubscriber, error: insertError } = await adminClient
                    .from('subscribers')
                    .insert(insertData)
                    .select('id, email')
                    .single();

                if (insertError || !newSubscriber) {
                    console.error('Failed to insert new subscriber:', insertError);
                    return NextResponse.json({ error: 'Failed to add subscriber to database' }, { status: 500 });
                }

                recipients = [{ email: newSubscriber.email, id: newSubscriber.id }];
            }
        } else {
            const adminClient = supabaseAdminClient;

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

        // 5. Check Quota & Split
        const adminClient = supabaseAdminClient;
        const todayStart = new Date();
        todayStart.setUTCHours(0, 0, 0, 0);

        const { count: sentToday } = await adminClient
            .from('email_campaign_logs')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', todayStart.toISOString());

        // Max limit is 100 per day
        const DAILY_LIMIT = 100;
        const remainingQuota = Math.max(0, DAILY_LIMIT - (sentToday || 0));

        const recipientsToSendNow = recipients.slice(0, remainingQuota);
        const recipientsToQueue = recipients.slice(remainingQuota);

        // 6. Send Emails
        let successCount = 0;
        let failCount = 0;
        const details: EmailLogDetail[] = [];

        for (const recipient of recipientsToSendNow) {
            try {
                let currentHtml = emailHtml;
                let currentSubject = subject;

                if (template === 'outreach' && segment === 'bulk-outreach') {
                    const metadata = (recipient as any).metadata as SubscriberMetadata | null;
                    const parkName = metadata?.parkName || 'Indoor Dog Park';
                    const parkSlug = (metadata as any)?.parkSlug || parkName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    
                    currentSubject = `Partner with IndoorDogPark.org - Increase Visibility for ${parkName}`;
                    const emailComponent = React.createElement(ParkOutreachEmail, {
                        parkName: parkName,
                        parkCity: metadata?.location?.split(',')[0]?.trim() || '',
                        parkState: metadata?.location?.split(',')[1]?.trim() || '',
                        parkEmail: recipient.email,
                        parkSlug: parkSlug,
                        personalizedNote: data.personalizedNote,
                        baseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://indoordogpark.org',
                    });
                    currentHtml = await render(emailComponent);
                }

                const personalizedHtml = currentHtml
                    .replace(/\{\{email\}\}/g, encodeURIComponent(recipient.email))
                    .replace(/%7B%7Bemail%7D%7D/g, encodeURIComponent(recipient.email));

                const isOutreach = template === 'outreach';
                const fromEmail = isOutreach 
                    ? 'Mahendra Balal | Indoor Dog Park <partnerships@indoordogpark.org>' 
                    : 'IndoorDogPark <newsletter@indoordogpark.org>';
                const replyToEmail = 'media@indoordogpark.org';

                const { error: sendError } = await resend.emails.send({
                    from: fromEmail,
                    to: recipient.email,
                    subject: currentSubject,
                    html: personalizedHtml,
                    replyTo: replyToEmail,
                });

                if (sendError) {
                    failCount++;
                    details.push({ email: recipient.email, status: 'failed', error: sendError.message });
                } else if (!testEmail) {
                    successCount++;
                    details.push({ email: recipient.email, status: 'success' });
                }

                // Prepare admin client for updates
                if (!testEmail || sendError) {
                    const adminClient = supabaseAdminClient;
                    
                    let campaignName = 'generic_broadcast';
                    if (template === 'outreach') {
                        campaignName = 'badge_outreach';
                    } else if (template === 'blog') {
                        campaignName = `blog_broadcast::${data.slug || 'unknown'}`;
                    } else if (template === 'generic' || template === 'marketing') {
                        campaignName = `generic_broadcast::${(data.subject || data.headline || 'Untitled').substring(0, 100)}`;
                    }

                    // Insert into email_campaign_logs
                    try {
                        await adminClient
                            .from('email_campaign_logs')
                            .insert({
                                recipient_email: recipient.email.toLowerCase().trim(),
                                campaign_name: campaignName,
                                status: sendError ? 'draft' : 'sent',
                                subject: currentSubject,
                                body_content: data.bodyContent || data.personalizedNote || '',
                            });
                    } catch (updateError) {
                        console.error('Failed to update campaign logs:', updateError);
                    }
                }
            } catch (e) {
                const error = e as Error;
                failCount++;
                details.push({ email: recipient.email, status: 'failed', error: error.message });
                
                if (!testEmail) {
                    try {
                        const adminClient = supabaseAdminClient;
                        let campaignName = template === 'outreach' ? 'badge_outreach' : 'generic_broadcast';
                        await adminClient
                            .from('email_campaign_logs')
                            .insert({
                                recipient_email: recipient.email.toLowerCase().trim(),
                                campaign_name: campaignName,
                                status: 'draft',
                                subject: subject || '',
                                body_content: data.bodyContent || data.personalizedNote || '',
                            });
                    } catch (err) {}
                }
            }
            await new Promise(r => setTimeout(r, 1000));
        }

        // 7. Queue Remaining Emails
        let queuedCount = 0;
        if (recipientsToQueue.length > 0) {
            let campaignName = 'generic_broadcast';
            if (template === 'outreach') {
                campaignName = 'badge_outreach';
            } else if (template === 'blog') {
                campaignName = `blog_broadcast::${data.slug || 'unknown'}`;
            } else if (template === 'generic' || template === 'marketing') {
                campaignName = `generic_broadcast::${(data.subject || data.headline || 'Untitled').substring(0, 100)}`;
            }

            const queueInserts = [];
            
            for (let i = 0; i < recipientsToQueue.length; i++) {
                const recipient = recipientsToQueue[i];
                let currentHtml = emailHtml;
                let currentSubject = subject;

                if (template === 'outreach' && segment === 'bulk-outreach') {
                    const metadata = recipient.metadata;
                    const parkName = metadata?.parkName || 'Indoor Dog Park';
                    const parkSlug = metadata?.parkSlug || parkName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    
                    currentSubject = `Partner with IndoorDogPark.org - Increase Visibility for ${parkName}`;
                    const emailComponent = React.createElement(ParkOutreachEmail, {
                        parkName: parkName,
                        parkCity: metadata?.location?.split(',')[0]?.trim() || '',
                        parkState: metadata?.location?.split(',')[1]?.trim() || '',
                        parkEmail: recipient.email,
                        parkSlug: parkSlug,
                        personalizedNote: data.personalizedNote,
                        baseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://indoordogpark.org',
                    });
                    currentHtml = await render(emailComponent);
                }

                const personalizedHtml = currentHtml
                    .replace(/\{\{email\}\}/g, encodeURIComponent(recipient.email))
                    .replace(/%7B%7Bemail%7D%7D/g, encodeURIComponent(recipient.email));
                
                // Calculate delay: distribute evenly based on daily limit
                const daysDelay = Math.floor(i / DAILY_LIMIT) + 1; // Start from tomorrow
                const scheduledFor = new Date();
                scheduledFor.setUTCDate(scheduledFor.getUTCDate() + daysDelay);
                scheduledFor.setUTCHours(9, 0, 0, 0); // 9 AM UTC

                queueInserts.push({
                    recipient_email: recipient.email.toLowerCase().trim(),
                    campaign_name: campaignName,
                    subject: currentSubject,
                    html_content: personalizedHtml,
                    scheduled_for: scheduledFor.toISOString(),
                    status: 'pending'
                });
            }

            for (let i = 0; i < queueInserts.length; i += 50) {
                const batch = queueInserts.slice(i, i + 50);
                const { error } = await adminClient.from('email_queue').insert(batch);
                if (error) {
                    console.error('Queue insert error:', error);
                } else {
                    queuedCount += batch.length;
                }
            }
        }

        return NextResponse.json({
            success: successCount > 0 || queuedCount > 0,
            message: `Sent ${successCount} immediately. Queued ${queuedCount} for later. Failed: ${failCount}`,
            total: recipients.length,
            sent: successCount,
            queued: queuedCount,
            details: details,
        });

    } catch (error) {
        const e = error as Error;
        console.error('Marketing send error:', e);
        return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
    }
}

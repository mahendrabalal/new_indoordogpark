import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdminClient } from '@/lib/supabase-admin';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function GET(request: NextRequest) {
    // Basic security: require a secret token if this is called from Vercel Cron
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    // If a secret is defined, verify it. Otherwise, let it pass (for manual testing)
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        // Fallback: check query parameter
        const { searchParams } = new URL(request.url);
        if (searchParams.get('secret') !== cronSecret) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    if (!resend) {
        return NextResponse.json({ error: 'Resend not configured' }, { status: 500 });
    }

    try {
        const adminClient = supabaseAdminClient;
        
        // 1. Check daily quota to see how many we can send today
        const todayStart = new Date();
        todayStart.setUTCHours(0, 0, 0, 0);

        const { count: sentToday } = await adminClient
            .from('email_campaign_logs')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', todayStart.toISOString());

        const DAILY_LIMIT = 100;
        const remainingQuota = Math.max(0, DAILY_LIMIT - (sentToday || 0));

        if (remainingQuota <= 0) {
            return NextResponse.json({ message: 'Daily limit reached. 0 emails sent.' });
        }

        // 2. Fetch pending emails from queue
        const { data: queueItems, error: queueError } = await adminClient
            .from('email_queue')
            .select('*')
            .eq('status', 'pending')
            .lte('scheduled_for', new Date().toISOString())
            .order('scheduled_for', { ascending: true })
            .limit(remainingQuota);

        if (queueError) {
            throw queueError;
        }

        if (!queueItems || queueItems.length === 0) {
            return NextResponse.json({ message: 'Queue is empty' });
        }

        // 3. Process the queue
        let successCount = 0;
        let failCount = 0;

        for (const item of queueItems) {
            try {
                const isOutreach = item.campaign_name.includes('outreach');
                const fromEmail = isOutreach 
                    ? 'Mahendra Balal | Indoor Dog Park <media@indoordogpark.org>' 
                    : 'IndoorDogPark <media@indoordogpark.org>';
                const replyToEmail = 'media@indoordogpark.org';

                const { error: sendError } = await resend.emails.send({
                    from: fromEmail,
                    to: item.recipient_email,
                    subject: item.subject,
                    html: item.html_content,
                    replyTo: replyToEmail,
                });

                if (sendError) {
                    failCount++;
                    await adminClient.from('email_queue').update({
                        status: 'failed',
                        error_message: sendError.message
                    }).eq('id', item.id);
                } else {
                    successCount++;
                    // Update queue status
                    await adminClient.from('email_queue').update({
                        status: 'sent'
                    }).eq('id', item.id);

                    // Insert log
                    await adminClient.from('email_campaign_logs').insert({
                        recipient_email: item.recipient_email,
                        campaign_name: item.campaign_name,
                        status: 'sent',
                        subject: item.subject,
                        body_content: 'Sent via queue processor'
                    });
                }
            } catch (err) {
                const e = err as Error;
                failCount++;
                await adminClient.from('email_queue').update({
                    status: 'failed',
                    error_message: e.message
                }).eq('id', item.id);
            }
            
            // Respect API rate limits
            await new Promise(r => setTimeout(r, 1000));
        }

        return NextResponse.json({
            success: true,
            message: `Processed ${queueItems.length} items. Success: ${successCount}. Failed: ${failCount}`,
            processed: queueItems.length,
            successCount,
            failCount
        });

    } catch (error) {
        const e = error as Error;
        console.error('Queue processor error:', e);
        return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
    }
}

const fs = require('fs');

const path = './src/app/api/admin/marketing/send/route.ts';
let code = fs.readFileSync(path, 'utf8');

// Replace Step 5
const step5Before = `        if (recipients.length === 0) {
            return NextResponse.json({ message: 'No recipients found', sent: 0 });
        }

        // 5. Send Emails
        let successCount = 0;`;

const step5After = `        if (recipients.length === 0) {
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
        let successCount = 0;`;

code = code.replace(step5Before, step5After);

code = code.replace(
    `for (const recipient of recipients) {`,
    `for (const recipient of recipientsToSendNow) {`
);

const returnJsonBefore = `        return NextResponse.json({
            success: successCount > 0,
            message: \`Sent to \${successCount} recipients. Failed: \${failCount}\`,
            total: recipients.length,
            sent: successCount,
            details: details,
        });`;

const returnJsonAfter = `        // 7. Queue Remaining Emails
        let queuedCount = 0;
        if (recipientsToQueue.length > 0) {
            let campaignName = 'generic_broadcast';
            if (template === 'outreach') {
                campaignName = 'badge_outreach';
            } else if (template === 'blog') {
                campaignName = \`blog_broadcast::\${data.slug || 'unknown'}\`;
            } else if (template === 'generic' || template === 'marketing') {
                campaignName = \`generic_broadcast::\${(data.subject || data.headline || 'Untitled').substring(0, 100)}\`;
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
                    
                    currentSubject = \`Partner with IndoorDogPark.org - Increase Visibility for \${parkName}\`;
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
                    .replace(/\\{\\{email\\}\\}/g, encodeURIComponent(recipient.email))
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
            message: \`Sent \${successCount} immediately. Queued \${queuedCount} for later. Failed: \${failCount}\`,
            total: recipients.length,
            sent: successCount,
            queued: queuedCount,
            details: details,
        });`;

code = code.replace(returnJsonBefore, returnJsonAfter);

fs.writeFileSync(path, code);
console.log('Successfully refactored send route.');

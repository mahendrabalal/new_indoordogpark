
const { Resend } = require('resend');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Generator function for the email HTML
function generateParkOutreachEmail(data: any) {
    const { parkName, parkCity, parkState, personalizedNote, parkEmail } = data;
    const location = parkCity && parkState ? ` in ${parkCity}, ${parkState} ` : '';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://indoordogpark.org';

    // Fallback if no name provided (subscribers table might just have email)
    const displayName = parkName || 'Park Owner';

    return `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="utf-8" >
        <meta name="viewport" content = "width=device-width, initial-scale=1.0" >
            <title>Partner with IndoorDogPark.org </title>
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;" >
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;" >
                    <h1 style="color: white; margin: 0; font-size: 28px;" > IndoorDogPark.org </h1>
                        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;" > California's Premier Indoor Dog Park Directory</p>
                            </div>

                            <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;" >
                                <h2 style="color: #667eea; margin-top: 0;" > Hello ${displayName}${location ? ` Team` : ''} !</h2>

                                    <p> We're reaching out because you are listed as a park owner in our directory. We'd love to help you get more visibility and connect with more dog owners in your area.</p>

${personalizedNote ? `<div style="background: #f3f4f6; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0;">
  <p style="margin: 0; font-style: italic;">${personalizedNote}</p>
</div>` : ''
        }

<h3 style="color: #667eea; margin-top: 30px;" > Why Partner With Us ? </h3>
<ul style="line-height: 1.8;" >
    <li><strong>Increased Visibility: </strong> Featured listings appear at the top of search results and on our homepage</li>
        <li><strong>More Customers: </strong> We help thousands of dog owners find the perfect indoor park every month</li>
            <li><strong>Professional Listing: </strong> Enhanced profiles with multiple photos, detailed amenities, and verified information</li>
                <li><strong>Analytics Dashboard: </strong> Track views, clicks, and inquiries from your listing</li>
                    <li><strong>Affordable Pricing: </strong> Starting at just $9.99/month for featured placement </li>
                        </ul>

                        <div style="background: #f9fafb; padding: 20px; border-radius: 6px; margin: 30px 0;" >
                        <h3 style="color: #667eea; margin-top: 0;" > Featured Listing Benefits: </h3>
                            <ul style="margin-bottom: 0;" >
                                <li>✅ Priority placement in search results </li>
                                    <li>✅ Featured badge on your listing </li>
                                        <li>✅ Homepage visibility </li>
                                            <li>✅ Highlighted on interactive map </li>
                                                <li>✅ Enhanced listing with more photos </li>
                                                    </ul>
                                                    </div>

                                                    <div style="text-align: center; margin: 40px 0;" >
                                                        <a href="${siteUrl}/list-your-park" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;" > Upgrade to Featured Listing </a>
                                                            </div>

                                                            <p style="margin-top: 30px;" > Our featured listing at just $9.99 / month includes all these benefits to help grow your business.</p>

                                                                <p> If you have any questions or would like to discuss partnership opportunities, please don't hesitate to reach out. We're here to help your business grow! </p>

                                                                    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;" >
                                                                        <p style="margin: 0; color: #6b7280; font-size: 14px;" >
                                                                            Best regards, <br>
                                                                                <strong>The IndoorDogPark.org Team </strong><br>
                                                                                    <a href="mailto:media@indoordogpark.org" style="color: #667eea;" > media@indoordogpark.org</a><br>
                                                                                        <a href="${siteUrl}" style="color: #667eea;" > indoordogpark.org </a>
                                                                                            </p>
                                                                                            </div>

                                                                                            <div style="margin-top: 30px; padding: 15px; background: #f3f4f6; border-radius: 6px; font-size: 12px; color: #6b7280;" >
                                                                                                <p style="margin: 0 0 10px 0;" > <strong>P.S.</strong> We're currently offering a special promotion: First month 50% off for new featured listings. Use code <strong>FIRST50</strong> at checkout.</p>
                                                                                                    <p style="margin: 0;" > You're receiving this because ${parkEmail} is listed as an owner in our directory. If you'd prefer not to receive these emails, please <a href="${siteUrl}/unsubscribe?email=${encodeURIComponent(parkEmail || '')}" style="color: #667eea;" > unsubscribe here </a>.</p>
                                                                                                        </div>
                                                                                                        </div>
                                                                                                        </body>
                                                                                                        </html>
                                                                                                            `.trim();
}

async function main() {
    console.log('🚀 Starting Subscriber Outreach Campaign (Type: Owner)...');

    // 1. Initialize Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        console.error('❌ Missing Supabase environment variables');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
    });

    // 2. Initialize Resend
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.error('❌ RESEND_API_KEY is missing');
        process.exit(1);
    }
    const resend = new Resend(apiKey);

    // 3. Fetch Subscribers
    console.log('📦 Fetching owner subscribers from Supabase...');
    const { data: subscribers, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('type', 'owner')
        .eq('status', 'active');

    if (error) {
        console.error('❌ Error fetching subscribers:', error.message);
        process.exit(1);
    }

    if (!subscribers || subscribers.length === 0) {
        console.log('⚠️ No active owner subscribers found.');
        process.exit(0);
    }

    console.log(`📊 Found ${subscribers.length} active owner subscribers.`);
    console.log('⚠️  WARNING: This will send REAL emails to all of them!');
    console.log('   Press Ctrl+C within 5 seconds to cancel...\n');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 4. Send Emails
    const results = [];
    let successCount = 0;
    let failCount = 0;

    for (const sub of subscribers) {
        if (!sub.email) {
            console.log(`⏭️  Skipping ID ${sub.id} (no email)`);
            continue;
        }

        // Try to derive a name from email if not present in custom fields (unlikely for simple subscriber table)
        // The subscriber table schema earlier showed: id, email, type, source, status. No name column visible in screenshot/log.
        // So we'll use a generic greeting or derived from email.
        const derivedName = sub.email.split('@')[0];

        console.log(`📧 Sending to ${sub.email}...`);

        try {
            const parkData = {
                parkName: derivedName, // Best effort name
                parkEmail: sub.email,
                parkCity: "", // Unknown
                parkState: "", // Unknown
            };

            const result = await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL || 'IndoorDogPark <outreach@indoordogpark.org>',
                to: sub.email,
                subject: `Partner with IndoorDogPark.org - Upgrade Your Listing`,
                html: generateParkOutreachEmail(parkData),
                replyTo: 'media@indoordogpark.org'
            });

            if (result.error) {
                console.error(`   ❌ Failed: ${result.error.message}`);
                failCount++;
                results.push({ email: sub.email, status: 'failed', error: result.error });
            } else {
                console.log(`   ✅ Success (ID: ${result.data.id})`);
                successCount++;
                results.push({ email: sub.email, status: 'sent', id: result.data.id });
            }

        } catch (err: any) {
            console.error(`   ❌ Exception: ${err.message}`);
            failCount++;
            results.push({ email: sub.email, status: 'error', error: err.message });
        }

        // Small delay
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // 5. Summary
    console.log('\n' + '='.repeat(40));
    console.log('📝 Campaign Summary');
    console.log('='.repeat(40));
    console.log(`Total: ${subscribers.length}`);
    console.log(`Sent: ${successCount}`);
    console.log(`Failed: ${failCount}`);

    // Save log
    const logFile = `subscriber-outreach-log-${Date.now()}.json`;
    fs.writeFileSync(logFile, JSON.stringify(results, null, 2));
    console.log(`\n📄 Log saved to ${logFile}`);
}

main().catch(console.error);

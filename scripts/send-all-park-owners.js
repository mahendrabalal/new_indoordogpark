const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config({ path: '.env.local' });

// Email template (inline to avoid build issues)
function generateParkOutreachEmail(data) {
  const { parkName, parkCity, parkState, personalizedNote, parkEmail } = data;
  const location = parkCity && parkState ? ` in ${parkCity}, ${parkState}` : '';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://indoordogpark.org';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Partner with IndoorDogPark.org</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">IndoorDogPark.org</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">USA's Premier Indoor Dog Park Directory</p>
  </div>

  <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <h2 style="color: #667eea; margin-top: 0;">Hello ${parkName}${location ? ` Team` : ''}!</h2>

    <p>We're reaching out because ${parkName}${location} is already featured in our comprehensive directory of indoor dog parks. We'd love to help you get more visibility and connect with more dog owners in your area.</p>

    ${personalizedNote ? `<div style="background: #f3f4f6; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0;">
      <p style="margin: 0; font-style: italic;">${personalizedNote}</p>
    </div>` : ''}

    <h3 style="color: #667eea; margin-top: 30px;">Why Partner With Us?</h3>
    <ul style="line-height: 1.8;">
      <li><strong>Increased Visibility:</strong> Featured listings appear at the top of search results and on our homepage</li>
      <li><strong>More Customers:</strong> We help thousands of dog owners find the perfect indoor park every month</li>
      <li><strong>Professional Listing:</strong> Enhanced profiles with multiple photos, detailed amenities, and verified information</li>
      <li><strong>Analytics Dashboard:</strong> Track views, clicks, and inquiries from your listing</li>
      <li><strong>Affordable Pricing:</strong> Starting at just $9.99/month for featured placement</li>
    </ul>

    <div style="background: #f9fafb; padding: 20px; border-radius: 6px; margin: 30px 0;">
      <h3 style="color: #667eea; margin-top: 0;">Featured Listing Benefits:</h3>
      <ul style="margin-bottom: 0;">
        <li>✅ Priority placement in search results</li>
        <li>✅ Featured badge on your listing</li>
        <li>✅ Homepage visibility</li>
        <li>✅ Highlighted on interactive map</li>
        <li>✅ Enhanced listing with more photos</li>
      </ul>
    </div>

    <div style="text-align: center; margin: 40px 0;">
      <a href="${siteUrl}/list-your-park" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
        Upgrade to Featured Listing
      </a>
    </div>

    <p>Our featured listing at just $9.99/month includes all these benefits to help grow your business.</p>

    <p>If you have any questions or would like to discuss partnership opportunities, please don't hesitate to reach out. We're here to help your business grow!</p>

    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0; color: #6b7280; font-size: 14px;">
        Best regards,<br />
        <strong>The IndoorDogPark.org Team</strong><br />
        <a href="mailto:media@indoordogpark.org" style="color: #667eea;">media@indoordogpark.org</a><br />
        <a href="${siteUrl}" style="color: #667eea;">indoordogpark.org</a>
      </p>
    </div>

    <div style="margin-top: 30px; padding: 15px; background: #f3f4f6; border-radius: 6px; font-size: 12px; color: #6b7280;">
      <p style="margin: 0 0 10px 0;">
        <strong>P.S.</strong> We're currently offering a special promotion: First month 50% off for new featured listings. Use code <strong style="background: #FF5722; color: white; padding: 4px 8px; border-radius: 4px; font-family: monospace;">FIRST50</strong> at checkout.
      </p>
      <p style="margin: 0;">
        You're receiving this because ${parkName} is listed in our directory. If you'd prefer not to receive these emails, please <a href="${siteUrl}/unsubscribe?email=${encodeURIComponent(parkEmail || '')}" style="color: #667eea;">unsubscribe here</a>.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// Function to get all parks from marketing contacts table
async function getAllParkOwners() {
  console.log('📊 Fetching park owners from marketing contacts...\n');

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    console.log('🗄️  Querying marketing contacts...');
    const { data: contacts, error } = await supabase
      .from('marketing_contacts')
      .select('name, email, city, state, phone, website, source')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase error:', error.message);
      return [];
    }

    console.log(`✅ Found ${contacts.length} active marketing contacts`);

    // Format the data
    const formattedParks = contacts.map(contact => ({
      name: contact.name || 'Indoor Dog Park',
      email: contact.email.toLowerCase().trim(),
      city: contact.city || '',
      state: contact.state || '',
      phone: contact.phone || '',
      website: contact.website || '',
      source: contact.source || 'imported'
    }));

    console.log(`📈 Total contacts to email: ${formattedParks.length}`);

    // Show source breakdown
    const sourceCounts = formattedParks.reduce((acc, park) => {
      acc[park.source] = (acc[park.source] || 0) + 1;
      return acc;
    }, {});

    console.log('\n📊 Source breakdown:');
    Object.entries(sourceCounts).forEach(([source, count]) => {
      console.log(`  ${source}: ${count} contacts`);
    });

    return formattedParks;

  } catch (error) {
    console.error('❌ Error connecting to Supabase:', error.message);
    return [];
  }
}

// Main function to send emails
async function sendEmailsToAllParkOwners() {
  console.log('🚀 Starting email campaign to ALL park owners...\n');

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('❌ RESEND_API_KEY is missing');
    return;
  }

  const resend = new Resend(apiKey);
  const parks = await getAllParkOwners();

  if (parks.length === 0) {
    console.log('❌ No parks found with email addresses');
    return;
  }

  console.log(`\n⚠️  WARNING: This will send ${parks.length} REAL emails!`);
  console.log('   Press Ctrl+C within 5 seconds to cancel...\n');
  await new Promise(resolve => setTimeout(resolve, 5000));

  const results = {
    total: parks.length,
    successful: 0,
    failed: 0,
    errors: []
  };

  // Send emails with delay
  for (let i = 0; i < parks.length; i++) {
    const park = parks[i];
    console.log(`[${i + 1}/${parks.length}] Sending to ${park.name} (${park.email})...`);

    try {
      const result = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'IndoorDogPark <outreach@indoordogpark.org>',
        to: park.email,
        subject: `Partner with IndoorDogPark.org - Increase Visibility for ${park.name}`,
        html: generateParkOutreachEmail({
          parkName: park.name,
          parkEmail: park.email,
          parkCity: park.city,
          parkState: park.state,
          personalizedNote: null
        }),
        replyTo: 'media@indoordogpark.org'
      });

      if (result.error) {
        results.failed++;
        results.errors.push({
          park: park.name,
          email: park.email,
          error: result.error.message
        });
        console.log(`   ❌ Failed: ${result.error.message}`);
      } else {
        results.successful++;
        console.log(`   ✅ Success (ID: ${result.data.id})`);
      }
    } catch (error) {
      results.failed++;
      results.errors.push({
        park: park.name,
        email: park.email,
        error: error.message
      });
      console.log(`   ❌ Error: ${error.message}`);
    }

    // Wait between emails to avoid rate limiting
    if (i < parks.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Save results
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const resultsFile = `outreach-results-all-${timestamp}.json`;
  fs.writeFileSync(resultsFile, JSON.stringify({
    timestamp: new Date().toISOString(),
    ...results,
    parks: parks.map(p => ({ name: p.name, email: p.email }))
  }, null, 2));

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Campaign Summary');
  console.log('='.repeat(60));
  console.log(`Total processed: ${results.total}`);
  console.log(`✅ Successful: ${results.successful}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`Success rate: ${((results.successful / results.total) * 100).toFixed(1)}%`);
  console.log(`\n💾 Results saved to: ${resultsFile}`);

  if (results.errors.length > 0) {
    console.log('\n❌ Failed emails:');
    results.errors.forEach(e => {
      console.log(`   - ${e.park}: ${e.error}`);
    });
  }
}

// Run the campaign
sendEmailsToAllParkOwners().catch(console.error);
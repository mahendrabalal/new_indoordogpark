#!/usr/bin/env ts-node

/**
 * Direct email sending script - bypasses API and sends emails directly
 */

const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Email template function (inline to avoid module issues)
function generateParkOutreachEmail(data: any): string {
  const { parkName, parkCity, parkState, personalizedNote } = data;
  const location = parkCity && parkState ? ` in ${parkCity}, ${parkState}` : '';
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">IndoorDogPark.org</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">California's Premier Indoor Dog Park Directory</p>
  </div>
  
  <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <h2 style="color: #667eea; margin-top: 0;">Hello ${parkName}${location ? ` Team` : ''}!</h2>
    
    <p>We're reaching out because ${parkName}${location} is already featured in our comprehensive directory of indoor dog parks across California. We'd love to help you get more visibility and connect with more dog owners in your area.</p>
    
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
      <a href="https://indoordogpark.org/list-your-park" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Upgrade to Featured Listing</a>
    </div>
    
    <p style="margin-top: 30px;">Our featured listing at just $9.99/month includes all these benefits to help grow your business.</p>
    
    <p>If you have any questions or would like to discuss partnership opportunities, please don't hesitate to reach out. We're here to help your business grow!</p>
    
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0; color: #6b7280; font-size: 14px;">
        Best regards,<br>
        <strong>The IndoorDogPark.org Team</strong><br>
        <a href="mailto:partnerships@indoordogpark.org" style="color: #667eea;">partnerships@indoordogpark.org</a><br>
        <a href="https://indoordogpark.org" style="color: #667eea;">indoordogpark.org</a>
      </p>
    </div>
    
    <div style="margin-top: 30px; padding: 15px; background: #f3f4f6; border-radius: 6px; font-size: 12px; color: #6b7280;">
      <p style="margin: 0 0 10px 0;"><strong>P.S.</strong> We're currently offering a special promotion: First month 50% off for new featured listings. Use code <strong>FIRST50</strong> at checkout.</p>
      <p style="margin: 0;">You're receiving this because ${parkName} is listed in our directory. If you'd prefer not to receive these emails, please <a href="mailto:unsubscribe@indoordogpark.org?subject=Unsubscribe" style="color: #667eea;">let us know</a>.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

interface ParkData {
  id: string;
  name: string;
  email?: string;
  city?: string;
  state?: string;
  website?: string;
  businessType?: string;
  [key: string]: any;
}

interface SendResult {
  parkName: string;
  email: string;
  success: boolean;
  error?: string;
  emailId?: string;
}

async function sendEmailDirect(park: ParkData): Promise<SendResult> {
  if (!park.email) {
    return {
      parkName: park.name,
      email: 'N/A',
      success: false,
      error: 'No email address',
    };
  }

  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY not found in .env.local');
    }

    const resend = new Resend(apiKey);

    const parkData = {
      parkName: park.name,
      parkEmail: park.email,
      parkCity: park.city,
      parkState: park.state,
      parkWebsite: park.website,
    };

    const emailHtml = generateParkOutreachEmail(parkData);
    const subject = `Partner with IndoorDogPark.org - Increase Visibility for ${park.name}`;

    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'IndoorDogPark <outreach@indoordogpark.org>',
      to: park.email,
      subject,
      html: emailHtml,
      replyTo: 'media@indoordogpark.org',
    });

    // Check for errors in Resend response
    if (result.error) {
      throw new Error(result.error.message || 'Resend API error');
    }

    if (!result.data || !result.data.id) {
      throw new Error('No email ID returned from Resend');
    }

    return {
      parkName: park.name,
      email: park.email,
      success: true,
      emailId: result.data.id,
    };
  } catch (error) {
    return {
      parkName: park.name,
      email: park.email,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

function loadParkData(filePath: string): ParkData[] {
  const fullPath = path.resolve(process.cwd(), filePath);
  const fileContent = fs.readFileSync(fullPath, 'utf-8');
  const data = JSON.parse(fileContent);
  
  if (Array.isArray(data)) {
    return data;
  } else if (data.parks && Array.isArray(data.parks)) {
    return data.parks;
  } else {
    throw new Error('Invalid JSON structure');
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  let dataFile = 'public/data/california.json';
  let limit = 16;
  let delay = 2000;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--file':
        dataFile = args[++i];
        break;
      case '--limit':
        limit = parseInt(args[++i], 10) || 16;
        break;
      case '--delay':
        delay = parseInt(args[++i], 10) || 2000;
        break;
    }
  }

  console.log('🚀 Starting DIRECT email campaign (bypassing API)...\n');
  console.log(`Configuration:`);
  console.log(`  Data file: ${dataFile}`);
  console.log(`  Limit: ${limit} emails`);
  console.log(`  Delay: ${delay}ms between emails\n`);

  console.log('⚠️  WARNING: This will send REAL emails!');
  console.log('   Press Ctrl+C within 5 seconds to cancel...\n');
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Load parks
  const allParks = loadParkData(dataFile);
  const parksWithEmails = allParks.filter(p => p.email && p.email.trim() !== '');
  const parksToEmail = parksWithEmails.slice(0, limit);

  console.log(`📧 Will send to ${parksToEmail.length} parks\n`);

  const results: SendResult[] = [];
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < parksToEmail.length; i++) {
    const park = parksToEmail[i];
    console.log(`[${i + 1}/${parksToEmail.length}] Sending to ${park.name} (${park.email})...`);

    const result = await sendEmailDirect(park);
    results.push(result);

    if (result.success) {
      successCount++;
      console.log(`   ✅ Success (ID: ${result.emailId || 'N/A'})`);
    } else {
      failCount++;
      console.log(`   ❌ Failed: ${result.error}`);
    }

    if (i < parksToEmail.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Campaign Summary');
  console.log('='.repeat(60));
  console.log(`Total processed: ${results.length}`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`Success rate: ${((successCount / results.length) * 100).toFixed(1)}%`);

  // Save results
  const resultsFile = `outreach-results-direct-${Date.now()}.json`;
  fs.writeFileSync(
    resultsFile,
    JSON.stringify({ timestamp: new Date().toISOString(), results }, null, 2)
  );
  console.log(`\n💾 Results saved to: ${resultsFile}`);
}

if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}


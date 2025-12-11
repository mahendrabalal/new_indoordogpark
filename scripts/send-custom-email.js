const { Resend } = require('resend');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config({ path: '.env.local' });

// Copy of the generator function to ensure we use the latest template
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

// Load park data function
function loadParkData(filePath) {
  try {
    const fullPath = path.resolve(process.cwd(), filePath);
    const fileContent = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('❌ Error loading park data:', error.message);
    return [];
  }
}

async function sendCustomEmail(parkEmail, parkName = null, personalizedNote = null) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error('❌ RESEND_API_KEY is missing');
    return;
  }

  const resend = new Resend(apiKey);

  // Load park data to get the specific park info if parkName is not provided
  let parkData = {
    parkName: parkName || "Indoor Dog Park",
    parkEmail: parkEmail,
    parkCity: null,
    parkState: null,
    personalizedNote: personalizedNote || null
  };

  // If parkName is provided, try to find more details about this park
  if (parkName) {
    try {
      const allParks = loadParkData('public/data/standardized_dog_parks.json');
      const foundPark = allParks.find(p =>
        p.name.toLowerCase().includes(parkName.toLowerCase()) ||
        parkName.toLowerCase().includes(p.name.toLowerCase())
      );

      if (foundPark) {
        parkData = {
          parkName: foundPark.name,
          parkEmail: parkEmail,
          parkCity: foundPark.city,
          parkState: foundPark.state,
          personalizedNote: personalizedNote || null
        };
        console.log(`✅ Found park data: ${foundPark.name} in ${foundPark.city}, ${foundPark.state}`);
      }
    } catch (error) {
      console.log('⚠️  Could not load park data, using provided information');
    }
  }

  console.log(`🚀 Sending custom email to: ${parkEmail}`);
  console.log(`📝 Park: ${parkData.parkName}${parkData.parkCity && parkData.parkState ? ` (${parkData.parkCity}, ${parkData.parkState})` : ''}`);

  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'IndoorDogPark <outreach@indoordogpark.org>',
      to: parkEmail,
      subject: `Partner with IndoorDogPark.org - Increase Visibility for ${parkData.parkName}`,
      html: generateParkOutreachEmail(parkData),
      replyTo: 'media@indoordogpark.org'
    });

    if (result.error) {
      console.error('❌ Failed to send email:', result.error);
    } else {
      console.log('✅ Email sent successfully!');
      console.log('📧 Email ID:', result.data.id);
    }
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
}

// Get command line arguments
const args = process.argv.slice(2);
let email = null;
let parkName = null;
let note = null;

// Parse arguments
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--email' && args[i + 1]) {
    email = args[i + 1];
    i++;
  } else if (args[i] === '--park' && args[i + 1]) {
    parkName = args[i + 1];
    i++;
  } else if (args[i] === '--note' && i < args.length - 1) {
    // Note can contain spaces, so take everything after --note
    note = args.slice(i + 1).join(' ');
    break;
  }
}

// Validate arguments
if (!email) {
  console.log('\n❌ Error: Email is required');
  console.log('\nUsage: node scripts/send-custom-email.js --email <email> --park <park-name> --note <personalized note>');
  console.log('\nExample:');
  console.log('  node scripts/send-custom-email.js --email pj@earthdog.com --park "Earthdog Indoor Dog Park"');
  console.log('  node scripts/send-custom-email.js --email pj@earthdog.com --park "Earthdog" --note "Your park has excellent reviews!"');
  console.log('\nIf --park is provided, the script will try to find the park in your database to get city/state info.');
  process.exit(1);
}

// Send the email
sendCustomEmail(email, parkName, note);
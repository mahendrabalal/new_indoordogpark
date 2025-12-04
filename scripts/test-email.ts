#!/usr/bin/env ts-node

/**
 * Simple test script to verify email functionality
 */

const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

async function testEmail() {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.error('❌ RESEND_API_KEY not found in .env.local');
    process.exit(1);
  }

  console.log('✅ Resend API key found');
  console.log('📧 Testing email generation...\n');

  const resend = new Resend(apiKey);

  // Test email HTML
  const testHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">IndoorDogPark.org</h1>
  </div>
  
  <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <h2 style="color: #667eea; margin-top: 0;">Email Test Successful! ✅</h2>
    <p>Your Resend email service is configured correctly.</p>
    <p>You can now send outreach emails to indoor dog parks.</p>
  </div>
</body>
</html>
  `.trim();

  try {
    console.log('Sending test email...');
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'IndoorDogPark <onboarding@resend.dev>',
      to: 'test@example.com', // This won't actually send, just tests the API
      subject: 'Test Email - IndoorDogPark Outreach',
      html: testHtml,
    });

    console.log('✅ Email API is working!');
    console.log('📧 Email ID:', result.data?.id || 'N/A');
    console.log('\n💡 Note: To actually send emails, you need:');
    console.log('   1. Verified domain in Resend dashboard');
    console.log('   2. Park email addresses in your data');
    console.log('   3. Run: npm run outreach:send');
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('Invalid API key')) {
      console.error('   → Check your RESEND_API_KEY in .env.local');
    } else if (error.message.includes('domain')) {
      console.error('   → You may need to verify your domain in Resend');
    }
    process.exit(1);
  }
}

testEmail();







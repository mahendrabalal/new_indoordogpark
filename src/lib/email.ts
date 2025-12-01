import { Resend } from 'resend';

// Initialize Resend client lazily
let resend: Resend | null = null;

function getResendClient(): Resend {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not configured in environment variables');
    }
    resend = new Resend(apiKey);
  }
  return resend;
}

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
  bcc?: string | string[];
}

export interface ParkOutreachData {
  parkName: string;
  parkEmail: string;
  parkCity?: string;
  parkState?: string;
  parkWebsite?: string;
  personalizedNote?: string;
}

/**
 * Send a single email using Resend
 */
export async function sendEmail(options: EmailOptions) {
  try {
    const client = getResendClient();
    const result = await client.emails.send({
      from: options.from || process.env.RESEND_FROM_EMAIL || 'IndoorDogPark <outreach@indoordogpark.org>',
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
      bcc: Array.isArray(options.bcc) ? options.bcc : options.bcc ? [options.bcc] : undefined,
    });

    return {
      success: true,
      id: result.data?.id,
      error: null,
    };
  } catch (error) {
    console.error('Email send error:', error);
    return {
      success: false,
      id: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Generate HTML email template for park outreach
 */
export function generateParkOutreachEmail(data: ParkOutreachData): string {
  const { parkName, parkCity, parkState, personalizedNote } = data;
  const location = parkCity && parkState ? ` in ${parkCity}, ${parkState}` : '';

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
        <a href="mailto:media@indoordogpark.org" style="color: #667eea;">media@indoordogpark.org</a><br>
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

/**
 * Generate a follow-up email template
 */
export function generateFollowUpEmail(data: ParkOutreachData): string {
  const { parkName, parkCity, parkState } = data;
  const location = parkCity && parkState ? ` in ${parkCity}, ${parkState}` : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-radius: 8px;">
    <h2 style="color: #667eea; margin-top: 0;">Quick Follow-Up: ${parkName}</h2>
    
    <p>Hi there,</p>
    
    <p>I wanted to follow up on my previous email about featuring ${parkName}${location} in our directory. I know you're busy, so I'll keep this brief.</p>
    
    <p><strong>Quick question:</strong> Would you be interested in a quick 10-minute call to discuss how we can help drive more customers to your facility?</p>
    
    <p>We've helped dozens of indoor dog parks increase their visibility and attract more visitors. I'd love to show you how we can do the same for ${parkName}.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://indoordogpark.org/list-your-park" style="display: inline-block; background: #667eea; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 600;">Schedule a Quick Call</a>
    </div>
    
    <p>Or if you prefer, you can simply upgrade to a featured listing online - it takes less than 5 minutes.</p>
    
    <p>Thanks for your time!</p>
    
    <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
      Best,<br>
      The IndoorDogPark.org Team<br>
      <a href="mailto:partnerships@indoordogpark.org" style="color: #667eea;">partnerships@indoordogpark.org</a>
    </p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generate welcome email for consumer subscribers (dog park visitors)
 */
export function generateConsumerWelcomeEmail(email: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to IndoorDogPark.org!</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 32px;">🐕 Welcome to the Pack!</h1>
    <p style="color: rgba(255,255,255,0.95); margin: 15px 0 0 0; font-size: 16px;">California's Premier Indoor Dog Park Directory</p>
  </div>
  
  <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
    <h2 style="color: #667eea; margin-top: 0; font-size: 24px;">Thanks for Subscribing! 🎉</h2>
    
    <p style="font-size: 16px; line-height: 1.8;">Hi there!</p>
    
    <p style="font-size: 16px; line-height: 1.8;">Welcome to the IndoorDogPark.org community! We're thrilled to have you join thousands of dog lovers discovering amazing indoor dog parks across California.</p>
    
    <div style="background: #f3f4f6; padding: 20px; border-left: 4px solid #667eea; margin: 30px 0; border-radius: 4px;">
      <h3 style="color: #667eea; margin-top: 0; font-size: 18px;">Here's what you'll get:</h3>
      <ul style="margin: 10px 0; padding-left: 20px; line-height: 2;">
        <li>🏞️ New park openings in your area</li>
        <li>💡 Tips for indoor dog park visits</li>
        <li>🎁 Exclusive deals and discounts</li>
        <li>📰 Weekly roundup of dog-friendly news</li>
      </ul>
    </div>
    
    <div style="text-align: center; margin: 40px 0;">
      <a href="https://indoordogpark.org/parks" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">Explore Parks Now</a>
    </div>
    
    <p style="font-size: 16px; line-height: 1.8;">In the meantime, check out our latest blog articles or browse parks near you!</p>
    
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0; color: #6b7280; font-size: 14px;">
        Happy tail wagging! 🐾<br>
        <strong>The IndoorDogPark.org Team</strong><br>
        <a href="mailto:media@indoordogpark.org" style="color: #667eea; text-decoration: none;">media@indoordogpark.org</a><br>
        <a href="https://indoordogpark.org" style="color: #667eea; text-decoration: none;">indoordogpark.org</a>
      </p>
    </div>
    
    <div style="margin-top: 30px; padding: 15px; background: #f9fafb; border-radius: 6px; font-size: 12px; color: #6b7280; text-align: center;">
      <p style="margin: 0;">You're receiving this because you subscribed to IndoorDogPark.org newsletter.</p>
      <p style="margin: 10px 0 0 0;">
        <a href="https://indoordogpark.org/unsubscribe?email=${encodeURIComponent(email)}" style="color: #667eea; text-decoration: underline;">Unsubscribe</a> | 
        <a href="https://indoordogpark.org/privacy" style="color: #667eea; text-decoration: underline;">Privacy Policy</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generate welcome email for owner subscribers (park owners)
 */
export function generateOwnerWelcomeEmail(email: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Our Partner Network!</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 32px;">🤝 Welcome to Our Partner Network!</h1>
    <p style="color: rgba(255,255,255,0.95); margin: 15px 0 0 0; font-size: 16px;">Let's Grow Your Dog Park Business Together</p>
  </div>
  
  <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
    <h2 style="color: #667eea; margin-top: 0; font-size: 24px;">Thanks for Joining! 🚀</h2>
    
    <p style="font-size: 16px; line-height: 1.8;">Hello fellow dog park enthusiast!</p>
    
    <p style="font-size: 16px; line-height: 1.8;">Welcome to the IndoorDogPark.org partner network! We're excited to help you grow your business and connect with more dog owners across California.</p>
    
    <div style="background: #f3f4f6; padding: 20px; border-left: 4px solid #667eea; margin: 30px 0; border-radius: 4px;">
      <h3 style="color: #667eea; margin-top: 0; font-size: 18px;">As a partner, you'll receive:</h3>
      <ul style="margin: 10px 0; padding-left: 20px; line-height: 2;">
        <li>📊 Industry insights and trends</li>
        <li>💰 Revenue optimization tips</li>
        <li>🎯 Marketing strategies that work</li>
        <li>🤝 Partnership opportunities</li>
        <li>⚡ Early access to new features</li>
      </ul>
    </div>
    
    <div style="background: #fff5f2; border: 2px dashed #FF5722; padding: 25px; border-radius: 8px; margin: 30px 0;">
      <h3 style="color: #FF5722; margin-top: 0; font-size: 18px;">🎁 Special Offer: First Month 50% Off</h3>
      <p style="margin: 10px 0; font-size: 15px;">Ready to get featured? Use code <strong style="background: #FF5722; color: white; padding: 4px 8px; border-radius: 4px; font-family: monospace;">FIRST50</strong> at checkout.</p>
    </div>
    
    <div style="text-align: center; margin: 40px 0;">
      <a href="https://indoordogpark.org/list-your-park" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">List Your Park Now</a>
    </div>
    
    <p style="font-size: 16px; line-height: 1.8;">Have questions? Just reply to this email or reach out to our partnerships team. We're here to help!</p>
    
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0; color: #6b7280; font-size: 14px;">
        To your success! 🌟<br>
        <strong>The IndoorDogPark.org Partnerships Team</strong><br>
        <a href="mailto:partnerships@indoordogpark.org" style="color: #667eea; text-decoration: none;">partnerships@indoordogpark.org</a><br>
        <a href="https://indoordogpark.org" style="color: #667eea; text-decoration: none;">indoordogpark.org</a>
      </p>
    </div>
    
    <div style="margin-top: 30px; padding: 15px; background: #f9fafb; border-radius: 6px; font-size: 12px; color: #6b7280; text-align: center;">
      <p style="margin: 0;">You're receiving this because you subscribed to our partner network.</p>
      <p style="margin: 10px 0 0 0;">
        <a href="https://indoordogpark.org/unsubscribe?email=${encodeURIComponent(email)}" style="color: #667eea; text-decoration: underline;">Unsubscribe</a> | 
        <a href="https://indoordogpark.org/privacy" style="color: #667eea; text-decoration: underline;">Privacy Policy</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

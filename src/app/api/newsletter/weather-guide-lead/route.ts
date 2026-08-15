import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, honeypot, postTitle, source } = body;

    // 1. Invisible bot defense
    if (honeypot) {
      return NextResponse.json({ success: true, message: 'Guide sent successfully!' });
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const trimmedEmail = email.trim();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indoordogpark.org';
    const logoUrl = `${siteUrl}/images/logo/logo.png`;

    // 2. Sync to Beehiiv Audience
    const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY;
    const BEEHIIV_PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID;

    if (
      BEEHIIV_API_KEY &&
      BEEHIIV_PUBLICATION_ID &&
      !BEEHIIV_API_KEY.includes('your_')
    ) {
      try {
        await fetch(
          `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${BEEHIIV_API_KEY}`,
            },
            body: JSON.stringify({
              email: trimmedEmail,
              reactivate_existing: false,
              send_welcome_email: false,
              utm_source: 'blog_lead_magnet',
              custom_fields: [
                { name: 'lead_magnet', value: 'extreme_weather_dog_guide' },
                { name: 'source', value: source || 'blog_article' },
                { name: 'article_ref', value: postTitle ? postTitle.substring(0, 100) : 'general_blog' },
              ],
            }),
          }
        );
      } catch (bhErr) {
        console.warn('[Weather Lead] Beehiiv sync warning:', bhErr);
      }
    }

    // 3. Dispatch Free Guide Email via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey && !resendApiKey.includes('your_')) {
      const resend = new Resend(resendApiKey);

      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your Free Extreme Weather Dog Safety & Indoor Activity Guide</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px 12px; color: #1e293b; line-height: 1.6;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
    
    <!-- Top Branded Header with Logo -->
    <div style="background: linear-gradient(135deg, #4338ca 0%, #6366f1 50%, #7c3aed 100%); padding: 32px 20px 28px; text-align: center;">
      <a href="${siteUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
        <div style="display: inline-block; background: #ffffff; padding: 10px 24px 8px; border-radius: 100px; box-shadow: 0 4px 16px rgba(0,0,0,0.15);">
          <img src="${logoUrl}" alt="IndoorDogPark.org" width="145" style="display: block; margin: 0 auto; max-width: 145px; height: auto;" />
        </div>
      </a>
      <p style="color: rgba(255,255,255,0.95); margin: 14px 0 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px;">
        🐾 Free Pet Safety Resource
      </p>
    </div>

    <!-- Body Content -->
    <div style="padding: 32px 28px;">
      <h1 style="color: #0f172a; font-size: 23px; font-weight: 800; margin: 0 0 14px; letter-spacing: -0.5px;">
        Your Extreme Weather Dog Safety &amp; Indoor Play Guide ☀️🌧️❄️
      </h1>

      <p style="color: #475569; font-size: 15px; margin: 0 0 20px;">
        Thank you for being a proactive pet parent! Here is your quick-reference survival guide for extreme heat, freezing winter temperatures, and rainy days when outdoor exercise isn't safe.
      </p>

      <!-- 1. The 7-Second Asphalt Heat Rule -->
      <div style="background: #fff7ed; border-left: 4px solid #ea580c; padding: 16px; border-radius: 0 8px 8px 0; margin-bottom: 20px;">
        <h3 style="color: #9a3412; font-size: 16px; margin: 0 0 6px; font-weight: 700;">🔥 1. The 7-Second Asphalt Rule (Summer Paw Safety)</h3>
        <p style="color: #431407; font-size: 13px; margin: 0; line-height: 1.5;">
          Place the back of your bare hand firmly against the pavement for 7 full seconds. If it’s too hot for your hand, it is hot enough to cause 2nd-degree burns and blisters on your dog's paw pads in under 60 seconds.
        </p>
      </div>

      <!-- 2. Indoor Mental Stimulation Games -->
      <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 16px; border-radius: 0 8px 8px 0; margin-bottom: 20px;">
        <h3 style="color: #166534; font-size: 16px; margin: 0 0 6px; font-weight: 700;">🧠 2. Three 10-Minute Indoor Energy Burners</h3>
        <p style="color: #14532d; font-size: 13px; margin: 0 0 6px; line-height: 1.5;">
          <strong>• The Muffin Tin Game:</strong> Place treats in the cups of a 12-hole muffin tin and cover them with tennis balls. Your dog must problem-solve to retrieve them!
        </p>
        <p style="color: #14532d; font-size: 13px; margin: 0 0 6px; line-height: 1.5;">
          <strong>• Rolled Towel Treat Puzzle:</strong> Lay a towel flat, scatter kibble/treats, roll it up tightly, and tie it into a loose knot.
        </p>
        <p style="color: #14532d; font-size: 13px; margin: 0; line-height: 1.5;">
          <strong>• Stairway Fetch (for healthy adult dogs):</strong> Toss a soft toy up a carpeted staircase for a gentle resistance workout.
        </p>
      </div>

      <!-- 3. Indoor Dog Parks Directory Link -->
      <div style="background: #eef2ff; border-left: 4px solid #6366f1; padding: 16px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
        <h3 style="color: #3730a3; font-size: 16px; margin: 0 0 6px; font-weight: 700;">📍 3. Find Climate-Controlled Indoor Parks</h3>
        <p style="color: #1e1b4b; font-size: 13px; margin: 0; line-height: 1.5;">
          When bad weather hits, let your dog sprint, socialize, and swim in 70°F climate-controlled comfort. Use our nationwide directory to find verified parks in your city!
        </p>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 28px 0;">
        <a href="${siteUrl}/states" style="display: inline-block; background: linear-gradient(135deg, #4338ca 0%, #7c3aed 100%); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);">
          Explore All Indoor Dog Parks →
        </a>
      </div>

      <!-- Sign-off -->
      <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #f1f5f9; font-size: 13px; color: #64748b; text-align: center;">
        <p style="margin: 0 0 4px;">Stay safe and have fun with your pup!</p>
        <p style="margin: 0; font-weight: 600; color: #334155;">The IndoorDogPark.org Team</p>
      </div>

    </div>

  </div>
</body>
</html>
      `;

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'IndoorDogPark <outreach@indoordogpark.org>',
        to: [trimmedEmail],
        replyTo: 'media@indoordogpark.org',
        subject: `🐾 Free Guide: Extreme Weather Dog Safety & Indoor Activity Checklist`,
        html: emailHtml,
      });
    }

    return NextResponse.json({
      success: true,
      message: `The guide has been emailed to ${trimmedEmail}!`,
    });
  } catch (error) {
    console.error('[api/newsletter/weather-guide-lead] error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

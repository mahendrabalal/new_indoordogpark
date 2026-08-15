import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dogName, email, age, size, energy, minMinutes, maxMinutes, activities, honeypot } = body;

    // 1. Invisible bot defense
    if (honeypot) {
      return NextResponse.json({ success: true, message: 'Plan sent successfully!' });
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const cleanDogName = dogName?.trim() || 'Your Dog';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indoordogpark.org';
    const logoUrl = `${siteUrl}/images/logo/logo.png`;

    // 2. Sync lead to Beehiiv Audience
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
              email: email,
              reactivate_existing: false,
              send_welcome_email: false,
              utm_source: 'exercise_calculator_tool',
              custom_fields: [
                { name: 'dog_name', value: cleanDogName },
                { name: 'dog_age', value: age || 'adult' },
                { name: 'dog_size', value: size || 'medium' },
                { name: 'dog_energy', value: energy || 'medium' },
                { name: 'exercise_goal', value: `${minMinutes}-${maxMinutes} min/day` },
                { name: 'lead_magnet', value: 'exercise_calculator' },
                { name: 'source', value: 'tools_page' },
              ],
            }),
          }
        );
      } catch (bhErr) {
        console.warn('[Exercise Lead] Beehiiv sync warning:', bhErr);
      }
    }

    // 3. Send Personalized Exercise Plan Email via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey && !resendApiKey.includes('your_')) {
      const resend = new Resend(resendApiKey);

      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${cleanDogName}'s Custom Exercise & Enrichment Plan</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px 12px; color: #1e293b; line-height: 1.6;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
    
    <!-- Top Header -->
    <div style="background: linear-gradient(135deg, #4338ca 0%, #6366f1 50%, #7c3aed 100%); padding: 32px 20px 28px; text-align: center;">
      <a href="${siteUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
        <div style="display: inline-block; background: #ffffff; padding: 10px 24px 8px; border-radius: 100px; box-shadow: 0 4px 16px rgba(0,0,0,0.15);">
          <img src="${logoUrl}" alt="IndoorDogPark.org" width="145" style="display: block; margin: 0 auto; max-width: 145px; height: auto;" />
        </div>
      </a>
      <p style="color: rgba(255,255,255,0.95); margin: 14px 0 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px;">
        🐾 Personalized Dog Care Plan
      </p>
    </div>

    <!-- Body -->
    <div style="padding: 32px 28px;">
      <h1 style="color: #0f172a; font-size: 24px; font-weight: 800; margin: 0 0 12px; letter-spacing: -0.5px;">
        Here is ${cleanDogName}'s Custom Exercise Plan! 🎾
      </h1>
      
      <p style="color: #475569; font-size: 15px; margin: 0 0 24px;">
        Based on our calculation for a <strong>${age}</strong> (${size} size, ${energy} energy level), here is the breakdown to keep ${cleanDogName} happy, mentally stimulated, and physically healthy.
      </p>

      <!-- Goal Summary Card -->
      <div style="background: #f8fafc; border: 2px solid #e0e7ff; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 28px;">
        <p style="margin: 0 0 4px; font-size: 13px; color: #6366f1; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Daily Target</p>
        <div style="font-size: 36px; font-weight: 900; color: #4338ca;">
          ${minMinutes} – ${maxMinutes} <span style="font-size: 18px; font-weight: 600; color: #64748b;">min/day</span>
        </div>
      </div>

      <!-- 7-Day Routine Checklist -->
      <h2 style="color: #0f172a; font-size: 18px; font-weight: 700; margin: 0 0 16px;">
        📋 Your 7-Day Indoor & Outdoor Balance Routine:
      </h2>

      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 24px;">
        <p style="margin: 0 0 10px; font-size: 14px; color: #334155;"><strong>• Monday (Mental Enrichment):</strong> 20 min brisk walk + 15 min puzzle toy / snuffle mat game.</p>
        <p style="margin: 0 0 10px; font-size: 14px; color: #334155;"><strong>• Tuesday (Cardio & Play):</strong> Interactive fetch or flirt pole session in the yard or living room.</p>
        <p style="margin: 0 0 10px; font-size: 14px; color: #334155;"><strong>• Wednesday (Socialization / Indoor Park):</strong> Climate-controlled indoor dog park visit or safe doggy playdate.</p>
        <p style="margin: 0 0 10px; font-size: 14px; color: #334155;"><strong>• Thursday (Trick Training):</strong> 15 min basic or advanced obedience training (burns energy faster than walking!).</p>
        <p style="margin: 0 0 10px; font-size: 14px; color: #334155;"><strong>• Friday (Scent Work):</strong> "Find the Treat" hide-and-seek game around the house.</p>
        <p style="margin: 0 0 10px; font-size: 14px; color: #334155;"><strong>• Saturday (Adventure Day):</strong> Long nature trail hike or agility obstacle practice.</p>
        <p style="margin: 0; font-size: 14px; color: #334155;"><strong>• Sunday (Rest & Grooming):</strong> Gentle stroll, soothing brush session, and frozen Kong treat.</p>
      </div>

      <!-- Bad Weather Recommendation Box -->
      <div style="background: #fdf2f8; border-left: 4px solid #db2777; padding: 16px; border-radius: 0 8px 8px 0; margin-bottom: 28px;">
        <h3 style="color: #9d174d; font-size: 15px; margin: 0 0 6px; font-weight: 700;">🌧️ Too Hot, Freezing, or Rainy Outside?</h3>
        <p style="color: #4c0519; font-size: 13px; margin: 0; line-height: 1.5;">
          Protect ${cleanDogName}'s paws from burning summer asphalt and winter frostbite. Check our nationwide directory to find verified, climate-controlled indoor dog parks near you!
        </p>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 28px 0;">
        <a href="${siteUrl}/states" style="display: inline-block; background: linear-gradient(135deg, #4338ca 0%, #7c3aed 100%); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);">
          Find Indoor Dog Parks Near You →
        </a>
      </div>

      <!-- Sign-off -->
      <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #f1f5f9; font-size: 13px; color: #64748b; text-align: center;">
        <p style="margin: 0 0 4px;">Give ${cleanDogName} an extra belly rub from us!</p>
        <p style="margin: 0; font-weight: 600; color: #334155;">The IndoorDogPark.org Team</p>
      </div>

    </div>

  </div>
</body>
</html>
      `;

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'IndoorDogPark <outreach@indoordogpark.org>',
        to: [email],
        replyTo: 'media@indoordogpark.org',
        subject: `🐾 ${cleanDogName}'s 7-Day Indoor Exercise & Enrichment Routine`,
        html: emailHtml,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Your custom 7-Day plan for ${cleanDogName} has been emailed to ${email}!`,
    });
  } catch (error) {
    console.error('[api/tools/exercise-plan-lead] error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, category, subject, message, honeypot } = body;

    // 1. Bot Spam Protection: Honeypot check (if bot fills invisible honeypot field, silent success)
    if (honeypot) {
      return NextResponse.json({ success: true, message: 'Message received' });
    }

    // 2. Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, subject, and message are required.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL || 'mahenbalal@gmail.com';
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'IndoorDogPark <outreach@indoordogpark.org>';

    // 3. Send Notification Email to Admin via Resend
    if (apiKey && !apiKey.includes('your_')) {
      const resend = new Resend(apiKey);

      const categoryLabels: Record<string, string> = {
        general: 'General Inquiry',
        support: 'Technical Support',
        partnership: 'Partnership',
        feedback: 'Feedback',
        report: 'Report an Issue',
        'list-park': 'List a Park',
      };

      const readableCategory = categoryLabels[category] || category || 'General Inquiry';

      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Contact Inquiry - IndoorDogPark.org</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px 12px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    
    <!-- Top Header -->
    <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 24px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700;">🐾 New Contact Form Message</h1>
      <p style="color: rgba(255,255,255,0.85); margin: 4px 0 0; font-size: 13px;">IndoorDogPark.org Visitor Inquiry</p>
    </div>

    <!-- Details Box -->
    <div style="padding: 28px 24px;">
      
      <div style="background: #f1f5f9; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #334155;">
          <tr>
            <td style="padding: 6px 0; font-weight: 600; width: 100px;">From:</td>
            <td style="padding: 6px 0;"><strong>${name}</strong> (&lt;<a href="mailto:${email}" style="color: #7c3aed;">${email}</a>&gt;)</td>
          </tr>
          ${phone ? `
          <tr>
            <td style="padding: 6px 0; font-weight: 600;">Phone:</td>
            <td style="padding: 6px 0;"><a href="tel:${phone}" style="color: #334155;">${phone}</a></td>
          </tr>` : ''}
          <tr>
            <td style="padding: 6px 0; font-weight: 600;">Category:</td>
            <td style="padding: 6px 0;"><span style="background: #e0e7ff; color: #4338ca; padding: 3px 8px; border-radius: 9999px; font-size: 12px; font-weight: 600;">${readableCategory}</span></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: 600;">Subject:</td>
            <td style="padding: 6px 0; font-weight: 700; color: #0f172a;">${subject}</td>
          </tr>
        </table>
      </div>

      <!-- Message Content -->
      <h3 style="color: #0f172a; font-size: 15px; margin: 0 0 8px;">Message:</h3>
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; font-size: 15px; line-height: 1.6; color: #1e293b; white-space: pre-wrap;">
${message}
      </div>

      <!-- Reply Notice -->
      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b; text-align: center;">
        💡 <em>To respond to this person, simply click <strong>"Reply"</strong> in your email client.</em>
      </div>

    </div>

    <!-- Footer -->
    <div style="background: #f8fafc; padding: 14px 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8;">
      IndoorDogPark.org • Contact System
    </div>

  </div>
</body>
</html>
      `;

      const sendResult = await resend.emails.send({
        from: fromEmail,
        to: [adminEmail],
        replyTo: email, // Direct reply in Gmail goes straight to the sender!
        subject: `[Contact Form] ${readableCategory}: ${subject} (from ${name})`,
        html: emailHtml,
      });

      if (sendResult.error) {
        console.error('[api/contact] Resend error:', sendResult.error);
        return NextResponse.json(
          { success: false, error: sendResult.error.message || 'Failed to dispatch email.' },
          { status: 500 }
        );
      }
    }

    // 4. Optional: Sync contact to Beehiiv as a lead subscriber
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
              utm_source: 'contact_form',
              custom_fields: [
                { name: 'name', value: name },
                { name: 'user_type', value: 'contact_lead' },
                { name: 'source', value: 'contact_page' },
              ],
            }),
          }
        );
      } catch (bhErr) {
        console.warn('[api/contact] Beehiiv auto-sync warning:', bhErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully.',
    });
  } catch (error) {
    console.error('[api/contact] Server error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

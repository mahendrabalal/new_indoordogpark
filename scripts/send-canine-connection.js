const { Resend } = require('resend');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function sendOutreach() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('❌ RESEND_API_KEY is missing from .env.local');
    process.exit(1);
  }

  const resend = new Resend(apiKey);
  const toEmail = 'canineconnectionuptown@gmail.com';
  const parkName = 'Canine Connection';
  const city = 'New Orleans';
  const listingUrl = 'https://www.indoordogpark.org/parks/canine-connection';
  const badgeUrl = 'https://www.indoordogpark.org/images/badge-featured.svg';

  const embedCode = `<a href="${listingUrl}" target="_blank" rel="noopener noreferrer"><img src="${badgeUrl}" alt="Featured on IndoorDogPark.org 2026" width="180" height="208" style="border:none;" /></a>`;

  const subject = `Congrats Canine Connection - Featured in the 2026 New Orleans Dog Directory!`;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px 12px; -webkit-font-smoothing: antialiased;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
    
    <!-- Top Header Banner -->
    <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 28px 24px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">IndoorDogPark.org</h1>
      <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0; font-size: 13px; font-weight: 500;">America's Premier Indoor Canine Recreation Directory</p>
    </div>

    <!-- Body Content Area -->
    <div style="padding: 32px 28px;">
      
      <!-- Personal Note Box -->
      <div style="background: #f5f3ff; border-left: 4px solid #7c3aed; padding: 14px 16px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 14px; color: #4c1d95; font-style: italic;">
          <strong>Personal note:</strong> "We loved your climate-controlled play areas and safety protocols on Tchoupitoulas St!"
        </p>
      </div>

      <h2 style="color: #1e293b; margin: 0 0 16px; font-size: 20px; font-weight: 700;">Hello Canine Connection Team,</h2>

      <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.65; color: #334155;">
        I'm reaching out from IndoorDogPark.org. We just published our 2026 directory update for <strong>${city}</strong>, and <strong>${parkName}</strong> is officially featured as a top-rated dog facility on Tchoupitoulas St!
      </p>

      <p style="margin: 0 0 20px; font-size: 15px; line-height: 1.65; color: #334155;">
        👉 <strong>View your verified listing:</strong><br />
        <a href="${listingUrl}" style="color: #7c3aed; font-weight: 600; text-decoration: underline;">${listingUrl}</a>
      </p>

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
        <h3 style="color: #0f172a; margin: 0 0 8px; font-size: 17px; font-weight: 700;">🏆 Claim Your Free Featured Listing Upgrade</h3>
        <p style="margin: 0 0 16px; font-size: 14px; color: #64748b; line-height: 1.5;">
          We’d love to upgrade Canine Connection to the <strong>#1 Featured Listing</strong> at the top of our New Orleans directory (priority search placement and map highlights).
        </p>
        <p style="margin: 0 0 12px; font-size: 13px; color: #475569; font-weight: 600;">
          All you need to do is place our official <strong>"Featured 2026"</strong> badge on your website footer, sidebar, or "About / Press" page:
        </p>

        <!-- Badge Visual -->
        <div style="margin: 16px 0;">
          <img src="${badgeUrl}" alt="Featured on IndoorDogPark.org 2026" width="160" height="185" style="display: inline-block; border: none;" />
        </div>

        <p style="margin: 12px 0 6px; font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase;">Your 1-Click HTML Embed Code:</p>
        <div style="background: #0f172a; color: #38bdf8; font-family: Consolas, Monaco, monospace; padding: 12px; border-radius: 8px; font-size: 11px; word-break: break-all; text-align: left;">
          &lt;a href="${listingUrl}" target="_blank" rel="noopener noreferrer"&gt;&lt;img src="${badgeUrl}" alt="Featured on IndoorDogPark.org 2026" width="180" height="208" style="border:none;" /&gt;&lt;/a&gt;
        </div>
      </div>

      <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.65; color: #475569;">
        Once our system detects the badge on <strong>canineconnectionnola.com</strong>, your listing is automatically upgraded to a <strong>Featured Listing</strong>!
      </p>

      <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.65; color: #475569;">
        If you need any updates to your photos, hours, or description, simply reply to this email. We're happy to help!
      </p>

      <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
        Warm regards,<br />
        <strong>The IndoorDogPark.org Team</strong><br />
        <a href="https://www.indoordogpark.org" style="color: #7c3aed; text-decoration: none;">https://www.indoordogpark.org</a>
      </p>
    </div>

    <!-- Footer -->
    <div style="background: #f8fafc; padding: 18px 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8;">
      <p style="margin: 0 0 4px;">Sent by <strong>IndoorDogPark.org</strong> • 2026 Canine Directory</p>
      <p style="margin: 0;">4920 Tchoupitoulas St, New Orleans, LA 70115 Listing Outreach</p>
    </div>

  </div>
</body>
</html>`;

  console.log(`🚀 Sending Featured Badge email to: ${toEmail}...`);

  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'IndoorDogPark.org <outreach@indoordogpark.org>',
      to: [toEmail],
      replyTo: process.env.ADMIN_EMAIL || 'outreach@indoordogpark.org',
      subject: subject,
      html: html,
    });

    if (result.error) {
      console.error('❌ Resend API Error:', result.error);
    } else {
      console.log('✅ Email successfully dispatched via Resend!');
      console.log('📧 Email ID:', result.data.id);
    }
  } catch (err) {
    console.error('❌ Unexpected Error:', err);
  }
}

sendOutreach();

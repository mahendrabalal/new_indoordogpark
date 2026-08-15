import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      to,
      toName,
      from,
      replyTo,
      subject,
      html,
      text,
      testMode,
      syncToBeehiiv,
      parkDetails,
    } = body;

    // Basic validation
    if (!to) {
      return NextResponse.json(
        { success: false, error: 'Recipient email is required' },
        { status: 400 }
      );
    }

    if (!subject) {
      return NextResponse.json(
        { success: false, error: 'Subject line is required' },
        { status: 400 }
      );
    }

    if (!html) {
      return NextResponse.json(
        { success: false, error: 'Email content (HTML) is required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { success: false, error: `Invalid email address format: ${to}` },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const defaultFrom =
      process.env.RESEND_FROM_EMAIL || 'IndoorDogPark <outreach@indoordogpark.org>';
    const senderFrom = from || defaultFrom;
    const senderReplyTo =
      replyTo || 'media@indoordogpark.org';

    // If test mode is requested without actual sending
    if (testMode && !apiKey) {
      return NextResponse.json({
        success: true,
        testMode: true,
        message: 'Preview generated successfully (No Resend API Key configured yet).',
        preview: { to, subject, from: senderFrom, replyTo: senderReplyTo },
      });
    }

    if (!apiKey || apiKey.includes('your_')) {
      return NextResponse.json(
        {
          success: false,
          error:
            'RESEND_API_KEY is not configured in .env.local. Please add your Resend API key to send live emails.',
        },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    // Send email via Resend
    const sendResult = await resend.emails.send({
      from: senderFrom,
      to: [to],
      subject,
      html,
      text: text || undefined,
      replyTo: senderReplyTo,
    });

    if (sendResult.error) {
      console.error('Resend error:', sendResult.error);
      return NextResponse.json(
        {
          success: false,
          error: sendResult.error.message || 'Failed to dispatch email via Resend',
        },
        { status: 500 }
      );
    }

    // Optional: Sync contact to Beehiiv
    let beehiivSynced = false;
    if (syncToBeehiiv) {
      const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY;
      const BEEHIIV_PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID;

      if (
        BEEHIIV_API_KEY &&
        BEEHIIV_PUBLICATION_ID &&
        !BEEHIIV_API_KEY.includes('your_')
      ) {
        try {
          const customFields = [
            { name: 'user_type', value: 'park_owner' },
            { name: 'source', value: 'outreach_studio' },
            toName ? { name: 'name', value: toName } : null,
            parkDetails?.parkName ? { name: 'park_name', value: parkDetails.parkName } : null,
            parkDetails?.city ? { name: 'city', value: parkDetails.city } : null,
            parkDetails?.state ? { name: 'state', value: parkDetails.state } : null,
            parkDetails?.website ? { name: 'website', value: parkDetails.website } : null,
          ].filter(Boolean);

          const bhRes = await fetch(
            `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${BEEHIIV_API_KEY}`,
              },
              body: JSON.stringify({
                email: to,
                reactivate_existing: false,
                send_welcome_email: false,
                utm_source: 'outreach_studio',
                custom_fields: customFields,
              }),
            }
          );
          if (bhRes.ok) {
            beehiivSynced = true;
          }
        } catch (bhErr) {
          console.warn('Beehiiv auto-sync warning:', bhErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      emailId: sendResult.data?.id,
      recipient: to,
      subject,
      beehiivSynced,
      message: `Email successfully sent to ${to}`,
    });
  } catch (error) {
    console.error('[api/outreach/composer-send] error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error while sending email',
      },
      { status: 500 }
    );
  }
}

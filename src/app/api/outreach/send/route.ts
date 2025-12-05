import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, generateParkOutreachEmail, type ParkOutreachData } from '@/lib/email';

// Rate limiting: max 10 emails per hour per IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication (you may want to add admin-only access)
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.OUTREACH_API_TOKEN;

    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { parkName, parkEmail, parkCity, parkState, parkWebsite, personalizedNote, testMode } = body;

    // Validation
    if (!parkName || !parkEmail) {
      return NextResponse.json(
        { success: false, error: 'parkName and parkEmail are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(parkEmail)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const parkData: ParkOutreachData = {
      parkName,
      parkEmail,
      parkCity,
      parkState,
      parkWebsite,
      personalizedNote,
    };

    // Generate email HTML
    const emailHtml = await generateParkOutreachEmail(parkData);
    const subject = `Partner with IndoorDogPark.org - Increase Visibility for ${parkName}`;

    // In test mode, return the email HTML without sending
    if (testMode) {
      return NextResponse.json({
        success: true,
        testMode: true,
        subject,
        html: emailHtml,
        message: 'Email generated successfully (test mode - not sent)',
      });
    }

    // Send email
    const result = await sendEmail({
      to: parkEmail,
      subject,
      html: emailHtml,
      replyTo: 'media@indoordogpark.org',
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        emailId: result.id,
        message: `Email sent successfully to ${parkEmail}`,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[outreach] send error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Outreach email endpoint is ready. Use POST to send emails.',
    usage: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_TOKEN (optional, set OUTREACH_API_TOKEN env var)',
      },
      body: {
        parkName: 'string (required)',
        parkEmail: 'string (required)',
        parkCity: 'string (optional)',
        parkState: 'string (optional)',
        parkWebsite: 'string (optional)',
        personalizedNote: 'string (optional)',
        testMode: 'boolean (optional, default: false)',
      },
    },
  });
}


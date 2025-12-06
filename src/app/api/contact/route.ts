import { NextResponse } from 'next/server';
import EmailService from '@/lib/email-service';

type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category?: string;
};

const MAX_MESSAGE_LENGTH = 2000;

function validatePayload(payload: Partial<ContactPayload>) {
  const errors: string[] = [];

  if (!payload.name?.trim()) errors.push('Name is required.');
  if (!payload.email?.trim()) errors.push('Email is required.');
  if (!payload.subject?.trim()) errors.push('Subject is required.');
  if (!payload.message?.trim()) errors.push('Message is required.');

  if (payload.message && payload.message.length > MAX_MESSAGE_LENGTH) {
    errors.push('Message is too long.');
  }

  return errors;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<ContactPayload>;
    const errors = validatePayload(payload);

    if (errors.length) {
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    // Send notification to admin
    const notificationResult = await EmailService.sendContactNotification(payload as ContactPayload);

    if (!notificationResult.success) {
      console.error('[contact] Failed to send admin notification:', notificationResult.error);
      // Continue with sending user confirmation even if admin notification fails
    }

    // Send confirmation to user
    const confirmationResult = await EmailService.sendContactConfirmation(payload as ContactPayload);

    if (!confirmationResult.success) {
      console.error('[contact] Failed to send user confirmation:', confirmationResult.error);
      // Still return success since the main notification was sent
    }

    console.info('[contact] submission processed', {
      name: payload.name,
      email: payload.email,
      subject: payload.subject,
      category: payload.category,
      adminNotified: notificationResult.success,
      userNotified: confirmationResult.success,
    });

    return NextResponse.json({
      success: true,
      message: 'Your message has been received. We will be in touch soon.',
    });
  } catch (error) {
    console.error('[contact] submission failed', error);
    return NextResponse.json(
      {
        success: false,
        errors: ['Unable to process your request right now. Please try again later.'],
      },
      { status: 500 }
    );
  }
}

export function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Contact endpoint is ready to accept POST requests.',
  });
}

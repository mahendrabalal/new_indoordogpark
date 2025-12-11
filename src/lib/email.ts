import { Resend } from 'resend';
import { render } from '@react-email/render';
import { ParkOutreachEmail } from '@/emails/ParkOutreachEmail';
import { OwnerWelcomeEmail } from '@/emails/OwnerWelcomeEmail';
import { ConsumerWelcomeEmail } from '@/emails/ConsumerWelcomeEmail';
import { FollowUpEmail } from '@/emails/FollowUpEmail';

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
 * Get the base URL for the application
 */
function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://indoordogpark.org';
}

/**
 * Generate HTML email template for park outreach
 */
export async function generateParkOutreachEmail(data: ParkOutreachData): Promise<string> {
  const baseUrl = getBaseUrl();
  return await render(
    ParkOutreachEmail({
      ...data,
      baseUrl,
    })
  );
}

/**
 * Generate a follow-up email template
 */
export async function generateFollowUpEmail(data: ParkOutreachData): Promise<string> {
  const baseUrl = getBaseUrl();
  return await render(
    FollowUpEmail({
      parkName: data.parkName,
      parkCity: data.parkCity,
      parkState: data.parkState,
      baseUrl,
    })
  );
}

/**
 * Generate welcome email for consumer subscribers (dog park visitors)
 */
export async function generateConsumerWelcomeEmail(email: string): Promise<string> {
  return await render(
    ConsumerWelcomeEmail({
      email,
    })
  );
}

/**
 * Generate welcome email for owner subscribers (park owners)
 */
export async function generateOwnerWelcomeEmail(): Promise<string> {
  const baseUrl = getBaseUrl();
  return await render(
    OwnerWelcomeEmail({
      baseUrl,
    })
  );
}

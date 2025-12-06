import React from 'react';
import { Resend } from 'resend';
import { AdminNotificationEmail } from './email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailParams {
  to: string;
  subject: string;
  react: JSX.Element;
  from?: string;
  replyTo?: string;
}

interface ContactSubmission {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category?: string;
}

export class EmailService {
  static async sendEmail(params: EmailParams): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await resend.emails.send({
        from: params.from || 'Indoor Dog Park <noreply@indoordogpark.org>',
        to: [params.to],
        subject: params.subject,
        react: params.react,
        replyTo: params.replyTo,
      });

      if (error) {
        console.error('[EmailService] Failed to send email:', error);
        return { success: false, error: error.message };
      }

      console.log('[EmailService] Email sent successfully:', data);
      return { success: true };
    } catch (error) {
      console.error('[EmailService] Unexpected error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  static async sendContactNotification(submission: ContactSubmission): Promise<{ success: boolean; error?: string }> {
    const adminEmail = process.env.ADMIN_EMAIL || 'contact@indoordogpark.org';

    const emailParams: EmailParams = {
      to: adminEmail,
      subject: `New Contact Form Submission: ${submission.subject}`,
      react: AdminNotificationEmail(submission),
      replyTo: submission.email,
    };

    return this.sendEmail(emailParams);
  }

  static async sendContactConfirmation(submission: ContactSubmission): Promise<{ success: boolean; error?: string }> {
    const confirmationEmail = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thank you for contacting Indoor Dog Park</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #8b5cf6; padding: 30px; text-align: center; color: white; }
            .content { padding: 30px; background: #f9fafb; }
            .footer { padding: 20px; text-align: center; font-size: 14px; color: #666; }
            h1 { margin: 0; font-size: 28px; }
            .field { margin: 15px 0; }
            .label { font-weight: 600; margin-bottom: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Contacting Us!</h1>
              <p>We've received your message and will get back to you soon.</p>
            </div>
            <div class="content">
              <h2>Your Message Details:</h2>
              <div class="field">
                <div class="label">Name:</div>
                <div>${submission.name}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div>${submission.email}</div>
              </div>
              ${submission.phone ? `
                <div class="field">
                  <div class="label">Phone:</div>
                  <div>${submission.phone}</div>
                </div>
              ` : ''}
              <div class="field">
                <div class="label">Subject:</div>
                <div>${submission.subject}</div>
              </div>
              ${submission.category ? `
                <div class="field">
                  <div class="label">Category:</div>
                  <div>${submission.category}</div>
                </div>
              ` : ''}
              <div class="field">
                <div class="label">Message:</div>
                <div style="white-space: pre-wrap;">${submission.message}</div>
              </div>
            </div>
            <div class="footer">
              <p>&copy; 2024 Indoor Dog Park. All rights reserved.</p>
              <p>Indoor Dog Park | <a href="https://www.indoordogpark.org">www.indoordogpark.org</a></p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailParams: EmailParams = {
      to: submission.email,
      subject: 'Thank you for contacting Indoor Dog Park',
      react: <div dangerouslySetInnerHTML={{ __html: confirmationEmail }} />,
    };

    return this.sendEmail(emailParams);
  }
}

export default EmailService;
import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth-helpers';
import { supabaseAdminClient } from '@/lib/supabase-admin';
import { sendEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ submissionId: string }> }
) {
  try {
    const { user, error: authError } = await getUserFromRequest(request);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userMetadata = user.user_metadata as { role?: string } | undefined;
    if (userMetadata?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden. Admin access required.' },
        { status: 403 }
      );
    }

    const { submissionId } = await params;
    const body = await request.json();
    const { replyMessage } = body as { replyMessage: string };

    if (!replyMessage || typeof replyMessage !== 'string' || replyMessage.trim() === '') {
      return NextResponse.json(
        { error: 'Reply message is required.' },
        { status: 400 }
      );
    }

    // 1. Fetch the original park submission
    const { data: submission, error: fetchError } = await supabaseAdminClient
      .from('park_submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (fetchError || !submission) {
      return NextResponse.json(
        { error: 'Park submission not found' },
        { status: 404 }
      );
    }

    if (!submission.email) {
      return NextResponse.json(
        { error: 'No email address found for this submission' },
        { status: 400 }
      );
    }

    // Fix list rendering in Gmail by removing <p> tags inside <li> tags
    const emailSafeMessage = replyMessage.replace(/<li>\s*<p>([\s\S]*?)<\/p>\s*<\/li>/g, '<li>$1</li>');

    // 2. Send the email using Resend
    const emailResult = await sendEmail({
      to: submission.email,
      from: 'Indoor Dog Parks Team <media@indoordogpark.org>',
      subject: `Re: Your Park Submission - ${submission.name}`,
      html: `
        <div style="font-family: sans-serif; color: #333;">
          ${emailSafeMessage}
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
          <p style="color: #666; font-size: 0.9em;">
            <strong>Your Original Submission:</strong><br/>
            Park Name: ${submission.name}<br/>
            Location: ${submission.city}, ${submission.state}<br/>
            Description: ${submission.description}
          </p>
        </div>
      `,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        { error: 'Failed to send email via Resend' },
        { status: 500 }
      );
    }

    // 3. Update the database record (this relies on the new DB columns)
    const { data: updatedData, error: updateError } = await supabaseAdminClient
      .from('park_submissions')
      .update({
        reply_message: replyMessage,
        replied_at: new Date().toISOString(),
      })
      .eq('id', submissionId)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update park submission record. Make sure you ran the SQL migration!' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      submission: updatedData,
    });

  } catch (error) {
    console.error('Admin park submission reply error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

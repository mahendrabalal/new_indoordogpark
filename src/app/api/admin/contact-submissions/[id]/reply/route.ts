import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth-helpers';
import { supabaseAdminClient } from '@/lib/supabase-admin';
import { sendEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
    const body = await request.json();
    const { replyMessage } = body as { replyMessage: string };

    if (!replyMessage || typeof replyMessage !== 'string' || replyMessage.trim() === '') {
      return NextResponse.json(
        { error: 'Reply message is required.' },
        { status: 400 }
      );
    }

    // 1. Fetch the original contact submission
    const { data: submission, error: fetchError } = await supabaseAdminClient
      .from('contact_submissions')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !submission) {
      return NextResponse.json(
        { error: 'Contact submission not found' },
        { status: 404 }
      );
    }

    // Fix list rendering in Gmail by removing <p> tags inside <li> tags
    const emailSafeMessage = replyMessage.replace(/<li>\s*<p>([\s\S]*?)<\/p>\s*<\/li>/g, '<li>$1</li>');

    // 2. Send the email using Resend
    const emailResult = await sendEmail({
      to: submission.email,
      from: 'Indoor Dog Parks Team <media@indoordogpark.org>',
      subject: `Re: ${submission.subject}`,
      html: `
        <div style="font-family: sans-serif; color: #333;">
          ${emailSafeMessage}
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
          <p style="color: #666; font-size: 0.9em;">
            <strong>Original Message:</strong><br/>
            ${submission.message.replace(/\n/g, '<br/>')}
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

    // 3. Update the database record
    const { data: updatedData, error: updateError } = await supabaseAdminClient
      .from('contact_submissions')
      .update({
        status: 'replied',
        reply_message: replyMessage,
        replied_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update contact submission record' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      contactSubmission: {
        id: updatedData.id,
        name: updatedData.name,
        email: updatedData.email,
        phone: updatedData.phone,
        subject: updatedData.subject,
        message: updatedData.message,
        category: updatedData.category,
        status: updatedData.status,
        adminNotes: updatedData.admin_notes,
        replyMessage: updatedData.reply_message,
        repliedAt: updatedData.replied_at,
        createdAt: updatedData.created_at,
        updatedAt: updatedData.updated_at,
      },
    });

  } catch (error) {
    console.error('Admin contact submission reply error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

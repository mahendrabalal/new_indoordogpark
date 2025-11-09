import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth-helpers';
import { supabaseAdminClient } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await getUserFromRequest(request);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check admin role
    const userMetadata = user.user_metadata as { role?: string } | undefined;
    if (userMetadata?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden. Admin access required.' },
        { status: 403 }
      );
    }

    const { submissionId, reason } = (await request.json()) as {
      submissionId?: string;
      reason?: string;
    };

    if (!submissionId || !reason) {
      return NextResponse.json(
        { error: 'Submission ID and rejection reason are required' },
        { status: 400 }
      );
    }

    // Update submission status to rejected
    const { error: updateError } = await supabaseAdminClient
      .from('park_submissions')
      .update({
        status: 'rejected',
        rejection_reason: reason,
      })
      .eq('id', submissionId);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to reject submission' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Submission rejected',
    }, { status: 200 });

  } catch (error) {
    console.error('Reject submission error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

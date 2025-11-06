import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();

    // Check if user is authenticated and is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check admin role
    const userMetadata = (user as any).user_metadata;
    if (userMetadata?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden. Admin access required.' },
        { status: 403 }
      );
    }

    const { submissionId, reason } = await request.json();

    if (!submissionId || !reason) {
      return NextResponse.json(
        { error: 'Submission ID and rejection reason are required' },
        { status: 400 }
      );
    }

    // Update submission status to rejected
    const { error: updateError } = await supabase
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

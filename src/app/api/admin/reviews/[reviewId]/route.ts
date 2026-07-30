import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { supabaseAdminClient } from '@/lib/supabase-admin';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const userMetadata = user.user_metadata as { role?: string };
    if (userMetadata?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { reviewId } = await params;

    if (!reviewId) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }

    // Delete the review
    const { error: updateError } = await supabaseAdminClient
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (updateError) {
      console.error('Error deleting review:', updateError);
      return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

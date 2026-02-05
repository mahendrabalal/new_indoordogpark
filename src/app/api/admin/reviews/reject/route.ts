import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const userMetadata = user.user_metadata as { role?: string } | undefined;
    if (userMetadata?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { reviewId } = await request.json();

    if (!reviewId) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }

    // Update review status to rejected
    const { data: review, error } = await supabase
      .from('reviews')
      .update({
        status: 'rejected',
        // Store rejection reason if provided (you may need to add a rejection_reason column)
      })
      .eq('id', reviewId)
      .select()
      .single();

    if (error) {
      console.error('Error rejecting review:', error);
      return NextResponse.json({ error: 'Failed to reject review' }, { status: 500 });
    }

    return NextResponse.json({ review, message: 'Review rejected successfully' });
  } catch (error) {
    console.error('Error in reject review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


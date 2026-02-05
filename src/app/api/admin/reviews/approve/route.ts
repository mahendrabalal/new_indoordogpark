import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export const runtime = 'edge';
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

    // Update review status to approved
    const { data: review, error } = await supabase
      .from('reviews')
      .update({ status: 'approved' })
      .eq('id', reviewId)
      .select()
      .single();

    if (error) {
      console.error('Error approving review:', error);
      return NextResponse.json({ error: 'Failed to approve review' }, { status: 500 });
    }

    return NextResponse.json({ review, message: 'Review approved successfully' });
  } catch (error) {
    console.error('Error in approve review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


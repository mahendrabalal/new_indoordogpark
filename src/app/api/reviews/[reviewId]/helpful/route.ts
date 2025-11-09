import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function POST(
  request: NextRequest,
  { params }: { params: { reviewId: string } }
) {
  try {
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { isHelpful } = await request.json();

    if (typeof isHelpful !== 'boolean') {
      return NextResponse.json({ error: 'isHelpful boolean is required' }, { status: 400 });
    }

    const { data: vote, error } = await supabase
      .from('review_helpful_votes')
      .upsert({
        user_id: user.id,
        review_id: params.reviewId,
        is_helpful: isHelpful,
      })
      .select()
      .single();

    if (error) {
      console.error('Error submitting helpful vote:', error);
      return NextResponse.json({ error: 'Failed to submit helpful vote' }, { status: 500 });
    }

    return NextResponse.json({ vote });
  } catch (error) {
    console.error('Error in helpful vote POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { reviewId: string } }
) {
  try {
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('review_helpful_votes')
      .delete()
      .eq('user_id', user.id)
      .eq('review_id', params.reviewId);

    if (error) {
      console.error('Error removing helpful vote:', error);
      return NextResponse.json({ error: 'Failed to remove helpful vote' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in helpful vote DELETE:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
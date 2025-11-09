import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const parkId = searchParams.get('parkId');

    if (!parkId) {
      return NextResponse.json({ error: 'Park ID is required' }, { status: 400 });
    }

    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('park_id', parkId)
      .eq('status', 'approved') // Only show approved reviews
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }

    // Ensure reviews is an array and has valid data
    const validReviews = Array.isArray(reviews) ? reviews : [];

    // Calculate average rating
    const avgRating = validReviews.length > 0
      ? validReviews.reduce((sum, review) => sum + (review.rating || 0), 0) / validReviews.length
      : 0;

    return NextResponse.json({
      reviews: validReviews,
      averageRating: Number(avgRating.toFixed(1)),
      totalReviews: validReviews.length
    });
  } catch (error) {
    console.error('Error in reviews GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // Debug logging
    console.log('POST Reviews - Auth Debug:', { user, authError });

    if (authError || !user) {
      return NextResponse.json({
        error: 'Unauthorized',
        details: authError?.message || 'No user found',
        authError: authError
      }, { status: 401 });
    }

    const { parkId, parkSlug, rating, title, comment } = await request.json();

    if (!parkId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Valid park ID and rating (1-5) are required' }, { status: 400 });
    }

    const { data: review, error } = await supabase
      .from('reviews')
      .upsert({
        user_id: user.id,
        park_id: parkId,
        rating,
        title: title || null,
        content: comment || null, // Map 'comment' to 'content' column
        status: 'pending', // Set default status
      })
      .select()
      .single();

    if (error) {
      console.error('Error submitting review:', error);
      return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
    }

    return NextResponse.json({ review });
  } catch (error) {
    console.error('Error in reviews POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
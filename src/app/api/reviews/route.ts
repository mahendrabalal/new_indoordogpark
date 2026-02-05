import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const { searchParams } = new URL(request.url);
    const parkId = searchParams.get('parkId');
    const includeUserReview = searchParams.get('includeUserReview') === 'true';

    if (!parkId) {
      return NextResponse.json({ error: 'Park ID is required' }, { status: 400 });
    }

    // Get current user if includeUserReview is true
    let currentUserId: string | null = null;
    let userReview: unknown = null;

    if (includeUserReview) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        currentUserId = user.id;
        // Fetch user's review (regardless of status) if they have one
        const { data: review } = await supabase
          .from('reviews')
          .select('*')
          .eq('park_id', parkId)
          .eq('user_id', user.id)
          .single();
        userReview = review;
      }
    }

    // Fetch all approved reviews for the park
    let query = supabase
      .from('reviews')
      .select('*')
      .eq('park_id', parkId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    // If we have a user review, exclude it from the main list (we'll return it separately)
    if (currentUserId && userReview) {
      query = query.neq('user_id', currentUserId) as typeof query;
    }

    const { data: reviews, error } = await query;

    if (error) {
      console.error('Error fetching reviews:', error);
      return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }

    // Ensure reviews is an array and has valid data
    const validReviews = Array.isArray(reviews) ? reviews : [];

    // Calculate average rating from all approved reviews (including user's if approved)
    const allReviewsForAvg = userReview && (userReview as { status?: string }).status === 'approved'
      ? [...validReviews, userReview]
      : validReviews;

    const avgRating = allReviewsForAvg.length > 0
      ? allReviewsForAvg.reduce((sum, review) => sum + ((review as { rating?: number }).rating || 0), 0) / allReviewsForAvg.length
      : 0;

    return NextResponse.json({
      reviews: validReviews,
      averageRating: Number(avgRating.toFixed(1)),
      totalReviews: allReviewsForAvg.length,
      userReview: userReview || null, // Include user's review (even if pending/rejected) so they can edit it
    });
  } catch (error) {
    console.error('Error in reviews GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
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

    const { parkId, rating, title, comment } = await request.json();

    if (!parkId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Valid park ID and rating (1-5) are required' }, { status: 400 });
    }

    // Check if user already has a review for this park
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('user_id', user.id)
      .eq('park_id', parkId)
      .single();

    let review;
    let error;

    if (existingReview) {
      // Update existing review
      const { data: updatedReview, error: updateError } = await supabase
        .from('reviews')
        .update({
          rating,
          title: title || null,
          content: comment || null,
          status: 'pending', // Reset to pending when updated
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingReview.id)
        .select()
        .single();
      review = updatedReview;
      error = updateError;
    } else {
      // Create new review
      const { data: newReview, error: insertError } = await supabase
        .from('reviews')
        .insert({
          user_id: user.id,
          park_id: parkId,
          rating,
          title: title || null,
          content: comment || null,
          status: 'pending', // Set default status
        })
        .select()
        .single();
      review = newReview;
      error = insertError;
    }

    if (error) {
      console.error('Error submitting review:', error);

      // Provide more helpful error messages
      if (error.code === '23503') {
        // Foreign key constraint violation
        return NextResponse.json({
          error: 'Database configuration error',
          details: 'The reviews table foreign key constraint is misconfigured. Please run the migration to fix it.',
          code: error.code
        }, { status: 500 });
      }

      return NextResponse.json({
        error: 'Failed to submit review',
        details: error.message || 'Unknown error occurred'
      }, { status: 500 });
    }

    return NextResponse.json({ review });
  } catch (error) {
    console.error('Error in reviews POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
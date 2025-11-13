import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth-helpers';
import { supabaseAdminClient } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
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

    // Get filter from query params
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const pageParam = Number.parseInt(searchParams.get('page') || '1', 10);
    const pageSizeParam = Number.parseInt(searchParams.get('pageSize') || '10', 10);

    const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
    const pageSize = Number.isNaN(pageSizeParam)
      ? 10
      : Math.min(Math.max(pageSizeParam, 1), 100);
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Build query
    let query = supabaseAdminClient
      .from('park_submissions')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    const {
      data: submissions,
      error: fetchError,
      count,
    } = await query.range(from, to);

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch submissions' },
        { status: 500 }
      );
    }

    // Transform to camelCase
    const transformedSubmissions = submissions?.map(sub => ({
      id: sub.id,
      userId: sub.user_id,
      name: sub.name,
      slug: sub.slug,
      businessType: sub.business_type,
      description: sub.description,
      address: sub.address,
      street: sub.street,
      city: sub.city,
      state: sub.state,
      zipCode: sub.zip_code,
      fullAddress: sub.full_address,
      latitude: sub.latitude,
      longitude: sub.longitude,
      phone: sub.phone,
      email: sub.email,
      website: sub.website,
      socialMedia: sub.social_media,
      photos: sub.photos,
      openingHours: sub.opening_hours,
      hours24x7: sub.hours_24x7,
      hoursNote: sub.hours_note,
      pricingInfo: sub.pricing_info,
      amenities: sub.amenities,
      indoorOutdoor: sub.indoor_outdoor,
      sizeCategory: sub.size_category,
      surfaceType: sub.surface_type,
      petFriendlyFeatures: sub.pet_friendly_features,
      listingType: sub.listing_type,
      status: sub.status,
      rejectionReason: sub.rejection_reason,
      stripeSubscriptionId: sub.stripe_subscription_id,
      stripeCustomerId: sub.stripe_customer_id,
      subscriptionStatus: sub.subscription_status,
      subscriptionCurrentPeriodEnd: sub.subscription_current_period_end,
      createdAt: sub.created_at,
      updatedAt: sub.updated_at,
      approvedAt: sub.approved_at,
      approvedBy: sub.approved_by,
    })) || [];

    const total = count ?? 0;
    const totalPages = total === 0 ? 1 : Math.max(1, Math.ceil(total / pageSize));

    return NextResponse.json(
      {
        submissions: transformedSubmissions,
        meta: {
          total,
          page,
          pageSize,
          totalPages,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Admin submissions fetch error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

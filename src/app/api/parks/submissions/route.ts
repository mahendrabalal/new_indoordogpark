import { NextResponse } from 'next/server';
import { supabaseAdminClient } from '@/lib/supabase-admin';

export async function GET() {
  try {
    // Fetch only approved submissions from database
    const { data: submissions, error } = await supabaseAdminClient
      .from('park_submissions')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching approved submissions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch approved submissions' },
        { status: 500 }
      );
    }

    // Transform database submissions to match frontend park format
    const transformedSubmissions = submissions?.map(sub => ({
      id: sub.id,
      name: sub.name,
      slug: sub.slug || sub.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      businessType: sub.business_type,
      rating: 0, // User submissions start with no rating
      reviewCount: 0,
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
      description: sub.description,
      photo: sub.photos?.[0] || null,
      photos: sub.photos || [],
      priceLevel: sub.pricing_info && typeof sub.pricing_info === 'string' ? (sub.pricing_info.includes('$$') ? 2 : sub.pricing_info.includes('$') ? 1 : 0) : undefined,
      openingHours: sub.opening_hours,
      amenities: sub.amenities || [],
      userRatingsTotal: 0,
      // Add source tracking
      source: 'user_submitted',
      listingType: sub.listing_type || 'free',
      submittedBy: sub.user_id,
      submittedAt: sub.created_at,
      approvedAt: sub.approved_at,
      subscriptionStatus: sub.subscription_status
    })) || [];

    return NextResponse.json({ parks: transformedSubmissions });

  } catch (error) {
    console.error('Approved submissions API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
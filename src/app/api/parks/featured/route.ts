import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Supabase client already imported

    // Fetch approved featured parks
    const { data: parks, error } = await supabase
      .from('park_submissions')
      .select('*')
      .eq('status', 'approved')
      .eq('listing_type', 'featured')
      .order('created_at', { ascending: false })
      .limit(6); // Show top 6 featured parks

    if (error) {
      console.error('Failed to fetch featured parks:', error);
      return NextResponse.json(
        { error: 'Failed to fetch featured parks' },
        { status: 500 }
      );
    }

    // Transform snake_case to camelCase for frontend
    const transformedParks = parks?.map(park => ({
      id: park.id,
      userId: park.user_id,
      name: park.name,
      slug: park.slug,
      businessType: park.business_type,
      description: park.description,
      address: park.address,
      street: park.street,
      city: park.city,
      state: park.state,
      zipCode: park.zip_code,
      fullAddress: park.full_address,
      latitude: park.latitude,
      longitude: park.longitude,
      phone: park.phone,
      email: park.email,
      website: park.website,
      socialMedia: park.social_media,
      photos: park.photos,
      openingHours: park.opening_hours,
      hours24x7: park.hours_24x7,
      hoursNote: park.hours_note,
      pricingInfo: park.pricing_info,
      amenities: park.amenities,
      indoorOutdoor: park.indoor_outdoor,
      sizeCategory: park.size_category,
      surfaceType: park.surface_type,
      petFriendlyFeatures: park.pet_friendly_features,
      listingType: park.listing_type,
      status: park.status,
      createdAt: park.created_at,
      updatedAt: park.updated_at,
      approvedAt: park.approved_at,
    })) || [];

    return NextResponse.json({ parks: transformedParks }, { status: 200 });

  } catch (error) {
    console.error('GET featured parks error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

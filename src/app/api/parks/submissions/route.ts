import { NextResponse } from 'next/server';
import { supabaseAdminClient } from '@/lib/supabase-admin';
import { MediaAsset } from '@/types/dog-park';

export async function GET() {
  try {
    const normalizePhotos = (photos: unknown): MediaAsset[] => {
      if (!Array.isArray(photos)) return [];

      return photos
        .map((photo) => {
          if (!photo) return null;

          if (typeof photo === 'string') {
            const trimmed = photo.trim();
            if (!trimmed) return null;
            return {
              url: trimmed,
              type: 'photo',
            } as MediaAsset;
          }

          if (typeof photo === 'object') {
            const anyPhoto = photo as Record<string, unknown>;
            const url =
              typeof anyPhoto.url === 'string' && anyPhoto.url.trim()
                ? anyPhoto.url
                : typeof anyPhoto.publicUrl === 'string' && anyPhoto.publicUrl.trim()
                  ? anyPhoto.publicUrl
                  : undefined;

            if (!url) return null;

            return {
              type: (anyPhoto.type as MediaAsset['type']) || 'photo',
              url,
              caption: typeof anyPhoto.caption === 'string' ? anyPhoto.caption : undefined,
              source: typeof anyPhoto.source === 'string' ? (anyPhoto.source as MediaAsset['source']) : undefined,
              uploadedAt: typeof anyPhoto.uploadedAt === 'string' ? anyPhoto.uploadedAt : undefined,
              storagePath: typeof anyPhoto.storagePath === 'string' ? anyPhoto.storagePath : undefined,
            } satisfies MediaAsset;
          }

          return null;
        })
        .filter((photo): photo is MediaAsset => !!photo);
    };

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
    const transformedSubmissions = submissions?.map((sub: any) => {
      const normalizedPhotos = normalizePhotos(sub.photos);

      return {
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
        photo: normalizedPhotos[0]?.url,
        photos: normalizedPhotos,
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
      };
    }) || [];

    return NextResponse.json({ parks: transformedSubmissions });

  } catch (error) {
    console.error('Approved submissions API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
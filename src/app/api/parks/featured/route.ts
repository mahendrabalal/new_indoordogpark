import { NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity-client';
import { MediaAsset } from '@/types/dog-park';
import { unstable_cache } from 'next/cache';

export const revalidate = 3600; // Cache for 1 hour to prevent Egress overages
export const runtime = 'nodejs';

const fetchFeaturedParksData = unstable_cache(
  async () => {
    const query = `*[_type == "parkSubmission" && status == "approved" && listingType == "featured"] | order(_createdAt desc)[0...12] {
        _id,
        _createdAt,
        name,
        "slug": slug.current,
        businessType,
        description,
        address,
        city,
        state,
        zipCode,
        latitude,
        longitude,
        phone,
        email,
        website,
        socialMedia,
        amenities,
        rules,
        pricingInfo,
        listingType,
        status,
        "photos": photos[]{
            "url": asset->url
        }
    }`;

    const sanityParksData = await sanityClient.fetch(query).catch((err) => {
      console.error('Failed to fetch from Sanity:', err);
      return [];
    });

    const sanityParks = sanityParksData.map((park: any) => {
      const normalizedPhotos: MediaAsset[] = (park.photos || [])
        .map((p: any) => ({
          url: p.url,
          type: 'photo',
        }))
        .filter((p: any) => p.url);

      return {
        id: park._id,
        userId: park.userId || 'anonymous',
        name: park.name,
        slug: park.slug,
        businessType: park.businessType,
        description: park.description,
        address: park.address,
        street: park.address,
        city: park.city,
        state: park.state,
        zipCode: park.zipCode,
        fullAddress: `${park.address || ''}, ${park.city || ''}, ${park.state || ''} ${park.zipCode || ''}`
          .trim()
          .replace(/^,|,$/g, '')
          .trim(),
        latitude: park.latitude,
        longitude: park.longitude,
        phone: park.phone,
        email: park.email,
        website: park.website,
        socialMedia: park.socialMedia,
        photos: normalizedPhotos,
        photo: normalizedPhotos[0]?.url,
        openingHours: park.openingHours || null,
        hours24x7: false,
        hoursNote: null,
        pricingInfo: park.pricingInfo,
        amenities: park.amenities,
        listingType: park.listingType || 'free',
        status: park.status,
        createdAt: park._createdAt,
        updatedAt: park._updatedAt || park._createdAt,
        approvedAt: park._createdAt,
      };
    });

    return sanityParks
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt || b.submittedAt || b.approvedAt || 0).getTime() -
          new Date(a.createdAt || a.submittedAt || a.approvedAt || 0).getTime()
      )
      .slice(0, 12);
  },
  ['featured-parks-data'],
  {
    revalidate: 3600,
    tags: ['park-submissions', 'parks'],
  }
);

export async function GET() {
  try {
    const allParks = await fetchFeaturedParksData();

    return NextResponse.json(
      { parks: allParks },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('GET featured parks error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

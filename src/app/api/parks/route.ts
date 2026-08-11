import { NextResponse } from 'next/server';
import { DogPark, MediaAsset } from '@/types/dog-park';
import { sanityServerClient } from '@/lib/sanity-server';
import { normalizeState, normalizeStateKey } from '@/lib/state';
import { getAllStaticParks, mapSanitySubmissionToDogPark } from '@/lib/parks-data';

export const revalidate = 1800; // Cache for 30 minutes to minimize Supabase egress

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '20', 10));
    // Use the Edge-compatible library function which bundles all JSON data
    const allStaticParks = await getAllStaticParks();
    const staticParks = allStaticParks;

    // Add source tracking to static parks
    const staticParksWithSource = staticParks.map(park => ({
      ...park,
      source: 'static',
      listingType: 'free'
    }));

    // Helper to normalize photos from database submissions
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
              typeof anyPhoto.url === 'string' && anyPhoto.url.trim() !== ''
                ? anyPhoto.url
                : typeof anyPhoto.publicUrl === 'string' && anyPhoto.publicUrl.trim() !== ''
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

    // Fetch approved user submissions from database
    let submissionParks: DogPark[] = [];
    try {
      const sanityQuery = `*[_type == "parkSubmission" && status == "approved"] | order(_createdAt desc) {
        ...,
        "photoUrls": photos[].asset->url
      }`;
      const submissions = await sanityServerClient.fetch(sanityQuery);

      if (submissions && submissions.length > 0) {
        submissionParks = submissions.map((sub: any) => mapSanitySubmissionToDogPark(sub));
      }
    } catch (error) {
      console.warn('[PARKS API] Failed to fetch submissions from Sanity', error);
    }

    // Merge both data sources
    const allParks: DogPark[] = [...staticParksWithSource, ...submissionParks] as DogPark[];

    // Remove duplicates based on name and city combination
    const uniqueParks = allParks.filter((park, index, arr) => {
      const key = `${park.name.toLowerCase()}|${park.city.toLowerCase()}|${normalizeStateKey(park.state)}`;
      return arr.findIndex(p => `${p.name.toLowerCase()}|${p.city.toLowerCase()}|${normalizeStateKey(p.state)}` === key) === index;
    });

    // Sort featured parks first, then by name
    uniqueParks.sort((a, b) => {
      // Featured parks come first
      if (a.listingType === 'featured' && b.listingType !== 'featured') return -1;
      if (a.listingType !== 'featured' && b.listingType === 'featured') return 1;

      // Within same category, sort by name
      return a.name.localeCompare(b.name);
    });

    // Apply pagination
    const startIdx = (page - 1) * limit;
    const endIdx = startIdx + limit;
    const parks = uniqueParks.slice(startIdx, endIdx);
    const totalParks = uniqueParks.length;
    const totalPages = Math.ceil(totalParks / limit);

    return NextResponse.json(
      {
        data: parks,
        pagination: {
          page,
          limit,
          totalParks,
          totalPages,
          hasMore: page < totalPages
        }
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=600, stale-while-revalidate=3600' // Reduced cache time to include fresh submissions
        }
      }
    );
  } catch (error) {
    console.error('Error fetching parks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch parks data' },
      { status: 500 }
    );
  }
}
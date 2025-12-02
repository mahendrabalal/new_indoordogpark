import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { DogPark, MediaAsset } from '@/types/dog-park';
import { supabaseAdminClient } from '@/lib/supabase-admin';
import { normalizeTypeParameter } from '@/lib/type-normalizer';

export const dynamic = 'force-dynamic';

interface SearchParams {
  q?: string;
  type?: string;
  minRating?: number;
  priceRange?: string;
  city?: string;
  amenities?: string[];
  sortBy?: 'relevance' | 'rating' | 'reviews' | 'name' | 'distance';
  page?: number;
  limit?: number;
  listingType?: 'featured' | 'free';
}

// Calculate search relevance score
function calculateRelevance(park: DogPark, searchTerm: string): number {
  if (!searchTerm) return 0;
  
  const term = searchTerm.toLowerCase();
  let score = 0;
  
  // Exact name match = highest score
  if (park.name.toLowerCase() === term) score += 100;
  else if (park.name.toLowerCase().includes(term)) score += 50;
  
  // Slug match (for searching by URL-friendly names)
  if (park.slug?.toLowerCase() === term) score += 90;
  else if (park.slug?.toLowerCase().includes(term)) score += 45;
  
  // City match
  if (park.city.toLowerCase() === term) score += 80;
  else if (park.city.toLowerCase().includes(term)) score += 40;
  
  // Address match
  if (park.address?.toLowerCase().includes(term)) score += 30;
  if (park.full_address?.toLowerCase().includes(term)) score += 20;
  
  // Description match
  if (park.description?.toLowerCase().includes(term)) score += 10;
  
  // Business type match
  if (park.businessType.toLowerCase().includes(term)) score += 15;
  
  // Boost featured listings slightly
  if (park.listingType === 'featured') score += 5;
  
  // Boost highly rated parks
  score += park.rating * 2;
  
  return score;
}

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse search parameters
    const listingTypeParam = searchParams.get('listingType');
    const listingType =
      listingTypeParam === 'featured' || listingTypeParam === 'free'
        ? listingTypeParam
        : undefined;

    // Normalize type parameter to prevent invalid values from causing empty results
    const rawType = searchParams.get('type') || undefined;
    const normalizedType = rawType && rawType !== 'all' 
      ? normalizeTypeParameter(rawType) || undefined
      : undefined;

    const params: SearchParams = {
      q: searchParams.get('q') || undefined,
      type: normalizedType,
      minRating: searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined,
      priceRange: searchParams.get('priceRange') || undefined,
      city: searchParams.get('city') || undefined,
      amenities: searchParams.get('amenities')?.split(',').filter(Boolean) || [],
      sortBy: (searchParams.get('sortBy') as SearchParams['sortBy']) || 'relevance',
      page: Math.max(1, parseInt(searchParams.get('page') || '1', 10)),
      limit: Math.min(100, parseInt(searchParams.get('limit') || '50', 10)),
      listingType,
    };

    // Fetch static parks from JSON files
    const allStaticParks: DogPark[] = [];
    
    // Load California parks
    try {
      const californiaPath = join(process.cwd(), 'public/data/california.json');
      const californiaContent = await readFile(californiaPath, 'utf-8');
      const californiaParks: DogPark[] = JSON.parse(californiaContent);
      allStaticParks.push(...californiaParks);
    } catch (error) {
      console.error('Failed to read California parks data:', error);
    }
    
    // Load Washington parks
    try {
      const washingtonPath = join(process.cwd(), 'public/data/washington.json');
      const washingtonContent = await readFile(washingtonPath, 'utf-8');
      const washingtonParks: DogPark[] = JSON.parse(washingtonContent);
      allStaticParks.push(...washingtonParks);
    } catch (error) {
      console.error('Failed to read Washington parks data:', error);
    }
    
    // Load Mixmatch parks (multi-state parks)
    try {
      const mixmatchPath = join(process.cwd(), 'public/data/mixmatch.json');
      const mixmatchContent = await readFile(mixmatchPath, 'utf-8');
      const mixmatchParks: DogPark[] = JSON.parse(mixmatchContent);
      allStaticParks.push(...mixmatchParks);
    } catch (error) {
      console.error('Failed to read Mixmatch parks data:', error);
    }

    // Add source tracking to static parks
    const staticParksWithSource = allStaticParks.map(park => ({
      ...park,
      source: 'static' as const,
      listingType: park.listingType || ('free' as const)
    }));

    // Fetch approved user submissions from database
    let submissionParks: DogPark[] = [];
    try {
      const { data: submissions, error } = await supabaseAdminClient
        .from('park_submissions')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) {
        // Industry standard: Log error but don't fail the entire request
        console.error('[SEARCH API] Error fetching approved submissions:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
        // Continue with empty array - graceful degradation
        submissionParks = [];
      } else if (submissions && submissions.length > 0) {
        // Industry standard: Log success for monitoring
        console.log(`[SEARCH API] Found ${submissions.length} approved submission(s)`);
        submissionParks = submissions.map(sub => {
          const normalizedPhotos = normalizePhotos(sub.photos);

          return {
            id: sub.id,
            name: sub.name,
            slug: sub.slug || sub.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            businessType: sub.business_type,
            rating: 0,
            reviewCount: 0,
            address: sub.address,
            street: sub.street,
            city: sub.city,
            state: sub.state,
            zipCode: sub.zip_code,
            full_address: sub.full_address || `${sub.address || ''} ${sub.city || ''} ${sub.state || ''} ${sub.zip_code || ''}`.trim(),
            latitude: sub.latitude,
            longitude: sub.longitude,
            phone: sub.phone,
            email: sub.email,
            website: sub.website,
            description: sub.description,
            photos: normalizedPhotos,
            photo: normalizedPhotos[0]?.url,
            priceLevel: sub.pricing_info && typeof sub.pricing_info === 'string' ? (sub.pricing_info.includes('$$') ? 2 : sub.pricing_info.includes('$') ? 1 : 0) : undefined,
            openingHours: sub.opening_hours,
            amenities: sub.amenities || {},
            userRatingsTotal: 0,
            source: 'user_submitted' as const,
            listingType: sub.listing_type || ('free' as const),
            submittedBy: sub.user_id,
            submittedAt: sub.created_at,
            approvedAt: sub.approved_at,
            subscriptionStatus: sub.subscription_status
          } as DogPark;
        });
      } else {
        // No submissions found - this is normal, not an error
        submissionParks = [];
      }
    } catch (dbError) {
      // Industry standard: Catch unexpected errors, log them, but continue gracefully
      console.error('[SEARCH API] Unexpected error fetching submissions:', {
        error: dbError instanceof Error ? dbError.message : String(dbError),
        stack: dbError instanceof Error ? dbError.stack : undefined,
      });
      submissionParks = []; // Graceful degradation - return empty array
    }

    // Merge both data sources
    let allParks: DogPark[] = [...staticParksWithSource, ...submissionParks];

    // Remove duplicates based on name and city combination
    allParks = allParks.filter((park, index, arr) => {
      const key = `${park.name.toLowerCase()}|${park.city.toLowerCase()}`;
      return arr.findIndex(p => `${p.name.toLowerCase()}|${p.city.toLowerCase()}` === key) === index;
    });

    // APPLY FILTERS
    let filteredParks = allParks;

    // 1. Text search filter
    if (params.q) {
      const searchTerm = params.q.toLowerCase();
      filteredParks = filteredParks.filter(park => {
        return (
          park.name.toLowerCase().includes(searchTerm) ||
          park.slug?.toLowerCase().includes(searchTerm) ||
          park.city.toLowerCase().includes(searchTerm) ||
          park.address?.toLowerCase().includes(searchTerm) ||
          park.full_address?.toLowerCase().includes(searchTerm) ||
          park.description?.toLowerCase().includes(searchTerm) ||
          park.businessType.toLowerCase().includes(searchTerm) ||
          park.state?.toLowerCase().includes(searchTerm) ||
          park.zipCode?.toLowerCase().includes(searchTerm)
        );
      });
    }

    // 2. Type filter
    if (params.type && params.type !== 'all') {
      filteredParks = filteredParks.filter(park => park.businessType === params.type);
    }

    // 3. City filter
    if (params.city) {
      const cityTerm = params.city.toLowerCase();
      filteredParks = filteredParks.filter(park => 
        park.city.toLowerCase() === cityTerm || 
        park.city.toLowerCase().includes(cityTerm)
      );
    }

    // 4. Minimum rating filter
    if (params.minRating !== undefined) {
      filteredParks = filteredParks.filter(park => park.rating >= params.minRating!);
    }

    // 5. Price range filter
    if (params.priceRange && params.priceRange !== 'all') {
      if (params.priceRange === 'free') {
        filteredParks = filteredParks.filter(park => 
          park.pricing?.isFree || 
          (!park.pricing?.dropInFee && !park.pricing?.dailyRate && !park.priceLevel)
        );
      } else {
        const priceLevel = params.priceRange.length; // $ = 1, $$ = 2, $$$ = 3
        filteredParks = filteredParks.filter(park => 
          park.priceLevel === priceLevel ||
          (park.pricing?.priceRange && park.pricing.priceRange.length === priceLevel)
        );
      }
    }

    // 6. Amenities filter
    if (params.amenities && params.amenities.length > 0) {
      filteredParks = filteredParks.filter(park => {
        if (!park.amenities) return false;
        return params.amenities!.every(amenity => 
          park.amenities && park.amenities[amenity as keyof typeof park.amenities] === true
        );
      });
    }

    // 7. Listing type filter (premium vs free)
    if (params.listingType) {
      filteredParks = filteredParks.filter(
        park => park.listingType === params.listingType
      );
    }

    // CALCULATE RELEVANCE SCORES (for relevance sorting)
    const parksWithScores = filteredParks.map(park => ({
      park,
      relevance: calculateRelevance(park, params.q || '')
    }));

    // APPLY SORTING
    parksWithScores.sort((a, b) => {
      switch (params.sortBy) {
        case 'relevance':
          // Featured parks get slight boost, then by relevance score
          if (a.park.listingType === 'featured' && b.park.listingType !== 'featured') return -1;
          if (a.park.listingType !== 'featured' && b.park.listingType === 'featured') return 1;
          return b.relevance - a.relevance;
        
        case 'rating':
          if (b.park.rating !== a.park.rating) return b.park.rating - a.park.rating;
          return b.park.reviewCount - a.park.reviewCount; // Tie-breaker
        
        case 'reviews':
          return b.park.reviewCount - a.park.reviewCount;
        
        case 'name':
          return a.park.name.localeCompare(b.park.name);
        
        case 'distance':
          // TODO: Implement distance calculation when user location is available
          return 0;
        
        default:
          return 0;
      }
    });

    const sortedParks = parksWithScores.map(item => item.park);

    // APPLY PAGINATION
    const totalResults = sortedParks.length;
    const totalPages = Math.ceil(totalResults / params.limit!);
    const startIdx = (params.page! - 1) * params.limit!;
    const endIdx = startIdx + params.limit!;
    const paginatedParks = sortedParks.slice(startIdx, endIdx);

    // Return results
    return NextResponse.json(
      {
        success: true,
        data: paginatedParks,
        pagination: {
          page: params.page!,
          limit: params.limit!,
          totalResults,
          totalPages,
          hasMore: params.page! < totalPages
        },
        filters: {
          query: params.q,
          type: params.type,
          minRating: params.minRating,
          priceRange: params.priceRange,
          city: params.city,
          amenities: params.amenities,
          sortBy: params.sortBy,
          listingType: params.listingType,
        },
        meta: {
          totalParks: allParks.length,
          searchApplied: !!params.q,
          filtersApplied: !!(
            params.type ||
            params.minRating ||
            params.priceRange ||
            params.city ||
            params.amenities?.length ||
            params.listingType
          )
        }
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=600'
        }
      }
    );
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to search parks',
        data: [],
        pagination: {
          page: 1,
          limit: 50,
          totalResults: 0,
          totalPages: 0,
          hasMore: false
        }
      },
      { status: 500 }
    );
  }
}

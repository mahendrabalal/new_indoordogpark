import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { DogPark, MediaAsset } from '@/types/dog-park';
import { supabaseAdminClient } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '20', 10));

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
    
    // Load New York parks
    try {
      const newyorkPath = join(process.cwd(), 'public/data/newyork.json');
      const newyorkContent = await readFile(newyorkPath, 'utf-8');
      const newyorkParks: DogPark[] = JSON.parse(newyorkContent);
      allStaticParks.push(...newyorkParks);
    } catch (error) {
      console.error('Failed to read New York parks data:', error);
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
      const { data: submissions, error } = await supabaseAdminClient
        .from('park_submissions')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (!error && submissions) {
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
            amenities: sub.amenities || [],
            userRatingsTotal: 0,
            source: 'user_submitted',
            listingType: sub.listing_type || 'free',
            submittedBy: sub.user_id,
            submittedAt: sub.created_at,
            approvedAt: sub.approved_at,
            subscriptionStatus: sub.subscription_status
          };
        });
      }
    } catch (dbError) {
      console.error('Error fetching user submissions:', dbError);
      // Continue with static parks only if database fetch fails
    }

    // Merge both data sources
    const allParks: DogPark[] = [...staticParksWithSource, ...submissionParks] as DogPark[];

    // Remove duplicates based on name and city combination
    const uniqueParks = allParks.filter((park, index, arr) => {
      const key = `${park.name.toLowerCase()}|${park.city.toLowerCase()}`;
      return arr.findIndex(p => `${p.name.toLowerCase()}|${p.city.toLowerCase()}` === key) === index;
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
import { NextResponse } from 'next/server';
import { DogPark, MediaAsset } from '@/types/dog-park';
import { normalizeState, normalizeStateKey } from '@/lib/state';
import { getAllStaticParks, loadUserSubmissions } from '@/lib/parks-data';

export const dynamic = 'force-dynamic'; // API routes using request.url must be dynamic

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

    // Fetch approved user submissions (cached from Sanity CDN)
    const submissionParks = await loadUserSubmissions().catch(() => []);

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
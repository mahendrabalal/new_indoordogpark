import { NextResponse } from 'next/server';
import { DogPark } from '@/types/dog-park';
import { supabaseAdminClient } from '@/lib/supabase-admin';
import { getAllStaticParks } from '@/lib/parks-data';

export const dynamic = 'force-dynamic';

interface AutocompleteSuggestion {
  type: 'city' | 'park' | 'business_type';
  value: string;
  displayValue: string;
  subtitle?: string;
  count?: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim() || '';

    // Require at least 2 characters
    if (query.length < 2) {
      return NextResponse.json({
        success: true,
        suggestions: [],
        query
      });
    }

    const searchTerm = query.toLowerCase();

    // Fetch static parks using centralized data loader
    const staticParks = await getAllStaticParks();

    // Fetch approved user submissions from database
    let submissionParks: DogPark[] = [];
    try {
      const { data: submissions, error } = await supabaseAdminClient
        .from('park_submissions')
        .select('name, city, business_type, latitude, longitude')
        .eq('status', 'approved');

      if (!error && submissions) {
        submissionParks = submissions.map((sub: any) => ({
          name: sub.name,
          city: sub.city,
          businessType: sub.business_type,
        })) as DogPark[];
      }
    } catch (dbError) {
      console.error('Error fetching submissions for autocomplete:', dbError);
    }

    // Merge both sources
    const allParks = [...staticParks, ...submissionParks];

    const suggestions: AutocompleteSuggestion[] = [];

    // 1. CITY SUGGESTIONS (max 3)
    const cityMap = new Map<string, number>();
    allParks.forEach(park => {
      if (park.city && park.city.toLowerCase().includes(searchTerm)) {
        const city = park.city;
        cityMap.set(city, (cityMap.get(city) || 0) + 1);
      }
    });

    const citySuggestions = Array.from(cityMap.entries())
      .sort((a, b) => {
        // Prioritize cities that start with search term
        const aStarts = a[0].toLowerCase().startsWith(searchTerm);
        const bStarts = b[0].toLowerCase().startsWith(searchTerm);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        // Then by count
        return b[1] - a[1];
      })
      .slice(0, 3)
      .map(([city, count]) => ({
        type: 'city' as const,
        value: city,
        displayValue: city,
        subtitle: `${count} ${count === 1 ? 'park' : 'parks'}`,
        count
      }));

    suggestions.push(...citySuggestions);

    // 2. PARK NAME SUGGESTIONS (max 5)
    const parkSuggestions = allParks
      .filter(park =>
        park.name.toLowerCase().includes(searchTerm) ||
        park.slug?.toLowerCase().includes(searchTerm)
      )
      .sort((a, b) => {
        // Prioritize parks that start with search term (name or slug)
        const aNameStarts = a.name.toLowerCase().startsWith(searchTerm);
        const aSlugStarts = a.slug?.toLowerCase().startsWith(searchTerm);
        const bNameStarts = b.name.toLowerCase().startsWith(searchTerm);
        const bSlugStarts = b.slug?.toLowerCase().startsWith(searchTerm);

        if ((aNameStarts || aSlugStarts) && !(bNameStarts || bSlugStarts)) return -1;
        if (!(aNameStarts || aSlugStarts) && (bNameStarts || bSlugStarts)) return 1;
        // Then by rating
        return b.rating - a.rating;
      })
      .slice(0, 5)
      .map(park => ({
        type: 'park' as const,
        value: park.name,
        displayValue: park.name,
        subtitle: park.city
      }));

    suggestions.push(...parkSuggestions);

    // 3. BUSINESS TYPE SUGGESTIONS (if matches)
    const businessTypes = [
      { value: 'General Play / Daycare Parks', display: 'General Play / Daycare Parks' },
      { value: 'Agility & Training Parks', display: 'Agility & Training Parks' },
      { value: 'Themed & Enrichment Parks', display: 'Themed & Enrichment Parks' },
      { value: 'Specialty / Social Parks', display: 'Specialty / Social Parks' },
    ];

    const typeSuggestions = businessTypes
      .filter(type =>
        type.value.toLowerCase().includes(searchTerm) ||
        type.display.toLowerCase().includes(searchTerm)
      )
      .map(type => {
        const count = allParks.filter(p => p.businessType === type.value).length;
        return {
          type: 'business_type' as const,
          value: type.value,
          displayValue: type.display,
          subtitle: `${count} locations`,
          count
        };
      });

    suggestions.push(...typeSuggestions);

    // Limit total suggestions to 10
    const limitedSuggestions = suggestions.slice(0, 10);

    return NextResponse.json(
      {
        success: true,
        suggestions: limitedSuggestions,
        query
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=120'
        }
      }
    );
  } catch (error) {
    console.error('Autocomplete API Error:', error);
    return NextResponse.json(
      {
        success: false,
        suggestions: [],
        error: 'Failed to fetch suggestions'
      },
      { status: 500 }
    );
  }
}









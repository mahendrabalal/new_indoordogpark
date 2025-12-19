import { supabaseAdminClient } from '@/lib/supabase-admin';
import type { DogPark } from '@/types/dog-park';
import type { CityData } from '@/lib/cityData';
import { getAllStaticParks, mapSubmissionToDogPark, type SubmissionRow } from '@/lib/parks-data';
import { normalizeStateKey } from '@/lib/state';
import { getCityCardsForState, getIndexableStateSlugs, getStateBySlug, type StateData } from '@/lib/stateData';

export type StateStats = {
  totalParks: number;
  totalCities: number;
  avgRating: number;
  totalReviews: number;
};

export type StateContentPayload = {
  state: {
    name: string;
    abbr: string;
    slug: string;
    featuredImage: string;
  };
  canonicalSlug: string;
  indexable: boolean;
  stats: StateStats;
  cities: CityData[];
  exampleParks: Array<Pick<DogPark, 'name' | 'city' | 'state'>>;
};

const INDEX_THRESHOLDS = { minCities: 5, minListings: 5 };

function dedupeParks(parks: DogPark[]): DogPark[] {
  const seen = new Set<string>();
  const result: DogPark[] = [];
  for (const park of parks) {
    const key = `${park.name.toLowerCase()}|${park.city.toLowerCase()}|${normalizeStateKey(park.state)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(park);
  }
  return result;
}

export async function getAllParksForStateAggregation(): Promise<DogPark[]> {
  const staticParks = await getAllStaticParks();
  let submissionParks: DogPark[] = [];
  try {
    const { data: submissions, error } = await supabaseAdminClient
      .from('park_submissions')
      .select('*')
      .eq('status', 'approved');

    if (!error && submissions) {
      submissionParks = submissions.map((sub) => mapSubmissionToDogPark(sub as SubmissionRow));
    }
  } catch {
    // Ignore DB errors for sitemap/state pages; fall back to static data.
  }

  return dedupeParks([...staticParks, ...submissionParks]);
}

export async function getAllStateSlugs(): Promise<string[]> {
  const allParks = await getAllParksForStateAggregation();
  return getIndexableStateSlugs(allParks, INDEX_THRESHOLDS);
}

function pickFeaturedImage(state: StateData): string {
  // Keep consistent with existing city/park fallbacks and palette.
  if (state.slug === 'california') {
    return 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80';
  }
  if (state.slug === 'washington') {
    return 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80';
  }
  return 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80';
}

export async function getStateContentBySlug(slug: string): Promise<StateContentPayload | null> {
  const allParks = await getAllParksForStateAggregation();

  const state = getStateBySlug(allParks, slug);
  if (!state) return null;

  const indexable = state.totalCities >= INDEX_THRESHOLDS.minCities && state.totalParks >= INDEX_THRESHOLDS.minListings;
  const canonicalSlug = state.slug;
  const cities = getCityCardsForState(allParks, state)
    .sort((a, b) => b.parkCount - a.parkCount)
    .slice(0, 24);

  const exampleParks = allParks
    .filter((p) => normalizeStateKey(p.state) === normalizeStateKey(state.abbr))
    .slice(0, 3)
    .map((p) => ({ name: p.name, city: p.city, state: p.state }));

  return {
    state: {
      name: state.name,
      abbr: state.abbr,
      slug: state.slug,
      featuredImage: pickFeaturedImage(state),
    },
    canonicalSlug,
    indexable,
    stats: {
      totalParks: state.totalParks,
      totalCities: state.totalCities,
      avgRating: state.avgRating,
      totalReviews: state.totalReviews,
    },
    cities,
    exampleParks,
  };
}



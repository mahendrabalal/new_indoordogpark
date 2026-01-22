import { supabaseAdminClient } from '@/lib/supabase-admin';
import type { DogPark } from '@/types/dog-park';
import type { CityData } from '@/lib/cityData';
import { getAllStaticParks, mapSubmissionToDogPark, type SubmissionRow } from '@/lib/parks-data';
import { normalizeStateKey } from '@/lib/state';
import { getCityCardsForState, getIndexableStateSlugs, getStateBySlug, type StateData } from '@/lib/stateData';
import { priorityStateContent } from '@/data/priorityStateContent';
import { StateCustomContent, PriorityStateConfig } from '@/types/state-content';

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
  customContent?: StateCustomContent;
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

function getPriorityStateConfigBySlug(slug: string) {
  const normalized = slug.toLowerCase().trim();
  return (
    priorityStateContent.find((s) => s.slug === normalized) ||
    priorityStateContent.find(
      (s) => s.slug.startsWith(`${normalized}-`) || normalized.startsWith(`${s.slug}-`),
    )
  );
}

const REGIONAL_HEROES: Record<string, string> = {
  // PNW
  'WA': '/images/cities/seattle/hero.webp',
  'OR': '/images/cities/portland-or/hero.png',
  'ID': '/images/cities/seattle/hero.webp',
  'MT': '/images/cities/minneapolis-mn/hero.png',
  'WY': '/images/cities/minneapolis-mn/hero.png',

  // Desert / Mountain West
  'AZ': '/images/cities/Phoenix/hero.webp',
  'NV': '/images/cities/las-vegas-nv/hero.png',
  'UT': '/images/cities/las-vegas-nv/hero.png',
  'NM': '/images/cities/las-vegas-nv/hero.png',
  'CO': '/images/cities/minneapolis-mn/hero.png',

  // Midwest / Great Lakes
  'IL': '/images/cities/chicago-il/hero.png',
  'MN': '/images/cities/minneapolis-mn/hero.png',
  'OH': '/images/cities/columbus-oh/hero.png',
  'MI': '/images/cities/chicago-il/hero.png',
  'WI': '/images/cities/minneapolis-mn/hero.png',
  'IN': '/images/cities/columbus-oh/hero.png',
  'IA': '/images/cities/chicago-il/hero.png',
  'MO': '/images/cities/chicago-il/hero.png',
  'NE': '/images/cities/chicago-il/hero.png',
  'KS': '/images/cities/austin-tx/hero.png',
  'ND': '/images/cities/minneapolis-mn/hero.png',
  'SD': '/images/cities/minneapolis-mn/hero.png',

  // Northeast / New England
  'NY': '/images/cities/new-york/hero.webp',
  'MA': '/images/cities/new-york/hero.webp',
  'PA': '/images/cities/columbus-oh/hero.png',
  'NJ': '/images/cities/new-york/hero.webp',
  'CT': '/images/cities/new-york/hero.webp',
  'RI': '/images/cities/new-york/hero.webp',
  'VT': '/images/cities/portland-or/hero.png', // Rainy/Woodsy vibe
  'NH': '/images/cities/portland-or/hero.png',
  'ME': '/images/cities/portland-or/hero.png',
  'MD': '/images/cities/columbus-oh/hero.png',
  'DE': '/images/cities/new-york/hero.webp',

  // South / Sunbelt
  'TX': '/images/cities/austin-tx/hero.png',
  'GA': '/images/cities/houston-tx/hero.png',
  'FL': '/images/cities/houston-tx/hero.png', // Or Miami if we had it
  'NC': '/images/cities/columbus-oh/hero.png',
  'SC': '/images/cities/houston-tx/hero.png',
  'AL': '/images/cities/houston-tx/hero.png',
  'MS': '/images/cities/houston-tx/hero.png',
  'LA': '/images/cities/houston-tx/hero.png',
  'AR': '/images/cities/austin-tx/hero.png',
  'TN': '/images/cities/austin-tx/hero.png',
  'KY': '/images/cities/columbus-oh/hero.png',
  'WV': '/images/cities/columbus-oh/hero.png',
  'VA': '/images/cities/columbus-oh/hero.png',
  'OK': '/images/cities/austin-tx/hero.png',

  // California
  'CA': '/images/cities/los-angeles/hero.webp',
  'AK': '/images/cities/minneapolis-mn/hero.png', // Winter vibe
  'HI': '/images/cities/san-diego/hero.webp', // Coastal vibe fallback
};

function pickFeaturedImage(state: StateData, priorityConfig?: PriorityStateConfig): string {
  if (priorityConfig?.featuredImage) return priorityConfig.featuredImage;

  // Regional Archetype Mapping
  const regionalHero = REGIONAL_HEROES[state.abbr.toUpperCase()];
  if (regionalHero) return regionalHero;

  // Final absolute fallback to a verified local asset
  return '/images/cities/los-angeles/hero.webp';
}

export async function getStateContentBySlug(slug: string): Promise<StateContentPayload | null> {
  const allParks = await getAllParksForStateAggregation();

  const state = getStateBySlug(allParks, slug);
  if (!state) return null;

  const priorityConfig = getPriorityStateConfigBySlug(slug);

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
      featuredImage: pickFeaturedImage(state, priorityConfig),
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
    customContent: priorityConfig?.customContent,
  };
}



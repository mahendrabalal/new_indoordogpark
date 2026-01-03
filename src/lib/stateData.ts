import type { DogPark } from '@/types/dog-park';
import type { CityData } from '@/lib/cityData';
import { getAllCities, getParksByCity } from '@/lib/cityData';
import { normalizeState, normalizeStateKey, type USStateAbbr } from '@/lib/state';

export interface StateData {
  abbr: USStateAbbr;
  name: string;
  slug: string; // canonical, e.g. "arizona"
  totalParks: number;
  totalCities: number;
  avgRating: number;
  totalReviews: number;
}

// Canonical USPS abbreviations to full names.
// Keep this explicit so state pages have stable slugs and titles.
const ABBR_TO_NAME: Record<USStateAbbr, string> = {
  AL: 'Alabama',
  AK: 'Alaska',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
};

function stateNameToSlug(stateName: string): string {
  return stateName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toStateAbbr(value: string | undefined | null): USStateAbbr | null {
  const normalized = normalizeState(value);
  if (!normalized || normalized.length !== 2) return null;
  return normalized.toUpperCase() as USStateAbbr;
}

export function getAllStates(parks: DogPark[]): StateData[] {
  const byState = new Map<USStateAbbr, DogPark[]>();

  for (const park of parks) {
    const abbr = toStateAbbr(park.state);
    if (!abbr) continue;
    if (!byState.has(abbr)) byState.set(abbr, []);
    byState.get(abbr)!.push(park);
  }

  const states: StateData[] = Array.from(byState.entries()).map(([abbr, stateParks]) => {
    const totalParks = stateParks.length;
    const totalReviews = stateParks.reduce((sum, p) => sum + (p.reviewCount || 0), 0);
    const avgRating =
      totalParks > 0
        ? parseFloat((stateParks.reduce((sum, p) => sum + (p.rating || 0), 0) / totalParks).toFixed(1))
        : 0;

    const cities = getAllCities(stateParks);

    const name = ABBR_TO_NAME[abbr];
    return {
      abbr,
      name,
      slug: stateNameToSlug(name),
      totalParks,
      totalCities: cities.length,
      avgRating,
      totalReviews,
    };
  });

  return states.sort((a, b) => b.totalParks - a.totalParks);
}

export function getStateBySlug(parks: DogPark[], slugOrAbbr: string): StateData | null {
  const normalized = slugOrAbbr.toLowerCase().trim();
  const allStates = getAllStates(parks);

  // Accept abbreviations like "az".
  if (normalized.length === 2) {
    const abbr = normalized.toUpperCase() as USStateAbbr;
    return allStates.find((s) => s.abbr === abbr) || null;
  }

  // Accept canonical slugs like "arizona".
  return allStates.find((s) => s.slug === normalized) || null;
}

export function getCitiesForState(allParks: DogPark[], state: string): CityData[] {
  const stateKey = normalizeStateKey(state);
  const stateParks = allParks.filter((p) => normalizeStateKey(p.state) === stateKey);
  const cities = getAllCities(stateParks);
  return cities;
}

export function isIndexableState(state: StateData, thresholds: { minCities: number; minListings: number }) {
  return state.totalCities >= thresholds.minCities && state.totalParks >= thresholds.minListings;
}

export function getIndexableStateSlugs(
  parks: DogPark[],
  thresholds: { minCities: number; minListings: number },
): string[] {
  return getAllStates(parks)
    .filter((s) => isIndexableState(s, thresholds))
    .map((s) => s.slug);
}

export function getCityCardsForState(allParks: DogPark[], state: StateData): CityData[] {
  const cities = getCitiesForState(allParks, state.abbr);
  // Ensure city stats are hydrated for consistent card display.
  return cities.map((city) => {
    const cityParks = getParksByCity(allParks, city.name, city.state);
    const totalReviews = cityParks.reduce((sum, p) => sum + (p.reviewCount || 0), 0);
    const avgRating =
      cityParks.length > 0
        ? parseFloat((cityParks.reduce((sum, p) => sum + (p.rating || 0), 0) / cityParks.length).toFixed(1))
        : 0;
    return {
      ...city,
      parkCount: cityParks.length,
      totalReviews,
      avgRating,
    };
  });
}


















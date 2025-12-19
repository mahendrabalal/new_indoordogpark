import { readFile } from 'fs/promises';
import path from 'path';
import { DogPark, MediaAsset } from '@/types/dog-park';
import { CityCustomContent } from '@/types/city-content';
import { normalizeState, normalizeStateKey } from '@/lib/state';
import { priorityCityContent } from '@/data/priorityCityContent';
import {
  CityData,
  CityStats,
  getAllCities,
  getCityBySlug as findCityBySlug,
  getCityStatistics,
  getParksByCity,
  getParksByType,
  getNearbyCities,
  slugToCityName,
} from '@/lib/cityData';
import { supabaseAdminClient } from '@/lib/supabase-admin';

export interface PaginatedParks {
  data: DogPark[];
  pagination: {
    page: number;
    limit: number;
    totalParks: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface CityContentPayload {
  city: CityData;
  cityParks: DogPark[];
  parksByType: Record<string, DogPark[]>;
  stats: CityStats;
  customContent?: CityCustomContent;
  nearbyCities?: CityData[];
}

const californiaDataPath = path.join(process.cwd(), 'public/data/california.json');
const washingtonDataPath = path.join(process.cwd(), 'public/data/washington.json');
const mixmatchDataPath = path.join(process.cwd(), 'public/data/mixmatch.json');

let parksCache: DogPark[] | null = null;

function getPriorityCityConfigBySlug(slug: string) {
  const normalized = slug.toLowerCase().trim();
  return (
    priorityCityContent.find((c) => c.slug === normalized) ||
    priorityCityContent.find(
      (c) => c.slug.startsWith(`${normalized}-`) || normalized.startsWith(`${c.slug}-`),
    )
  );
}

function slugify(name: string, city?: string): string {
  const base = `${name}-${city || ''}`.trim().toLowerCase();
  return base
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function normalizePark(rawPark: DogPark): DogPark {
  const slug = rawPark.slug || slugify(rawPark.name, rawPark.city);
  return {
    ...rawPark,
    slug,
    state: normalizeState(rawPark.state),
    source: rawPark.source || 'static',
    listingType: rawPark.listingType || 'free',
  };
}

function normalizeSubmissionPhotos(photos: unknown): MediaAsset[] {
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
}

export interface SubmissionRow {
  id: string;
  name: string;
  slug?: string | null;
  business_type: string;
  description?: string | null;
  address?: string | null;
  street?: string | null;
  city: string;
  state: string;
  zip_code?: string | null;
  full_address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  photos?: unknown;
  opening_hours?: Record<string, string> | null;
  amenities?: Record<string, unknown> | null;
  listing_type?: string | null;
  user_id: string;
  created_at: string;
  updated_at?: string | null;
  approved_at?: string | null;
}

export function mapSubmissionToDogPark(submission: SubmissionRow): DogPark {
  const photos = normalizeSubmissionPhotos(submission.photos);

  return {
    id: submission.id,
    name: submission.name,
    slug:
      submission.slug ||
      slugify(submission.name, submission.city),
    businessType: submission.business_type,
    rating: 0,
    reviewCount: 0,
    address: submission.address,
    street: submission.street,
    city: submission.city,
    state: normalizeState(submission.state),
    zipCode: submission.zip_code,
    full_address:
      submission.full_address ||
      `${submission.address || ''}, ${submission.city || ''}, ${submission.state || ''}, ${submission.zip_code || ''}`.replace(
        /(^,\s*|\s*,\s*$)/g,
        '',
      ),
    latitude: submission.latitude,
    longitude: submission.longitude,
    phone: submission.phone,
    email: submission.email,
    website: submission.website,
    description: submission.description,
    photos,
    photo: photos[0]?.url,
    openingHours: submission.opening_hours,
    amenities: submission.amenities || {},
    source: 'user_submitted',
    listingType: submission.listing_type || 'free',
    submittedBy: submission.user_id,
    submittedAt: submission.created_at,
    approvedAt: submission.approved_at,
    lastUpdated: submission.updated_at || submission.approved_at || submission.created_at,
  } as DogPark;
}

function dedupeParks(parks: DogPark[]): DogPark[] {
  const seen = new Set<string>();
  return parks.filter((park) => {
    const key = `${park.name.toLowerCase()}|${park.city.toLowerCase()}|${normalizeStateKey(park.state)}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

async function loadStaticParks(): Promise<DogPark[]> {
  if (parksCache) {
    return parksCache;
  }

  try {
    const allParks: DogPark[] = [];
    
    // Load California parks
    try {
      const californiaContent = await readFile(californiaDataPath, 'utf-8');
      const californiaParks: DogPark[] = JSON.parse(californiaContent);
      allParks.push(...californiaParks);
    } catch (error) {
      console.error('Failed to read California parks data:', error);
    }
    
    // Load Washington parks
    try {
      const washingtonContent = await readFile(washingtonDataPath, 'utf-8');
      const washingtonParks: DogPark[] = JSON.parse(washingtonContent);
      allParks.push(...washingtonParks);
    } catch (error) {
      console.error('Failed to read Washington parks data:', error);
    }
    
    // Load Mixmatch parks (multi-state parks)
    try {
      const mixmatchContent = await readFile(mixmatchDataPath, 'utf-8');
      const mixmatchParks: DogPark[] = JSON.parse(mixmatchContent);
      allParks.push(...mixmatchParks);
    } catch (error) {
      console.error('Failed to read Mixmatch parks data:', error);
    }
    
    const normalized = allParks.map(normalizePark);
    const deduped = dedupeParks(normalized);
    deduped.sort((a, b) => a.name.localeCompare(b.name));
    parksCache = deduped;
    return deduped;
  } catch (error) {
    console.error('Failed to read parks data from disk:', error);
    parksCache = [];
    return [];
  }
}

export async function getAllStaticParks(): Promise<DogPark[]> {
  return loadStaticParks();
}

export async function getPaginatedStaticParks(page = 1, limit = 20): Promise<PaginatedParks> {
  const parks = await loadStaticParks();
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, Math.min(limit, 100));
  const startIdx = (safePage - 1) * safeLimit;
  const data = parks.slice(startIdx, startIdx + safeLimit);
  const totalParks = parks.length;
  const totalPages = Math.ceil(totalParks / safeLimit) || 1;

  return {
    data,
    pagination: {
      page: safePage,
      limit: safeLimit,
      totalParks,
      totalPages,
      hasMore: safePage < totalPages,
    },
  };
}

export async function getParkBySlug(slug: string): Promise<DogPark | null> {
  const parks = await loadStaticParks();
  
  // Try exact match first
  let park = parks.find((p) => (p.slug || p.id) === slug);
  if (park) {
    return park;
  }

  // Try fuzzy matching: remove common city/state suffixes and try again
  // This handles cases where URL has "-new-york" or "-brooklyn" but data doesn't
  const cityStatePatterns = [
    /-new-york$/i,
    /-new-york-ny$/i,
    /-brooklyn$/i,
    /-brooklyn-ny$/i,
    /-manhattan$/i,
    /-queens$/i,
    /-bronx$/i,
    /-california$/i,
    /-los-angeles$/i,
    /-san-francisco$/i,
    /-san-diego$/i,
    /-washington$/i,
    /-seattle$/i,
    /-florida$/i,
    /-nc$/i,
    /-ca$/i,
  ];
  
  for (const pattern of cityStatePatterns) {
    const trimmedSlug = slug.replace(pattern, '');
    if (trimmedSlug !== slug) {
      park = parks.find((p) => {
        const parkSlug = (p.slug || slugify(p.name, p.city));
        return parkSlug === trimmedSlug || parkSlug === slug;
      });
      if (park) {
        return park;
      }
    }
  }
  
  // Try matching by checking if slug starts with park slug (handles suffixes)
  const normalizedSlug = slug.toLowerCase().trim();
  park = parks.find((p) => {
    const parkSlug = (p.slug || slugify(p.name, p.city)).toLowerCase();
    // Check if requested slug starts with park slug or vice versa
    return parkSlug === normalizedSlug ||
           normalizedSlug.startsWith(parkSlug + '-') ||
           parkSlug.startsWith(normalizedSlug + '-');
  });
  if (park) {
    return park;
  }

  // Special case fallbacks for known 404s - industry best practice: name-based matching
  const fallbackMappings: Record<string, string> = {
    'alamo-square-dog-play-area': 'Alamo Square Dog Play Area',
    'down-town-indoor-dog-park-durham': 'Down Town Indoor Dog Park Durham',
  };

  if (fallbackMappings[normalizedSlug]) {
    const searchName = fallbackMappings[normalizedSlug];
    park = parks.find((p) =>
      p.name.toLowerCase().includes(searchName.toLowerCase())
    );
    if (park) {
      return park;
    }
  }

  try {
    // First, try to find by exact slug match
    const { data: submission, error } = await supabaseAdminClient
      .from('park_submissions')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'approved')
      .maybeSingle();

    if (submission && !error) {
      return mapSubmissionToDogPark(submission as SubmissionRow);
    }

    // If not found by slug, try to find by matching generated slug from name+city
    // This handles cases where the slug wasn't set in the database
    const { data: allApproved, error: fetchError } = await supabaseAdminClient
      .from('park_submissions')
      .select('*')
      .eq('status', 'approved');

    if (!fetchError && allApproved) {
      const matchingSubmission = allApproved.find((sub) => {
        const generatedSlug = sub.slug || slugify(sub.name, sub.city);
        return generatedSlug === slug;
      });

      if (matchingSubmission) {
        return mapSubmissionToDogPark(matchingSubmission as SubmissionRow);
      }
    }
  } catch (submissionError) {
    console.error('Failed to fetch park submission by slug:', submissionError);
  }

  return null;
}

async function loadUserSubmissions(): Promise<DogPark[]> {
  try {
    const { data: submissions, error } = await supabaseAdminClient
      .from('park_submissions')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error || !submissions) {
      console.error('Error fetching user submissions:', error);
      return [];
    }

    return submissions.map((sub) => mapSubmissionToDogPark(sub as SubmissionRow));
  } catch (error) {
    console.error('Failed to load user submissions:', error);
    return [];
  }
}

export async function getCityContentBySlug(slug: string): Promise<CityContentPayload | null> {
  // Load all data sources
  const staticParks = await loadStaticParks();
  const userSubmissions = await loadUserSubmissions();
  const allParks = dedupeParks([...staticParks, ...userSubmissions]);
  
  // Normalize slug: decode URL encoding and handle malformed slugs
  let normalizedSlug = slug;
  try {
    normalizedSlug = decodeURIComponent(slug);
  } catch {
    // If decoding fails, use original slug
    normalizedSlug = slug;
  }
  
  // Clean up malformed slugs (e.g., "steiner-st-&" -> "steiner-st")
  normalizedSlug = normalizedSlug.replace(/[&?=]/g, '').trim();

  // Check if it's a regular city (from parks + submissions)
  let city = findCityBySlug(allParks, normalizedSlug);

  // Backwards-compatible slug matching:
  // - handle old slugs that included state (e.g. los-angeles-ca)
  // - handle state normalization changes (CA vs California)
  if (!city) {
    const allCities = getAllCities(allParks);
    const matches = allCities.filter(
      (candidate) =>
        candidate.slug === normalizedSlug ||
        candidate.slug.startsWith(`${normalizedSlug}-`) ||
        normalizedSlug.startsWith(`${candidate.slug}-`),
    );
    if (matches.length === 1) {
      city = matches[0];
    }
  }

  if (city) {
    // For regular cities without priority equivalents: merge static parks + user submissions for this city
    const allCityParks = getParksByCity(allParks, city.name, city.state);
    const parksByType = getParksByType(allCityParks);
    const stats = getCityStatistics(allCityParks);

    const hydratedCity: CityData = {
      ...city,
      avgRating: stats.avgRating,
      totalReviews: stats.totalReviews,
      parkCount: allCityParks.length,
    };

    const nearbyCities = getNearbyCities(allParks, city.name, city.state);

    return {
      city: hydratedCity,
      cityParks: allCityParks,
      parksByType,
      stats,
      nearbyCities,
    };
  }

  // Priority city fallback (content-led city pages even if we don't have listings yet)
  const priorityConfig = getPriorityCityConfigBySlug(normalizedSlug);
  if (priorityConfig) {
    const dataCityParks = getParksByCity(allParks, priorityConfig.city, priorityConfig.state);
    const priorityParks = (priorityConfig.parks || []).map(normalizePark);
    const allCityParks = dedupeParks([...dataCityParks, ...priorityParks]);
    const parksByType = getParksByType(allCityParks);
    const stats = getCityStatistics(allCityParks);

    const hydratedCity: CityData = {
      slug: priorityConfig.slug,
      name: priorityConfig.city,
      state: normalizeState(priorityConfig.state),
      parkCount: allCityParks.length,
      avgRating: stats.avgRating,
      totalReviews: stats.totalReviews,
      featuredImage: priorityConfig.featuredImage,
      latitude: allCityParks.find((p) => typeof p.latitude === 'number')?.latitude,
      longitude: allCityParks.find((p) => typeof p.longitude === 'number')?.longitude,
    };

    const nearbyCities = getNearbyCities(allParks, hydratedCity.name, hydratedCity.state);

    return {
      city: hydratedCity,
      cityParks: allCityParks,
      parksByType,
      stats,
      customContent: priorityConfig.customContent,
      nearbyCities,
    };
  }

  // Final fallback: render a lightweight "coming soon" city page instead of 404.
  // This improves UX for users landing on `/cities/<slug>` links we haven't verified yet.
  // These pages are still set to noindex by `shouldIndexCity()` in the city page when there are 0 listings.
  const slugParts = normalizedSlug.split('-').filter(Boolean);
  const lastPart = slugParts[slugParts.length - 1] || '';
  const inferredState = lastPart.length === 2 ? lastPart.toUpperCase() : 'CA';
  const citySlugBase = lastPart.length === 2 ? slugParts.slice(0, -1).join('-') : normalizedSlug;
  const inferredCityName = slugToCityName(citySlugBase);

  const hydratedCity: CityData = {
    slug: normalizedSlug,
    name: inferredCityName,
    state: normalizeState(inferredState) || inferredState,
    parkCount: 0,
    avgRating: 0,
    totalReviews: 0,
    featuredImage: undefined,
    latitude: undefined,
    longitude: undefined,
  };

  const emptyStats: CityStats = {
    totalParks: 0,
    avgRating: 0,
    totalReviews: 0,
  };

  return {
    city: hydratedCity,
    cityParks: [],
    parksByType: {},
    stats: emptyStats,
    customContent: {
      heroEyebrow: 'City spotlight',
      heroHeading: `Dog Parks in ${hydratedCity.name}, ${hydratedCity.state}`,
      heroDescription:
        `We’re building out our verified directory for ${hydratedCity.name}. Submit a park to help us review and publish more dog-friendly spots in this area.`,
      heroPill: 'Listings in review',
      heroFootnotes: ['Data refreshed weekly', 'Submit a park to help us verify more locations'],
      heroChips: [
        { label: 'Verified parks', value: '—', caption: 'In review' },
        { label: 'Avg rating', value: '—', caption: 'Pending data' },
        { label: 'Park types', value: '—', caption: 'Pending data' },
        { label: 'Local reviews', value: '—', caption: 'Pending data' },
      ],
    },
    nearbyCities: undefined,
  };
}

/**
 * Get the correct city slug for a given city name (and optionally state)
 * This checks priority cities first, then static cities, and returns the canonical slug
 */
export async function getCitySlugByName(cityName: string, state?: string): Promise<string | null> {
  const normalizedCityName = cityName.toLowerCase().trim();
  const normalizedState = state ? normalizeStateKey(state) : undefined;
  
  // Check priority cities first
  const priorityMatch = priorityCityContent.find(
    (city) =>
      city.city.toLowerCase() === normalizedCityName &&
      (!normalizedState || normalizeStateKey(city.state) === normalizedState),
  );
  if (priorityMatch) {
    return priorityMatch.slug;
  }

  // Then check static cities
  const staticParks = await loadStaticParks();
  const userSubmissions = await loadUserSubmissions();
  const allParks = dedupeParks([...staticParks, ...userSubmissions]);
  const cities = getAllCities(allParks);
  const staticCity = cities.find(
    (c) =>
      c.name.toLowerCase() === normalizedCityName &&
      (!normalizedState || normalizeStateKey(c.state) === normalizedState)
  );
  
  if (staticCity) {
    return staticCity.slug;
  }
  
  return null;
}

/**
 * Extract city and state from a park slug pattern
 * Handles patterns like: "central-park-new-york", "golden-gate-park-san-francisco"
 * Returns { city: string, state: string } | null
 */
export function extractLocationFromSlug(slug: string): { city: string; state: string } | null {
  if (!slug) return null;

  const parts = slug.toLowerCase().split('-');
  if (parts.length < 2) return null;

  // Common city patterns to match at the end of slug
  const cityPatterns: Array<{ pattern: RegExp; city: string; state: string }> = [
    // Multi-word cities
    { pattern: /-new-york(-ny)?$/i, city: 'New York', state: 'NY' },
    { pattern: /-san-francisco(-ca)?$/i, city: 'San Francisco', state: 'CA' },
    { pattern: /-los-angeles(-ca)?$/i, city: 'Los Angeles', state: 'CA' },
    { pattern: /-san-diego(-ca)?$/i, city: 'San Diego', state: 'CA' },
    { pattern: /-long-beach(-ca)?$/i, city: 'Long Beach', state: 'CA' },
    { pattern: /-new-orleans(-la)?$/i, city: 'New Orleans', state: 'LA' },
    { pattern: /-kansas-city(-mo)?$/i, city: 'Kansas City', state: 'MO' },
    { pattern: /-oakland(-ca)?$/i, city: 'Oakland', state: 'CA' },
    { pattern: /-san-jose(-ca)?$/i, city: 'San Jose', state: 'CA' },
    { pattern: /-santa-barbara(-ca)?$/i, city: 'Santa Barbara', state: 'CA' },
    { pattern: /-palo-alto(-ca)?$/i, city: 'Palo Alto', state: 'CA' },
    { pattern: /-west-palm-beach(-fl)?$/i, city: 'West Palm Beach', state: 'FL' },
    { pattern: /-fort-lauderdale(-fl)?$/i, city: 'Fort Lauderdale', state: 'FL' },
    { pattern: /-colorado-springs(-co)?$/i, city: 'Colorado Springs', state: 'CO' },
    { pattern: /-salt-lake-city(-ut)?$/i, city: 'Salt Lake City', state: 'UT' },
  ];

  // Try to match known city patterns first
  for (const { pattern, city, state } of cityPatterns) {
    if (pattern.test(slug)) {
      return { city, state };
    }
  }

  // Try to extract state abbreviation from the end (2-letter pattern)
  const stateAbbrMap: Record<string, string> = {
    'al': 'Alabama', 'ak': 'Alaska', 'az': 'Arizona', 'ar': 'Arkansas',
    'ca': 'California', 'co': 'Colorado', 'ct': 'Connecticut', 'de': 'Delaware',
    'fl': 'Florida', 'ga': 'Georgia', 'hi': 'Hawaii', 'id': 'Idaho',
    'il': 'Illinois', 'in': 'Indiana', 'ia': 'Iowa', 'ks': 'Kansas',
    'ky': 'Kentucky', 'la': 'Louisiana', 'me': 'Maine', 'md': 'Maryland',
    'ma': 'Massachusetts', 'mi': 'Michigan', 'mn': 'Minnesota', 'ms': 'Mississippi',
    'mo': 'Missouri', 'mt': 'Montana', 'ne': 'Nebraska', 'nv': 'Nevada',
    'nh': 'New Hampshire', 'nj': 'New Jersey', 'nm': 'New Mexico', 'ny': 'New York',
    'nc': 'North Carolina', 'nd': 'North Dakota', 'oh': 'Ohio', 'ok': 'Oklahoma',
    'or': 'Oregon', 'pa': 'Pennsylvania', 'ri': 'Rhode Island', 'sc': 'South Carolina',
    'sd': 'South Dakota', 'tn': 'Tennessee', 'tx': 'Texas', 'ut': 'Utah',
    'vt': 'Vermont', 'va': 'Virginia', 'wa': 'Washington', 'wv': 'West Virginia',
    'wi': 'Wisconsin', 'wy': 'Wyoming',
  };

  // Check if last part is a state abbreviation
  const lastPart = parts[parts.length - 1];
  if (lastPart && lastPart.length === 2 && stateAbbrMap[lastPart]) {
    const state = stateAbbrMap[lastPart];
    // Try to extract city name (everything before the state)
    // For multi-word cities, we need to check common patterns
    if (parts.length >= 3) {
      // Try to match common city patterns before state
      const cityPart = parts.slice(0, -1).join('-');
      
      // Check if it matches a known city pattern
      for (const { pattern, city: knownCity, state: knownState } of cityPatterns) {
        if (pattern.test(cityPart + '-' + lastPart)) {
          return { city: knownCity, state: knownState };
        }
      }
      
      // Fallback: try to reconstruct city name from parts
      // Capitalize first letter of each word
      const cityName = parts
        .slice(0, -1)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
      
      return { city: cityName, state };
    }
  }

  // Try to match full state names at the end
  const stateNameMap: Record<string, string> = {
    'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR',
    'california': 'CA', 'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE',
    'florida': 'FL', 'georgia': 'GA', 'hawaii': 'HI', 'idaho': 'ID',
    'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA', 'kansas': 'KS',
    'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
    'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS',
    'missouri': 'MO', 'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV',
    'new-hampshire': 'NH', 'new-jersey': 'NJ', 'new-mexico': 'NM', 'new-york': 'NY',
    'north-carolina': 'NC', 'north-dakota': 'ND', 'ohio': 'OH', 'oklahoma': 'OK',
    'oregon': 'OR', 'pennsylvania': 'PA', 'rhode-island': 'RI', 'south-carolina': 'SC',
    'south-dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT',
    'vermont': 'VT', 'virginia': 'VA', 'washington': 'WA', 'west-virginia': 'WV',
    'wisconsin': 'WI', 'wyoming': 'WY',
  };

  // Check if last 1-2 parts form a state name
  const lastTwoParts = parts.slice(-2).join('-');
  const lastOnePart = parts[parts.length - 1];
  
  if (stateNameMap[lastTwoParts]) {
    const state = stateNameMap[lastTwoParts];
    const cityName = parts
      .slice(0, -2)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
    if (cityName) {
      return { city: cityName, state };
    }
  } else if (stateNameMap[lastOnePart]) {
    const state = stateNameMap[lastOnePart];
    const cityName = parts
      .slice(0, -1)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
    if (cityName) {
      return { city: cityName, state };
    }
  }

  return null;
}

const MIN_CITY_LISTINGS_FOR_INDEXING = 3;

export async function getAllCitySlugs(): Promise<string[]> {
  const staticParks = await loadStaticParks();
  const userSubmissions = await loadUserSubmissions();
  const allParks = dedupeParks([...staticParks, ...userSubmissions]);
  const cities = getAllCities(allParks);
  const slugs = new Set(
    cities
      .filter((city) => city.parkCount >= MIN_CITY_LISTINGS_FOR_INDEXING)
      .map((city) => city.slug),
  );

  // Always include priority city pages (content-led, may have < MIN listings)
  for (const city of priorityCityContent) {
    slugs.add(city.slug);
  }

  return Array.from(slugs);
}






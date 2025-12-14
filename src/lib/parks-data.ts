import { readFile } from 'fs/promises';
import path from 'path';
import { DogPark, MediaAsset } from '@/types/dog-park';
import { CityCustomContent } from '@/types/city-content';
import { getPriorityCityBySlug, getPriorityCityByName, getPriorityCitySlugs, priorityCityContent } from '@/data/priorityCityContent';
import {
  CityData,
  CityStats,
  getAllCities,
  getCityBySlug as findCityBySlug,
  getCityStatistics,
  getParksByCity,
  getParksByType,
  getNearbyCities,
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
    state: submission.state,
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
    const key = `${park.name.toLowerCase()}|${park.city.toLowerCase()}`;
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

  // Try matching in priority cities
  for (const priorityCity of priorityCityContent) {
    const priorityPark = priorityCity.parks.find((p) => (p.slug || p.id) === slug);
    if (priorityPark) {
      return priorityPark;
    }
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
      
      // Also check priority cities
      for (const priorityCity of priorityCityContent) {
        const priorityPark = priorityCity.parks.find((p) => {
          const parkSlug = (p.slug || slugify(p.name, p.city));
          return parkSlug === trimmedSlug || parkSlug === slug;
        });
        if (priorityPark) {
          return priorityPark;
        }
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
  
  // Check priority cities FIRST (they have custom content and should take precedence)
  // Try exact match first, then try variations (e.g., "chicago" -> "chicago-il")
  let priorityCity = getPriorityCityBySlug(normalizedSlug);
  if (!priorityCity) {
    // Try to find by city name only (e.g., "chicago" should match "chicago-il")
    const priorityCityByName = getPriorityCityByName(normalizedSlug);
    if (priorityCityByName) {
      priorityCity = priorityCityByName;
    }
  }
  
  if (priorityCity) {
    // For priority cities: merge priority parks + static parks + user submissions
    const priorityParks = priorityCity.parks;
    const staticCityParks = getParksByCity(staticParks, priorityCity.city);
    const submissionCityParks = getParksByCity(userSubmissions, priorityCity.city);
    
    // Merge all sources: priority parks first (as seed/featured), then static, then submissions
    // Priority parks should take precedence in case of duplicates
    const allCityParks = dedupeParks([...priorityParks, ...staticCityParks, ...submissionCityParks]);
    const parksByType = getParksByType(allCityParks);
    const stats = getCityStatistics(allCityParks);

    const priorityCityData: CityData = {
      slug: priorityCity.slug,
      name: priorityCity.city,
      parkCount: allCityParks.length,
      avgRating: stats.avgRating,
      totalReviews: stats.totalReviews,
      featuredImage: priorityCity.featuredImage,
      latitude: allCityParks[0]?.latitude || priorityParks[0]?.latitude,
      longitude: allCityParks[0]?.longitude || priorityParks[0]?.longitude,
      state: priorityCity.state,
    };

    const nearbyCities = getNearbyCities(staticParks, priorityCity.city, priorityCity.state);

    return {
      city: priorityCityData,
      cityParks: allCityParks,
      parksByType,
      stats,
      customContent: priorityCity.customContent,
      nearbyCities,
    };
  }

  // Check if it's a regular city (from static parks)
  const city = findCityBySlug(staticParks, slug);

  if (city) {
    // Before processing as a static city, check if a priority city exists for this city/state
    // This ensures that static slugs like "las-vegas" will redirect to priority slugs like "las-vegas-nv"
    const priorityCityForStatic = getPriorityCityByName(city.name, city.state);
    if (priorityCityForStatic) {
      // Return priority city data instead, which will trigger a redirect to the canonical slug
      const priorityParks = priorityCityForStatic.parks;
      const staticCityParks = getParksByCity(staticParks, priorityCityForStatic.city);
      const submissionCityParks = getParksByCity(userSubmissions, priorityCityForStatic.city);
      
      const allCityParks = dedupeParks([...priorityParks, ...staticCityParks, ...submissionCityParks]);
      const parksByType = getParksByType(allCityParks);
      const stats = getCityStatistics(allCityParks);

      const priorityCityData: CityData = {
        slug: priorityCityForStatic.slug,
        name: priorityCityForStatic.city,
        parkCount: allCityParks.length,
        avgRating: stats.avgRating,
        totalReviews: stats.totalReviews,
        featuredImage: priorityCityForStatic.featuredImage,
        latitude: allCityParks[0]?.latitude || priorityParks[0]?.latitude,
        longitude: allCityParks[0]?.longitude || priorityParks[0]?.longitude,
        state: priorityCityForStatic.state,
      };

      const nearbyCities = getNearbyCities(staticParks, priorityCityForStatic.city, priorityCityForStatic.state);

      return {
        city: priorityCityData,
        cityParks: allCityParks,
        parksByType,
        stats,
        customContent: priorityCityForStatic.customContent,
        nearbyCities,
      };
    }
    
    // For regular cities without priority equivalents: merge static parks + user submissions for this city
    const staticCityParks = getParksByCity(staticParks, city.name);
    const submissionCityParks = getParksByCity(userSubmissions, city.name);
    
    // Merge and deduplicate
    const allCityParks = dedupeParks([...staticCityParks, ...submissionCityParks]);
    const parksByType = getParksByType(allCityParks);
    const stats = getCityStatistics(allCityParks);

    const hydratedCity: CityData = {
      ...city,
      avgRating: stats.avgRating,
      totalReviews: stats.totalReviews,
      parkCount: allCityParks.length,
    };

    const nearbyCities = getNearbyCities(staticParks, city.name, city.state);

    return {
      city: hydratedCity,
      cityParks: allCityParks,
      parksByType,
      stats,
      nearbyCities,
    };
  }

  return null;
}

/**
 * Get the correct city slug for a given city name (and optionally state)
 * This checks priority cities first, then static cities, and returns the canonical slug
 */
export async function getCitySlugByName(cityName: string, state?: string): Promise<string | null> {
  const normalizedCityName = cityName.toLowerCase().trim();
  const normalizedState = state?.toLowerCase().trim();
  
  // First check priority cities
  const priorityCity = getPriorityCityByName(cityName, state);
  if (priorityCity) {
    return priorityCity.slug;
  }
  
  // Then check static cities
  const parks = await loadStaticParks();
  const cities = getAllCities(parks);
  const staticCity = cities.find(
    (c) =>
      c.name.toLowerCase() === normalizedCityName &&
      (!normalizedState || c.state.toLowerCase() === normalizedState)
  );
  
  if (staticCity) {
    // Check if this static city has a priority equivalent
    const priorityEquivalent = getPriorityCityByName(staticCity.name, staticCity.state);
    if (priorityEquivalent) {
      return priorityEquivalent.slug;
    }
    return staticCity.slug;
  }
  
  return null;
}

export async function getAllCitySlugs(): Promise<string[]> {
  const parks = await loadStaticParks();
  const cities = getAllCities(parks);
  const staticSlugs = cities.map((city) => city.slug);
  const prioritySlugs = getPriorityCitySlugs();
  
  // Exclude static city slugs that conflict with priority cities
  // (e.g., exclude "las-vegas" if "las-vegas-nv" exists as a priority city)
  const priorityCities = priorityCityContent;
  const filteredStaticSlugs = staticSlugs.filter((staticSlug) => {
    // Find the static city by slug
    const staticCity = cities.find((c) => c.slug === staticSlug);
    if (!staticCity) return true;
    
    // Check if a priority city exists for the same city name and state
    const conflictingPriority = priorityCities.find(
      (pc) =>
        pc.city.toLowerCase() === staticCity.name.toLowerCase() &&
        pc.state.toLowerCase() === staticCity.state.toLowerCase()
    );
    
    // Exclude this static slug if a priority city exists for the same city/state
    return !conflictingPriority;
  });
  
  const combined = new Set([...filteredStaticSlugs, ...prioritySlugs]);
  return Array.from(combined);
}






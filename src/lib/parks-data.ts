import fs from 'fs';
import path from 'path';
import { DogPark, MediaAsset } from '@/types/dog-park';
import { CityCustomContent, PriorityCityConfig } from '@/types/city-content';
import { normalizeState, normalizeStateKey, getStateName } from '@/lib/state';
import { getAllCityContent } from '@/lib/sanity-content';
import { californiaFallbackCities } from '@/data/californiaFallbackCities';
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
  cityNameToSlug,
  findLocalCityHeroImage,
} from '@/lib/cityData';

import { sanityServerClient } from '@/lib/sanity-server';
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

let parksCache: DogPark[] | null = null;
const STATIC_PARK_FILES = [
  'arizona.json',
  'california.json',
  'washington.json',
  'virginia.json',
  'texas.json',
  'tennessee.json',
  'pennsylvania.json',
  'ohio.json',
  'northcarolina.json',
  'newyork.json',
  'missouri.json',
  'newjersey.json',
  'kansas.json',
  'mixmatch.json',
];

function getStaticDataBaseUrl() {
  // Legacy – kept for reference but no longer used.
  // Data is now read directly from the filesystem in all environments.
  return 'http://localhost:3000/data';
}

async function getPriorityCityConfigBySlug(slug: string) {
  const normalized = slug.toLowerCase().trim();
  let content: PriorityCityConfig[] = [];
  try {
    content = await getAllCityContent();
  } catch (err) {
    console.warn('[Sanity] Failed to fetch city content', err);
  }
  return (
    content.find((c) => c?.slug === normalized) ||
    content.find(
      (c) => Boolean(c?.slug && (c.slug.startsWith(`${normalized}-`) || normalized.startsWith(`${c.slug}-`))),
    )
  );
}

function slugify(name: string, city?: string): string {
  const normalizedName = name.toLowerCase().trim();
  const normalizedCity = city?.toLowerCase().trim();

  // If the city name is already at the end of the park name, don't append it again
  let base = normalizedName;
  if (normalizedCity && !normalizedName.endsWith(normalizedCity)) {
    base = `${normalizedName}-${normalizedCity}`;
  }

  return base
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function normalizePark(rawPark: DogPark): DogPark {
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

export function mapSanitySubmissionToDogPark(sub: any): DogPark {
  const photoUrls: string[] = [];
  if (Array.isArray(sub.photoUrls)) {
    sub.photoUrls.forEach((u: any) => {
      if (typeof u === 'string' && u.trim()) photoUrls.push(u.trim());
    });
  }
  if (Array.isArray(sub.photos)) {
    sub.photos.forEach((p: any) => {
      const url = typeof p === 'string' ? p : p?.url || p?.asset?.url;
      if (url && typeof url === 'string' && !photoUrls.includes(url)) {
        photoUrls.push(url);
      }
    });
  }
  if (sub.photo && typeof sub.photo === 'string' && !photoUrls.includes(sub.photo)) {
    photoUrls.push(sub.photo);
  }

  const mediaAssets: MediaAsset[] = photoUrls.map((url) => ({ url, type: 'photo' }));

  return {
    id: sub._id || sub.id,
    name: sub.name,
    slug: sub.slug?.current || sub.slug || slugify(sub.name, sub.city),
    businessType: sub.businessType,
    rating: sub.rating || 0,
    reviewCount: sub.reviewCount || 0,
    address: sub.address,
    street: sub.street || sub.address,
    city: sub.city,
    state: normalizeState(sub.state),
    zipCode: sub.zipCode,
    full_address: sub.fullAddressString || `${sub.address || ''}, ${sub.city || ''}, ${sub.state || ''}, ${sub.zipCode || ''}`.replace(/(^,\s*|\s*,\s*$)/g, ''),
    latitude: sub.latitude,
    longitude: sub.longitude,
    phone: sub.phoneNumber || sub.phone,
    email: sub.emailAddress || sub.email,
    website: sub.website,
    description: sub.description,
    photos: mediaAssets,
    photo: mediaAssets[0]?.url,
    openingHours: sub.operatingHours || sub.openingHours || {},
    amenities: sub.amenities || {},
    pricing: sub.pricing || sub.pricingInfo || undefined,
    rules: sub.rules || undefined,
    source: 'user_submitted',
    listingType: sub.listingType || 'free',
    submittedBy: sub.userId,
    submittedAt: sub._createdAt,
    approvedAt: sub._updatedAt || sub._createdAt,
    lastUpdated: sub._updatedAt || sub._createdAt,
  } as DogPark;
}

function mergeParkData(primary: DogPark, secondary: DogPark): DogPark {
  const mergedPhotos = [
    ...(primary.photos || []),
    ...(secondary.photos || []),
  ];
  const uniquePhotos: MediaAsset[] = [];
  const seenUrls = new Set<string>();
  for (const p of mergedPhotos) {
    if (p?.url && !seenUrls.has(p.url)) {
      seenUrls.add(p.url);
      uniquePhotos.push(p);
    }
  }

  const primaryPhoto = primary.photo || secondary.photo || uniquePhotos[0]?.url || null;

  return {
    ...secondary,
    ...primary,
    rating: primary.rating || secondary.rating || 0,
    reviewCount: primary.reviewCount || secondary.reviewCount || 0,
    description: primary.description?.trim() || secondary.description?.trim() || '',
    pricing: primary.pricing || secondary.pricing,
    openingHours: Object.keys(primary.openingHours || {}).length > 0 ? primary.openingHours : secondary.openingHours,
    amenities: { ...(secondary.amenities || {}), ...(primary.amenities || {}) },
    rules: primary.rules || secondary.rules,
    photos: uniquePhotos.length > 0 ? uniquePhotos : null,
    photo: primaryPhoto,
    listingType: primary.listingType === 'featured' || secondary.listingType === 'featured' ? 'featured' : (primary.listingType || secondary.listingType || 'free'),
  };
}

function dedupeParks(parks: DogPark[]): DogPark[] {
  const map = new Map<string, DogPark>();
  for (const park of parks) {
    const name = (park.name || 'Unknown Park').toLowerCase().trim();
    const city = (park.city || 'Unknown City').toLowerCase().trim();
    const stateAbbr = normalizeStateKey(park.state) || '';
    const key = `${name}|${city}|${stateAbbr}`;
    if (map.has(key)) {
      const existing = map.get(key)!;
      map.set(key, mergeParkData(existing, park));
    } else {
      map.set(key, park);
    }
  }
  return Array.from(map.values());
}

async function loadStaticParks(): Promise<DogPark[]> {
  const shouldCache = process.env.NODE_ENV !== 'development';

  if (shouldCache && parksCache) {
    return parksCache;
  }

  const parkArrays = await Promise.all(
    STATIC_PARK_FILES.map(async (file) => {
      try {
        const filePath = path.join(process.cwd(), 'public', 'data', file);
        const content = await fs.promises.readFile(filePath, 'utf-8');
        const json = JSON.parse(content);
        return Array.isArray(json) ? (json as DogPark[]) : [];
      } catch (err) {
        console.warn(`[parks-data] Error reading ${file}:`, err);
        return [];
      }
    }),
  );

  const allParks: DogPark[] = parkArrays.flat();
  const normalized = allParks.map(normalizePark);
  const deduped = dedupeParks(normalized);
  deduped.sort((a, b) => a.name.localeCompare(b.name));
  if (shouldCache) {
    parksCache = deduped;
  }
  return deduped;
}

export async function getAllStaticParks(): Promise<DogPark[]> {
  const staticParks = await loadStaticParks();
  const userSubmissions = await loadUserSubmissions();
  return dedupeParks([...userSubmissions, ...staticParks]);
}

export async function getPaginatedStaticParks(page = 1, limit = 20): Promise<PaginatedParks> {
  const staticParks = await loadStaticParks();
  const userSubmissions = await loadUserSubmissions();
  const allParks = dedupeParks([...userSubmissions, ...staticParks]);
  
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, Math.min(limit, 100));
  const startIdx = (safePage - 1) * safeLimit;
  const data = allParks.slice(startIdx, startIdx + safeLimit);
  const totalParks = allParks.length;
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
  const parks = await getAllStaticParks();

  // Try exact match first
  let park = parks.find((p) => {
    const parkSlug = p.slug || p.id;
    return parkSlug === slug || (parkSlug && parkSlug.toLowerCase() === slug.toLowerCase());
  });
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
    'barking-hound-village-inn-atlanta': 'Barking Hound Village Inn',
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
    const sanityQuery = `*[_type == "parkSubmission" && status == "approved"]{
      ...,
      "photoUrls": photos[].asset->url
    }`;
    const allApproved = await sanityServerClient.fetch(sanityQuery);

    if (allApproved && allApproved.length > 0) {
      // Find exact slug
      let matchingSubmission = allApproved.find((sub: any) => sub.slug?.current === slug);

      if (!matchingSubmission) {
        // Fallback: generated slug
        matchingSubmission = allApproved.find((sub: any) => {
          const generatedSlug = slugify(sub.name, sub.city);
          return generatedSlug === slug;
        });
      }

      if (matchingSubmission) {
        return mapSanitySubmissionToDogPark(matchingSubmission);
      }

      // Last resort: try name-based matching
      const normalizedSearchSlug = slug.toLowerCase().trim();
      const nameBasedMatch = allApproved.find((sub: any) => {
        const subName = sub.name.toLowerCase().trim();
        const expectedSlug = slugify(sub.name, sub.city).toLowerCase();

        return normalizedSearchSlug.includes(subName.replace(/[^a-z0-9]+/g, '-')) ||
          expectedSlug.includes(normalizedSearchSlug) ||
          normalizedSearchSlug.includes(expectedSlug);
      });

      if (nameBasedMatch) {
        return mapSanitySubmissionToDogPark(nameBasedMatch);
      }
    }
  } catch (submissionError) {
    console.warn(`[Sanity] Failed to fetch park by slug: ${slug}`);
  }

  return null;
}

async function loadUserSubmissions(): Promise<DogPark[]> {
  try {
    const sanityQuery = `*[_type == "parkSubmission" && status == "approved"] | order(_createdAt desc) {
      ...,
      "photoUrls": photos[].asset->url
    }`;
    
    const submissions = await sanityServerClient.fetch(sanityQuery);

    if (!submissions || submissions.length === 0) {
      return [];
    }

    return submissions.map((sub: any) => mapSanitySubmissionToDogPark(sub));
  } catch (error) {
    console.warn('[Sanity] Failed to load user submissions');
    return [];
  }
}

export async function getCityContentBySlug(slug: string): Promise<CityContentPayload | null> {
  // Load all data sources
  const staticParks = await loadStaticParks();
  const userSubmissions = await loadUserSubmissions();
  const allParks = dedupeParks([...staticParks, ...userSubmissions]);
  
  let content: PriorityCityConfig[] = [];
  try {
    content = await getAllCityContent();
  } catch (err) {
    console.warn('[Sanity] Failed to fetch city content', err);
  }

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
    const allCities = getAllCities(allParks, content);
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
    // For regular cities: merge static parks + user submissions for this city
    // Also check if there's a priority config to merge custom content and featured image
    const priorityConfig = await getPriorityCityConfigBySlug(normalizedSlug);
    const allCityParks = getParksByCity(allParks, city.name, city.state);
    const parksByType = getParksByType(allCityParks);
    const stats = getCityStatistics(allCityParks);

    // Resolve featured image:
    // 1. Local filesystem hero.webp (Highest priority, allows future overrides)
    // 2. Fallback list for specific cities (Force state image)
    // 3. Priority Config / DB value
    let featuredImage: string | undefined | null = undefined;

    // Check for city hero image on filesystem (try exact slug, base slug, state-suffixed slug)
    const baseSlug = cityNameToSlug(city.name);
    const stateSlug = `${baseSlug}-${normalizeStateKey(city.state)}`;
    const localHero = findLocalCityHeroImage([
      city.slug,
      baseSlug,
      stateSlug,
      normalizedSlug,
      priorityConfig?.slug,
    ]);

    if (localHero) {
      featuredImage = localHero;
    } else if (californiaFallbackCities.includes(city.name)) {
      // If no local file exists and it's in our fallback list, 
      // explicitly leave featuredImage undefined to trigger state fallback
      featuredImage = undefined;
    } else {
      // Otherwise use the configured image (from DB or priority content)
      featuredImage = priorityConfig?.featuredImage || city.featuredImage;
    }

    if (featuredImage?.startsWith('/')) {
      const absolutePath = path.join(process.cwd(), 'public', featuredImage);
      if (!fs.existsSync(absolutePath)) {
        featuredImage = undefined;
      }
    }

    const hydratedCity: CityData = {
      ...city,
      avgRating: stats.avgRating,
      totalReviews: stats.totalReviews,
      parkCount: allCityParks.length,
      featuredImage: featuredImage,
    };

    const nearbyCities = getNearbyCities(allParks, city.name, city.state, 6, content);

    return {
      city: hydratedCity,
      cityParks: allCityParks,
      parksByType,
      stats,
      customContent: priorityConfig?.customContent,
      nearbyCities,
    };
  }

  // Priority city fallback (content-led city pages even if we don't have listings yet)
  const priorityConfig = await getPriorityCityConfigBySlug(normalizedSlug);
  if (priorityConfig) {
    const dataCityParks = getParksByCity(allParks, priorityConfig.city, priorityConfig.state);
    const priorityParks = (priorityConfig.parks || []).map(normalizePark);
    const allCityParks = dedupeParks([...dataCityParks, ...priorityParks]);
    const parksByType = getParksByType(allCityParks);
    const stats = getCityStatistics(allCityParks);

    // Resolve featured image with priority: Local > Fallback List > Config > State Fallback > Default
    let featuredImage: string | undefined = priorityConfig.featuredImage;
    const priorityBaseSlug = cityNameToSlug(priorityConfig.city);
    const priorityStateSlug = `${priorityBaseSlug}-${normalizeStateKey(priorityConfig.state)}`;
    const localHero = findLocalCityHeroImage([
      priorityConfig.slug,
      priorityBaseSlug,
      priorityStateSlug,
      normalizedSlug,
    ]);

    if (localHero) {
      // Priority 1: Local file
      featuredImage = localHero;
    } else if (!featuredImage && californiaFallbackCities.includes(priorityConfig.city)) {
      // Priority 2: Fallback list (triggers state fallback below)
      featuredImage = undefined;
    }

    if (featuredImage?.startsWith('/')) {
      const absolutePath = path.join(process.cwd(), 'public', featuredImage);
      if (!fs.existsSync(absolutePath)) {
        featuredImage = undefined;
      }
    }

    const hydratedCity: CityData = {
      slug: priorityConfig.slug,
      name: priorityConfig.city,
      state: normalizeState(priorityConfig.state),
      parkCount: allCityParks.length,
      avgRating: stats.avgRating,
      totalReviews: stats.totalReviews,
      featuredImage: featuredImage!,
      latitude: allCityParks.find((p) => typeof p.latitude === 'number')?.latitude,
      longitude: allCityParks.find((p) => typeof p.longitude === 'number')?.longitude,
    };

    const nearbyCities = getNearbyCities(allParks, hydratedCity.name, hydratedCity.state, 6, content);

    return {
      city: hydratedCity,
      cityParks: allCityParks,
      parksByType,
      stats,
      customContent: priorityConfig.customContent,
      nearbyCities,
    };
  }

  // Final fallback: If the slug doesn't match any known city with parks,
  // and it's not a priority configured city, we should return null to trigger a 404.
  // This prevents generating pages for typos (like "tuscon") or random URLs.
  return null;
}

/**
 * Get the correct city slug for a given city name (and optionally state)
 * This checks priority cities first, then static cities, and returns the canonical slug
 */
export async function getCitySlugByName(cityName: string, state?: string): Promise<string | null> {
  const normalizedCityName = cityName.toLowerCase().trim();
  const normalizedState = state ? normalizeStateKey(state) : undefined;

  // Check priority cities first
  let content: PriorityCityConfig[] = [];
  try {
    content = await getAllCityContent();
  } catch (err) {
    console.warn('[Sanity] Failed to fetch city content', err);
  }
  const priorityMatch = content.find(
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
    { pattern: /-brooklyn(-ny)?$/i, city: 'Brooklyn', state: 'NY' },
    { pattern: /-queens(-ny)?$/i, city: 'Queens', state: 'NY' },
    { pattern: /-bronx(-ny)?$/i, city: 'Bronx', state: 'NY' },
    { pattern: /-staten-island(-ny)?$/i, city: 'Staten Island', state: 'NY' },
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

/** Minimum aggregated listings for a `/cities/[slug]` to exist in slug lists / sitemap. Matches indexability (see city page metadata). */
const MIN_CITY_LISTINGS_FOR_INDEXING = 1;

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

  // Always include priority city pages (content-led; may be noindex until they have verified listings)
  let content: PriorityCityConfig[] = [];
  try {
    content = await getAllCityContent();
  } catch (err) {
    console.warn('[Sanity] Failed to fetch city content', err);
  }
  for (const city of content) {
    slugs.add(city.slug);
  }

  return Array.from(slugs);
}

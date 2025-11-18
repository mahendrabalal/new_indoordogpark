import { readFile } from 'fs/promises';
import path from 'path';
import { DogPark, MediaAsset } from '@/types/dog-park';
import { CityCustomContent } from '@/types/city-content';
import { getPriorityCityBySlug, getPriorityCitySlugs, priorityCityContent } from '@/data/priorityCityContent';
import {
  CityData,
  CityStats,
  getAllCities,
  getCityBySlug as findCityBySlug,
  getCityStatistics,
  getParksByCity,
  getParksByType,
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
}

const californiaDataPath = path.join(process.cwd(), 'public/data/california.json');
const newyorkDataPath = path.join(process.cwd(), 'public/data/newyork.json');

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

interface SubmissionRow {
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

function mapSubmissionToDogPark(submission: SubmissionRow): DogPark {
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
    
    // Load New York parks
    try {
      const newyorkContent = await readFile(newyorkDataPath, 'utf-8');
      const newyorkParks: DogPark[] = JSON.parse(newyorkContent);
      allParks.push(...newyorkParks);
    } catch (error) {
      console.error('Failed to read New York parks data:', error);
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
  const park = parks.find((p) => (p.slug || p.id) === slug);
  if (park) {
    return park;
  }

  for (const priorityCity of priorityCityContent) {
    const priorityPark = priorityCity.parks.find((p) => (p.slug || p.id) === slug);
    if (priorityPark) {
      return priorityPark;
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
  
  // Check priority cities FIRST (they have custom content and should take precedence)
  const priorityCity = getPriorityCityBySlug(slug);
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

    return {
      city: priorityCityData,
      cityParks: allCityParks,
      parksByType,
      stats,
      customContent: priorityCity.customContent,
    };
  }

  // Check if it's a regular city (from static parks)
  const city = findCityBySlug(staticParks, slug);

  if (city) {
    // For regular cities: merge static parks + user submissions for this city
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

    return {
      city: hydratedCity,
      cityParks: allCityParks,
      parksByType,
      stats,
    };
  }

  return null;
}

export async function getAllCitySlugs(): Promise<string[]> {
  const parks = await loadStaticParks();
  const cities = getAllCities(parks);
  const staticSlugs = cities.map((city) => city.slug);
  const prioritySlugs = getPriorityCitySlugs();
  const combined = new Set([...staticSlugs, ...prioritySlugs]);
  return Array.from(combined);
}






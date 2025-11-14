import { readFile } from 'fs/promises';
import path from 'path';
import { DogPark } from '@/types/dog-park';
import {
  CityData,
  CityStats,
  getAllCities,
  getCityBySlug as findCityBySlug,
  getCityStatistics,
  getParksByCity,
  getParksByType,
} from '@/lib/cityData';

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
}

const parksDataPath = path.join(process.cwd(), 'public/data/california.json');

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
    const fileContent = await readFile(parksDataPath, 'utf-8');
    const parsed: DogPark[] = JSON.parse(fileContent);
    const normalized = parsed.map(normalizePark);
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
  return park || null;
}

export async function getCityContentBySlug(slug: string): Promise<CityContentPayload | null> {
  const parks = await loadStaticParks();
  const city = findCityBySlug(parks, slug);

  if (!city) {
    return null;
  }

  const cityParks = getParksByCity(parks, city.name);
  const parksByType = getParksByType(cityParks);
  const stats = getCityStatistics(cityParks);

  const hydratedCity: CityData = {
    ...city,
    avgRating: stats.avgRating,
    totalReviews: stats.totalReviews,
    parkCount: cityParks.length,
  };

  return {
    city: hydratedCity,
    cityParks,
    parksByType,
    stats,
  };
}

export async function getAllCitySlugs(): Promise<string[]> {
  const parks = await loadStaticParks();
  const cities = getAllCities(parks);
  return cities.map((city) => city.slug);
}






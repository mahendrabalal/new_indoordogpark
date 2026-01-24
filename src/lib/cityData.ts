import { DogPark } from '@/types/dog-park';
import { normalizeState, normalizeStateKey } from '@/lib/state';
import { priorityCityContent } from '@/data/priorityCityContent';

export interface CityData {
  slug: string;
  name: string;
  parkCount: number;
  avgRating: number;
  totalReviews: number;
  featuredImage?: string;
  latitude?: number;
  longitude?: number;
  state: string;
  topParks?: string[];
}

export interface CityStats {
  totalParks: number;
  avgRating: number;
  totalReviews: number;
}

/**
 * Get all unique cities with aggregated data
 */
export function getAllCities(parks: DogPark[]): CityData[] {
  const cityMap = new Map<string, DogPark[]>();

  // Group parks by city
  parks.forEach(park => {
    const cityKey = (park.city || '').toLowerCase().trim();
    const stateKey = normalizeStateKey(park.state);
    const key = `${cityKey}|${stateKey}`;
    if (!cityMap.has(key)) {
      cityMap.set(key, []);
    }
    cityMap.get(key)!.push(park);
  });

  const grouped = Array.from(cityMap.values());

  // Determine slug collisions (same city name across different states)
  const baseSlugCounts = new Map<string, number>();
  for (const cityParks of grouped) {
    const cityName = cityParks[0].city;
    const baseSlug = cityNameToSlug(cityName);
    baseSlugCounts.set(baseSlug, (baseSlugCounts.get(baseSlug) || 0) + 1);
  }

  const stateToSlugPart = (state: string | undefined) =>
    normalizeStateKey(state);

  // Convert to CityData array
  const cities: CityData[] = grouped.map((cityParks) => {
    const cityName = cityParks[0].city;
    const cityState = normalizeState(cityParks[0].state);
    const baseSlug = cityNameToSlug(cityName);
    const needsState = (baseSlugCounts.get(baseSlug) || 0) > 1;
    const avgRating = cityParks.length > 0
      ? parseFloat((cityParks.reduce((sum, p) => sum + p.rating, 0) / cityParks.length).toFixed(1))
      : 0;

    const totalReviews = cityParks.reduce((sum, p) => sum + p.reviewCount, 0);

    // Get featured image - check priority content first, then park photos
    let featuredImage: string | undefined;

    // Check priority content for curated image
    const priorityConfig = priorityCityContent.find(c =>
      c.city.toLowerCase() === cityName.toLowerCase() &&
      (!c.state || normalizeStateKey(c.state) === normalizeStateKey(cityState))
    );

    if (priorityConfig?.featuredImage) {
      featuredImage = priorityConfig.featuredImage;
    } else {
      // Fallback to first park with photos
      const parkWithPhoto = cityParks.find(p => p.photos && p.photos.length > 0);
      if (parkWithPhoto?.photos?.[0]) {
        featuredImage = parkWithPhoto.photos[0].url;
      } else {
        featuredImage = cityParks.find(p => p.photo)?.photo;
      }
    }

    return {
      slug: needsState ? `${baseSlug}-${stateToSlugPart(cityState)}` : baseSlug,
      name: cityName,
      parkCount: cityParks.length,
      avgRating,
      totalReviews,
      featuredImage,
      longitude: cityParks[0].longitude,
      state: cityState,
      topParks: [...cityParks]
        .sort((a, b) => {
          if (b.rating !== a.rating) return b.rating - a.rating;
          return b.reviewCount - a.reviewCount;
        })
        .slice(0, 3)
        .map(p => p.name),
    };
  });

  // Sort by park count descending
  return cities.sort((a, b) => b.parkCount - a.parkCount);
}

/**
 * Get featured cities for homepage (top N by park count)
 */
export function getFeaturedCities(parks: DogPark[], limit: number = 12): CityData[] {
  const allCities = getAllCities(parks);
  return allCities.slice(0, limit);
}

/**
 * Get city data by slug
 */
export function getCityBySlug(parks: DogPark[], slug: string): CityData | null {
  const allCities = getAllCities(parks);
  return allCities.find(city => city.slug === slug) || null;
}

/**
 * Get parks for a specific city
 */
export function getParksByCity(parks: DogPark[], cityName: string, state?: string): DogPark[] {
  const normalizedCity = cityName.toLowerCase().trim();
  const normalizedState = state ? normalizeStateKey(state) : undefined;

  return parks.filter((park) => {
    const matchesCity = park.city.toLowerCase().trim() === normalizedCity;
    if (!matchesCity) return false;
    if (!normalizedState) return true;
    return normalizeStateKey(park.state) === normalizedState;
  });
}

/**
 * Calculate city-level statistics
 */
export function getCityStatistics(parks: DogPark[]): CityStats {
  if (parks.length === 0) {
    return {
      totalParks: 0,
      avgRating: 0,
      totalReviews: 0,
    };
  }

  const avgRating = parseFloat(
    (parks.reduce((sum, p) => sum + p.rating, 0) / parks.length).toFixed(1)
  );

  const totalReviews = parks.reduce((sum, p) => sum + p.reviewCount, 0);

  return {
    totalParks: parks.length,
    avgRating,
    totalReviews,
  };
}

/**
 * Get parks grouped by type for a city
 */
export function getParksByType(parks: DogPark[]): Record<string, DogPark[]> {
  return parks.reduce((acc, park) => {
    const type = park.businessType;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(park);
    return acc;
  }, {} as Record<string, DogPark[]>);
}

/**
 * Convert city name to slug format
 */
export function cityNameToSlug(cityName: string): string {
  return cityName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Convert slug back to city name (capitalize words)
 */
export function slugToCityName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get featured parks for homepage (top parks with diversity across cities)
 */
export function getFeaturedParks(parks: DogPark[], limit: number = 16): DogPark[] {
  if (parks.length === 0) return [];

  // Separate featured listings and regular parks
  const featuredListings = parks.filter(park => park.listingType === 'featured');
  const regularParks = parks.filter(park => park.listingType !== 'featured');

  // Always include featured listings first
  const featured: DogPark[] = [...featuredListings];

  // If we still need more parks, add regular parks based on quality
  if (featured.length < limit) {
    // Calculate quality score for regular parks (rating * log of review count)
    const scoredParks = regularParks.map(park => ({
      ...park,
      qualityScore: park.rating * Math.log(Math.max(park.reviewCount, 1) + 1),
    }));

    // Sort by quality score descending
    scoredParks.sort((a, b) => b.qualityScore - a.qualityScore);

    // Use greedy algorithm to maintain city diversity for remaining slots
    const cityCount = new Map<string, number>();

    // Count existing cities from featured listings
    featured.forEach(park => {
      const count = cityCount.get(park.city) || 0;
      cityCount.set(park.city, count + 1);
    });

    const maxPerCity = Math.ceil(limit / 8); // Allow more per city since we have featured priority

    for (const park of scoredParks) {
      if (featured.length >= limit) break;

      const cityCount_val = cityCount.get(park.city) || 0;
      if (cityCount_val < maxPerCity) {
        featured.push(park);
        cityCount.set(park.city, cityCount_val + 1);
      }
    }

    // Fill remaining slots if needed
    if (featured.length < limit) {
      for (const park of scoredParks) {
        if (featured.length >= limit) break;
        if (!featured.find(p => p.id === park.id)) {
          featured.push(park);
        }
      }
    }
  }

  return featured.slice(0, limit);
}

/**
 * Get nearby cities based on state
 */
export function getNearbyCities(parks: DogPark[], currentCity: string, currentState: string, limit: number = 6): CityData[] {
  const allCities = getAllCities(parks);

  // Filter cities in the same state, excluding current city
  const nearby = allCities.filter(city =>
    city.state === currentState &&
    city.name.toLowerCase() !== currentCity.toLowerCase()
  );

  // Sort by park count (proxy for popularity)
  return nearby.sort((a, b) => b.parkCount - a.parkCount).slice(0, limit);
}

import { DogPark, ParkStats } from '@/types/dog-park';

export interface PaginationResponse {
  data: DogPark[];
  pagination: {
    page: number;
    limit: number;
    totalParks: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface SearchParams {
  q?: string;
  type?: string;
  minRating?: number;
  priceRange?: string;
  city?: string;
  amenities?: string[];
  sortBy?: 'relevance' | 'rating' | 'reviews' | 'name' | 'distance';
  page?: number;
  limit?: number;
  listingType?: 'featured' | 'free';
}

export interface SearchResponse {
  success: boolean;
  data: DogPark[];
  pagination: {
    page: number;
    limit: number;
    totalResults: number;
    totalPages: number;
    hasMore: boolean;
  };
  filters: {
    query?: string;
    type?: string;
    minRating?: number;
    priceRange?: string;
    city?: string;
    amenities?: string[];
    sortBy?: string;
  };
  meta: {
    totalParks: number;
    searchApplied: boolean;
    filtersApplied: boolean;
    // Additional metadata for transparency
    staticParksCount?: number;
    submissionParksCount?: number;
    featuredParksCount?: number;
  };
}

export async function fetchParks(page = 1, limit = 20): Promise<PaginationResponse> {
  try {
    const response = await fetch(`/api/parks?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch parks data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching parks:', error);
    return {
      data: [],
      pagination: {
        page,
        limit,
        totalParks: 0,
        totalPages: 0,
        hasMore: false
      }
    };
  }
}

export async function searchParks(params: SearchParams): Promise<SearchResponse> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.q) queryParams.append('q', params.q);
    if (params.type) queryParams.append('type', params.type);
    if (params.minRating) queryParams.append('minRating', params.minRating.toString());
    if (params.priceRange) queryParams.append('priceRange', params.priceRange);
    if (params.city) queryParams.append('city', params.city);
    if (params.amenities && params.amenities.length > 0) {
      queryParams.append('amenities', params.amenities.join(','));
    }
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.listingType) queryParams.append('listingType', params.listingType);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const response = await fetch(`/api/parks/search?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error('Failed to search parks');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching parks:', error);
    return {
      success: false,
      data: [],
      pagination: {
        page: params.page || 1,
        limit: params.limit || 50,
        totalResults: 0,
        totalPages: 0,
        hasMore: false
      },
      filters: {},
      meta: {
        totalParks: 0,
        searchApplied: false,
        filtersApplied: false
      }
    };
  }
}

export function calculateStats(parks: DogPark[]): ParkStats {
  const totalParks = parks.length;
  const cities = [...new Set(parks.map(park => park.city))].length;
  const avgRating = totalParks > 0 
    ? (parks.reduce((sum, park) => sum + park.rating, 0) / totalParks).toFixed(1)
    : '0';
  const totalReviews = parks.reduce((sum, park) => sum + park.reviewCount, 0);

  return {
    totalParks,
    totalCities: cities,
    avgRating: parseFloat(avgRating),
    totalReviews,
  };
}

export function filterParks(parks: DogPark[], searchTerm: string, type: string): DogPark[] {
  return parks.filter(park => {
    const matchesSearch = searchTerm === '' || 
      park.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      park.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      park.full_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      park.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = type === 'all' || park.businessType === type;
    
    return matchesSearch && matchesType;
  });
}
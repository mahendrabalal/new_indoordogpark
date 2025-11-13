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
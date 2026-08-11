import { DogPark } from '@/types/dog-park';

export async function fetchReviewsForParks(parks: DogPark[]) {
  // Returns empty for now, reviews will be moved to Sanity later
  return {};
}

export function aggregateReviewsData(parks: DogPark[], reviewsMap: Record<string, any[]>) {
  return parks.map(park => ({
    ...park,
    reviewCount: 0,
    rating: 0
  }));
}

export async function getParkReviews(parkId: string) {
  return [];
}

export interface PricingInfo {
  isFree: boolean;
  pricingType?: 'free' | 'hourly' | 'daily' | 'monthly' | 'membership' | 'per-visit' | 'mixed';
  priceRange?: '$' | '$$' | '$$$' | '$$$$';
  hourlyRate?: number;
  dailyRate?: number;
  monthlyRate?: number;
  dropInFee?: number;
  pricingDetails?: string;
  pricingUrl?: string;
  currency?: string;
  lastPricingUpdate?: string;
  pricingSource?: 'website' | 'google_places' | 'manual' | 'unknown';
}

export interface Amenities {
  parking?: boolean;
  waterFountains?: boolean;
  shade?: boolean;
  seating?: boolean;
  smallDogArea?: boolean;
  largeDogArea?: boolean;
  agilityCourse?: boolean;
  swimming?: boolean;
  dogWashStation?: boolean;
  restrooms?: boolean;
  handicapAccess?: boolean;
  lighting?: boolean;
  fencing?: boolean;
  grooming?: boolean;
  daycare?: boolean;
  training?: boolean;
  socializing?: boolean;
  [key: string]: boolean | undefined;
}

export interface MediaAsset {
  url: string;
  type: 'photo' | 'video';
  caption?: string;
  source?: 'google_places' | 'user' | 'website';
  uploadedAt?: string;
  storagePath?: string;
}

export interface ParkFAQ {
  question: string;
  answer: string;
  lastUpdated?: string;
}

export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  tiktok?: string;
  youtube?: string;
}

export interface DogPark {
  // Core Information
  id: string;
  name: string;
  businessType: 'Dog Park' | 'Indoor Dog Park' | 'Dog-Friendly Establishment';
  description: string;
  slug: string;

  // Location Information
  address: string;
  street: string;
  city: string;
  state: string;
  zipCode?: string;
  full_address: string;
  latitude?: number;
  longitude?: number;
  googlePlaceId?: string;

  // Contact Information
  phone?: string;
  website?: string;
  email?: string;
  socialMedia?: SocialMedia;
  faqs?: ParkFAQ[];

  // Media Assets
  photos?: MediaAsset[];
  photo?: string; // Primary/featured photo URL (deprecated - use photos[0])
  photo2?: string; // Secondary photo (deprecated)
  photo3?: string; // Tertiary photo (deprecated)

  // Ratings & Reviews
  rating: number;
  reviewCount: number;
  userRatingsTotal?: number;

  // Pricing Information
  pricing?: PricingInfo;

  // Operating Hours
  openingHours?: Record<string, string>;
  hours24x7?: boolean;
  hoursNote?: string;

  // Amenities & Features
  amenities?: Amenities;
  indoorOutdoor?: 'indoor' | 'outdoor' | 'both';
  sizeCategory?: 'small' | 'medium' | 'large';
  surfaceType?: string;
  petFriendlyFeatures?: string[];

  // Metadata
  placeTypes?: string[];
  websiteVerified?: boolean;
  verificationDate?: string;
  lastUpdated?: string;
  dataQuality?: 'verified' | 'partial' | 'unverified';

  // Data source tracking
  source?: 'static' | 'user_submitted';
  listingType?: 'free' | 'featured';
  submittedBy?: string;
  submittedAt?: string;
  approvedAt?: string;
  subscriptionStatus?: string;

  // Deprecated fields (kept for backward compatibility)
  priceLevel?: number;
}

export interface ParkFilters {
  type: string;
  searchTerm: string;
}

export interface ParkStats {
  totalParks: number;
  totalCities: number;
  avgRating: number;
  totalReviews: number;
}

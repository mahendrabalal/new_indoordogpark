// Types for park listing submissions

export type ListingType = 'free' | 'featured';
export type SubmissionStatus = 'pending' | 'approved' | 'rejected';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'unpaid' | 'incomplete';

export interface ParkSubmissionForm {
  // Step 1: Basic Information
  name: string;
  businessType: string;
  description: string;

  // Step 2: Location
  address?: string;
  street?: string;
  city: string;
  state: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;

  // Step 3: Contact & Hours
  phone?: string;
  email?: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    youtube?: string;
  };
  openingHours?: Record<string, string>;
  hours24x7?: boolean;
  hoursNote?: string;

  // Step 4: Amenities
  amenities?: {
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
  };

  // Step 5: Pricing & Photos
  pricingInfo?: {
    isFree?: boolean;
    pricingType?: string;
    priceRange?: string;
    hourlyRate?: number;
    dailyRate?: number;
    monthlyRate?: number;
    dropInFee?: number;
    pricingDetails?: string;
  };
  photos?: Array<{
    url: string;
    type?: string;
    caption?: string;
    source?: string;
  }>;

  // Additional fields
  indoorOutdoor?: string;
  sizeCategory?: string;
  surfaceType?: string;
  petFriendlyFeatures?: string[];
}

export interface ParkSubmission extends ParkSubmissionForm {
  id: string;
  userId: string;
  slug?: string;
  fullAddress?: string;

  // Listing Management
  listingType: ListingType;
  status: SubmissionStatus;
  rejectionReason?: string;

  // Subscription (for featured listings)
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionCurrentPeriodEnd?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  approvedBy?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  parkSubmissionId: string;

  // Stripe Details
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  stripePriceId: string;

  // Subscription Info
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

// Form validation schema
export interface ValidationErrors {
  [key: string]: string;
}

export const BUSINESS_TYPES = [
  'Dog Park',
  'Indoor Dog Park',
  'Dog-Friendly Establishment',
] as const;

export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming'
] as const;

export const INDOOR_OUTDOOR_OPTIONS = [
  'Outdoor',
  'Indoor',
  'Both Indoor and Outdoor',
] as const;

export const SIZE_CATEGORIES = [
  'Small (under 5,000 sq ft)',
  'Medium (5,000-20,000 sq ft)',
  'Large (20,000-50,000 sq ft)',
  'Extra Large (over 50,000 sq ft)',
] as const;

export const SURFACE_TYPES = [
  'Grass',
  'Dirt',
  'Gravel',
  'Artificial Turf',
  'Concrete',
  'Mixed Surface',
] as const;

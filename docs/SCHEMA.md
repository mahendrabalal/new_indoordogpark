# Dog Parks Data Schema

This document describes the standardized JSON schema used for dog park data across the application.

## Overview

The schema follows industry-standard practices for location-based service data and tourism/amenities datasets, similar to schemas used by:
- Google Places API
- OpenStreetMap
- Yelp API
- Travel & Tourism APIs (JSON-LD)

## Complete Schema Structure

### Root Object: `DogPark`

```typescript
{
  // Core Information
  "id": "ChIJHeDWr3m7woARFGm1aYRsjuQ",
  "name": "Glen Alla Dog Park",
  "businessType": "Dog Park" | "Indoor Dog Park" | "Dog-Friendly Establishment",
  "description": "Detailed description of the park...",
  "slug": "glen-alla-dog-park",

  // Location Information
  "address": "4711 Alla Rd",
  "street": "4711 Alla Rd",
  "city": "Marina Del Rey",
  "state": "California",
  "zipCode": "90292",
  "full_address": "4711 Alla Rd, Marina Del Rey, CA 90292, USA",
  "latitude": 33.983951999999995,
  "longitude": -118.4322585,
  "googlePlaceId": "ChIJHeDWr3m7woARFGm1aYRsjuQ",

  // Contact Information
  "phone": "+1 (555) 123-4567",
  "website": "https://example.com",
  "email": "info@dogpark.com",
  "socialMedia": {
    "facebook": "https://facebook.com/...",
    "instagram": "@dogpark",
    "twitter": "https://twitter.com/...",
    "tiktok": "https://tiktok.com/@...",
    "youtube": "https://youtube.com/..."
  },

  // Media Assets (Up to 10 images)
  "photos": [
    {
      "url": "https://places.googleapis.com/v1/places/.../media",
      "type": "photo",
      "source": "google_places",
      "caption": "Photo 1",
      "uploadedAt": "2024-11-05T10:00:00Z"
    },
    {
      "url": "https://places.googleapis.com/v1/places/.../media",
      "type": "photo",
      "source": "google_places",
      "caption": "Photo 2"
    }
  ],

  // Legacy photo fields (backward compatibility)
  "photo": "https://...",
  "photo2": "https://...",
  "photo3": "https://...",
  "images": ["https://...", "https://..."], // Legacy flat array

  // Ratings & Reviews
  "rating": 4.5,
  "reviewCount": 170,
  "userRatingsTotal": 170,

  // Pricing Information
  "pricing": {
    "isFree": false,
    "pricingType": "hourly",
    "priceRange": "$",
    "hourlyRate": 15.00,
    "dailyRate": 30.00,
    "monthlyRate": 100.00,
    "dropInFee": 10.00,
    "pricingDetails": "First hour free for members, $15/hour thereafter. Daily pass $30.",
    "pricingUrl": "https://example.com/pricing",
    "currency": "USD",
    "lastPricingUpdate": "2024-11-05T10:00:00Z",
    "pricingSource": "website" | "google_places" | "manual" | "unknown"
  },

  // Operating Hours
  "openingHours": {
    "Monday": "6:00 AM - 6:00 PM",
    "Tuesday": "6:00 AM - 6:00 PM",
    "Wednesday": "6:00 AM - 6:00 PM",
    "Thursday": "6:00 AM - 6:00 PM",
    "Friday": "6:00 AM - 8:00 PM",
    "Saturday": "7:00 AM - 8:00 PM",
    "Sunday": "7:00 AM - 6:00 PM"
  },
  "hours24x7": false,
  "hoursNote": "Closed on holidays",

  // Amenities & Features
  "amenities": {
    "parking": true,
    "waterFountains": true,
    "shade": true,
    "seating": true,
    "smallDogArea": true,
    "largeDogArea": true,
    "agilityCourse": false,
    "swimming": false,
    "dogWashStation": false,
    "restrooms": true,
    "handicapAccess": true,
    "lighting": true,
    "fencing": true,
    "grooming": false,
    "daycare": false,
    "training": false,
    "socializing": true
  },
  "indoorOutdoor": "outdoor" | "indoor" | "both",
  "sizeCategory": "large" | "medium" | "small",
  "surfaceType": "grass, bark, concrete mix",
  "petFriendlyFeatures": [
    "Off-leash areas",
    "Water bowls",
    "Waste stations",
    "Shaded areas"
  ],

  // Metadata
  "placeTypes": [
    "dog_park",
    "park",
    "point_of_interest",
    "establishment"
  ],
  "websiteVerified": true,
  "verificationDate": "2024-11-05T10:00:00Z",
  "lastUpdated": "2024-11-05T10:00:00Z",
  "dataQuality": "verified" | "partial" | "unverified"
}
```

## Field Descriptions

### Core Information

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (Google Place ID) |
| `name` | string | Yes | Display name of the park |
| `businessType` | enum | Yes | Type of facility (Dog Park, Indoor Dog Park, Dog-Friendly Establishment) |
| `description` | string | Yes | Long-form description of the park |
| `slug` | string | Yes | URL-friendly identifier (lowercase, hyphens) |

### Location Information

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `address` | string | Yes | Street address without city/state |
| `street` | string | Yes | Street address line |
| `city` | string | Yes | City name |
| `state` | string | Yes | State name (full, e.g., "California") |
| `zipCode` | string | No | Postal/ZIP code |
| `full_address` | string | Yes | Complete formatted address |
| `latitude` | number | Yes | Latitude coordinate |
| `longitude` | number | Yes | Longitude coordinate |
| `googlePlaceId` | string | No | Original Google Places API ID |

### Contact Information

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `phone` | string | No | Phone number in E.164 format |
| `website` | string | No | Website URL |
| `email` | string | No | Email address |
| `socialMedia` | object | No | Social media links (Facebook, Instagram, Twitter, TikTok, YouTube) |

### Media Assets

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `photos` | array | No | Array of MediaAsset objects (up to 10) |
| `photo` | string | No | Primary photo URL (deprecated - use photos[0]) |
| `photo2` | string | No | Secondary photo URL (deprecated) |
| `photo3` | string | No | Tertiary photo URL (deprecated) |
| `images` | array | No | Flat array of image URLs (deprecated - use photos) |

#### MediaAsset Object

```typescript
{
  "url": "https://...",
  "type": "photo" | "video",
  "caption": "Photo 1",
  "source": "google_places" | "user" | "website",
  "uploadedAt": "2024-11-05T10:00:00Z"
}
```

### Ratings & Reviews

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `rating` | number | Yes | Average rating (0-5 scale) |
| `reviewCount` | number | Yes | Total number of reviews |
| `userRatingsTotal` | number | No | Alternative field for total ratings count |

### Pricing Information

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `pricing` | object | No | Complete pricing information |
| `pricing.isFree` | boolean | Yes | Whether admission is free |
| `pricing.pricingType` | enum | No | Type of pricing (free, hourly, daily, monthly, membership, per-visit, mixed) |
| `pricing.priceRange` | enum | No | Price level indicator ($, $$, $$$, $$$$) |
| `pricing.hourlyRate` | number | No | Cost per hour (USD) |
| `pricing.dailyRate` | number | No | Cost per day (USD) |
| `pricing.monthlyRate` | number | No | Cost per month (USD) |
| `pricing.dropInFee` | number | No | Cost for single visit (USD) |
| `pricing.pricingDetails` | string | No | Human-readable pricing description |
| `pricing.pricingUrl` | string | No | URL with pricing information |
| `pricing.currency` | string | No | Currency code (default: USD) |
| `pricing.lastPricingUpdate` | string | No | ISO 8601 timestamp of last update |
| `pricing.pricingSource` | enum | No | Source of pricing data (website, google_places, manual, unknown) |

### Operating Hours

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `openingHours` | object | No | Object with day names as keys, hours as values |
| `hours24x7` | boolean | No | Whether facility is open 24/7 |
| `hoursNote` | string | No | Additional notes about hours (e.g., holidays) |

### Amenities & Features

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `amenities` | object | No | Boolean flags for available amenities |
| `indoorOutdoor` | enum | No | Location type (indoor, outdoor, both) |
| `sizeCategory` | enum | No | Size of facility (small, medium, large) |
| `surfaceType` | string | No | Description of ground surface |
| `petFriendlyFeatures` | array | No | List of pet-specific features |

#### Amenities Object Keys

- `parking` - Parking available
- `waterFountains` - Water fountains for dogs
- `shade` - Shaded areas
- `seating` - Seating for people
- `smallDogArea` - Separate area for small dogs
- `largeDogArea` - Separate area for large dogs
- `agilityCourse` - Agility course/obstacles
- `swimming` - Water/swimming area
- `dogWashStation` - Dog wash facilities
- `restrooms` - Public restrooms
- `handicapAccess` - ADA accessible
- `lighting` - Evening lighting
- `fencing` - Fenced/enclosed
- `grooming` - Grooming services
- `daycare` - Daycare services
- `training` - Training classes
- `socializing` - Social activities

### Metadata

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `placeTypes` | array | No | Google Places type tags |
| `websiteVerified` | boolean | No | Whether website has been verified |
| `verificationDate` | string | No | When data was last verified |
| `lastUpdated` | string | No | ISO 8601 timestamp of last update |
| `dataQuality` | enum | No | Quality level (verified, partial, unverified) |

## Examples

### Example 1: Outdoor Dog Park with Pricing

```json
{
  "id": "ChIJHeDWr3m7woARFGm1aYRsjuQ",
  "name": "Glen Alla Dog Park",
  "businessType": "Dog Park",
  "description": "Glen Alla is a dedicated dog park serving the Marina Del Rey community...",
  "slug": "glen-alla-dog-park",
  "address": "4711 Alla Rd",
  "street": "4711 Alla Rd",
  "city": "Marina Del Rey",
  "state": "California",
  "zipCode": "90292",
  "full_address": "4711 Alla Rd, Marina Del Rey, CA 90292, USA",
  "latitude": 33.983951999999995,
  "longitude": -118.4322585,
  "phone": "+1 (555) 123-4567",
  "website": "https://marinellib.org/parks",
  "rating": 4.5,
  "reviewCount": 170,
  "pricing": {
    "isFree": true,
    "pricingType": "free",
    "pricingSource": "google_places"
  },
  "amenities": {
    "parking": true,
    "waterFountains": true,
    "shade": true,
    "seating": true,
    "smallDogArea": true,
    "largeDogArea": true,
    "fencing": true,
    "socializing": true
  },
  "indoorOutdoor": "outdoor",
  "sizeCategory": "large",
  "surfaceType": "grass, bark",
  "dataQuality": "verified",
  "lastUpdated": "2024-11-05T10:00:00Z"
}
```

### Example 2: Indoor Dog Park with Premium Pricing

```json
{
  "id": "ChIJ_custom_id_002",
  "name": "DoggieLand Indoor Play",
  "businessType": "Indoor Dog Park",
  "description": "DoggieLand is a premier indoor dog facility...",
  "slug": "doggieland-indoor-play",
  "address": "123 Business Ave",
  "street": "123 Business Ave",
  "city": "Los Angeles",
  "state": "California",
  "zipCode": "90001",
  "full_address": "123 Business Ave, Los Angeles, CA 90001, USA",
  "latitude": 34.0522,
  "longitude": -118.2437,
  "phone": "+1 (555) 987-6543",
  "website": "https://doggieland.com",
  "email": "info@doggieland.com",
  "rating": 4.8,
  "reviewCount": 245,
  "pricing": {
    "isFree": false,
    "pricingType": "hourly",
    "priceRange": "$$",
    "hourlyRate": 25.00,
    "dailyRate": 60.00,
    "monthlyRate": 350.00,
    "pricingDetails": "Hourly rates: $25/hour. Full-day passes $60. Monthly memberships $350 with unlimited access.",
    "pricingUrl": "https://doggieland.com/pricing",
    "currency": "USD",
    "lastPricingUpdate": "2024-10-15T00:00:00Z",
    "pricingSource": "website"
  },
  "photos": [
    {
      "url": "https://...",
      "type": "photo",
      "caption": "Main play area",
      "source": "google_places"
    }
  ],
  "amenities": {
    "parking": true,
    "waterFountains": true,
    "shade": false,
    "seating": true,
    "smallDogArea": true,
    "largeDogArea": true,
    "agilityCourse": true,
    "swimming": false,
    "dogWashStation": true,
    "restrooms": true,
    "handicapAccess": true,
    "lighting": true,
    "grooming": true,
    "daycare": true,
    "training": true,
    "socializing": true
  },
  "indoorOutdoor": "indoor",
  "sizeCategory": "large",
  "surfaceType": "turf, rubber",
  "petFriendlyFeatures": [
    "Climate-controlled",
    "Professional supervision",
    "Daily cleaning",
    "Multiple play areas by size"
  ],
  "dataQuality": "verified",
  "lastUpdated": "2024-11-05T10:00:00Z"
}
```

## Notes

- All timestamps use ISO 8601 format (UTC)
- Currency amounts are in USD unless specified otherwise
- Phone numbers should use E.164 format (+1 XXX-XXX-XXXX)
- Photos support up to 10 images; older data may only have 3 (photo, photo2, photo3)
- The `images` array is a legacy field; use `photos` array for new integrations
- All location fields are required for map functionality
- Ratings are on a 0-5 scale with decimal precision
- Data quality indicates the reliability of the information:
  - `verified`: Data has been checked against primary sources
  - `partial`: Some fields are missing but core data is reliable
  - `unverified`: Data comes from scraping and hasn't been verified

# Guest Post: Building a Location-Based Directory with Next.js and AI

## Title

Building a Scalable Location Directory: Lessons from Building indoordogpark.org with Next.js, TypeScript, and Google Places API

## TL;DR

This article shares practical lessons learned from building indoordogpark.org, a comprehensive directory of indoor dog parks across California. We'll explore how we leveraged Next.js 14, TypeScript, and the Google Places API to create a fast, searchable directory platform. Key topics include data pipeline architecture, implementing client-side filtering with performance optimization, integrating Leaflet maps for interactive exploration, and designing scalable data transformation workflows. You'll learn about handling location-based queries, managing large datasets efficiently, and creating an intuitive user experience for discovering local businesses. Whether you're building a similar directory or working with location data, these implementation patterns will help you avoid common pitfalls and deliver production-ready features.

## Reference URL

https://indoordogpark.org

---

## Full Article Content

# Building a Scalable Location Directory: Lessons from Building indoordogpark.org with Next.js, TypeScript, and Google Places API

## Introduction

Location-based directories are everywhere—from restaurant finders to business listings. But building one that's fast, searchable, and provides an excellent user experience isn't trivial. This article shares practical lessons learned from building [indoordogpark.org](https://indoordogpark.org), a comprehensive directory of indoor dog parks across California.

We'll dive into the technical decisions that made our platform scalable, from data pipeline architecture to client-side filtering strategies. You'll learn how we integrated the Google Places API, implemented interactive maps with Leaflet, and designed a data transformation workflow that keeps our directory up-to-date and performant.

## The Challenge: Building a Location Directory from Scratch

Our goal was straightforward: create a directory that helps dog owners find indoor dog parks across California. But the requirements quickly expanded:

- **Real-time search** across hundreds of locations
- **Interactive maps** showing park locations
- **Rich filtering** by amenities, pricing, and location
- **Fast performance** with instant results
- **Scalable data pipeline** to keep information current

Traditional approaches like server-side rendering for each search would be too slow. We needed a modern architecture that could handle complex filtering while maintaining performance.

## Architecture Overview

We chose Next.js 14 with the App Router for several reasons:

```typescript
// Tech Stack
- Frontend: Next.js 14, React 18, TypeScript
- Styling: Tailwind CSS
- Mapping: Leaflet with react-leaflet
- Data: Google Places API + Static JSON files
- Deployment: Vercel (optimized for Next.js)
```

### Why This Stack?

**Next.js 14** provides excellent performance out of the box with:
- Automatic code splitting
- Optimized static generation
- Built-in API routes for backend logic
- Server and client components for flexible rendering

**TypeScript** ensures type safety across our data models, preventing runtime errors from mismatched location data.

**Leaflet** gives us full control over map customization without the restrictions of proprietary mapping services.

## Data Pipeline: From Google Places API to Production

The foundation of any location directory is quality data. We built a Python-based pipeline that transforms raw Google Places API data into a standardized format our frontend can efficiently consume.

### Stage 1: Data Collection

```python
# scripts/scrape_enhanced_indoor_parks.py
import requests
from typing import List, Dict

PLACES_TEXT_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText"

def search_indoor_dog_parks(api_key: str, location: str) -> List[Dict]:
    """Search for indoor dog parks using Google Places API"""
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": api_key
    }
    
    payload = {
        "textQuery": f"indoor dog park {location}",
        "locationRestriction": {
            "rectangle": {
                "low": {"latitude": 32.528832, "longitude": -124.482003},
                "high": {"latitude": 42.009516, "longitude": -114.131211}
            }
        },
        "maxResultCount": 20
    }
    
    response = requests.post(
        PLACES_TEXT_SEARCH_URL,
        headers=headers,
        json=payload
    )
    
    return response.json().get("places", [])
```

### Stage 2: Data Transformation

Raw Google Places data needs transformation to match our standardized schema:

```python
def transform_place_data(raw_place: Dict) -> Dict:
    """Transform Google Places data to our standard format"""
    return {
        "id": raw_place.get("id"),
        "name": raw_place.get("displayName", {}).get("text"),
        "address": extract_street_address(raw_place.get("formattedAddress")),
        "city": extract_city(raw_place.get("formattedAddress")),
        "state": "California",
        "latitude": raw_place.get("location", {}).get("latitude"),
        "longitude": raw_place.get("location", {}).get("longitude"),
        "rating": raw_place.get("rating"),
        "reviewCount": raw_place.get("userRatingCount", 0),
        "businessType": classify_business_type(raw_place),
        "description": generate_seo_description(raw_place),
        "photos": extract_photos(raw_place.get("photos", [])),
        "amenities": detect_amenities(raw_place),
        "openingHours": parse_opening_hours(raw_place.get("regularOpeningHours"))
    }
```

### Stage 3: Address Parsing Challenge

One of the trickiest parts was parsing formatted addresses into structured components:

```python
def parse_formatted_address(address: str) -> Dict:
    """
    Parse "123 Main St, Los Angeles, CA 90001, USA" into components
    """
    parts = [p.strip() for p in address.split(",")]
    
    return {
        "street": parts[0] if len(parts) > 0 else "",
        "city": parts[1] if len(parts) > 1 else "",
        "state": extract_state(parts[2]) if len(parts) > 2 else "",
        "zipCode": extract_zip(parts[2]) if len(parts) > 2 else "",
        "full_address": address
    }

def extract_state(address_part: str) -> str:
    """Extract state abbreviation from 'CA 90001'"""
    state_pattern = r'\b([A-Z]{2})\b'
    match = re.search(state_pattern, address_part)
    return match.group(1) if match else ""

def extract_zip(address_part: str) -> str:
    """Extract ZIP code from 'CA 90001'"""
    zip_pattern = r'\b(\d{5}(?:-\d{4})?)\b'
    match = re.search(zip_pattern, address_part)
    return match.group(1) if match else ""
```

This structured data approach allows for efficient filtering and sorting on the frontend.

## Frontend Implementation: Client-Side Filtering with Performance

Once we have structured data, the frontend needs to handle filtering efficiently. Loading all parks on page load and filtering client-side provides instant results:

```typescript
// src/lib/api.ts
export interface DogPark {
  id: string;
  name: string;
  city: string;
  state: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  businessType: string;
  amenities?: Record<string, boolean>;
  // ... other fields
}

export function filterParks(
  parks: DogPark[],
  searchTerm: string,
  selectedType?: string
): DogPark[] {
  return parks.filter(park => {
    // Type filter
    if (selectedType && park.businessType !== selectedType) {
      return false;
    }
    
    // Search term filter (case-insensitive)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesName = park.name.toLowerCase().includes(searchLower);
      const matchesCity = park.city.toLowerCase().includes(searchLower);
      const matchesAddress = park.full_address?.toLowerCase().includes(searchLower);
      const matchesDescription = park.description?.toLowerCase().includes(searchLower);
      
      if (!matchesName && !matchesCity && !matchesAddress && !matchesDescription) {
        return false;
      }
    }
    
    return true;
  });
}
```

### Performance Optimization: Memoization

For large datasets, we use React's `useMemo` to avoid recalculating filters on every render:

```typescript
// src/app/page.tsx
'use client';

import { useMemo, useState } from 'react';

export default function ParksPage() {
  const [parks, setParks] = useState<DogPark[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | undefined>();
  
  const filteredParks = useMemo(() => {
    return filterParks(parks, searchTerm, selectedType);
  }, [parks, searchTerm, selectedType]);
  
  // Calculate statistics from filtered results
  const stats = useMemo(() => {
    return {
      total: filteredParks.length,
      averageRating: calculateAverageRating(filteredParks),
      cities: countUniqueCities(filteredParks)
    };
  }, [filteredParks]);
  
  return (
    // ... UI components
  );
}
```

This ensures filtering happens only when dependencies change, not on every keystroke or state update.

## Interactive Maps with Leaflet

Maps are crucial for location directories. We chose Leaflet for its flexibility and performance:

```typescript
// src/components/Map.tsx
'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  parks: DogPark[];
}

export default function Map({ parks }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  
  useEffect(() => {
    // Initialize map (lazy load to avoid SSR issues)
    if (typeof window === 'undefined') return;
    
    const initializeMap = async () => {
      const L = (await import('leaflet')).default;
      
      if (!mapRef.current) {
        mapRef.current = L.map('map-container').setView([36.7783, -119.4179], 6);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapRef.current);
      }
      
      // Clear existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      
      // Add markers for each park
      parks.forEach(park => {
        if (park.latitude && park.longitude) {
          const marker = L.marker([park.latitude, park.longitude])
            .addTo(mapRef.current!)
            .bindPopup(`
              <h3>${park.name}</h3>
              <p>${park.city}, ${park.state}</p>
              ${park.rating ? `<p>Rating: ${park.rating}/5</p>` : ''}
            `);
          
          markersRef.current.push(marker);
        }
      });
      
      // Fit map to show all markers
      if (markersRef.current.length > 0) {
        const group = new L.FeatureGroup(markersRef.current);
        mapRef.current.fitBounds(group.getBounds().pad(0.1));
      }
    };
    
    initializeMap();
  }, [parks]);
  
  return <div id="map-container" style={{ height: '600px', width: '100%' }} />;
}
```

**Key implementation details:**

1. **Lazy Loading**: Dynamic import of Leaflet avoids SSR issues
2. **Marker Management**: Clear and recreate markers when parks change
3. **Auto-fit Bounds**: Map automatically adjusts to show all visible parks
4. **Custom Icons**: You can customize marker icons for different park types

## Handling Large Datasets

With hundreds of parks, we need strategies to keep the app performant:

### Strategy 1: Static Generation with Incremental Updates

```typescript
// Generate static pages at build time
export async function generateStaticParams() {
  const parks = await fetchParks();
  return parks.map(park => ({
    slug: park.slug
  }));
}
```

### Strategy 2: Pagination and Virtual Scrolling

For search results, implement pagination:

```typescript
const ITEMS_PER_PAGE = 20;

function usePaginatedResults<T>(items: T[], itemsPerPage: number) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return items.slice(start, end);
  }, [items, currentPage, itemsPerPage]);
  
  const totalPages = Math.ceil(items.length / itemsPerPage);
  
  return {
    paginatedItems,
    currentPage,
    totalPages,
    setCurrentPage,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
  };
}
```

### Strategy 3: Debounced Search

Prevent excessive filtering during typing:

```typescript
import { useDebounce } from '@/hooks/useDebounce';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  const filteredParks = useMemo(() => {
    return filterParks(parks, debouncedSearchTerm);
  }, [parks, debouncedSearchTerm]);
  
  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search parks..."
    />
  );
}
```

## Type Safety with TypeScript

TypeScript prevents many bugs in location data:

```typescript
// src/types/dog-park.ts
export interface DogPark {
  id: string;
  name: string;
  businessType: 'Dog Park' | 'Indoor Dog Park' | 'Dog-Friendly Establishment';
  address: string;
  city: string;
  state: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  reviewCount?: number;
  amenities?: {
    smallDogArea?: boolean;
    waterFountains?: boolean;
    shade?: boolean;
    // ... more amenities
  };
}

// Type guard for coordinates
export function hasCoordinates(park: DogPark): park is DogPark & {
  latitude: number;
  longitude: number;
} {
  return park.latitude !== undefined && park.longitude !== undefined;
}

// Usage
parks.forEach(park => {
  if (hasCoordinates(park)) {
    // TypeScript knows latitude and longitude are defined here
    createMarker(park.latitude, park.longitude);
  }
});
```

## API Route for Dynamic Data

While we use static JSON files, we also expose an API route for dynamic updates:

```typescript
// src/app/api/parks/route.ts
import { NextResponse } from 'next/server';
import parksData from '@/public/data/standardized_dog_parks.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const type = searchParams.get('type');
  
  let filtered = parksData;
  
  if (city) {
    filtered = filtered.filter(p => 
      p.city.toLowerCase().includes(city.toLowerCase())
    );
  }
  
  if (type) {
    filtered = filtered.filter(p => p.businessType === type);
  }
  
  return NextResponse.json({
    parks: filtered,
    count: filtered.length
  });
}
```

## Lessons Learned

### 1. Standardize Data Early

Create a consistent schema from the start. It's much harder to refactor later when you have multiple consumers of the data.

### 2. Client-Side Filtering Can Be Fast

Don't assume you need a backend search service. For datasets under 10,000 items, client-side filtering with memoization is often faster and simpler.

### 3. Handle Missing Data Gracefully

Not every location has all fields. Use optional types and provide sensible defaults:

```typescript
const displayRating = park.rating ?? 'Not rated';
const displayAddress = park.full_address ?? `${park.address}, ${park.city}`;
```

### 4. Optimize Map Performance

Limit the number of visible markers. For large datasets, consider clustering or pagination on the map.

### 5. Test with Real Data Early

Mock data often hides edge cases. Test with real Google Places API responses as soon as possible.

## Conclusion

Building a location directory like [indoordogpark.org](https://indoordogpark.org) requires careful attention to data pipeline design, frontend performance, and user experience. By leveraging Next.js, TypeScript, and the Google Places API, we created a platform that's both performant and maintainable.

Key takeaways:

- **Standardize your data schema** early in development
- **Client-side filtering** can handle surprisingly large datasets
- **Type safety** with TypeScript prevents location data errors
- **Interactive maps** enhance user experience significantly
- **Performance optimization** through memoization and debouncing is crucial

Whether you're building a similar directory or working with location-based features, these patterns will help you deliver a production-ready solution.

## Resources

- [indoordogpark.org](https://indoordogpark.org) - Live implementation
- [Next.js Documentation](https://nextjs.org/docs)
- [Google Places API](https://developers.google.com/maps/documentation/places)
- [Leaflet Documentation](https://leafletjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## Article Stats

- **Word Count**: ~1,600 words
- **Code Examples**: 12+ TypeScript/Python snippets
- **Technical Level**: Intermediate
- **Target Audience**: Full-stack developers, Next.js developers, Location-based service builders


# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a California Dog Parks Directory - a Next.js application that displays dog parks across California with filtering, search, and mapping capabilities. The app combines data sourced from Google Places API with custom transformations and displays parks on an interactive Leaflet map.

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, PostCSS, Bootstrap Icons
- **Mapping**: Leaflet with react-leaflet for interactive maps
- **Backend**: Next.js API routes
- **Data**: Static JSON files served from public directory

## Common Development Commands

```bash
# Development server (runs on localhost:3000)
npm run dev

# Build for production
npm build

# Start production server
npm start

# Run linting
npm run lint
```

## Architecture

### High-Level Data Flow

1. **Data Layer** (`public/data/`): Static JSON files containing standardized park data
   - `standardized_dog_parks.json` - The primary data source used by the frontend
   - `google_places_dog_parks.json` - Raw Google Places API data
   - `google_places_dog_parks_with_images.json` - Enhanced data with image URLs

2. **API Routes** (`src/app/api/`):
   - `/api/parks` - Returns all parks from standardized JSON file
   - `/api/parks/live` - Returns parks by IDs with simulated live data (visitor counts)
   - `/api/weather/context` - Placeholder for weather context API

3. **Frontend Page** (`src/app/page.tsx`):
   - Client-side component that orchestrates the main user interface
   - Manages state for parks, filters, search, and statistics
   - Loads all parks on mount and calculates aggregate statistics

4. **Components** (`src/components/`):
   - `Map.tsx` - Leaflet-based interactive map with park markers and popups
   - `ParkCard.tsx` - Card component displaying individual park information

### Key Data Transformations

The `scripts/transform_google_places_data.py` script handles conversion from Google Places API format to the standardized format. It:
- Parses formatted addresses into structured components (street, city, state, zip)
- Classifies parks into three types: "Dog Park", "Indoor Dog Park", "Dog-Friendly Establishment"
- Generates SEO-friendly descriptions
- Handles image URLs from the Google Places API
- Processes working hours and amenities

### Component Structure

- `Map.tsx` is a client-side component that dynamically imports Leaflet (avoiding SSR issues). It:
  - Uses refs to manage the Leaflet map instance and markers
  - Re-initializes markers when the parks array changes
  - Handles popup click events through window-level event handlers
  - Sets initial view to California (36.7783, -119.4179) at zoom level 6

## Data Models

Main interface in `src/types/dog-park.ts`:

```typescript
interface DogPark {
  id: string;
  name: string;
  businessType: string; // "Dog Park" | "Indoor Dog Park" | "Dog-Friendly Establishment"
  rating: number;
  reviewCount: number;
  address: string;
  city: string;
  state: string;
  full_address: string;
  phone?: string;
  website?: string;
  description: string;
  latitude?: number;
  longitude?: number;
  photo?: string;
  photos?: string[];
  priceLevel?: number;
  openingHours?: Record<string, string>;
  userRatingsTotal?: number;
}
```

## Styling Notes

- Styling uses a combination of Tailwind CSS (utility-first) and custom CSS in `globals.css`
- Bootstrap Icons are loaded from CDN for UI icons (search, heart, etc.)
- Leaflet CSS is also loaded from CDN for map styling
- The app uses a purple gradient background with a custom color scheme
- Responsive design uses Tailwind breakpoints (e.g., `md:text-5xl`, `col-md-3`)

## Important Implementation Details

1. **Map Initialization**: The Map component lazy-loads Leaflet to avoid SSR errors. Marker icons are configured with CDN URLs since Leaflet's default icon resolution fails in Next.js.

2. **Client Components**: Both the home page and Map component use `'use client'` directive as they rely on browser APIs (window, useEffect, refs).

3. **Image Domains**: The `next.config.js` allows images from specific domains including unsplash.com, lh3.googleusercontent.com, and places.googleapis.com.

4. **Filtering Logic**: Filtering happens client-side in `lib/api.ts` by checking park properties against search terms and selected type. Search matches across name, city, full_address, and description fields.

5. **Statistics Calculation**: Stats are computed synchronously from the full parks array and recalculated whenever the parks data updates.

## Python Scripts

- `scripts/scrape_google_places_dog_parks.py` - Queries Google Places API for dog parks
- `scripts/scrape_indoor_dog_parks.py` - Specialized scraping for indoor dog parks
- `scripts/fetch_places_with_images.py` - Fetches and handles image URLs from Places API
- `scripts/transform_google_places_data.py` - Main transformation script
- `scripts/transformation_summary.py` - Generates summary of transformation results

These scripts are utilities for data preparation and are not part of the runtime application.

## Development Considerations

- The app assumes location data (latitude/longitude) is present for map functionality
- The live parks API endpoint (`/api/parks/live`) currently generates mock live data
- Search and filtering are case-insensitive and match partial strings
- The map auto-fits bounds to show all loaded markers with 10% padding

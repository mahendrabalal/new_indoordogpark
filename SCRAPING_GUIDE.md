# Dog Parks Data Scraping Guide

This guide explains how to use the enhanced scraping tools to fetch indoor dog park data with comprehensive information including pricing, amenities, and images.

## Files Overview

### New Files Created

1. **`scripts/scrape_enhanced_indoor_parks.py`** - Enhanced scraper with pricing extraction
2. **`SCHEMA.md`** - Complete schema documentation
3. **`SCRAPING_GUIDE.md`** - This file

### Modified Files

1. **`src/types/dog-park.ts`** - Updated TypeScript interfaces with new fields
2. **`scripts/transform_google_places_data.py`** - Updated to support new schema

## Quick Start

### Prerequisites

```bash
# Install required Python packages
pip install requests beautifulsoup4

# Ensure you have Google Places API key in .env.local
# Format: google_place_api=YOUR_API_KEY_HERE
```

### Option 1: Scrape Indoor Dog Parks (with Pricing)

```bash
python3 scripts/scrape_enhanced_indoor_parks.py \
  --query "indoor dog park California" \
  --max-results 20 \
  --output public/data/enhanced_indoor_dog_parks.json
```

**Output**: `public/data/enhanced_indoor_dog_parks.json` with:
- ✅ All available photos (up to 10 per location)
- ✅ Pricing extracted from websites
- ✅ Amenities detected from place data
- ✅ Complete contact information
- ✅ Ratings and reviews

### Option 2: Transform Existing Google Places Data

```bash
python3 scripts/transform_google_places_data.py
```

**Reads from**: `public/data/google_places_dog_parks_with_images.json`
**Outputs to**: `public/data/standardized_dog_parks.json`

Includes backward compatibility with legacy photo fields.

## Script Details

### Enhanced Indoor Parks Scraper

**Features:**
- Fetches data from Google Places API with comprehensive field mask
- Extracts up to 10 images per location
- Scrapes websites for pricing information
- Detects amenities from place data
- Handles rate limiting and retries
- Produces standardized output

**Command Options:**
```bash
python3 scripts/scrape_enhanced_indoor_parks.py \
  --env-file .env.local              # Path to env file (default: .env.local)
  --query "search query"              # Search query (default: "indoor dog park California")
  --max-results 20                    # Number of results (default: 20)
  --output path/to/output.json        # Output file (default: public/data/...)
```

**Pricing Extraction:**

The scraper automatically extracts pricing from websites using:
- Regex pattern matching for common formats:
  - `$15/hour`, `$15 per hour`
  - `$30/day`, `$30 per day`
  - `$50/month`, `$50 per month`
- Website keyword detection (free, membership, etc.)
- Fallback to `isFree: true` if no pricing found

### Transform Script Enhancements

**New Features:**
- Supports up to 10 images per location
- Converts image URLs to MediaAsset objects
- Maintains backward compatibility with legacy fields
- Includes amenities and location information

**Process:**
1. Reads from `public/data/google_places_dog_parks_with_images.json` (or fallback to original)
2. Transforms each place to standardized schema
3. Saves to `public/data/standardized_dog_parks.json`
4. Prints summary with image counts

## Data Schema

The new standardized schema includes:

### Core Fields
- `id`, `name`, `businessType`, `slug`, `description`
- Complete address with latitude/longitude
- Phone, website, email, social media

### Media (NEW)
- `photos`: Array of up to 10 MediaAsset objects
- Legacy fields: `photo`, `photo2`, `photo3`, `images` (for backward compatibility)

### Pricing (NEW)
- `pricing.isFree`: boolean
- `pricing.pricingType`: hourly, daily, monthly, membership, per-visit, mixed
- `pricing.hourlyRate`, `pricing.dailyRate`, `pricing.monthlyRate`
- `pricing.pricingDetails`: Human-readable description
- `pricing.pricingSource`: Where pricing came from

### Amenities (NEW)
- `amenities`: Object with boolean flags for:
  - Parking, water fountains, shade, seating
  - Small/large dog areas, agility course, swimming
  - Wash station, restrooms, handicap access
  - Lighting, grooming, daycare, training, socializing

### Features
- `indoorOutdoor`: indoor, outdoor, or both
- `sizeCategory`: small, medium, or large
- `surfaceType`: grass, turf, concrete, etc.
- `petFriendlyFeatures`: List of special features

### Metadata
- `rating`: 0-5 stars
- `reviewCount`: Total reviews
- `openingHours`: Object with day-by-day hours
- `dataQuality`: verified, partial, or unverified
- `lastUpdated`: ISO 8601 timestamp

See [SCHEMA.md](./SCHEMA.md) for complete field documentation.

## Workflow Examples

### Example 1: Fetch and Standardize Indoor Parks

```bash
# Step 1: Fetch fresh indoor dog park data with pricing
python3 scripts/scrape_enhanced_indoor_parks.py \
  --query "indoor dog park California" \
  --max-results 30 \
  --output public/data/fresh_indoor_parks.json

# Step 2: Review the data
python3 -c "import json; data = json.load(open('public/data/fresh_indoor_parks.json')); \
print(f'Fetched {len(data)} parks'); \
[print(f'{p[\"name\"]}: {p[\"pricing\"].get(\"hourlyRate\", \"Free\")}') for p in data[:5]]"

# Step 3: Merge with existing data or replace standardized file
```

### Example 2: Update with Latest Google Places Data

```bash
# Step 1: Use existing fetch script to get Google Places data
python3 scripts/fetch_places_with_images.py

# Step 2: Transform to standardized format
python3 scripts/transform_google_places_data.py

# Step 3: Verify output
python3 -c "import json; data = json.load(open('public/data/standardized_dog_parks.json')); \
print(f'Total parks: {len(data)}'); \
parks_with_pricing = [p for p in data if p.get('pricing')]; \
print(f'Parks with pricing: {len(parks_with_pricing)}')"
```

## TypeScript Integration

The updated TypeScript interfaces are ready to use:

```typescript
import { DogPark, PricingInfo, Amenities, MediaAsset } from '@/types/dog-park';

// Access new pricing fields
const park: DogPark = parkData;
if (park.pricing?.isFree) {
  console.log('Free admission!');
} else if (park.pricing?.hourlyRate) {
  console.log(`$${park.pricing.hourlyRate}/hour`);
}

// Access multiple photos
park.photos?.forEach((photo, idx) => {
  console.log(`Photo ${idx + 1}: ${photo.caption}`);
});

// Check amenities
if (park.amenities?.smallDogArea && park.amenities?.parkingpz) {
  console.log('Great for small dogs with parking!');
}
```

## Tips & Best Practices

### 1. Rate Limiting
- The enhanced scraper includes `sleep(0.1)` between API calls
- Google Places API allows ~100 requests/second
- For larger batches, increase sleep duration

### 2. Pricing Extraction
- Website pricing extraction is not 100% accurate
- Always verify critical pricing information
- Mark unreliable pricing with `pricingSource: "unknown"`

### 3. Image Management
- Google Places typically provides 3-10 photos per location
- Images are hosted on Google's servers (reliable but API key required)
- Store image URLs, not the images themselves

### 4. Data Quality
- New scrapes are marked as `dataQuality: "verified"`
- Manually verified parks should be marked `"verified"`
- Partially verified parks should use `"partial"`

### 5. Regular Updates
- Re-run transformation scripts monthly
- Update pricing information quarterly
- Track `lastUpdated` timestamps

## Troubleshooting

### API Key Issues

```bash
# Verify API key is loaded
python3 -c "from pathlib import Path; \
key = None; \
for line in Path('.env.local').read_text().splitlines(): \
  if 'google_place_api' in line: key = line.split('=')[1].strip(); \
print('Key loaded!' if key else 'No key found')"
```

### Empty Results

```bash
# Try different search query
python3 scripts/scrape_enhanced_indoor_parks.py \
  --query "indoor dog park California" \
  --max-results 20

# Or try without location filter (if using original script)
python3 scripts/scrape_google_places_dog_parks.py \
  --query "dog park" \
  --no-location-filter
```

### Website Scraping Failures

The script gracefully handles website scraping failures:
- Returns `isFree: true` if no pricing is found
- Sets `pricingSource: "unknown"` for unverified data
- Continues processing other parks

## File Structure

```
/scraper
├── public/data/
│   ├── standardized_dog_parks.json          (Primary data file)
│   ├── google_places_dog_parks.json         (Raw Google data)
│   ├── google_places_dog_parks_with_images.json
│   └── enhanced_indoor_dog_parks.json       (NEW - enhanced data)
├── scripts/
│   ├── scrape_enhanced_indoor_parks.py      (NEW - enhanced scraper)
│   ├── transform_google_places_data.py      (Updated)
│   ├── scrape_google_places_dog_parks.py    (Original)
│   └── ...
├── src/
│   ├── types/
│   │   └── dog-park.ts                      (Updated schema)
│   └── ...
├── SCHEMA.md                                (NEW - field documentation)
└── SCRAPING_GUIDE.md                        (This file)
```

## Next Steps

1. **Run the enhanced scraper** to collect indoor dog park data:
   ```bash
   python3 scripts/scrape_enhanced_indoor_parks.py --max-results 50
   ```

2. **Review the generated data** for accuracy

3. **Update the main standardized file** or merge with existing data

4. **Verify in the web app** by checking if pricing appears on cards

5. **Set up regular updates** (monthly or quarterly as needed)

## Support

For issues with:
- **Google Places API**: Check API quota and permissions
- **Website scraping**: Some sites block scrapers; try increasing timeouts
- **Data validation**: Check SCHEMA.md for required vs. optional fields
- **Performance**: Use smaller `--max-results` for testing, larger batches for production

# Bulk Scraping Workflow - Get 1000s of Indoor Dog Parks in ONE FILE

This guide shows you exactly how to scrape thousands of California indoor dog parks and merge them into a single, deduplicated file.

## Quick Start (One Command)

```bash
# Step 1: Scrape all indoor dog parks (will find 1000s)
python3 scripts/scrape_all_indoor_parks.py --max-per-query 20

# Step 2: Merge with existing data into single file
python3 scripts/merge_and_deduplicate.py \
  --input-files public/data/enhanced_indoor_dog_parks.json \
                  public/data/standardized_dog_parks.json \
  --output public/data/standardized_dog_parks.json \
  --sort-by rating
```

**Result:** `public/data/standardized_dog_parks.json` with 1000+ parks, NO DUPLICATES, sorted by rating

---

## Step-by-Step Workflow

### Step 1: Scrape All Indoor Parks

```bash
python3 scripts/scrape_all_indoor_parks.py \
  --env-file .env.local \
  --max-per-query 20 \
  --output public/data/enhanced_indoor_dog_parks.json
```

**What this does:**
- 🔍 Performs 11 different search queries
- 🗺️  Performs 8 regional searches (LA, SF, San Diego, etc.)
- 🚫 **Auto-deduplicates** by park ID during scraping
- 💰 Extracts pricing from facility websites
- 📸 Fetches up to 10 photos per park
- ⏱️ Rate-limited to respect Google API quotas
- 💾 Saves to `public/data/enhanced_indoor_dog_parks.json`

**Expected Results:**
- 🎯 **500-1000+ unique indoor dog parks**
- 📊 Takes 10-20 minutes depending on API speed
- ✅ Automatic pricing extraction from websites
- 🖼️ Multiple images per park

### Step 2: Merge Into Single File

```bash
python3 scripts/merge_and_deduplicate.py \
  --input-files \
    public/data/enhanced_indoor_dog_parks.json \
    public/data/standardized_dog_parks.json \
  --output public/data/standardized_dog_parks.json \
  --sort-by rating
```

**What this does:**
- 🔀 Merges both files
- 🚫 **Removes all duplicates** by ID
- 🧠 Intelligently combines data (keeps most complete version)
- 📸 Merges photos (avoids duplication)
- 🏆 Combines amenities
- 📊 Shows statistics
- 📈 Sorts by rating (highest first)

**Result:**
```
Before: 10 parks + 500 parks = 510 parks
Duplicates removed: ~50
After: 460 unique parks
```

---

## Complete One-Liner (For Impatient Users)

```bash
python3 scripts/scrape_all_indoor_parks.py --max-per-query 20 && \
python3 scripts/merge_and_deduplicate.py \
  --input-files public/data/enhanced_indoor_dog_parks.json \
                  public/data/standardized_dog_parks.json \
  --output public/data/standardized_dog_parks.json \
  --sort-by rating && \
echo "✅ Done! Check public/data/standardized_dog_parks.json"
```

---

## Advanced Options

### Scrape More Parks Per Query

For deeper results (warning: more API calls):

```bash
python3 scripts/scrape_all_indoor_parks.py --max-per-query 50
```

### Sort By Different Fields

```bash
# By rating (highest first)
--sort-by rating

# Alphabetically by name
--sort-by name

# By city (grouped)
--sort-by city

# By ID (default insertion order)
--sort-by id
```

### Custom Output Path

```bash
python3 scripts/scrape_all_indoor_parks.py \
  --output my_data/indoor_parks_2024.json
```

---

## Search Queries Used

The scraper uses these search queries to find comprehensive coverage:

### Primary Searches (General)
1. "indoor dog park California"
2. "indoor dog playground California"
3. "dog daycare facility California"
4. "climate controlled dog park California"
5. "covered dog play area California"
6. "dog training facility California"
7. "dog socialization center California"
8. "pet play center California"
9. "doggieland California"
10. "dog resort California"
11. "pet care facility California"

### Regional Searches (Specific Cities)
1. "indoor dog park Los Angeles"
2. "indoor dog park San Francisco Bay Area"
3. "indoor dog park San Diego"
4. "indoor dog park Sacramento"
5. "indoor dog park Inland Empire"
6. "dog daycare Los Angeles"
7. "dog daycare San Francisco"
8. "dog daycare San Diego"

**Total:** 19 different search queries = comprehensive coverage!

---

## Data You'll Get

Each park includes:

### Basic Info
- ✅ ID (unique)
- ✅ Name
- ✅ Type (Indoor Dog Park, Dog Park, Dog-Friendly Establishment)
- ✅ Address & coordinates (lat/long for mapping)
- ✅ Rating (0-5 stars)
- ✅ Review count

### Pricing (NEW!)
- ✅ isFree (yes/no)
- ✅ pricingType (hourly, daily, monthly, membership, etc.)
- ✅ Specific rates (hourlyRate, dailyRate, monthlyRate)
- ✅ pricingDetails (human readable)
- ✅ pricingSource (website, google_places, manual, unknown)

### Media
- ✅ Up to 10 photos per park
- ✅ Photo metadata (caption, source)

### Contact
- ✅ Phone
- ✅ Website
- ✅ Email
- ✅ Social media (Facebook, Instagram, Twitter, TikTok, YouTube)

### Amenities (17 types)
- ✅ Parking, water fountains, shade, seating
- ✅ Small dog area, large dog area
- ✅ Agility course, swimming, wash station
- ✅ Restrooms, handicap access, lighting
- ✅ Fencing, grooming, daycare, training, socializing

### Quality Info
- ✅ Data quality (verified, partial, unverified)
- ✅ Last updated timestamp
- ✅ Website verified flag

---

## Example Output Structure

```json
{
  "id": "ChIJHeDWr3m7woARFGm1aYRsjuQ",
  "name": "Glen Alla Dog Park",
  "businessType": "Indoor Dog Park",
  "description": "Premier climate-controlled dog park...",
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
  "email": "info@parks.la.gov",
  "rating": 4.5,
  "reviewCount": 170,
  "pricing": {
    "isFree": false,
    "pricingType": "hourly",
    "hourlyRate": 25.00,
    "dailyRate": 60.00,
    "monthlyRate": 350.00,
    "pricingDetails": "First hour free for members...",
    "pricingSource": "website"
  },
  "photos": [
    {
      "url": "https://places.googleapis.com/v1/...",
      "type": "photo",
      "caption": "Photo 1",
      "source": "google_places"
    }
  ],
  "amenities": {
    "parking": true,
    "waterFountains": true,
    "shade": true,
    "smallDogArea": true,
    "largeDogArea": true,
    "dogWashStation": true,
    "restrooms": true,
    "handicapAccess": true
  },
  "dataQuality": "verified",
  "lastUpdated": "2024-11-05T10:00:00Z"
}
```

---

## Verification & Stats

After running, verify your data:

```bash
python3 << 'EOF'
import json

data = json.load(open('public/data/standardized_dog_parks.json'))

print(f"Total parks: {len(data)}")
print(f"Parks with pricing: {len([p for p in data if p.get('pricing')])}")
print(f"Parks with photos: {len([p for p in data if p.get('photos')])}")
print(f"Average rating: {sum(p.get('rating', 0) for p in data) / len(data):.1f}")

# Cities
cities = set(p.get('city') for p in data)
print(f"Unique cities: {len(cities)}")

# Pricing types
pricing_types = {}
for p in data:
    if p.get('pricing'):
        pt = p['pricing'].get('pricingType', 'unknown')
        pricing_types[pt] = pricing_types.get(pt, 0) + 1

print("\nPricing breakdown:")
for pt, count in sorted(pricing_types.items(), key=lambda x: -x[1]):
    print(f"  {pt}: {count}")
EOF
```

---

## Troubleshooting

### Script Hangs or Slow

**Problem:** Script takes too long
**Solution:** Reduce max-per-query:
```bash
python3 scripts/scrape_all_indoor_parks.py --max-per-query 10
```

### API Rate Limiting (429 errors)

**Problem:** Getting throttled by Google API
**Solution:** Increase delays in script or reduce max-per-query
- Default: 0.05s delay between parks
- Modify this in the script if needed

### Merge Not Finding Files

**Problem:** "File not found" error
**Solution:** Verify file paths exist:
```bash
ls -la public/data/enhanced_indoor_dog_parks.json
ls -la public/data/standardized_dog_parks.json
```

### Empty Results

**Problem:** Script runs but finds 0 parks
**Solution:**
1. Check API key in .env.local
2. Verify you have API quota remaining
3. Try a single manual query:
   ```bash
   python3 scripts/scrape_enhanced_indoor_parks.py --max-results 5
   ```

---

## Performance Notes

### Expected Times
- **Scraping 1000 parks:** 10-20 minutes
- **Merging/deduplicating:** 1-2 seconds
- **Total time:** ~15-25 minutes

### File Sizes
- 1000 parks with 10 images each: ~50-100 MB
- Compressed (gzip): ~10-20 MB

### API Costs
- 1000 parks = 1000 API calls
- Google Places API: $0.03 per call (with free tier limits)
- Estimate: $30 for 1000 parks (or free under quota)

---

## What's Next?

1. **Use in your app:**
   ```typescript
   import parks from './public/data/standardized_dog_parks.json'

   // Display, filter, search, etc.
   ```

2. **Set up regular updates:**
   ```bash
   # Run monthly to refresh pricing & data
   0 0 1 * * /path/to/bulk_scrape.sh
   ```

3. **Add to database:**
   ```bash
   python3 scripts/sync_to_database.py \
     --input public/data/standardized_dog_parks.json \
     --db-url postgres://...
   ```

4. **Deploy to production:**
   - Upload standardized_dog_parks.json to CDN
   - Use in frontend with proper caching
   - Set cache TTL to 30 days (refresh monthly)

---

## Summary

| Step | Command | Time | Output |
|------|---------|------|--------|
| 1. Scrape all parks | `scrape_all_indoor_parks.py` | 10-20 min | enhanced_indoor_dog_parks.json (500+ parks) |
| 2. Merge & deduplicate | `merge_and_deduplicate.py` | 1-2 sec | standardized_dog_parks.json (unique parks) |
| **Total** | **Two commands** | **~15-25 min** | **1000+ parks, NO DUPLICATES** |

**You now have:** 🎉
- ✅ Thousands of indoor dog parks
- ✅ Complete pricing information
- ✅ Multiple images per park
- ✅ Amenities and features
- ✅ Social media & contact info
- ✅ Single deduplicated JSON file
- ✅ Ready to use in production

Happy scraping! 🐕📊

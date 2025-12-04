#!/usr/bin/env python3
"""
Script to fetch and download images for parks without images using Google Places API.
Fetches photos using Place IDs and downloads them locally.
"""

import json
import os
import requests
from pathlib import Path
import sys
from typing import Dict, List, Any

# Configuration
IMAGES_DIR = 'public/images/parks'
DATA_FILE = 'public/data/mixmatch.json'
TIMEOUT = 30
MAX_RETRIES = 3
MAX_IMAGES_PER_PARK = 3

# Google Places API endpoints
PLACES_DETAILS_URL = "https://places.googleapis.com/v1/places/{}"
PLACES_PHOTO_URL = "https://places.googleapis.com/v1/{}/media?maxWidthPx=800&key={}"

# Field mask for place details to get photos
DETAILS_FIELD_MASK = ",".join([
    "id",
    "displayName",
    "photos",
])

def load_api_key(env_path: Path = Path(".env"), env_var: str = "google_place_api") -> str:
    """Load the Google Places API key from a dotenv-style file."""
    # Try environment variable first
    if env_var in os.environ and os.environ[env_var]:
        return os.environ[env_var]
    
    # Try alternative env var names
    for alt_var in ["GOOGLE_PLACE_API", "google_place_api", "GOOGLE_PLACES_API_KEY", "NEXT_PUBLIC_GOOGLE_PLACE_API"]:
        if alt_var in os.environ and os.environ[alt_var]:
            return os.environ[alt_var]
    
    # Try multiple env file paths
    env_files = [Path(".env.local"), env_path, Path(".env"), Path("../.env"), Path("../../.env")]
    
    key = None
    for env_file in env_files:
        if not env_file.exists():
            continue
            
        for raw_line in env_file.read_text(encoding="utf-8").splitlines():
            line = raw_line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" not in line:
                continue
            name, value = line.split("=", 1)
            name = name.strip()
            value = value.strip().strip('"').strip("'")
            
            # Try multiple possible names
            if name.lower() in [env_var.lower(), "google_place_api", "google_places_api_key", "next_public_google_place_api"]:
                key = value
                break
        
        if key:
            break

    if not key:
        raise KeyError(
            f"Google Places API key not found. "
            f"Tried files: {', '.join(str(f) for f in env_files if f.exists())}. "
            f"Tried vars: google_place_api, GOOGLE_PLACE_API, GOOGLE_PLACES_API_KEY, NEXT_PUBLIC_GOOGLE_PLACE_API"
        )

    return key

def get_place_photos(api_key: str, place_id: str) -> List[str]:
    """Fetch photo URLs for a place using its Place ID."""
    try:
        headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": api_key,
            "X-Goog-FieldMask": DETAILS_FIELD_MASK,
        }
        
        details_url = PLACES_DETAILS_URL.format(place_id)
        response = requests.get(details_url, headers=headers, timeout=TIMEOUT)
        
        # Check for API errors
        if response.status_code == 400:
            error_data = response.json() if response.text else {}
            error_msg = error_data.get("error", {}).get("message", "Bad Request")
            print(f"    ⚠ API Error: {error_msg}")
            return []
        
        response.raise_for_status()
        
        place_data = response.json()
        photos = place_data.get("photos", [])
        
        if not photos:
            return []
        
        photo_urls = []
        for photo in photos[:MAX_IMAGES_PER_PARK]:
            photo_name = photo.get("name")
            if photo_name:
                photo_url = PLACES_PHOTO_URL.format(photo_name, api_key)
                photo_urls.append(photo_url)
        
        return photo_urls
    except requests.exceptions.HTTPError as e:
        if hasattr(e.response, 'text'):
            try:
                error_data = e.response.json()
                error_msg = error_data.get("error", {}).get("message", str(e))
            except:
                error_msg = str(e)
        else:
            error_msg = str(e)
        print(f"    ⚠ HTTP Error: {error_msg[:100]}")
        return []
    except Exception as e:
        print(f"    ⚠ Error fetching photos: {str(e)[:100]}")
        return []

def download_image(url: str, filepath: str, retries: int = MAX_RETRIES) -> bool:
    """Download an image from URL and save it locally."""
    # Skip if already downloaded
    if os.path.exists(filepath):
        return True

    for attempt in range(retries):
        try:
            response = requests.get(url, timeout=TIMEOUT, stream=True)
            response.raise_for_status()

            # Create directory if needed
            os.makedirs(os.path.dirname(filepath), exist_ok=True)

            # Write the image file
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)

            return True
        except Exception as e:
            if attempt < retries - 1:
                print(f"      ⚠ Retry {attempt + 1}/{retries}")
            else:
                print(f"      ✗ Failed: {str(e)[:60]}")
                return False

    return False

def get_image_filepath(park_city: str, park_slug: str, image_index: int = 0) -> str:
    """Generate a filepath for the park image organized by city."""
    # Normalize city name to lowercase with hyphens
    city_folder = park_city.lower().replace(' ', '-').replace("'", "").replace(",", "") if park_city else 'unknown'
    
    # Remove state suffix if present (e.g., "Oakland Park, Florida" -> "oakland-park")
    if ', ' in city_folder:
        city_folder = city_folder.split(', ')[0]
    
    # Primary image: [slug].jpg, secondary: [slug]-2.jpg, etc.
    if image_index == 0:
        filename = f"{park_slug}.jpg"
    else:
        filename = f"{park_slug}-{image_index + 1}.jpg"
    
    return f"{city_folder}/{filename}"

def process_parks_without_images():
    """Load parks, find ones without images, fetch photos, and download them."""
    print("\n" + "="*80)
    print("🖼️  Download Missing Park Images")
    print("="*80)
    
    # Load API key
    try:
        api_key = load_api_key()
        print("✓ API key loaded")
    except Exception as e:
        print(f"❌ Error loading API key: {e}")
        return False
    
    # Load parks data
    print(f"\n📥 Loading parks data from {DATA_FILE}...")
    with open(DATA_FILE, 'r') as f:
        parks = json.load(f)
    
    print(f"✓ Loaded {len(parks)} parks")
    
    # Find parks without images
    parks_without_images = []
    for park in parks:
        has_images = (park.get('photos') and len(park.get('photos', [])) > 0) or park.get('photo')
        if not has_images and park.get('googlePlaceId'):
            parks_without_images.append(park)
    
    if not parks_without_images:
        print("\n✓ All parks already have images!")
        return True
    
    print(f"\n📋 Found {len(parks_without_images)} parks without images")
    print("\n⬇️  Starting image download...\n")
    
    successful_downloads = 0
    failed_downloads = 0
    parks_updated = 0
    
    for idx, park in enumerate(parks_without_images, 1):
        park_name = park.get('name', 'Unknown')
        park_city = park.get('city', 'Unknown')
        park_slug = park.get('slug', '')
        place_id = park.get('googlePlaceId', '')
        
        print(f"[{idx}/{len(parks_without_images)}] 📍 {park_name}")
        print(f"    City: {park_city}, Place ID: {place_id}")
        
        if not place_id:
            print("    ⊘ No Google Place ID, skipping")
            continue
        
        # Fetch photo URLs from Google Places API
        print("    🔍 Fetching photos from Google Places API...")
        photo_urls = get_place_photos(api_key, place_id)
        
        if not photo_urls:
            print("    ⊘ No photos found")
            failed_downloads += 1
            continue
        
        print(f"    ✓ Found {len(photo_urls)} photos")
        
        # Download images
        downloaded_photos = []
        for img_idx, photo_url in enumerate(photo_urls):
            relative_filepath = get_image_filepath(park_city, park_slug, img_idx)
            full_filepath = os.path.join(IMAGES_DIR, relative_filepath)
            
            print(f"    ⬇️  Downloading image {img_idx + 1}/{len(photo_urls)}...", end=" ")
            if download_image(photo_url, full_filepath):
                local_url = f"/images/parks/{relative_filepath}"
                downloaded_photos.append({
                    "url": local_url,
                    "type": "photo",
                    "source": "local",
                    "caption": None
                })
                successful_downloads += 1
                print("✓")
            else:
                failed_downloads += 1
                print("✗")
        
        if downloaded_photos:
            # Update park data with local image paths
            park['photo'] = downloaded_photos[0]['url']
            park['photos'] = downloaded_photos
            parks_updated += 1
            print(f"    ✅ Updated park with {len(downloaded_photos)} images\n")
        else:
            print(f"    ✗ Failed to download any images\n")
    
    # Save updated parks data
    if parks_updated > 0:
        print(f"\n💾 Saving updated parks data to {DATA_FILE}...")
        with open(DATA_FILE, 'w') as f:
            json.dump(parks, f, indent=2)
        print(f"✓ Updated {DATA_FILE}")
    
    print(f"\n" + "="*80)
    print(f"📊 Download Summary:")
    print(f"  ✅ Parks updated:  {parks_updated}")
    print(f"  ✓ Images downloaded:  {successful_downloads}")
    print(f"  ✗ Failed downloads:   {failed_downloads}")
    print(f"  Total parks processed: {len(parks_without_images)}")
    print(f"="*80 + "\n")
    
    return parks_updated > 0

if __name__ == '__main__':
    try:
        ensure_images_directory = lambda: Path(IMAGES_DIR).mkdir(parents=True, exist_ok=True)
        ensure_images_directory()
        
        success = process_parks_without_images()
        
        if success:
            print("✅ Process completed successfully!")
        else:
            print("⚠️  Process completed with some issues")
        
    except KeyboardInterrupt:
        print("\n\n❌ Process interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Fatal error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


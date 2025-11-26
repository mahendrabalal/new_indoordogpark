#!/usr/bin/env python3
"""
Fetch images for mixmatch1.json parks from Google Places API.
Removes existing images and fetches up to 3 images per park.
"""

import json
import requests
import time
from pathlib import Path
from typing import Dict, List, Any, Optional

# Google Places API endpoints
PLACES_DETAILS_URL = "https://places.googleapis.com/v1/places/{}"

# Field mask for place details to get photo references
DETAILS_FIELD_MASK = ",".join([
    "id",
    "displayName",
    "photos",
])

def load_api_key(env_path: Path = Path(".env.local"), env_var: str = "google_place_api") -> str:
    """Load the Google Places API key from a dotenv-style file."""
    import os
    
    # Try environment variable first
    if env_var in os.environ and os.environ[env_var]:
        return os.environ[env_var]
    
    # Try alternative env var names
    for alt_var in ["GOOGLE_PLACE_API", "google_place_api", "GOOGLE_PLACES_API_KEY", "NEXT_PUBLIC_GOOGLE_PLACE_API"]:
        if alt_var in os.environ and os.environ[alt_var]:
            return os.environ[alt_var]
    
    # Try multiple env file paths
    env_files = [Path(".env.local"), Path(".env"), Path("../.env"), Path("../../.env")]
    
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

def get_place_details(api_key: str, place_id: str) -> Optional[Dict[str, Any]]:
    """Fetch place details including photos from Google Places API."""
    try:
        headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": api_key,
            "X-Goog-FieldMask": DETAILS_FIELD_MASK,
        }
        
        details_url = PLACES_DETAILS_URL.format(place_id)
        response = requests.get(details_url, headers=headers, timeout=30)
        response.raise_for_status()
        
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"  Error fetching details for {place_id}: {e}")
        return None
    except Exception as e:
        print(f"  Unexpected error for {place_id}: {e}")
        return None

def get_photo_urls(api_key: str, photos: List[Dict[str, Any]], max_photos: int = 3) -> List[Dict[str, str]]:
    """Convert photo references to downloadable URLs in the format expected by the JSON."""
    if not photos:
        return []
    
    photo_objects = []
    for i, photo in enumerate(photos[:max_photos]):
        photo_name = photo.get("name")
        if not photo_name:
            continue
        
        # Create photo URL using the new Places API format
        photo_url = f"https://places.googleapis.com/v1/{photo_name}/media?maxWidthPx=800&key={api_key}"
        
        photo_objects.append({
            "url": photo_url,
            "type": "photo",
            "source": "google"
        })
    
    return photo_objects

def fetch_images_for_parks(api_key: str, parks: List[Dict[str, Any]]) -> tuple[List[Dict[str, Any]], int]:
    """Fetch images for parks from Google Places API and remove existing images."""
    updated_parks = []
    fetched_count = 0
    
    print(f"\nProcessing {len(parks)} parks...")
    print("=" * 80)
    
    for i, park in enumerate(parks, 1):
        place_id = park.get("googlePlaceId") or park.get("id")
        park_name = park.get("name", "Unknown")
        park_city = park.get("city", "Unknown")
        
        if not place_id:
            print(f"{i}. {park_name} ({park_city}) - SKIPPED: No place_id")
            # Remove existing images
            updated_park = park.copy()
            updated_park["photos"] = []
            updated_park["photo"] = None
            updated_parks.append(updated_park)
            continue
        
        print(f"{i}. {park_name} ({park_city}) - Fetching images...", end=" ")
        
        # Fetch place details
        place_details = get_place_details(api_key, place_id)
        
        if not place_details:
            print("FAILED")
            # Remove existing images
            updated_park = park.copy()
            updated_park["photos"] = []
            updated_park["photo"] = None
            updated_parks.append(updated_park)
            continue
        
        # Get photos
        photos = place_details.get("photos", [])
        
        if not photos:
            print("NO PHOTOS FOUND")
            # Remove existing images
            updated_park = park.copy()
            updated_park["photos"] = []
            updated_park["photo"] = None
            updated_parks.append(updated_park)
            continue
        
        # Get photo URLs from Google Places API (max 3)
        photo_objects = get_photo_urls(api_key, photos, max_photos=3)
        
        if not photo_objects:
            print("NO VALID PHOTOS")
            # Remove existing images
            updated_park = park.copy()
            updated_park["photos"] = []
            updated_park["photo"] = None
            updated_parks.append(updated_park)
            continue
        
        # Update park with new photos (removing old ones)
        updated_park = park.copy()
        updated_park["photos"] = photo_objects
        if photo_objects:
            updated_park["photo"] = photo_objects[0]["url"]  # Set primary photo
        else:
            updated_park["photo"] = None
        updated_parks.append(updated_park)
        fetched_count += 1
        print(f"SUCCESS ({len(photo_objects)} images)")
        
        # Rate limiting - be nice to the API
        time.sleep(0.2)  # 200ms delay between requests
    
    return updated_parks, fetched_count

def main():
    """Main function to fetch images for mixmatch1.json parks."""
    import sys
    import os
    
    # Load API key - try multiple methods
    api_key = None
    
    # Method 1: Command line argument
    if len(sys.argv) > 1:
        api_key = sys.argv[1]
        print(f"✓ Using API key from command line")
    
    # Method 2: Environment variable
    if not api_key:
        for var_name in ["google_place_api", "GOOGLE_PLACE_API", "GOOGLE_PLACES_API_KEY", "NEXT_PUBLIC_GOOGLE_PLACE_API"]:
            if var_name in os.environ and os.environ[var_name]:
                api_key = os.environ[var_name]
                print(f"✓ Using API key from environment variable: {var_name}")
                break
    
    # Method 3: Load from file
    if not api_key:
        try:
            api_key = load_api_key()
            print(f"✓ Loaded Google Places API key from .env.local")
        except Exception as e:
            print(f"⚠️  Could not load API key from file: {e}")
    
    # Method 4: Prompt user
    if not api_key:
        print("\n" + "=" * 80)
        print("Google Places API key is required to fetch images.")
        print("=" * 80)
        print("\nYou can provide it in one of these ways:")
        print("  1. As command line argument: python3 scripts/fetch_mixmatch1_images.py YOUR_API_KEY")
        print("  2. As environment variable: export google_place_api=YOUR_API_KEY")
        print("  3. In .env.local file: google_place_api=YOUR_API_KEY")
        print("\nOr enter it now (it will not be saved):")
        api_key = input("Google Places API Key: ").strip()
        
        if not api_key:
            print("❌ No API key provided. Exiting.")
            return
    
    if not api_key:
        print("❌ Could not determine API key. Please provide it using one of the methods above.")
        return
    
    # Load mixmatch1.json
    input_path = Path('public/data/mixmatch1.json')
    backup_path = Path('public/data/mixmatch1.json.backup')
    
    if not input_path.exists():
        print(f"❌ File not found: {input_path}")
        return
    
    print(f"Loading {input_path}...")
    with open(input_path, 'r', encoding='utf-8') as f:
        parks = json.load(f)
    
    print(f"✓ Loaded {len(parks)} parks")
    
    # Create backup
    if not backup_path.exists():
        print(f"Creating backup: {backup_path}")
        import shutil
        shutil.copy(input_path, backup_path)
        print(f"✓ Backup created")
    
    # Fetch images (this will also remove existing images)
    updated_parks, fetched_count = fetch_images_for_parks(api_key, parks)
    
    # Save updated data
    print(f"\n{'=' * 80}")
    print(f"Saving updated data to {input_path}...")
    with open(input_path, 'w', encoding='utf-8') as f:
        json.dump(updated_parks, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Image fetching complete!")
    print(f"  Total parks: {len(parks)}")
    print(f"  Parks with images fetched: {fetched_count}")
    print(f"  Parks with images after: {len([p for p in updated_parks if p.get('photos')])}")
    print(f"  Backup saved to: {backup_path}")

if __name__ == "__main__":
    main()


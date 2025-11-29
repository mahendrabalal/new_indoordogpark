#!/usr/bin/env python3
"""
Populate missing images in mixmatch1.json using Google Places API.
Fetches photos for parks that are missing the 'photo' field or have empty 'photos' array.
"""

import os
import json
import requests
import time
from pathlib import Path
from typing import Dict, List, Any, Optional

# Google Places API endpoints
PLACES_DETAILS_URL = "https://places.googleapis.com/v1/places/{}"

# Field mask for place details to get photos
DETAILS_FIELD_MASK = ",".join([
    "id",
    "displayName",
    "photos",
])

def load_api_key(env_path: Path = Path(".env.local"), env_var: str = "google_place_api") -> str:
    """Load the Google Places API key from a dotenv-style file."""
    if env_var in os.environ and os.environ[env_var]:
        return os.environ[env_var]

    if not env_path.exists():
        raise FileNotFoundError(f"Cannot find environment file: {env_path}")

    key = None
    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            continue
        name, value = line.split("=", 1)
        if name.strip() == env_var:
            key = value.strip().strip('"').strip("'")
            break

    if not key:
        raise KeyError(f"Environment variable `{env_var}` not found in {env_path}")
    return key

def get_place_details(api_key: str, place_id: str) -> Optional[Dict[str, Any]]:
    """Fetch place details including photos from Google Places API."""
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": api_key,
        "X-Goog-FieldMask": DETAILS_FIELD_MASK,
    }
    
    details_url = PLACES_DETAILS_URL.format(place_id)
    
    try:
        response = requests.get(details_url, headers=headers, timeout=30)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"  ⚠ Error fetching details for {place_id}: {e}")
        return None

def get_photo_urls(api_key: str, photos: List[Dict[str, Any]], max_photos: int = 5) -> List[Dict[str, str]]:
    """Convert photo references to actual URLs in the format expected by mixmatch1.json."""
    if not photos:
        return []
    
    photo_objects = []
    for photo in photos[:max_photos]:
        photo_name = photo.get("name")
        if not photo_name:
            continue
            
        # Create photo URL
        photo_url = f"https://places.googleapis.com/v1/{photo_name}/media?maxWidthPx=800&key={api_key}"
        photo_objects.append({
            "url": photo_url,
            "type": "photo",
            "source": "google"
        })
    
    return photo_objects

def needs_images(park: Dict[str, Any]) -> bool:
    """Check if a park needs images populated."""
    photos = park.get("photos", [])
    photo = park.get("photo", "")
    
    # Need images if:
    # 1. photos array is empty or missing
    # 2. photo field is empty or missing
    # 3. Using old Google image format (lh3.googleusercontent.com) instead of Places API format
    has_old_format = False
    if photo and "lh3.googleusercontent.com" in photo:
        has_old_format = True
    for p in photos:
        if "lh3.googleusercontent.com" in p.get("url", ""):
            has_old_format = True
    
    return (not photos or len(photos) == 0) or not photo or photo == "" or has_old_format

def populate_images_for_park(api_key: str, park: Dict[str, Any]) -> Dict[str, Any]:
    """Fetch and populate images for a single park."""
    place_id = park.get("googlePlaceId") or park.get("id")
    park_name = park.get("name", "Unknown")
    
    if not place_id:
        print(f"  ⚠ Skipping {park_name}: No place_id found")
        return park
    
    print(f"  Fetching images for: {park_name} ({place_id})")
    
    # Fetch place details
    place_details = get_place_details(api_key, place_id)
    if not place_details:
        return park
    
    # Get photos from the API response
    photos_data = place_details.get("photos", [])
    if not photos_data:
        print(f"    No photos found in API response")
        return park
    
    # Convert to photo URLs
    photo_objects = get_photo_urls(api_key, photos_data, max_photos=5)
    
    if photo_objects:
        # Update the park with new photos
        park["photos"] = photo_objects
        # Set primary photo field to first photo URL
        park["photo"] = photo_objects[0]["url"]
        print(f"    ✓ Added {len(photo_objects)} photos")
    else:
        print(f"    ⚠ No valid photo URLs generated")
    
    return park

def main():
    """Main function to populate missing images."""
    input_file = Path("public/data/mixmatch1.json")
    output_file = Path("public/data/mixmatch1.json")
    
    # Load API key
    try:
        api_key = load_api_key()
        print(f"✓ Loaded API key from .env.local")
    except Exception as e:
        print(f"❌ Error loading API key: {e}")
        return
    
    # Load parks data
    print(f"\n📄 Loading {input_file}...")
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            parks = json.load(f)
        print(f"✓ Loaded {len(parks)} parks")
    except Exception as e:
        print(f"❌ Error loading parks file: {e}")
        return
    
    # Find parks that need images
    parks_needing_images = []
    for i, park in enumerate(parks):
        if needs_images(park):
            parks_needing_images.append((i, park))
    
    if not parks_needing_images:
        print(f"\n✓ All parks already have images!")
        return
    
    print(f"\n🖼️  Found {len(parks_needing_images)} parks needing images")
    
    # Populate images for each park
    updated_count = 0
    for idx, park in parks_needing_images:
        parks[idx] = populate_images_for_park(api_key, park)
        updated_count += 1
        
        # Rate limiting - wait 0.1 seconds between requests
        if idx < len(parks_needing_images) - 1:
            time.sleep(0.1)
    
    # Save updated parks data
    print(f"\n💾 Saving updated data to {output_file}...")
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(parks, f, indent=2, ensure_ascii=False)
        print(f"✓ Successfully updated {updated_count} parks with images")
        print(f"✓ File saved to {output_file}")
    except Exception as e:
        print(f"❌ Error saving file: {e}")
        return
    
    # Summary
    print(f"\n📊 Summary:")
    print(f"  - Total parks: {len(parks)}")
    print(f"  - Parks needing images: {len(parks_needing_images)}")
    print(f"  - Parks updated: {updated_count}")

if __name__ == "__main__":
    main()


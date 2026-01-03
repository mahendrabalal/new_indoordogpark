#!/usr/bin/env python3
"""
Fetch images for remaining parks using text search to find correct Place IDs.
"""

import os
import json
import time
import urllib.request
import urllib.error
import urllib.parse
import ssl
from pathlib import Path
from typing import Dict, List, Any, Optional

PLACES_TEXT_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText"
PLACES_DETAILS_URL = "https://places.googleapis.com/v1/places/{}"

DETAILS_FIELD_MASK = ",".join([
    "id",
    "displayName",
    "photos",
])

def load_api_key() -> Optional[str]:
    """Load API key from .env.local."""
    env_files = [Path(".env.local"), Path(".env")]
    
    for env_file in env_files:
        if env_file.exists():
            with open(env_file, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        key, value = line.split('=', 1)
                        key = key.strip()
                        value = value.strip().strip('"').strip("'")
                        if key in ["GOOGLE_PLACES_API_KEY", "google_place_api", "GOOGLE_PLACE_API"]:
                            return value
    
    return os.getenv("GOOGLE_PLACES_API_KEY") or os.getenv("google_place_api")

def search_place(api_key: str, query: str, location: str = "") -> Optional[Dict[str, Any]]:
    """Search for a place using text search."""
    try:
        search_query = query
        if location:
            search_query = f"{query} {location}"
        
        payload = {
            "textQuery": search_query,
            "maxResultCount": 3,
            "languageCode": "en",
            "regionCode": "US"
        }
        
        data = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(PLACES_TEXT_SEARCH_URL, data=data)
        req.add_header("Content-Type", "application/json")
        req.add_header("X-Goog-Api-Key", api_key)
        req.add_header("X-Goog-FieldMask", "places.id,places.displayName,places.formattedAddress,places.photos")
        
        ssl_context = ssl.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE
        
        with urllib.request.urlopen(req, timeout=30, context=ssl_context) as response:
            result = json.loads(response.read().decode())
            places = result.get("places", [])
            if places:
                return places[0]  # Return first result
        return None
    except urllib.error.HTTPError as e:
        error_body = e.read().decode() if hasattr(e, 'read') else str(e)
        print(f"  HTTP Error {e.code}: {error_body[:300]}")
        return None
    except Exception as e:
        print(f"  Error: {e}")
        return None

def get_place_details(api_key: str, place_id: str) -> Optional[Dict[str, Any]]:
    """Fetch place details including photos."""
    try:
        url = PLACES_DETAILS_URL.format(place_id)
        req = urllib.request.Request(url)
        req.add_header("Content-Type", "application/json")
        req.add_header("X-Goog-Api-Key", api_key)
        req.add_header("X-Goog-FieldMask", DETAILS_FIELD_MASK)
        
        ssl_context = ssl.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE
        
        with urllib.request.urlopen(req, timeout=30, context=ssl_context) as response:
            return json.loads(response.read().decode())
    except Exception as e:
        print(f"  Error: {e}")
        return None

def get_photo_urls(api_key: str, photos: List[Dict[str, Any]], max_photos: int = 5) -> List[Dict[str, Any]]:
    """Convert photo references to URLs."""
    if not photos:
        return []
    
    photo_objects = []
    for i, photo in enumerate(photos[:max_photos]):
        photo_name = photo.get("name")
        if not photo_name:
            continue
        
        photo_url = f"https://places.googleapis.com/v1/{photo_name}/media?maxWidthPx=800&key={api_key}"
        photo_objects.append({
            "url": photo_url,
            "type": "photo",
            "source": "google_places",
            "caption": f"Photo {i + 1}"
        })
    
    return photo_objects

def main():
    """Main function."""
    mixmatch_path = Path("public/data/mixmatch.json")
    
    api_key = load_api_key()
    if not api_key:
        print("Error: API key not found!")
        return
    
    print("Loading mixmatch.json...")
    with open(mixmatch_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Find parks without images
    parks_without = []
    for park in data:
        has_photos = bool(park.get('photos') or park.get('photo'))
        if not has_photos:
            parks_without.append(park)
    
    print(f"\nFound {len(parks_without)} parks without images")
    
    if not parks_without:
        print("All parks have images!")
        return
    
    updated_count = 0
    
    print(f"\nSearching for places and fetching images...")
    for i, park in enumerate(parks_without, 1):
        park_name = park.get('name', 'Unknown')
        city = park.get('city', '')
        state = park.get('state', '')
        location = f"{city} {state}".strip()
        
        print(f"\n[{i}/{len(parks_without)}] {park_name} ({location})")
        
        # Search for the place
        place_result = search_place(api_key, park_name, location)
        
        if not place_result:
            print(f"  ✗ Place not found")
            continue
        
        place_id = place_result.get('id')
        found_name = place_result.get('displayName', {}).get('text', 'Unknown')
        
        print(f"  Found: {found_name} (ID: {place_id})")
        
        # Get detailed info with photos
        place_details = get_place_details(api_key, place_id)
        
        if not place_details:
            print(f"  ✗ Failed to get details")
            continue
        
        photos = place_details.get("photos", [])
        if not photos:
            print(f"  ✗ No photos available")
            continue
        
        # Convert to photo URLs
        photo_objects = get_photo_urls(api_key, photos)
        
        if not photo_objects:
            print(f"  ✗ Failed to generate photo URLs")
            continue
        
        print(f"  ✓ Found {len(photo_objects)} photos")
        
        # Update park
        park_index = data.index(park)
        data[park_index]['photos'] = photo_objects
        data[park_index]['photo'] = photo_objects[0]['url'] if photo_objects else None
        data[park_index]['id'] = place_id
        data[park_index]['googlePlaceId'] = place_id
        
        updated_count += 1
        time.sleep(0.5)  # Rate limiting
    
    # Save
    print(f"\nSaving updated data...")
    with open(mixmatch_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"\n✓ Complete!")
    print(f"  - Parks updated: {updated_count}")
    print(f"  - Total parks with images: {sum(1 for p in data if p.get('photos') or p.get('photo'))}/{len(data)}")

if __name__ == "__main__":
    main()












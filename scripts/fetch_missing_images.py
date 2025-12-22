#!/usr/bin/env python3
"""
Fetch missing images for parks in mixmatch.json using Google Places API.
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

# Google Places API endpoints
PLACES_DETAILS_URL = "https://places.googleapis.com/v1/places/{}"
PLACES_TEXT_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText"

# Field mask for place details to get photos
DETAILS_FIELD_MASK = ",".join([
    "id",
    "displayName",
    "photos",
])

def load_api_key(env_path: Path = Path(".env"), env_var: str = "google_place_api") -> Optional[str]:
    """Load API key from environment variable or .env file."""
    # Try multiple environment variable names
    api_key = (os.getenv("GOOGLE_PLACES_API_KEY") or 
               os.getenv("google_place_api") or 
               os.getenv("GOOGLE_PLACE_API"))
    
    if api_key:
        return api_key
    
    # Try .env.local first, then .env
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
                        if key in [env_var, "GOOGLE_PLACES_API_KEY", "google_place_api", "GOOGLE_PLACE_API"]:
                            return value
    
    return None

def search_place_by_name(api_key: str, name: str, address: str = "") -> Optional[Dict[str, Any]]:
    """Search for a place by name and address using text search."""
    try:
        query = name
        if address:
            query = f"{name} {address}"
        
        payload = {
            "textQuery": query,
            "maxResultCount": 1,
            "languageCode": "en",
            "regionCode": "US"
        }
        
        data = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(PLACES_TEXT_SEARCH_URL, data=data)
        req.add_header("Content-Type", "application/json")
        req.add_header("X-Goog-Api-Key", api_key)
        req.add_header("X-Goog-FieldMask", DETAILS_FIELD_MASK)
        
        ssl_context = ssl.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE
        
        with urllib.request.urlopen(req, timeout=30, context=ssl_context) as response:
            result = json.loads(response.read().decode())
            places = result.get("places", [])
            if places:
                return places[0]
        return None
    except Exception as e:
        print(f"  Error searching for {name}: {e}")
        return None

def get_place_details(api_key: str, place_id: str) -> Optional[Dict[str, Any]]:
    """Fetch place details including photos from Google Places API."""
    try:
        details_url = PLACES_DETAILS_URL.format(place_id)
        
        req = urllib.request.Request(details_url)
        req.add_header("Content-Type", "application/json")
        req.add_header("X-Goog-Api-Key", api_key)
        req.add_header("X-Goog-FieldMask", DETAILS_FIELD_MASK)
        
        # Create SSL context that doesn't verify certificates (for development)
        ssl_context = ssl.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE
        
        with urllib.request.urlopen(req, timeout=30, context=ssl_context) as response:
            data = json.loads(response.read().decode())
            return data
    except urllib.error.HTTPError as e:
        error_body = e.read().decode() if hasattr(e, 'read') else str(e)
        # If Place ID is invalid, return None to try text search instead
        if "not valid" in error_body or "INVALID_ARGUMENT" in error_body:
            return None
        print(f"  HTTP Error {e.code}: {error_body[:200]}")
        return None
    except Exception as e:
        print(f"  Error fetching details for {place_id}: {e}")
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
        
        # Create photo URL using the new Places API format
        photo_url = f"https://places.googleapis.com/v1/{photo_name}/media?maxWidthPx=800&key={api_key}"
        
        photo_objects.append({
            "url": photo_url,
            "type": "photo",
            "source": "google_places",
            "caption": f"Photo {i + 1}"
        })
    
    return photo_objects

def find_parks_without_images(data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Find parks that don't have images."""
    parks_without_images = []
    
    for park in data:
        has_photos = False
        
        # Check photos array
        if park.get('photos') and isinstance(park.get('photos'), list) and len(park.get('photos', [])) > 0:
            has_photos = True
        
        # Check photo field (legacy)
        if park.get('photo'):
            has_photos = True
        
        if not has_photos:
            parks_without_images.append(park)
    
    return parks_without_images

def update_park_with_images(park: Dict[str, Any], photo_objects: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Update park entry with fetched images."""
    updated_park = park.copy()
    
    if photo_objects:
        updated_park["photos"] = photo_objects
        # Also set legacy photo field
        updated_park["photo"] = photo_objects[0]["url"]
    
    return updated_park

def main():
    """Main function to fetch missing images."""
    mixmatch_path = Path("public/data/mixmatch.json")
    backup_path = Path("public/data/mixmatch.json.backup")
    
    # Load API key
    api_key = load_api_key()
    if not api_key:
        print("Error: Google Places API key not found!")
        print("Please set GOOGLE_PLACES_API_KEY environment variable or add it to .env file")
        return
    
    print("Loading mixmatch.json...")
    with open(mixmatch_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Find parks without images
    parks_without_images = find_parks_without_images(data)
    
    print(f"\nFound {len(parks_without_images)} parks without images:")
    for park in parks_without_images:
        print(f"  - {park.get('name', 'Unknown')} (ID: {park.get('id', 'N/A')}, Place ID: {park.get('googlePlaceId', 'N/A')})")
    
    if not parks_without_images:
        print("\nAll parks already have images!")
        return
    
    # Create backup
    if not backup_path.exists():
        print(f"\nCreating backup at {backup_path}...")
        with open(backup_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    
    # Fetch images for each park
    updated_count = 0
    failed_count = 0
    
    print(f"\nFetching images from Google Places API...")
    for i, park in enumerate(parks_without_images, 1):
        park_name = park.get('name', 'Unknown')
        place_id = park.get('googlePlaceId') or park.get('id')
        
        # Skip if no valid place ID
        if not place_id or place_id.startswith('mixmatch_'):
            print(f"\n[{i}/{len(parks_without_images)}] {park_name}: No valid Google Place ID")
            failed_count += 1
            continue
        
        print(f"\n[{i}/{len(parks_without_images)}] {park_name} (Place ID: {place_id})")
        
        # Try to fetch place details by Place ID first
        place_details = get_place_details(api_key, place_id)
        
        # If Place ID is invalid, try searching by name and address
        if not place_details:
            print(f"  Place ID invalid, trying text search...")
            search_name = park.get('name', '')
            search_address = f"{park.get('city', '')} {park.get('state', '')}".strip()
            place_details = search_place_by_name(api_key, search_name, search_address)
            
            if place_details:
                # Update the park with the correct Place ID
                new_place_id = place_details.get('id')
                if new_place_id:
                    print(f"  Found place with ID: {new_place_id}")
                    data[park_index]['id'] = new_place_id
                    data[park_index]['googlePlaceId'] = new_place_id
        
        if not place_details:
            print(f"  ✗ Failed to fetch details")
            failed_count += 1
            continue
        
        # Get photos
        photos = place_details.get("photos", [])
        if not photos:
            print(f"  ✗ No photos available")
            failed_count += 1
            continue
        
        # Convert to photo URLs
        photo_objects = get_photo_urls(api_key, photos)
        
        if not photo_objects:
            print(f"  ✗ Failed to generate photo URLs")
            failed_count += 1
            continue
        
        print(f"  ✓ Found {len(photo_objects)} photos")
        
        # Update park in data
        park_index = data.index(park)
        data[park_index] = update_park_with_images(park, photo_objects)
        updated_count += 1
        
        # Rate limiting - be nice to the API
        time.sleep(0.5)
    
    # Save updated data
    print(f"\nSaving updated data to {mixmatch_path}...")
    with open(mixmatch_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"\n✓ Complete!")
    print(f"  - Parks updated with images: {updated_count}")
    print(f"  - Parks failed: {failed_count}")
    print(f"  - Total parks now with images: {sum(1 for p in data if p.get('photos') or p.get('photo'))}/{len(data)}")

if __name__ == "__main__":
    main()


#!/usr/bin/env python3
"""
Fetch images for Colorado parks from Google Places API and update mixmatch.json.
"""

import os
import json
import requests
import time
from pathlib import Path
from typing import Dict, List, Any, Optional

# Google Places API endpoints
PLACES_TEXT_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText"
PLACES_DETAILS_URL = "https://places.googleapis.com/v1/places/{}"

# Field mask for place details to get photos
DETAILS_FIELD_MASK = ",".join([
    "id",
    "displayName",
    "photos",
])

# Field mask for text search
SEARCH_FIELD_MASK = ",".join([
    "places.id",
    "places.displayName",
    "places.location",
    "places.photos",
])

# Colorado parks to search for
COLORADO_PARKS = [
    {
        "name": "Skiptown",
        "city": "Denver",
        "address": "3833 Steele Street, Suite 1332, Denver, CO 80205",
        "query": "Skiptown Denver 3833 Steele Street"
    },
    {
        "name": "PubDog Colorado",
        "city": "Colorado Springs",
        "address": "2207 Bott Ave, Colorado Springs, CO 80904",
        "query": "PubDog Colorado Springs 2207 Bott Ave"
    }
]

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

def search_place(api_key: str, query: str) -> Optional[Dict[str, Any]]:
    """Search for a place by query string."""
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": api_key,
        "X-Goog-FieldMask": SEARCH_FIELD_MASK,
    }
    
    payload = {
        "textQuery": query,
        "maxResultCount": 5,
        "languageCode": "en",
        "regionCode": "US",
    }
    
    try:
        response = requests.post(PLACES_TEXT_SEARCH_URL, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        places = response.json().get("places", [])
        if places:
            return places[0]  # Return first result
        return None
    except requests.exceptions.RequestException as e:
        print(f"  ⚠ Error searching for '{query}': {e}")
        return None

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
    """Convert photo references to actual URLs in the format expected by mixmatch.json."""
    if not photos:
        return []
    
    photo_objects = []
    for photo in photos[:max_photos]:
        photo_name = photo.get("name")
        if not photo_name:
            continue
            
        # Create photo URL using Google Places API
        photo_url = f"https://places.googleapis.com/v1/{photo_name}/media?maxWidthPx=800&key={api_key}"
        photo_objects.append({
            "url": photo_url,
            "type": "photo",
            "source": "google_places",
            "caption": None
        })
    
    return photo_objects

def update_park_images(api_key: str, parks: List[Dict[str, Any]]) -> tuple[List[Dict[str, Any]], int]:
    """Update images for Colorado parks in the parks list."""
    updated_count = 0
    
    # Create a map of park names to park objects for quick lookup
    park_map = {}
    for park in parks:
        park_name = park.get("name", "").lower()
        park_city = park.get("city", "").lower()
        key = f"{park_name}|{park_city}"
        park_map[key] = park
    
    for park_info in COLORADO_PARKS:
        park_name = park_info["name"]
        park_city = park_info["city"]
        query = park_info["query"]
        
        print(f"\n📸 Processing: {park_name} in {park_city}")
        
        # Find the park in our data
        key = f"{park_name.lower()}|{park_city.lower()}"
        park = park_map.get(key)
        
        if not park:
            print(f"  ⚠️  Park not found in mixmatch.json")
            continue
        
        # Check if already has photos
        current_photos = park.get("photos", [])
        if current_photos and len(current_photos) > 0:
            print(f"  ℹ️  Already has {len(current_photos)} photos, updating with fresh data...")
        
        # Search for the place to get the actual Google Place ID
        print(f"  🔍 Searching for: {query}")
        search_result = search_place(api_key, query)
        if not search_result:
            print(f"  ❌ Failed to find place in Google Places API")
            continue
        
        google_place_id = search_result.get("id")
        if not google_place_id:
            print(f"  ❌ No place ID found in search results")
            continue
        
        print(f"  ✓ Found place ID: {google_place_id}")
        
        # Fetch place details with photos
        place_details = get_place_details(api_key, google_place_id)
        if not place_details:
            print(f"  ❌ Failed to fetch place details")
            continue
        
        # Get photos from the API response
        photos_data = place_details.get("photos", [])
        if not photos_data:
            print(f"  ⚠️  No photos found in API response")
            continue
        
        print(f"  ✓ Found {len(photos_data)} photos in API")
        
        # Convert to photo URLs
        photo_objects = get_photo_urls(api_key, photos_data, max_photos=5)
        
        if photo_objects:
            # Update the park with new photos
            park["photos"] = photo_objects
            # Set primary photo field to first photo URL
            park["photo"] = photo_objects[0]["url"]
            print(f"  ✓ Added {len(photo_objects)} photos")
            updated_count += 1
        else:
            print(f"  ⚠️  No valid photo URLs generated")
        
        # Rate limiting
        time.sleep(0.3)
    
    return parks, updated_count

def main():
    """Main function to fetch and update images for Colorado parks."""
    input_file = Path("public/data/mixmatch.json")
    
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
    
    # Update images for Colorado parks
    print(f"\n🖼️  Fetching images for Colorado parks...")
    updated_parks, updated_count = update_park_images(api_key, parks)
    
    if updated_count == 0:
        print(f"\n⚠️  No parks were updated")
        return
    
    # Save updated parks data
    print(f"\n💾 Saving updated data to {input_file}...")
    try:
        with open(input_file, 'w', encoding='utf-8') as f:
            json.dump(updated_parks, f, indent=2, ensure_ascii=False)
        print(f"✓ Successfully updated {updated_count} park(s) with images")
        print(f"✓ File saved to {input_file}")
    except Exception as e:
        print(f"❌ Error saving file: {e}")
        return
    
    # Summary
    print(f"\n📊 Summary:")
    print(f"  - Total parks in file: {len(parks)}")
    print(f"  - Colorado parks processed: {len(COLORADO_PARKS)}")
    print(f"  - Parks updated: {updated_count}")

if __name__ == "__main__":
    main()

























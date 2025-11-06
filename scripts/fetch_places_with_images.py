#!/usr/bin/env python3
"""
Enhanced script to fetch dog park data from Google Places API including images.
"""

import os
import json
import requests
from pathlib import Path
from typing import Dict, List, Any

# Google Places API endpoints
PLACES_TEXT_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText"
PLACES_DETAILS_URL = "https://places.googleapis.com/v1/places/{}"

# Enhanced field mask to include photos
DEFAULT_FIELD_MASK = ",".join([
    "places.id",
    "places.displayName", 
    "places.formattedAddress",
    "places.location",
    "places.websiteUri",
    "places.nationalPhoneNumber",
    "places.types",
    "places.rating",
    "places.userRatingCount",
    "places.photos",
])

# Field mask for place details to get photo references
DETAILS_FIELD_MASK = ",".join([
    "id",
    "displayName",
    "formattedAddress", 
    "location",
    "websiteUri",
    "nationalPhoneNumber",
    "types",
    "rating",
    "userRatingCount",
    "photos",
])

CALIFORNIA_LOCATION_RESTRICTION = {
    "rectangle": {
        "low": {"latitude": 32.528832, "longitude": -124.482003},
        "high": {"latitude": 42.009516, "longitude": -114.131211},
    }
}

def load_api_key(env_path: Path = Path(".env"), env_var: str = "google_place_api") -> str:
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

def search_places_with_images(api_key: str, query: str, max_results: int = 10) -> List[Dict[str, Any]]:
    """Search for places and fetch detailed information including photos."""
    
    # Initial search
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": api_key,
        "X-Goog-FieldMask": DEFAULT_FIELD_MASK,
    }
    
    payload = {
        "textQuery": query,
        "maxResultCount": max_results,
        "languageCode": "en",
        "regionCode": "US",
        "locationRestriction": CALIFORNIA_LOCATION_RESTRICTION,
    }
    
    response = requests.post(PLACES_TEXT_SEARCH_URL, headers=headers, json=payload, timeout=30)
    response.raise_for_status()
    
    places = response.json().get("places", [])
    
    # Fetch detailed information for each place including photos
    detailed_places = []
    for place in places:
        place_id = place.get("id")
        if not place_id:
            continue
            
        # Get place details with photos
        details_headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": api_key,
            "X-Goog-FieldMask": DETAILS_FIELD_MASK,
        }
        
        details_url = PLACES_DETAILS_URL.format(place_id)
        details_response = requests.get(details_url, headers=details_headers, timeout=30)
        details_response.raise_for_status()
        
        detailed_place = details_response.json()
        detailed_places.append(detailed_place)
    
    return detailed_places

def get_photo_urls(api_key: str, photos: List[Dict[str, Any]], max_photos: int = 3) -> List[str]:
    """Convert photo references to actual URLs."""
    if not photos:
        return []
    
    photo_urls = []
    for i, photo in enumerate(photos[:max_photos]):
        photo_name = photo.get("name")
        if not photo_name:
            continue
            
        # Create photo URL
        photo_url = f"https://places.googleapis.com/v1/{photo_name}/media?maxWidthPx=800&key={api_key}"
        photo_urls.append(photo_url)
    
    return photo_urls

def process_places_with_images(api_key: str, places: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Process places and add image URLs."""
    processed_places = []
    
    for place in places:
        # Get photo URLs
        photos = place.get("photos", [])
        image_urls = get_photo_urls(api_key, photos)
        
        # Create processed place with image URLs
        processed_place = place.copy()
        processed_place["imageUrls"] = image_urls
        processed_places.append(processed_place)
    
    return processed_places

def main():
    """Main function to fetch places with images."""
    try:
        api_key = load_api_key()
    except Exception as e:
        print(f"Error loading API key: {e}")
        return
    
    try:
        # Search for dog parks
        places = search_places_with_images(
            api_key=api_key,
            query="dog park in California",
            max_results=10
        )
        
        # Process places to add image URLs
        processed_places = process_places_with_images(api_key, places)
        
        # Save to file
        output_path = Path("data/google_places_dog_parks_with_images.json")
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(processed_places, f, indent=2, ensure_ascii=False)
        
        print(f"Fetched {len(processed_places)} places with images")
        print(f"Saved to: {output_path}")
        
        # Print summary
        for i, place in enumerate(processed_places[:3], 1):  # Show first 3
            name = place.get("displayName", {}).get("text", "Unknown")
            images = place.get("imageUrls", [])
            print(f"\n{i}. {name}")
            print(f"   Images: {len(images)}")
            for j, img_url in enumerate(images[:2], 1):  # Show first 2 images
                print(f"     {j}. {img_url}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
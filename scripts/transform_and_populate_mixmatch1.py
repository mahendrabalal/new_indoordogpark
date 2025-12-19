#!/usr/bin/env python3
"""
Transform mixmatch1.json to standardized format matching mixmatch.json
and populate images from Google Places API.
"""

import json
import os
import re
import requests
import time
from pathlib import Path
from typing import Any, Dict, List, Optional

# Google Places API endpoints
PLACES_DETAILS_URL = "https://places.googleapis.com/v1/places/{}"
PLACES_TEXT_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText"

# Field mask for place details to get photos
DETAILS_FIELD_MASK = ",".join([
    "id",
    "displayName",
    "photos",
])

# Field mask for text search
TEXT_SEARCH_FIELD_MASK = ",".join([
    "places.id",
    "places.displayName",
    "places.photos",
])


def load_api_key(env_path: Path = Path(".env.local"), env_var: str = "google_place_api") -> str:
    """Load the Google Places API key from a dotenv-style file."""
    if env_var in os.environ and os.environ[env_var]:
        return os.environ[env_var]

    # Try alternative variable names
    for alt_var in ["GOOGLE_PLACE_API", "google_place_api", "GOOGLE_PLACES_API_KEY", "NEXT_PUBLIC_GOOGLE_PLACE_API"]:
        if alt_var in os.environ and os.environ[alt_var]:
            return os.environ[alt_var]

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
        name = name.strip()
        value = value.strip().strip('"').strip("'")
        
        # Check multiple possible variable names
        if name.lower() in [env_var.lower(), "google_place_api", "google_places_api_key", "next_public_google_place_api"]:
            key = value
            break

    if not key:
        raise KeyError(
            f"Environment variable `{env_var}` not found in {env_path}. "
            f"Tried vars: google_place_api, GOOGLE_PLACE_API, GOOGLE_PLACES_API_KEY, NEXT_PUBLIC_GOOGLE_PLACE_API"
        )
    return key


def convert_state_name_to_abbr(state_name: str) -> str:
    """Convert full state name to abbreviation."""
    state_mapping = {
        "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR",
        "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE",
        "Florida": "FL", "Georgia": "GA", "Hawaii": "HI", "Idaho": "ID",
        "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS",
        "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
        "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS",
        "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV",
        "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY",
        "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK",
        "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
        "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT",
        "Vermont": "VT", "Virginia": "VA", "Washington": "WA", "West Virginia": "WV",
        "Wisconsin": "WI", "Wyoming": "WY"
    }
    return state_mapping.get(state_name, state_name[:2].upper() if len(state_name) >= 2 else state_name)


def generate_slug(name: str) -> str:
    """Generate URL-friendly slug from name."""
    slug = name.lower()
    # Remove special characters except hyphens and spaces
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    # Replace multiple spaces/hyphens with single hyphen
    slug = re.sub(r'[\s-]+', '-', slug)
    # Remove leading/trailing hyphens
    slug = slug.strip('-')
    return slug


def determine_business_type(category: str, type_field: str, subtypes: str, name: str) -> str:
    """Determine business type based on category, type, subtypes, and name."""
    name_lower = name.lower()
    category_lower = (category or "").lower()
    type_lower = (type_field or "").lower()
    subtypes_lower = (subtypes or "").lower()
    
    # Check for indoor facilities first
    if any(keyword in name_lower for keyword in ["indoor", "waterland", "doggieland", "playland"]):
        return "Indoor Dog Park"
    if "indoor" in subtypes_lower or "indoor" in category_lower:
        return "Indoor Dog Park"
    
    # Check for dog parks
    if "dog park" in category_lower or "dog park" in type_lower or "dog park" in subtypes_lower:
        return "Dog Park"
    
    # Check for dog-friendly establishments
    if any(keyword in category_lower for keyword in ["cafe", "bar", "restaurant", "food", "store", "shop"]):
        return "Dog-Friendly Establishment"
    if any(keyword in type_lower for keyword in ["cafe", "bar", "restaurant", "food", "store", "shop"]):
        return "Dog-Friendly Establishment"
    
    # Check for daycare, boarding, grooming
    if any(keyword in category_lower for keyword in ["day care", "daycare", "boarding", "groomer"]):
        return "Dog-Friendly Establishment"
    
    # Default to dog park
    return "Dog Park"


def convert_working_hours(working_hours: Dict[str, str]) -> Dict[str, str]:
    """Convert working_hours format to openingHours format."""
    if not working_hours:
        return {}
    return working_hours


def extract_amenities(about: Dict[str, Any]) -> Dict[str, bool]:
    """Extract amenities from the 'about' field."""
    amenities = {}
    
    if not about:
        return amenities
    
    # Check accessibility
    if "Accessibility" in about:
        acc = about["Accessibility"]
        if isinstance(acc, dict):
            if acc.get("Wheelchair accessible entrance"):
                amenities["handicapAccess"] = True
            if acc.get("Wheelchair accessible parking lot"):
                amenities["parking"] = True
    
    return amenities


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
        # Silently fail - will try text search as fallback
        return None


def search_place_by_name(api_key: str, name: str, city: str = "", state: str = "") -> Optional[Dict[str, Any]]:
    """Search for a place by name and location as fallback when place_id fails."""
    if not name:
        return None
    
    # Build search query
    query = name
    if city:
        query += f" {city}"
    if state:
        query += f" {state}"
    
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": api_key,
        "X-Goog-FieldMask": TEXT_SEARCH_FIELD_MASK,
    }
    
    payload = {
        "textQuery": query,
        "maxResultCount": 1,
        "languageCode": "en",
        "regionCode": "US",
    }
    
    try:
        response = requests.post(PLACES_TEXT_SEARCH_URL, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        data = response.json()
        places = data.get("places", [])
        if places:
            # Get details for the first result
            place_id = places[0].get("id")
            if place_id:
                return get_place_details(api_key, place_id)
    except requests.exceptions.RequestException:
        # Silently fail
        pass
    
    return None


def get_photo_urls(api_key: str, photos: List[Dict[str, Any]], max_photos: int = 5) -> List[Dict[str, str]]:
    """Convert photo references to actual URLs in the standardized format."""
    if not photos:
        return []
    
    photo_objects = []
    for photo in photos[:max_photos]:
        photo_name = photo.get("name")
        if not photo_name:
            continue
            
        # Create photo URL using Places API media endpoint
        photo_url = f"https://places.googleapis.com/v1/{photo_name}/media?maxWidthPx=800&key={api_key}"
        photo_objects.append({
            "url": photo_url,
            "type": "photo",
            "source": "google_places",
            "caption": None
        })
    
    return photo_objects


def transform_and_populate_images(
    mixmatch_data: List[Dict[str, Any]], 
    api_key: str,
    fetch_images: bool = True
) -> List[Dict[str, Any]]:
    """Transform mixmatch format to standardized format and populate images."""
    standardized_data = []
    
    total = len(mixmatch_data)
    for idx, item in enumerate(mixmatch_data, 1):
        if idx % 50 == 0:
            print(f"  Processing {idx}/{total}...")
        
        # Generate slug
        slug = generate_slug(item.get("name", ""))
        
        # Determine business type
        business_type = determine_business_type(
            item.get("category", ""),
            item.get("type", ""),
            item.get("subtypes", ""),
            item.get("name", "")
        )
        
        # Get ID - use place_id if available, otherwise generate from name
        place_id = item.get("place_id")
        park_id = place_id or item.get("id") or f"mixmatch_{slug}"
        
        # Convert state to abbreviation for consistency
        state_full = item.get("state") or item.get("us_state", "")
        state_abbr = convert_state_name_to_abbr(state_full) if state_full else ""
        
        # Get zip code
        zip_code = str(item.get("postal_code", "")) if item.get("postal_code") else ""
        
        # Convert working hours
        opening_hours = convert_working_hours(item.get("working_hours", {}))
        
        # Extract amenities
        amenities = extract_amenities(item.get("about", {}))
        
        # Fetch images from Google Places API if place_id is available
        photos = []
        photo = None
        
        if fetch_images and place_id and place_id.startswith("ChIJ"):
            place_details = get_place_details(api_key, place_id)
            if place_details:
                photos_data = place_details.get("photos", [])
                if photos_data:
                    photos = get_photo_urls(api_key, photos_data, max_photos=5)
                    if photos:
                        photo = photos[0]["url"]
            
            # Fallback: try text search if place details failed
            if not photos and item.get("name"):
                place_details = search_place_by_name(
                    api_key, 
                    item.get("name", ""), 
                    item.get("city", ""), 
                    state_abbr
                )
                if place_details:
                    photos_data = place_details.get("photos", [])
                    if photos_data:
                        photos = get_photo_urls(api_key, photos_data, max_photos=5)
                        if photos:
                            photo = photos[0]["url"]
        
        # If no photos from API, try to use existing photos or logo/street_view
        if not photos:
            existing_photos = item.get("photos", [])
            if existing_photos and isinstance(existing_photos, list):
                for p in existing_photos:
                    if isinstance(p, dict) and p.get("url"):
                        photos.append(p)
                    elif isinstance(p, str):
                        photos.append({
                            "url": p,
                            "type": "photo",
                            "source": "google_places",
                            "caption": None
                        })
            
            # Fallback to logo and street_view
            if not photos:
                logo = item.get("logo")
                street_view = item.get("street_view")
                
                if logo:
                    photos.append({
                        "url": logo,
                        "type": "photo",
                        "source": "website",
                        "caption": None
                    })
                    photo = logo
                
                if street_view:
                    photos.append({
                        "url": street_view,
                        "type": "photo",
                        "source": "google_street_view",
                        "caption": None
                    })
                    if not photo:
                        photo = street_view
        
        # Create standardized entry matching mixmatch.json format
        standardized_entry = {
            "id": park_id,
            "name": item.get("name", ""),
            "businessType": business_type,
            "description": item.get("description", item.get("shortDescription", item.get("seoDescription", ""))),
            "slug": slug,
            "address": item.get("street", ""),
            "street": item.get("street", ""),
            "city": item.get("city", ""),
            "state": state_abbr,
            "zipCode": zip_code,
            "full_address": item.get("full_address", ""),
            "googlePlaceId": place_id if place_id and place_id.startswith("ChIJ") else None,
            "phone": item.get("phone", ""),
            "website": item.get("site", ""),
            "rating": item.get("rating", 0),
            "reviewCount": item.get("reviews", item.get("reviewCount", 0)),
            "userRatingsTotal": item.get("reviews", item.get("userRatingsTotal", 0)),
            "openingHours": opening_hours if opening_hours else None,
            "amenities": amenities if amenities else None,
            "photos": photos if photos else None,
            "photo": photo,  # Legacy field
            "placeTypes": item.get("subtypes", "").split(", ") if item.get("subtypes") else [],
            "dataQuality": "verified" if item.get("verified") == "TRUE" else "partial"
        }
        
        # Remove None values for cleaner output
        standardized_entry = {k: v for k, v in standardized_entry.items() if v is not None}
        
        standardized_data.append(standardized_entry)
        
        # Rate limiting - wait 0.1 seconds between API requests
        if fetch_images and place_id and idx < total:
            time.sleep(0.1)
    
    return standardized_data


def merge_into_destination(transformed_data: List[Dict[str, Any]], destination_path: Path) -> List[Dict[str, Any]]:
    """Merge transformed data into destination file, avoiding duplicates."""
    if not destination_path.exists():
        return transformed_data
    
    # Load existing data
    with open(destination_path, 'r', encoding='utf-8') as f:
        existing_data = json.load(f)
    
    if not isinstance(existing_data, list):
        return transformed_data
    
    # Create a set of existing IDs for quick lookup
    existing_ids = {park.get("id") for park in existing_data if park.get("id")}
    existing_place_ids = {park.get("googlePlaceId") for park in existing_data if park.get("googlePlaceId")}
    
    # Merge: add new parks, update existing ones
    merged_data = existing_data.copy()
    added_count = 0
    updated_count = 0
    
    for new_park in transformed_data:
        park_id = new_park.get("id")
        place_id = new_park.get("googlePlaceId")
        
        # Check if park already exists by ID or place_id
        existing_index = None
        for i, existing_park in enumerate(merged_data):
            if (existing_park.get("id") == park_id or 
                (place_id and existing_park.get("googlePlaceId") == place_id)):
                existing_index = i
                break
        
        if existing_index is not None:
            # Update existing park (prefer new data, especially images)
            if new_park.get("photos") and not merged_data[existing_index].get("photos"):
                merged_data[existing_index] = new_park
                updated_count += 1
        else:
            # Add new park
            merged_data.append(new_park)
            added_count += 1
    
    print(f"\n📊 Merge Summary:")
    print(f"  - Existing parks: {len(existing_data)}")
    print(f"  - New parks added: {added_count}")
    print(f"  - Parks updated: {updated_count}")
    print(f"  - Total parks: {len(merged_data)}")
    
    return merged_data


def main():
    """Main function to transform and populate images."""
    input_path = Path('public/data/mixmatch1.json')
    destination_path = Path('public/data/mixmatch.json')
    
    print("=" * 80)
    print("MIXMATCH1 TRANSFORMATION & IMAGE POPULATION")
    print("=" * 80)
    
    # Load API key
    try:
        api_key = load_api_key()
        print(f"✓ Loaded API key from .env.local")
    except Exception as e:
        print(f"❌ Error loading API key: {e}")
        print("   Continuing without image fetching...")
        api_key = None
    
    # Load input data
    print(f"\n📄 Reading: {input_path}")
    if not input_path.exists():
        print(f"❌ Error: Input file not found: {input_path}")
        return
    
    try:
        with open(input_path, 'r', encoding='utf-8') as f:
            mixmatch_data = json.load(f)
    except Exception as e:
        print(f"❌ Error reading input file: {e}")
        return
    
    if not isinstance(mixmatch_data, list):
        print("❌ Error: Input file must contain a JSON array")
        return
    
    print(f"   ✓ Loaded {len(mixmatch_data)} records")
    
    # Transform and populate images
    print(f"\n🔄 Transforming to standardized format...")
    if api_key:
        print("   Fetching images from Google Places API...")
    standardized_data = transform_and_populate_images(
        mixmatch_data, 
        api_key, 
        fetch_images=api_key is not None
    )
    
    print(f"   ✓ Transformed {len(standardized_data)} records")
    
    # Merge into destination file
    print(f"\n🔀 Merging into destination: {destination_path}")
    merged_data = merge_into_destination(standardized_data, destination_path)
    
    # Save the merged data
    print(f"\n💾 Saving to: {destination_path}")
    destination_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(destination_path, 'w', encoding='utf-8') as f:
        json.dump(merged_data, f, indent=2, ensure_ascii=False)
    
    print(f"   ✓ Saved successfully")
    
    # Print statistics
    print("\n📊 Final Statistics:")
    print(f"   Total parks: {len(merged_data)}")
    
    # Count by business type
    business_types = {}
    for park in merged_data:
        bt = park.get("businessType", "Unknown")
        business_types[bt] = business_types.get(bt, 0) + 1
    
    print(f"   Business types:")
    for bt, count in sorted(business_types.items()):
        print(f"     - {bt}: {count}")
    
    # Count with photos
    parks_with_photos = len([p for p in merged_data if p.get("photos")])
    print(f"   Parks with photos: {parks_with_photos}/{len(merged_data)}")
    
    # Count with Google Place IDs
    parks_with_place_ids = len([p for p in merged_data if p.get("googlePlaceId")])
    print(f"   Parks with Google Place IDs: {parks_with_place_ids}/{len(merged_data)}")
    
    print("\n✅ Transformation and image population complete!")


if __name__ == "__main__":
    main()


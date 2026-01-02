#!/usr/bin/env python3
"""
Script to find and add "Snouts & Stouts Indoor Dog Park & Bar" to mixmatch.json
using Google Places API.
"""

from __future__ import annotations

import json
import os
import re
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional

import requests

PLACES_TEXT_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText"
PLACES_DETAILS_URL = "https://places.googleapis.com/v1/places/{}"

ENHANCED_FIELD_MASK = ",".join([
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
    "places.regularOpeningHours",
])

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
    "regularOpeningHours",
])


def load_api_key(env_path: Path, env_var: str = "google_place_api") -> str:
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


def search_places(api_key: str, query: str, max_results: int = 10) -> List[Dict[str, Any]]:
    """Execute a Places Text Search request and return the list of places."""
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": api_key,
        "X-Goog-FieldMask": ENHANCED_FIELD_MASK,
    }
    payload = {
        "textQuery": query,
        "maxResultCount": max_results,
        "languageCode": "en",
        "regionCode": "US",
    }
    response = requests.post(
        PLACES_TEXT_SEARCH_URL,
        headers=headers,
        json=payload,
        timeout=30,
    )
    try:
        response.raise_for_status()
    except requests.HTTPError as exc:
        detail = exc.response.text if exc.response is not None else ""
        raise RuntimeError(f"Places API request failed: {detail}") from exc

    data = response.json()
    return data.get("places", [])


def get_place_details(place_id: str, api_key: str) -> Dict[str, Any]:
    """Get detailed information for a place including photos."""
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": api_key,
        "X-Goog-FieldMask": DETAILS_FIELD_MASK,
    }
    
    details_url = PLACES_DETAILS_URL.format(place_id)
    response = requests.get(details_url, headers=headers, timeout=30)
    response.raise_for_status()
    
    return response.json()


def get_photo_urls(photos: List[Dict[str, Any]], api_key: str, max_photos: int = 10) -> List[Dict[str, Any]]:
    """Convert photo references to actual URLs with MediaAsset format."""
    if not photos:
        return []

    photo_urls = []
    for i, photo in enumerate(photos[:max_photos]):
        photo_name = photo.get("name")
        if not photo_name:
            continue

        photo_url = f"https://places.googleapis.com/v1/{photo_name}/media?maxWidthPx=800&key={api_key}"
        photo_urls.append({
            "url": photo_url,
            "type": "photo",
            "source": "google_places",
            "caption": f"Photo {i + 1}",
        })

    return photo_urls


def extract_address_components(formatted_address: str) -> Dict[str, str]:
    """Extract address components from formatted address."""
    if not formatted_address.endswith(', USA'):
        formatted_address += ', USA'
    
    parts = formatted_address.split(',')
    
    street = parts[0].strip() if len(parts) > 0 else ""
    city = ""
    state = ""
    zip_code = ""
    
    if len(parts) >= 3:
        city_state_zip = parts[1].strip()
        city = city_state_zip
        
        if len(parts) >= 4:
            state_zip = parts[2].strip()
            state_zip_parts = state_zip.split()
            if len(state_zip_parts) >= 2:
                state_abbr = state_zip_parts[0]
                zip_code = ' '.join(state_zip_parts[1:])
                state = convert_state_abbr(state_abbr)
            else:
                state = convert_state_abbr(state_zip)
    elif len(parts) == 2:
        city_state_zip = parts[1].strip()
        city_state_zip_parts = city_state_zip.split()
        if len(city_state_zip_parts) >= 3:
            city = ' '.join(city_state_zip_parts[:-2])
            state_abbr = city_state_zip_parts[-2]
            zip_code = city_state_zip_parts[-1]
            state = convert_state_abbr(state_abbr)
    
    return {
        "full_address": formatted_address,
        "street": street,
        "city": city,
        "state": state if state else "California",
        "zip_code": zip_code
    }


def convert_state_abbr(state_abbr: str) -> str:
    """Convert state abbreviation to full state name."""
    state_mapping = {
        "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas",
        "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware",
        "FL": "Florida", "GA": "Georgia", "HI": "Hawaii", "ID": "Idaho",
        "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas",
        "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland",
        "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi",
        "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada",
        "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York",
        "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio", "OK": "Oklahoma",
        "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina",
        "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah",
        "VT": "Vermont", "VA": "Virginia", "WA": "Washington", "WV": "West Virginia",
        "WI": "Wisconsin", "WY": "Wyoming"
    }
    
    if len(state_abbr) > 2:
        return state_abbr.title()
    
    return state_mapping.get(state_abbr.upper(), state_abbr.title())


def generate_slug(name: str) -> str:
    """Generate URL-friendly slug from name."""
    slug = name.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s-]+', '-', slug)
    slug = slug.strip('-')
    return slug


def determine_business_type(types: List[str], name: str) -> str:
    """Determine business type based on Google Places types and name."""
    name_lower = name.lower()
    
    if any(keyword in name_lower for keyword in ["indoor", "waterland", "doggieland", "playland"]):
        return "Indoor Dog Park"
    elif "dog_park" in types:
        return "Dog Park"
    elif any(type_name in types for type_name in ["cafe", "bar", "restaurant", "food"]):
        return "Dog-Friendly Establishment"
    elif any(type_name in types for type_name in ["clothing_store", "store"]):
        return "Dog-Friendly Establishment"
    elif "park" in types:
        return "Dog Park"
    else:
        return "Dog Park"


def format_opening_hours(opening_hours: Optional[Dict[str, Any]]) -> Optional[Dict[str, str]]:
    """Format opening hours from Google Places format to our format."""
    if not opening_hours:
        return None
    
    weekday_descriptions = opening_hours.get("weekdayDescriptions", [])
    if not weekday_descriptions:
        return None
    
    hours_dict = {}
    for desc in weekday_descriptions:
        # Format: "Monday: 9:00 AM – 5:00 PM"
        if ":" in desc:
            day, time = desc.split(":", 1)
            hours_dict[day.strip()] = time.strip()
        else:
            hours_dict[desc] = ""
    
    return hours_dict if hours_dict else None


def transform_place_to_standard(place: Dict[str, Any], api_key: str) -> Dict[str, Any]:
    """Transform Google Places data to standardized DogPark schema."""
    location = place.get("location", {})
    display_name = place.get("displayName", {}) or {}
    formatted_address = place.get("formattedAddress", "")
    
    # Extract address components
    address_components = extract_address_components(formatted_address)
    
    # Generate slug
    slug = generate_slug(display_name.get("text", ""))
    
    # Determine business type
    business_type = determine_business_type(place.get("types", []), display_name.get("text", ""))
    
    # Get photos
    photos = place.get("photos", [])
    photo_urls = get_photo_urls(photos, api_key)
    
    # Format opening hours
    opening_hours = format_opening_hours(place.get("regularOpeningHours"))
    
    # Create standardized entry
    standardized = {
        "id": place.get("id", ""),
        "name": display_name.get("text", ""),
        "businessType": business_type,
        "description": f"{display_name.get('text', '')} is a {business_type.lower()} in {address_components['city']}, {address_components['state']}.",
        "slug": slug,
        "address": address_components["street"],
        "street": address_components["street"],
        "city": address_components["city"],
        "state": address_components["state"],
        "zipCode": address_components.get("zip_code", ""),
        "full_address": address_components["full_address"],
        "latitude": location.get("latitude"),
        "longitude": location.get("longitude"),
        "googlePlaceId": place.get("id"),
        "phone": place.get("nationalPhoneNumber", ""),
        "website": place.get("websiteUri", ""),
        "rating": place.get("rating", 0),
        "reviewCount": place.get("userRatingCount", 0),
        "userRatingsTotal": place.get("userRatingCount", 0),
        "photos": photo_urls if photo_urls else None,
        "openingHours": opening_hours,
        "amenities": {},
    }
    
    # Add legacy photo fields for backward compatibility
    if photo_urls:
        if len(photo_urls) >= 1:
            standardized["photo"] = photo_urls[0]["url"]
        if len(photo_urls) >= 2:
            standardized["photo2"] = photo_urls[1]["url"]
        if len(photo_urls) >= 3:
            standardized["photo3"] = photo_urls[2]["url"]
        standardized["images"] = [img["url"] for img in photo_urls]
    
    return standardized


def add_to_mixmatch(place_data: Dict[str, Any], mixmatch_path: Path) -> bool:
    """Add place to mixmatch.json, avoiding duplicates."""
    # Load existing data
    if mixmatch_path.exists():
        with open(mixmatch_path, 'r', encoding='utf-8') as f:
            existing_data = json.load(f)
    else:
        existing_data = []
    
    # Check if place already exists (by id or name)
    place_id = place_data.get("id")
    place_name = place_data.get("name", "").lower()
    
    for existing_place in existing_data:
        existing_id = existing_place.get("id")
        existing_name = existing_place.get("name", "").lower()
        
        if existing_id == place_id or existing_name == place_name:
            print(f"Place already exists in mixmatch.json: {place_data.get('name')}")
            return False
    
    # Add new place
    existing_data.append(place_data)
    
    # Save updated data
    with open(mixmatch_path, 'w', encoding='utf-8') as f:
        json.dump(existing_data, f, indent=2, ensure_ascii=False)
    
    print(f"Successfully added {place_data.get('name')} to mixmatch.json")
    return True


def main():
    """Main function."""
    mixmatch_path = Path("public/data/mixmatch.json")
    
    # Load API key - try multiple environment variable names first, then .env files
    api_key = None
    for var_name in ["google_place_api", "GOOGLE_PLACE_API", "GOOGLE_PLACES_API_KEY", "NEXT_PUBLIC_GOOGLE_PLACE_API"]:
        if var_name in os.environ and os.environ[var_name]:
            api_key = os.environ[var_name]
            break
    
    if not api_key:
        # Try .env.local first (common for Next.js projects), then .env
        for env_file in [Path(".env.local"), Path(".env")]:
            try:
                api_key = load_api_key(env_file)
                if api_key:
                    break
            except FileNotFoundError:
                continue
            except Exception as exc:
                print(f"Error loading API key from {env_file}: {exc}", file=sys.stderr)
    
    if not api_key:
        print("Error: Google Places API key not found", file=sys.stderr)
        print("\nPlease set the Google Places API key using one of these methods:", file=sys.stderr)
        print("  1. Set environment variable: export google_place_api='YOUR_API_KEY'", file=sys.stderr)
        print("  2. Create a .env.local file with: google_place_api=YOUR_API_KEY", file=sys.stderr)
        print("  3. Create a .env file with: google_place_api=YOUR_API_KEY", file=sys.stderr)
        sys.exit(1)
    
    # Search for the place
    query = "Snouts & Stouts Indoor Dog Park & Bar"
    print(f"Searching for: {query}")
    
    try:
        places = search_places(api_key, query, max_results=5)
    except Exception as exc:
        print(f"Error searching for place: {exc}", file=sys.stderr)
        sys.exit(2)
    
    if not places:
        print(f"No results found for: {query}", file=sys.stderr)
        sys.exit(3)
    
    # Find the best match
    best_match = None
    query_lower = query.lower()
    
    for place in places:
        name = place.get("displayName", {}).get("text", "").lower()
        if "snouts" in name and "stouts" in name:
            best_match = place
            break
    
    if not best_match:
        print("Found places but no exact match. Using first result:")
        for i, place in enumerate(places, 1):
            name = place.get("displayName", {}).get("text", "")
            print(f"  {i}. {name}")
        best_match = places[0]
    
    place_name = best_match.get("displayName", {}).get("text", "")
    print(f"Selected: {place_name}")
    
    # Get detailed information
    place_id = best_match.get("id")
    if not place_id:
        print("Error: Place ID not found", file=sys.stderr)
        sys.exit(4)
    
    try:
        detailed_place = get_place_details(place_id, api_key)
    except Exception as exc:
        print(f"Error getting place details: {exc}", file=sys.stderr)
        # Use the search result if details fail
        detailed_place = best_match
    
    # Transform to standard format
    standardized = transform_place_to_standard(detailed_place, api_key)
    
    # Add to mixmatch.json
    success = add_to_mixmatch(standardized, mixmatch_path)
    
    if success:
        print(f"\nPlace added successfully!")
        print(f"Name: {standardized.get('name')}")
        print(f"Address: {standardized.get('full_address')}")
        print(f"Rating: {standardized.get('rating')} ({standardized.get('reviewCount')} reviews)")
        if standardized.get('website'):
            print(f"Website: {standardized.get('website')}")
        if standardized.get('photos'):
            print(f"Photos: {len(standardized.get('photos', []))} found")
    else:
        print("\nPlace was not added (may already exist)")


if __name__ == "__main__":
    main()


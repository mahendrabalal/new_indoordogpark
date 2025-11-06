#!/usr/bin/env python3
"""
Enhanced scraper for indoor dog parks in California using Google Places API (New).

Fetches comprehensive data including:
- All available photos from Google Places (up to 10+ per location)
- Pricing information extracted from facility websites
- Complete amenities and features
- Social media links
- Operating hours and details

Uses the standardized schema defined in src/types/dog-park.ts
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from pathlib import Path
from time import sleep
from typing import Any, Dict, List, Optional
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

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
    "places.openingHours",
])

CALIFORNIA_LOCATION_RESTRICTION = {
    "rectangle": {
        "low": {"latitude": 32.528832, "longitude": -124.482003},
        "high": {"latitude": 42.009516, "longitude": -114.131211},
    }
}

# Pricing patterns for regex extraction
PRICING_PATTERNS = [
    r'\$(\d+(?:\.\d{2})?)\s*(?:/|per)\s*(?:hour|hr|h)',  # $15/hour
    r'\$(\d+(?:\.\d{2})?)\s*(?:/|per)\s*(?:day|d)',  # $30/day
    r'\$(\d+(?:\.\d{2})?)\s*(?:/|per)\s*(?:month|mo)',  # $50/month
    r'(?:hourly|hour)[:\s]+\$(\d+(?:\.\d{2})?)',  # hourly: $15
    r'(?:daily|day)[:\s]+\$(\d+(?:\.\d{2})?)',  # daily: $30
    r'(?:monthly|month)[:\s]+\$(\d+(?:\.\d{2})?)',  # monthly: $50
    r'(?:price|cost)[:\s]+\$(\d+(?:\.\d{2})?)',  # price: $25
]

AMENITY_KEYWORDS = {
    'parking': ['parking', 'lot'],
    'waterFountains': ['water fountain', 'water bowl', 'drinking water'],
    'shade': ['shade', 'shaded', 'covered', 'canopy'],
    'seating': ['bench', 'seating', 'chairs'],
    'smallDogArea': ['small dog', 'small breed', 'toy dog'],
    'largeDogArea': ['large dog', 'big dog'],
    'agilityCourse': ['agility', 'obstacle', 'course'],
    'swimming': ['swimming', 'pool', 'water play', 'splash pad'],
    'dogWashStation': ['wash station', 'dog wash', 'rinse'],
    'restrooms': ['restroom', 'bathroom', 'toilet'],
    'handicapAccess': ['wheelchair', 'handicap', 'accessible', 'ada'],
    'lighting': ['light', 'lit', 'night', 'evening'],
    'fencing': ['fenced', 'enclosed', 'fence'],
    'grooming': ['grooming', 'nail trim', 'bath'],
    'daycare': ['daycare', 'day care', 'boarding'],
    'training': ['training', 'classes', 'lessons'],
    'socializing': ['social', 'socialization', 'play'],
}


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


def search_places(
    api_key: str,
    query: str,
    max_results: int = 20,
    language: str = "en",
    location_restriction: Optional[Dict[str, Any]] = None,
) -> List[Dict[str, Any]]:
    """Execute a Places Text Search request and return the list of places."""
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": api_key,
        "X-Goog-FieldMask": ENHANCED_FIELD_MASK,
    }
    payload = {
        "textQuery": query,
        "maxResultCount": max_results,
        "languageCode": language,
        "regionCode": "US",
    }
    if location_restriction:
        payload["locationRestriction"] = location_restriction

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


def extract_pricing_from_website(website_url: Optional[str]) -> Dict[str, Any]:
    """Extract pricing information from a website."""
    if not website_url:
        return {}

    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
        response = requests.get(website_url, headers=headers, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.content, "html.parser")
        text = soup.get_text().lower()

        # Extract pricing information
        pricing_info = {"pricingSource": "website"}

        # Check if free
        if any(phrase in text for phrase in ["free admission", "free entry", "no cost", "free access", "no fee"]):
            pricing_info["isFree"] = True
            pricing_info["pricingType"] = "free"
            return pricing_info

        pricing_info["isFree"] = False

        # Try to extract rates from website text
        hourly_matches = re.findall(r'\$(\d+(?:\.\d{2})?)\s*(?:/|per)\s*(?:hour|hr|h)', text)
        if hourly_matches:
            pricing_info["hourlyRate"] = float(hourly_matches[0])
            pricing_info["pricingType"] = "hourly"

        daily_matches = re.findall(r'\$(\d+(?:\.\d{2})?)\s*(?:/|per)\s*(?:day|d)', text)
        if daily_matches:
            pricing_info["dailyRate"] = float(daily_matches[0])
            pricing_info["pricingType"] = "daily"

        monthly_matches = re.findall(r'\$(\d+(?:\.\d{2})?)\s*(?:/|per)\s*(?:month|mo)', text)
        if monthly_matches:
            pricing_info["monthlyRate"] = float(monthly_matches[0])
            pricing_info["pricingType"] = "monthly"

        # Check for membership
        if "membership" in text or "member" in text:
            pricing_info["pricingType"] = "membership"

        # Look for pricing details section
        pricing_section = soup.find("div", {"class": re.compile(r"price|cost|rate|fee", re.I)})
        if pricing_section:
            pricing_info["pricingUrl"] = website_url

        return pricing_info if len(pricing_info) > 1 else {}

    except Exception as e:
        print(f"Error extracting pricing from {website_url}: {e}", file=sys.stderr)
        return {}


def extract_amenities(place: Dict[str, Any]) -> Dict[str, bool]:
    """Extract amenities from place data and text."""
    amenities = {}

    name = place.get("displayName", {}).get("text", "").lower()
    types = [t.lower() for t in place.get("types", [])]

    # Check place types
    text_to_search = name + " " + " ".join(types)

    for amenity, keywords in AMENITY_KEYWORDS.items():
        amenities[amenity] = any(keyword in text_to_search for keyword in keywords)

    # Infer some amenities based on business type
    if "dog_park" in types:
        amenities["fencing"] = True
        amenities["socializing"] = True

    if "indoor" in name:
        amenities.pop("lighting", None)  # Indoor doesn't need outdoor lighting

    return {k: v for k, v in amenities.items() if v}


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


def transform_place_to_standard(place: Dict[str, Any], api_key: str) -> Dict[str, Any]:
    """Transform Google Places data to standardized DogPark schema."""
    location = place.get("location", {})
    display_name = place.get("displayName", {}) or {}
    formatted_address = place.get("formattedAddress", "")

    # Parse address components
    address_parts = formatted_address.split(",")
    street = address_parts[0].strip() if address_parts else ""
    city = ""
    state = "California"
    zip_code = ""

    if len(address_parts) >= 2:
        city = address_parts[1].strip()
    if len(address_parts) >= 3:
        state_zip = address_parts[2].strip()
        parts = state_zip.split()
        if len(parts) >= 2:
            state = parts[0]
            zip_code = " ".join(parts[1:])

    business_type = determine_business_type(place.get("types", []), display_name.get("text", ""))

    # Get photos
    photos = place.get("photos", [])
    photo_urls = get_photo_urls(photos, api_key)

    # Extract pricing from website
    website = place.get("websiteUri", "")
    pricing_info = extract_pricing_from_website(website) if website else {}
    if not pricing_info:
        pricing_info = {"isFree": True, "pricingType": "free", "pricingSource": "unknown"}

    # Extract amenities
    amenities = extract_amenities(place)

    standardized = {
        "id": place.get("id", ""),
        "name": display_name.get("text", ""),
        "businessType": business_type,
        "description": f"{display_name.get('text', '')} is a {business_type.lower()} in {city}, California.",
        "slug": generate_slug(display_name.get("text", "")),

        # Location
        "address": street,
        "street": street,
        "city": city,
        "state": state,
        "zipCode": zip_code,
        "full_address": formatted_address,
        "latitude": location.get("latitude"),
        "longitude": location.get("longitude"),
        "googlePlaceId": place.get("id"),

        # Contact
        "phone": place.get("nationalPhoneNumber", ""),
        "website": website,

        # Media
        "photos": photo_urls if photo_urls else None,

        # Ratings
        "rating": place.get("rating", 0),
        "reviewCount": place.get("userRatingCount", 0),

        # Pricing
        "pricing": pricing_info if pricing_info else None,

        # Amenities
        "amenities": amenities if amenities else None,
        "indoorOutdoor": "indoor" if "indoor" in business_type.lower() else "outdoor",

        # Metadata
        "placeTypes": place.get("types", []),
        "lastUpdated": None,
        "dataQuality": "verified",
    }

    # Clean up None values for compact output
    return {k: v for k, v in standardized.items() if v is not None}


def write_json(records: List[Dict[str, Any]], output_path: Path) -> None:
    """Persist data to a JSON file."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as f:
        json.dump(records, f, indent=2, ensure_ascii=False)


def print_summary(records: List[Dict[str, Any]]) -> None:
    """Print a summary of fetched parks."""
    if not records:
        print("No parks found.")
        return

    print(f"\nFetched {len(records)} dog parks:")
    print("=" * 80)

    for i, park in enumerate(records[:5], 1):  # Show first 5
        print(f"\n{i}. {park.get('name')}")
        print(f"   Type: {park.get('businessType')}")
        print(f"   Rating: {park.get('rating')} ⭐ ({park.get('reviewCount')} reviews)")

        pricing = park.get("pricing", {})
        if pricing:
            if pricing.get("isFree"):
                print(f"   Pricing: Free")
            elif pricing.get("hourlyRate"):
                print(f"   Pricing: ${pricing['hourlyRate']}/hour")
            elif pricing.get("dailyRate"):
                print(f"   Pricing: ${pricing['dailyRate']}/day")

        photos = park.get("photos", [])
        print(f"   Photos: {len(photos) if photos else 0}")

        amenities = park.get("amenities", {})
        if amenities:
            print(f"   Amenities: {', '.join(list(amenities.keys())[:5])}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Fetch enhanced dog park data in California via Google Places API (New)."
    )
    parser.add_argument(
        "--env-file",
        type=Path,
        default=Path(".env.local"),
        help="Path to the dotenv file containing `google_place_api` (default: .env.local)",
    )
    parser.add_argument(
        "--query",
        default="indoor dog park California",
        help="Free text query sent to Places Text Search (default: %(default)s)",
    )
    parser.add_argument(
        "--max-results",
        type=int,
        default=20,
        help="Number of results to request from the API (default: %(default)s)",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("public/data/enhanced_indoor_dog_parks.json"),
        help="Output path for enhanced data (default: %(default)s)",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    try:
        api_key = load_api_key(args.env_file)
    except Exception as exc:
        print(f"Error loading API key: {exc}", file=sys.stderr)
        sys.exit(1)

    try:
        print(f"Searching for: {args.query}", file=sys.stderr)
        places = search_places(
            api_key=api_key,
            query=args.query,
            max_results=args.max_results,
            location_restriction=CALIFORNIA_LOCATION_RESTRICTION,
        )
        print(f"Found {len(places)} results", file=sys.stderr)

        # Transform to standardized schema
        standardized_parks = []
        for i, place in enumerate(places, 1):
            try:
                park = transform_place_to_standard(place, api_key)
                standardized_parks.append(park)
                print(f"  [{i}/{len(places)}] {place.get('displayName', {}).get('text', 'Unknown')}", file=sys.stderr)
                sleep(0.1)  # Rate limiting
            except Exception as e:
                print(f"  Error processing place: {e}", file=sys.stderr)

        # Save to file
        write_json(standardized_parks, args.output)
        print(f"\nSaved {len(standardized_parks)} parks to {args.output}", file=sys.stderr)

        # Print summary
        print_summary(standardized_parks)

    except Exception as exc:
        print(f"Error: {exc}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()

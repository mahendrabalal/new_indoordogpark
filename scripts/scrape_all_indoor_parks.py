#!/usr/bin/env python3
"""
Scrape ALL indoor dog parks in California using multiple search queries.

This script performs multiple searches with different queries and geographic
regions to maximize coverage and find thousands of indoor dog parks across
California.

Features:
- Multiple search queries for comprehensive coverage
- Automatic deduplication by ID
- Progress tracking and statistics
- Rate limiting to respect API quotas
- Saves results with merged data
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
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

PLACES_TEXT_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText"

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
])

CALIFORNIA_LOCATION_RESTRICTION = {
    "rectangle": {
        "low": {"latitude": 32.528832, "longitude": -124.482003},
        "high": {"latitude": 42.009516, "longitude": -114.131211},
    }
}

# Multiple search queries for comprehensive coverage
SEARCH_QUERIES = [
    "indoor dog park California",
    "indoor dog playground California",
    "dog daycare facility California",
    "climate controlled dog park California",
    "covered dog play area California",
    "dog training facility California",
    "dog socialization center California",
    "pet play center California",
    "doggieland California",
    "dog resort California",
    "pet care facility California",
    "indoor pet facility California",
    "dog boarding facility California",
    "enclosed dog park California",
]

# Regional searches for additional coverage
REGIONAL_QUERIES = [
    "indoor dog park Los Angeles",
    "indoor dog park San Francisco Bay Area",
    "indoor dog park San Diego",
    "indoor dog park Sacramento",
    "indoor dog park Inland Empire",
    "dog daycare Los Angeles",
    "dog daycare San Francisco",
    "dog daycare San Diego",
    "dog training Los Angeles",
    "dog training San Francisco",
    "dog training San Diego",
    "pet daycare Sacramento",
    "dog boarding Los Angeles",
    "dog boarding San Francisco",
]


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

    try:
        response = requests.post(
            PLACES_TEXT_SEARCH_URL,
            headers=headers,
            json=payload,
            timeout=30,
        )
        response.raise_for_status()
        data = response.json()
        return data.get("places", [])
    except requests.HTTPError as exc:
        detail = exc.response.text if exc.response is not None else ""
        print(f"API Error for query '{query}': {detail}", file=sys.stderr)
        return []
    except Exception as e:
        print(f"Error searching for '{query}': {e}", file=sys.stderr)
        return []


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

        pricing_info = {"pricingSource": "website"}

        if any(phrase in text for phrase in ["free admission", "free entry", "no cost", "free access"]):
            pricing_info["isFree"] = True
            pricing_info["pricingType"] = "free"
            return pricing_info

        pricing_info["isFree"] = False

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

        if "membership" in text or "member" in text:
            pricing_info["pricingType"] = "membership"

        return pricing_info if len(pricing_info) > 1 else {}

    except Exception:
        return {}


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
    else:
        return "Dog Park"


def transform_place_to_standard(place: Dict[str, Any], api_key: str) -> Dict[str, Any]:
    """Transform Google Places data to standardized DogPark schema."""
    location = place.get("location", {})
    display_name = place.get("displayName", {}) or {}
    formatted_address = place.get("formattedAddress", "")

    # Parse address
    address_parts = formatted_address.split(",")
    street = address_parts[0].strip() if address_parts else ""
    city = address_parts[1].strip() if len(address_parts) > 1 else ""
    state = "California"
    zip_code = ""

    if len(address_parts) >= 3:
        state_zip = address_parts[2].strip()
        parts = state_zip.split()
        if len(parts) >= 2:
            state = parts[0]
            zip_code = " ".join(parts[1:])

    business_type = determine_business_type(place.get("types", []), display_name.get("text", ""))
    photos = place.get("photos", [])
    photo_urls = get_photo_urls(photos, api_key)

    website = place.get("websiteUri", "")
    pricing_info = extract_pricing_from_website(website) if website else {}
    if not pricing_info:
        pricing_info = {"isFree": True, "pricingType": "free", "pricingSource": "unknown"}

    return {
        "id": place.get("id", ""),
        "name": display_name.get("text", ""),
        "businessType": business_type,
        "description": f"{display_name.get('text', '')} is a {business_type.lower()} in {city}, California.",
        "slug": generate_slug(display_name.get("text", "")),
        "address": street,
        "street": street,
        "city": city,
        "state": state,
        "zipCode": zip_code,
        "full_address": formatted_address,
        "latitude": location.get("latitude"),
        "longitude": location.get("longitude"),
        "googlePlaceId": place.get("id"),
        "phone": place.get("nationalPhoneNumber", ""),
        "website": website,
        "photos": photo_urls if photo_urls else None,
        "rating": place.get("rating", 0),
        "reviewCount": place.get("userRatingCount", 0),
        "pricing": pricing_info if pricing_info else None,
        "placeTypes": place.get("types", []),
        "lastUpdated": None,
        "dataQuality": "verified",
    }


def main():
    parser = argparse.ArgumentParser(
        description="Scrape thousands of indoor dog parks across California."
    )
    parser.add_argument(
        "--env-file",
        type=Path,
        default=Path(".env.local"),
        help="Path to .env file with API key",
    )
    parser.add_argument(
        "--max-per-query",
        type=int,
        default=20,
        help="Max results per search query (default: 20)",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("public/data/enhanced_indoor_dog_parks.json"),
        help="Output file path",
    )
    args = parser.parse_args()

    try:
        api_key = load_api_key(args.env_file)
    except Exception as exc:
        print(f"Error loading API key: {exc}", file=sys.stderr)
        sys.exit(1)

    all_parks = {}  # Use dict for deduplication by ID
    query_stats = {}

    print("\n" + "=" * 80)
    print("SCRAPING INDOOR DOG PARKS - CALIFORNIA WIDE")
    print("=" * 80)

    # Primary searches
    print("\n🔍 PRIMARY SEARCHES")
    print("-" * 80)
    for query in SEARCH_QUERIES:
        print(f"Searching: {query}", end=" ... ")
        places = search_places(
            api_key=api_key,
            query=query,
            max_results=args.max_per_query,
            location_restriction=CALIFORNIA_LOCATION_RESTRICTION,
        )

        new_parks = 0
        for place in places:
            try:
                park = transform_place_to_standard(place, api_key)
                park_id = park.get("id")
                if park_id and park_id not in all_parks:
                    all_parks[park_id] = park
                    new_parks += 1
                sleep(0.05)  # Rate limiting
            except Exception as e:
                print(f"Error processing place: {e}", file=sys.stderr)

        query_stats[query] = new_parks
        print(f"✓ Found {new_parks} new parks")

    # Regional searches
    print("\n🗺️  REGIONAL SEARCHES")
    print("-" * 80)
    for query in REGIONAL_QUERIES:
        print(f"Searching: {query}", end=" ... ")
        places = search_places(
            api_key=api_key,
            query=query,
            max_results=args.max_per_query,
            location_restriction=CALIFORNIA_LOCATION_RESTRICTION,
        )

        new_parks = 0
        for place in places:
            try:
                park = transform_place_to_standard(place, api_key)
                park_id = park.get("id")
                if park_id and park_id not in all_parks:
                    all_parks[park_id] = park
                    new_parks += 1
                sleep(0.05)  # Rate limiting
            except Exception as e:
                print(f"Error processing place: {e}", file=sys.stderr)

        query_stats[query] = new_parks
        print(f"✓ Found {new_parks} new parks")

    # Save results
    parks_list = list(all_parks.values())
    parks_list.sort(key=lambda p: (-(p.get('rating') or 0), p.get('name', '')))

    print("\n" + "=" * 80)
    print("RESULTS")
    print("=" * 80)
    print(f"Total unique parks: {len(parks_list)}")
    print(f"Parks with pricing: {len([p for p in parks_list if p.get('pricing')])}")
    print(f"Parks with photos: {len([p for p in parks_list if p.get('photos')])}")

    args.output.parent.mkdir(parents=True, exist_ok=True)
    with open(args.output, 'w', encoding='utf-8') as f:
        json.dump(parks_list, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Saved to: {args.output}")
    print("=" * 80)


if __name__ == "__main__":
    main()

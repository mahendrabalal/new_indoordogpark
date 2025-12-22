#!/usr/bin/env python3
"""
Transform mix.json to standardized dog park format.
Converts the raw Google Places format to match california.json and washington.json structure.
"""

import json
import re
from pathlib import Path
from typing import Any, Dict, List, Optional

# State name to abbreviation mapping
STATE_TO_ABBR = {
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

def determine_business_type(type_field: Any, category: Any, name: str) -> str:
    """Determine business type from type, category, and name."""
    name_lower = name.lower()
    
    # Handle type_field - could be string, list, or None
    if isinstance(type_field, list):
        type_lower = " ".join(str(t).lower() for t in type_field)
    else:
        type_lower = (str(type_field) if type_field else "").lower()
    
    # Handle category - could be string, list, or None
    if isinstance(category, list):
        category_lower = " ".join(str(c).lower() for c in category)
    else:
        category_lower = (str(category) if category else "").lower()
    
    # Check for indoor facilities first
    if any(keyword in name_lower for keyword in ["indoor", "waterland", "doggieland", "playland"]):
        return "Indoor Dog Park"
    
    # Check category and type fields
    if "indoor" in category_lower or "indoor" in type_lower:
        return "Indoor Dog Park"
    
    # Check for dog park
    if "dog park" in category_lower or "dog park" in type_lower:
        return "Dog Park"
    
    # Check for dog-friendly establishments
    if any(term in category_lower or term in type_lower for term in ["cafe", "bar", "restaurant", "food", "store"]):
        return "Dog-Friendly Establishment"
    
    # Default based on common patterns
    if "day care" in category_lower or "daycare" in category_lower:
        return "Indoor Dog Park"  # Daycare centers are typically indoor
    
    return "Dog Park"

def convert_state_to_abbr(state: str) -> str:
    """Convert full state name to abbreviation."""
    return STATE_TO_ABBR.get(state, state)

def convert_working_hours(working_hours: Dict[str, Any]) -> Optional[Dict[str, str]]:
    """Convert working_hours format to openingHours format."""
    if not working_hours:
        return None
    
    converted = {}
    for day, hours_value in working_hours.items():
        # Handle case where hours_value is a list of objects
        if isinstance(hours_value, list):
            if len(hours_value) > 0 and isinstance(hours_value[0], dict):
                # Extract hours from first object
                hours_str = hours_value[0].get("hours", "")
            else:
                hours_str = str(hours_value[0]) if hours_value else ""
        else:
            hours_str = str(hours_value) if hours_value else ""
        
        hours_clean = hours_str.strip()
        
        if hours_clean and hours_clean.lower() != "closed":
            # Convert format like "7AM-6PM" to "7:00 AM – 6:00 PM"
            # Handle various formats
            if "-" in hours_clean:
                parts = hours_clean.split("-")
                if len(parts) == 2:
                    start = parts[0].strip()
                    end = parts[1].strip()
                    # Normalize time format
                    converted[day] = f"{start} – {end}"
                else:
                    converted[day] = hours_clean
            else:
                converted[day] = hours_clean
        else:
            converted[day] = "Closed"
    
    return converted if converted else None

def create_photos_array(logo: Optional[str], street_view: Optional[str]) -> Optional[List[Dict[str, Any]]]:
    """Create photos array from logo and street_view."""
    photos = []
    
    if logo and logo.strip():
        photos.append({
            "url": logo,
            "type": "photo",
            "source": "google_places"
        })
    
    if street_view and street_view.strip():
        photos.append({
            "url": street_view,
            "type": "photo",
            "source": "google_street_view"
        })
    
    return photos if photos else None

def transform_mix_entry(entry: Dict[str, Any]) -> Dict[str, Any]:
    """Transform a single mix.json entry to standardized format."""
    # Extract core fields
    place_id = entry.get("place_id", "")
    name = entry.get("name", "")
    
    # Generate required fields
    slug = generate_slug(name)
    business_type = determine_business_type(
        entry.get("type", ""),
        entry.get("category", ""),
        name
    )
    
    # Convert state to abbreviation
    state_full = entry.get("state", "")
    state_abbr = convert_state_to_abbr(state_full) if state_full else ""
    
    # Convert postal_code to zipCode (string)
    postal_code = entry.get("postal_code")
    zip_code = str(postal_code) if postal_code else ""
    
    # Convert reviews to reviewCount (handle both number and missing)
    review_count = entry.get("reviews", 0) or 0
    
    # Convert working_hours to openingHours
    opening_hours = convert_working_hours(entry.get("working_hours", {}))
    
    # Create photos array
    photos = create_photos_array(entry.get("logo"), entry.get("street_view"))
    
    # Build standardized entry
    standardized = {
        "id": place_id,
        "name": name,
        "businessType": business_type,
        "description": entry.get("description", ""),
        "slug": slug,
        "address": entry.get("street", ""),
        "street": entry.get("street", ""),
        "city": entry.get("city", ""),
        "state": state_abbr,
        "zipCode": zip_code,
        "full_address": entry.get("full_address", ""),
        "latitude": entry.get("latitude"),
        "longitude": entry.get("longitude"),
        "googlePlaceId": place_id,
    }
    
    # Add optional fields
    if entry.get("phone"):
        standardized["phone"] = entry.get("phone")
    
    if entry.get("site"):
        standardized["website"] = entry.get("site")
    
    if photos:
        standardized["photos"] = photos
        # Also add legacy photo field for backward compatibility
        if photos and len(photos) > 0:
            standardized["photo"] = photos[0]["url"]
    
    standardized["rating"] = entry.get("rating", 0)
    standardized["reviewCount"] = review_count
    standardized["userRatingsTotal"] = review_count
    
    # Add pricing info (default to unknown)
    standardized["pricing"] = {
        "pricingSource": "unknown",
        "isFree": False
    }
    
    if opening_hours:
        standardized["openingHours"] = opening_hours
    
    # Add placeTypes if available
    subtypes = entry.get("subtypes", "")
    if subtypes:
        # Parse subtypes string (comma-separated)
        place_types = [t.strip() for t in subtypes.split(",") if t.strip()]
        if place_types:
            standardized["placeTypes"] = place_types
    
    # Add metadata
    standardized["dataQuality"] = "verified" if entry.get("verified") == "TRUE" else "unverified"
    
    # Remove None values
    return {k: v for k, v in standardized.items() if v is not None and v != ""}

def main():
    """Main function to transform mix.json."""
    input_path = Path("public/data/mix.json")
    output_path = Path("public/data/mix.json")
    
    if not input_path.exists():
        print(f"Error: {input_path} not found")
        return
    
    print(f"Reading {input_path}...")
    with open(input_path, 'r', encoding='utf-8') as f:
        mix_data = json.load(f)
    
    print(f"Transforming {len(mix_data)} entries...")
    standardized_data = []
    
    for entry in mix_data:
        try:
            transformed = transform_mix_entry(entry)
            standardized_data.append(transformed)
        except Exception as e:
            print(f"Error transforming entry {entry.get('name', 'unknown')}: {e}")
            continue
    
    print(f"Transformed {len(standardized_data)} entries successfully")
    
    # Create backup
    backup_path = Path("public/data/mix.json.backup")
    if not backup_path.exists():
        print(f"Creating backup at {backup_path}...")
        with open(backup_path, 'w', encoding='utf-8') as f:
            json.dump(mix_data, f, indent=2, ensure_ascii=False)
    
    # Write transformed data
    print(f"Writing transformed data to {output_path}...")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(standardized_data, f, indent=2, ensure_ascii=False)
    
    print("Transformation complete!")
    print(f"\nSummary:")
    print(f"  - Total entries: {len(standardized_data)}")
    print(f"  - With photos: {sum(1 for e in standardized_data if e.get('photos'))}")
    print(f"  - With opening hours: {sum(1 for e in standardized_data if e.get('openingHours'))}")
    print(f"  - With websites: {sum(1 for e in standardized_data if e.get('website'))}")

if __name__ == "__main__":
    main()


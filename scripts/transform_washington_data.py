#!/usr/bin/env python3
"""
Transform washington.json data to standardized DogPark format.
Converts raw scraped format to match the expected DogPark interface.
"""

import json
import re
from pathlib import Path
from typing import Any, Dict, List, Optional


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
    return state_mapping.get(state_name.title(), state_name[:2].upper() if len(state_name) >= 2 else state_name)


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


def determine_business_type(
    type_field: str,
    category_field: str,
    name: str,
    description: str
) -> str:
    """Determine business type based on type, category, name, and description."""
    name_lower = name.lower()
    desc_lower = (description or "").lower()
    type_lower = (type_field or "").lower()
    category_lower = (category_field or "").lower()
    
    # Check for indoor facilities first
    indoor_keywords = ["indoor", "waterland", "doggieland", "playland", "climate-controlled", 
                       "heated", "air-conditioned", "enclosed", "covered"]
    if any(keyword in name_lower or keyword in desc_lower for keyword in indoor_keywords):
        return "Indoor Dog Park"
    
    # Check for dog parks
    if "dog park" in type_lower or "dog park" in category_lower:
        return "Dog Park"
    
    # Check for daycare centers (these are typically indoor facilities)
    if "day care" in type_lower or "daycare" in type_lower or "day care" in category_lower:
        return "Indoor Dog Park"  # Daycare centers are typically indoor
    
    # Check for dog-friendly establishments (cafes, bars, restaurants)
    if any(keyword in type_lower or keyword in category_lower for keyword in 
           ["cafe", "bar", "restaurant", "store", "shop"]):
        return "Dog-Friendly Establishment"
    
    # Default based on context
    if "park" in name_lower or "park" in desc_lower:
        return "Dog Park"
    
    # Default to Indoor Dog Park for daycare centers (common in Washington data)
    return "Indoor Dog Park"


def convert_working_hours(working_hours: Dict[str, str]) -> Optional[Dict[str, str]]:
    """Convert working_hours dict to openingHours format."""
    if not working_hours or not isinstance(working_hours, dict):
        return None
    
    # Already in the right format, just return it
    return working_hours


def convert_images_to_photos(images: List[str]) -> List[Dict[str, Any]]:
    """Convert images array (strings) to photos array (MediaAsset objects)."""
    if not images:
        return []
    
    photos = []
    for url in images:
        # Determine source based on URL
        if url.startswith("http://") or url.startswith("https://"):
            source = "google_places"
        elif url.startswith("/images/"):
            source = "local"
        else:
            source = "local"
        
        photos.append({
            "url": url,
            "type": "photo",
            "source": source
        })
    
    return photos


def transform_washington_entry(raw_entry: Dict[str, Any]) -> Dict[str, Any]:
    """Transform a single washington.json entry to standardized format."""
    place_id = raw_entry.get("place_id", "")
    
    # Generate slug from name
    name = raw_entry.get("name", "")
    slug = generate_slug(name)
    
    # Determine business type
    business_type = determine_business_type(
        raw_entry.get("type", ""),
        raw_entry.get("category", ""),
        name,
        raw_entry.get("description", "")
    )
    
    # Convert state name to abbreviation
    state_name = raw_entry.get("state", "Washington")
    state_abbr = convert_state_name_to_abbr(state_name)
    
    # Handle images/photos
    images = raw_entry.get("images", [])
    photos = convert_images_to_photos(images)
    
    # Use first image as primary photo for backward compatibility
    photo = images[0] if images else None
    
    # Convert working hours
    opening_hours = convert_working_hours(raw_entry.get("working_hours"))
    
    # Build standardized entry
    standardized_entry = {
        "id": place_id,
        "name": name,
        "businessType": business_type,
        "description": raw_entry.get("description", ""),
        "slug": slug,
        "address": raw_entry.get("street", ""),
        "street": raw_entry.get("street", ""),
        "city": raw_entry.get("city", ""),
        "state": state_abbr,
        "zipCode": raw_entry.get("postal_code", ""),
        "full_address": raw_entry.get("full_address", ""),
        "latitude": raw_entry.get("latitude"),
        "longitude": raw_entry.get("longitude"),
        "googlePlaceId": place_id,
        "phone": raw_entry.get("phone", ""),
        "rating": raw_entry.get("rating", 0),
        "reviewCount": raw_entry.get("reviews", 0),
        "userRatingsTotal": raw_entry.get("reviews", 0),
        "photos": photos if photos else None,
        "photo": photo,
        "placeTypes": ["point_of_interest", "establishment"],
        "dataQuality": "verified" if raw_entry.get("verified") == "TRUE" else "partial",
    }
    
    # Add website if available
    site = raw_entry.get("site", "")
    if site:
        standardized_entry["website"] = site
    
    # Add opening hours if available
    if opening_hours:
        standardized_entry["openingHours"] = opening_hours
    
    # Add pricing info if available (default to non-free for daycare centers)
    standardized_entry["pricing"] = {
        "pricingSource": "unknown",
        "isFree": False
    }
    
    # Remove None values for cleaner output
    standardized_entry = {k: v for k, v in standardized_entry.items() if v is not None}
    
    return standardized_entry


def main():
    """Main function to transform washington.json data."""
    input_path = Path('public/data/washington.json')
    output_path = Path('public/data/washington.json')
    
    # Backup original file
    backup_path = Path('public/data/washington.json.backup')
    if not backup_path.exists():
        print(f"Creating backup: {backup_path}")
        import shutil
        shutil.copy(input_path, backup_path)
    
    # Load raw data
    print(f"Loading data from: {input_path}")
    with open(input_path, 'r', encoding='utf-8') as f:
        raw_data = json.load(f)
    
    print(f"Loaded {len(raw_data)} entries")
    
    # Transform all entries
    standardized_data = []
    for i, entry in enumerate(raw_data):
        try:
            transformed = transform_washington_entry(entry)
            standardized_data.append(transformed)
        except Exception as e:
            print(f"Error transforming entry {i} ({entry.get('name', 'Unknown')}): {e}")
            continue
    
    # Save transformed data
    print(f"Saving transformed data to: {output_path}")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(standardized_data, f, indent=2, ensure_ascii=False)
    
    print(f"\nTransformation complete!")
    print(f"  Total entries: {len(standardized_data)}")
    print(f"  Successfully transformed: {len(standardized_data)}")
    
    # Statistics
    with_images = sum(1 for entry in standardized_data if entry.get("photos"))
    business_types = {}
    for entry in standardized_data:
        bt = entry.get("businessType", "Unknown")
        business_types[bt] = business_types.get(bt, 0) + 1
    
    print(f"\nStatistics:")
    print(f"  Entries with photos: {with_images}/{len(standardized_data)}")
    print(f"  Business type distribution:")
    for bt, count in sorted(business_types.items(), key=lambda x: -x[1]):
        print(f"    {bt}: {count}")
    
    # Show sample entry
    if standardized_data:
        print(f"\nSample transformed entry:")
        sample = standardized_data[0].copy()
        # Truncate long URLs for display
        if sample.get("photos"):
            sample["photos"] = sample["photos"][:2]  # Only show first 2
        print(json.dumps(sample, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()


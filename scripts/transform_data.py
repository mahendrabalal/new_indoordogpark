#!/usr/bin/env python3
"""
Generalized transformation script for state parks data.
Converts raw scraped formats into the standardized DogPark schema.
"""

import json
import re
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional

STATE_MAP = {
    "northcarolina": "NC",
    "ohio": "OH",
    "newyork": "NY",
}

def generate_slug(name: str) -> str:
    slug = name.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s-]+', '-', slug)
    return slug.strip('-')

def determine_business_type(type_field: Any, category: Any, name: str) -> str:
    name_lower = name.lower()
    
    if isinstance(type_field, list):
        type_lower = " ".join(str(t).lower() for t in type_field)
    else:
        type_lower = (str(type_field) if type_field else "").lower()
    
    if isinstance(category, list):
        category_lower = " ".join(str(c).lower() for c in category)
    else:
        category_lower = (str(category) if category else "").lower()
    
    if any(keyword in name_lower for keyword in ["indoor", "waterland", "doggieland", "playland"]):
        return "Indoor Dog Park"
    
    if "indoor" in category_lower or "indoor" in type_lower:
        return "Indoor Dog Park"
    
    if "dog park" in category_lower or "dog park" in type_lower:
        return "Dog Park"
    
    if "day care" in category_lower or "daycare" in category_lower:
        return "Indoor Dog Park"
    
    return "Dog-Friendly Establishment"

def transform_working_hours(working_hours: Dict[str, Any]) -> Optional[Dict[str, str]]:
    if not working_hours or not isinstance(working_hours, dict):
        return None
    
    cleaned = {}
    for day, hours in working_hours.items():
        if isinstance(hours, str) and hours.strip() and hours.lower() != "closed":
            cleaned[day] = hours.strip()
        else:
            cleaned[day] = "Closed"
    return cleaned if any(v != "Closed" for v in cleaned.values()) else None

def transform_entry(entry: Dict[str, Any], state_abbr: str, state_slug: str) -> Dict[str, Any]:
    name = entry.get("name", "")
    place_id = entry.get("place_id", entry.get("id", ""))
    
    slug = generate_slug(name)
    business_type = determine_business_type(
        entry.get("type", ""),
        entry.get("category", ""),
        name
    )
    
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
        "zipCode": str(entry.get("postal_code", "")),
        "full_address": entry.get("full_address", ""),
        "latitude": entry.get("latitude"),
        "longitude": entry.get("longitude"),
        "googlePlaceId": place_id,
        "phone": entry.get("phone"),
        "website": entry.get("site"),
        "rating": entry.get("rating", 0),
        "reviewCount": entry.get("reviews", 0),
        "userRatingsTotal": entry.get("reviews", 0),
        "pricing": {
            "pricingSource": "unknown",
            "isFree": False
        },
        "placeTypes": [
            "point_of_interest",
            "establishment"
        ],
        "dataQuality": "verified" if entry.get("verified") == "TRUE" else "partial",
        "openingHours": transform_working_hours(entry.get("working_hours", {})),
        "faqs": [],
        "amenities": {}
    }
    
    # Handle photos from "images" array or "photo" fields
    photos = []
    image_paths = entry.get("images", [])
    if isinstance(image_paths, list):
        for img_path in image_paths:
            if isinstance(img_path, str) and "/images/parks/" in img_path:
                photos.append({
                    "url": img_path,
                    "type": "photo",
                    "source": "website"
                })
    
    main_photo = entry.get("photo")
    if main_photo and "/images/parks/" in main_photo:
        # Check if already in photos
        if not any(p["url"] == main_photo for p in photos):
            photos.append({
                "url": main_photo,
                "type": "photo",
                "source": "website"
            })
    
    if photos:
        standardized["photos"] = photos
        standardized["photo"] = photos[0]["url"]
    
    return {k: v for k, v in standardized.items() if v is not None and v != ""}

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/transform_data.py <state_slug>")
        return
    
    state_slug = sys.argv[1].lower().replace(".json", "")
    state_abbr = STATE_MAP.get(state_slug)
    
    if not state_abbr:
        print(f"Error: No abbreviation map for state '{state_slug}'")
        return
    
    input_filename = f"{state_slug}.json"
    input_path = Path("public/data") / input_filename
    output_path = input_path
    
    if not input_path.exists():
        print(f"Error: {input_path} not found")
        return
    
    print(f"Reading {input_path}...")
    with open(input_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"Transforming {len(data)} entries for {state_abbr}...")
    transformed = [transform_entry(e, state_abbr, state_slug) for e in data if e.get("name")]
    
    # Backup
    backup_path = input_path.with_suffix(".json.backup")
    if not backup_path.exists():
        print(f"Creating backup at {backup_path}...")
        with open(backup_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"Writing {len(transformed)} entries to {output_path}...")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(transformed, f, indent=2, ensure_ascii=False)
    
    print("Transformation complete!")

if __name__ == "__main__":
    main()

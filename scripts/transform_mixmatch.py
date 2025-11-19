#!/usr/bin/env python3
"""
Transform mixmatch.json to match the destination file format (newyork.json/california.json structure)
"""

import json
import re
from typing import Dict, Any, List
from urllib.parse import quote

def slugify(text: str) -> str:
    """Convert text to URL-friendly slug"""
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text.strip('-')

def map_business_type(type_str: str, category: str, subtypes: str) -> str:
    """Map the type/category to businessType"""
    type_lower = (type_str or "").lower()
    category_lower = (category or "").lower()
    subtypes_lower = (subtypes or "").lower()
    
    # Check for indoor dog park
    if "indoor" in type_lower or "indoor" in category_lower or "indoor" in subtypes_lower:
        return "Indoor Dog Park"
    
    # Check for dog park
    if "dog park" in type_lower or "dog park" in category_lower:
        return "Dog Park"
    
    # Check for dog-friendly establishment
    if any(term in type_lower or term in category_lower for term in [
        "dog day care", "pet boarding", "dog trainer", "pet groomer", 
        "kennel", "pet store", "pet supply"
    ]):
        return "Dog-Friendly Establishment"
    
    # Default to Dog-Friendly Establishment for other types
    return "Dog-Friendly Establishment"

def transform_working_hours(working_hours: Any) -> Dict[str, str]:
    """Transform working hours to openingHours format"""
    if not working_hours or working_hours == "":
        return {}
    
    if isinstance(working_hours, dict):
        return working_hours
    
    return {}

def create_photos_array(street_view: str = None, logo: str = None) -> List[Dict[str, str]]:
    """Create photos array from available image URLs"""
    photos = []
    
    if street_view:
        photos.append({
            "url": street_view,
            "type": "photo",
            "source": "google"
        })
    
    if logo and logo != street_view:
        photos.append({
            "url": logo,
            "type": "photo",
            "source": "google"
        })
    
    return photos

def transform_park(park: Dict[str, Any]) -> Dict[str, Any]:
    """Transform a single park entry to match destination format"""
    
    # Get primary photo URL
    primary_photo = park.get("street_view") or park.get("logo") or ""
    
    # Transform the park
    transformed = {
        "id": park.get("place_id", ""),
        "name": park.get("name", ""),
        "businessType": map_business_type(
            park.get("type", ""),
            park.get("category", ""),
            park.get("subtypes", "")
        ),
        "description": park.get("description") or park.get("shortDescription") or park.get("marketingDescription") or "",
        "slug": slugify(park.get("name", "")),
        "address": park.get("street", ""),
        "street": park.get("street", ""),
        "city": park.get("city", ""),
        "state": park.get("state", ""),
        "zipCode": str(park.get("postal_code", "")) if park.get("postal_code") else None,
        "full_address": park.get("full_address", ""),
        "latitude": park.get("latitude"),
        "longitude": park.get("longitude"),
        "googlePlaceId": park.get("place_id", ""),
        "phone": park.get("phone"),
        "website": park.get("site"),
        "photos": create_photos_array(
            park.get("street_view"),
            park.get("logo")
        ),
        "rating": park.get("rating", 0),
        "reviewCount": park.get("reviews", 0),
        "userRatingsTotal": park.get("reviews", 0),
        "pricing": {
            "pricingSource": "unknown",
            "isFree": False
        },
        "placeTypes": [
            "point_of_interest",
            "establishment"
        ],
        "lastUpdated": None,
        "dataQuality": "verified" if park.get("verified") == "TRUE" else "unverified",
        "photo": primary_photo,
        "openingHours": transform_working_hours(park.get("working_hours")),
        "faqs": []
    }
    
    # Add amenities if available from 'about' field
    amenities = {}
    about = park.get("about", {})
    if isinstance(about, dict):
        accessibility = about.get("Accessibility", {})
        if accessibility:
            if accessibility.get("Wheelchair accessible entrance"):
                amenities["handicapAccess"] = True
            if accessibility.get("Wheelchair accessible parking lot"):
                amenities["parking"] = True
        
        # Check for daycare, grooming, training in subtypes
        subtypes = (park.get("subtypes", "") or "").lower()
        if "day care" in subtypes or "daycare" in subtypes:
            amenities["daycare"] = True
        if "groomer" in subtypes or "grooming" in subtypes:
            amenities["grooming"] = True
        if "trainer" in subtypes or "training" in subtypes:
            amenities["training"] = True
    
    if amenities:
        transformed["amenities"] = amenities
    
    # Remove None values for optional fields
    transformed = {k: v for k, v in transformed.items() if v is not None or k in ["lastUpdated", "zipCode"]}
    
    return transformed

def main():
    """Main transformation function"""
    input_file = "public/data/mixmatch.json"
    output_file = "public/data/mixmatch.json"
    
    print(f"Reading {input_file}...")
    with open(input_file, 'r', encoding='utf-8') as f:
        parks = json.load(f)
    
    print(f"Transforming {len(parks)} parks...")
    transformed_parks = [transform_park(park) for park in parks]
    
    print(f"Writing transformed data to {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(transformed_parks, f, indent=2, ensure_ascii=False)
    
    print(f"✓ Successfully transformed {len(transformed_parks)} parks")
    print(f"✓ Output written to {output_file}")

if __name__ == "__main__":
    main()


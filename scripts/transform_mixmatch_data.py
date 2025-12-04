#!/usr/bin/env python3
"""
Transform mixmatch JSON format to standardized dog park format.

Converts data from mixmatch1.json format to the standardized DogPark schema
used by the application.
"""

import json
import re
from pathlib import Path
from typing import Any, Dict, List


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
    
    # The format is already compatible, just return it
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
    
    # Check for other amenities in subtypes or description
    # This is a basic extraction - can be enhanced
    
    return amenities


def create_media_assets(item: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Create media assets from available image sources."""
    photos = []
    
    # First, check if photos array already exists (from downloaded images)
    existing_photos = item.get("photos", [])
    if existing_photos and isinstance(existing_photos, list):
        # Use existing photos if they're in the correct format
        for photo in existing_photos:
            if isinstance(photo, dict) and photo.get("url"):
                photos.append(photo)
            elif isinstance(photo, str):
                # Convert string URL to dict format
                photos.append({
                    "url": photo,
                    "type": "photo",
                    "source": "google_places"
                })
        if photos:
            return photos
    
    # Fallback to logo and street_view if no photos array
    logo = item.get("logo")
    street_view = item.get("street_view")
    
    if logo:
        photos.append({
            "url": logo,
            "type": "photo",
            "source": "website",
            "caption": "Logo"
        })
    
    if street_view:
        photos.append({
            "url": street_view,
            "type": "photo",
            "source": "google_street_view",
            "caption": "Street View"
        })
    
    return photos


def transform_mixmatch_data(mixmatch_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Transform mixmatch format to standardized format."""
    standardized_data = []
    
    for item in mixmatch_data:
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
        park_id = item.get("place_id") or item.get("id") or f"mixmatch_{slug}"
        
        # Convert state to abbreviation for consistency
        state_full = item.get("state") or item.get("us_state", "")
        state_abbr = convert_state_name_to_abbr(state_full) if state_full else ""
        
        # Get zip code
        zip_code = str(item.get("postal_code", "")) if item.get("postal_code") else ""
        
        # Convert working hours
        opening_hours = convert_working_hours(item.get("working_hours", {}))
        
        # Extract amenities
        amenities = extract_amenities(item.get("about", {}))
        
        # Create media assets
        photos = create_media_assets(item)
        
        # Get primary photo for backward compatibility
        photo = None
        if photos:
            photo = photos[0]["url"]
        
        # Create standardized entry
        standardized_entry = {
            "id": park_id,
            "name": item.get("name", ""),
            "businessType": business_type,
            "description": item.get("description", item.get("shortDescription", "")),
            "slug": slug,
            "address": item.get("street", ""),
            "street": item.get("street", ""),
            "city": item.get("city", ""),
            "state": state_abbr,
            "zipCode": zip_code,
            "full_address": item.get("full_address", ""),
            "latitude": item.get("latitude"),
            "longitude": item.get("longitude"),
            "googlePlaceId": park_id if park_id.startswith("ChIJ") else None,
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
            "lastUpdated": None,
            "dataQuality": "verified" if item.get("verified") == "TRUE" else "partial"
        }
        
        # Remove None values for cleaner output
        standardized_entry = {k: v for k, v in standardized_entry.items() if v is not None}
        
        standardized_data.append(standardized_entry)
    
    return standardized_data


def main():
    """Main function to transform and save the data."""
    input_path = Path('public/data/mixmatch1.json')
    output_path = Path('public/data/standardized_dog_parks.json')
    
    if not input_path.exists():
        print(f"❌ Error: Input file not found: {input_path}")
        return
    
    print("=" * 80)
    print("MIXMATCH DATA TRANSFORMATION")
    print("=" * 80)
    print(f"📄 Reading: {input_path}")
    
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
    
    # Transform the data
    print("\n🔄 Transforming to standardized format...")
    standardized_data = transform_mixmatch_data(mixmatch_data)
    
    print(f"   ✓ Transformed {len(standardized_data)} records")
    
    # Save the transformed data
    print(f"\n💾 Saving to: {output_path}")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(standardized_data, f, indent=2, ensure_ascii=False)
    
    print(f"   ✓ Saved successfully")
    
    # Print statistics
    print("\n📊 Statistics:")
    print(f"   Total parks: {len(standardized_data)}")
    
    # Count by business type
    business_types = {}
    for park in standardized_data:
        bt = park.get("businessType", "Unknown")
        business_types[bt] = business_types.get(bt, 0) + 1
    
    print(f"   Business types:")
    for bt, count in sorted(business_types.items()):
        print(f"     - {bt}: {count}")
    
    # Count with photos
    parks_with_photos = len([p for p in standardized_data if p.get("photos")])
    print(f"   Parks with photos: {parks_with_photos}/{len(standardized_data)}")
    
    # Count with amenities
    parks_with_amenities = len([p for p in standardized_data if p.get("amenities")])
    print(f"   Parks with amenities: {parks_with_amenities}/{len(standardized_data)}")
    
    # Print a sample entry
    if standardized_data:
        print("\n📝 Sample transformed entry:")
        sample = standardized_data[0].copy()
        # Truncate long URLs for display
        if sample.get("photos"):
            for photo in sample["photos"]:
                if photo.get("url") and len(photo["url"]) > 50:
                    photo["url"] = photo["url"][:50] + "..."
        if sample.get("photo") and len(sample["photo"]) > 50:
            sample["photo"] = sample["photo"][:50] + "..."
        print(json.dumps(sample, indent=2))
    
    print("\n✅ Transformation complete!")


if __name__ == "__main__":
    main()


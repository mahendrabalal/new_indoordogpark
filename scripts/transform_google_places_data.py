import json
import re
from pathlib import Path
from typing import Any, Dict, List

from description_generator import generate_description, normalize_context

def extract_address_components(formatted_address: str) -> Dict[str, str]:
    """Extract address components from formatted address."""
    # Add ", USA" if not present for consistency
    if not formatted_address.endswith(', USA'):
        formatted_address += ', USA'
    
    # Parse address components
    parts = formatted_address.split(',')
    
    street = parts[0].strip() if len(parts) > 0 else ""
    
    city = ""
    state = ""
    zip_code = ""
    
    if len(parts) >= 3:
        # Format: "Street, City, State ZIP, USA"
        city_state_zip = parts[1].strip()
        city = city_state_zip
        
        if len(parts) >= 4:
            state_zip = parts[2].strip()
            state_zip_parts = state_zip.split()
            if len(state_zip_parts) >= 2:
                state_abbr = state_zip_parts[0]
                zip_code = ' '.join(state_zip_parts[1:])
                # Convert state abbreviation to full name
                state = convert_state_abbr(state_abbr)
            else:
                state = convert_state_abbr(state_zip)
    elif len(parts) == 2:
        # Format: "Street, City State ZIP"
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
        "state": state if state else "California",  # Default to California for CA addresses
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
    
    # Handle case where full state name might already be provided
    if len(state_abbr) > 2:
        return state_abbr.title()
    
    return state_mapping.get(state_abbr.upper(), state_abbr.title())

def generate_slug(name: str) -> str:
    """Generate URL-friendly slug from name."""
    # Convert to lowercase and replace spaces with hyphens
    slug = name.lower()
    # Remove special characters except hyphens and spaces
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    # Replace multiple spaces/hyphens with single hyphen
    slug = re.sub(r'[\s-]+', '-', slug)
    # Remove leading/trailing hyphens
    slug = slug.strip('-')
    return slug

def determine_business_type(types: List[str], name: str) -> str:
    """Determine business type based on Google Places types and name."""
    name_lower = name.lower()
    
    # Check for indoor facilities first
    if any(keyword in name_lower for keyword in ["indoor", "waterland", "doggieland", "playland"]):
        return "Indoor Dog Park"
    # Check for dog parks
    elif "dog_park" in types:
        return "Dog Park"
    # Check for dog-friendly establishments
    elif any(type_name in types for type_name in ["cafe", "bar", "restaurant", "food"]):
        return "Dog-Friendly Establishment"
    # Check for stores
    elif any(type_name in types for type_name in ["clothing_store", "store"]):
        return "Dog-Friendly Establishment"
    # Default to dog park if it has "park" in types
    elif "park" in types:
        return "Dog Park"
    else:
        return "Dog Park"

def create_media_assets(images: List[str]) -> List[Dict[str, Any]]:
    """Convert image URLs to MediaAsset format."""
    if not images:
        return []

    media_assets = []
    for i, url in enumerate(images):
        media_assets.append({
            "url": url,
            "type": "photo",
            "source": "google_places",
            "caption": f"Photo {i + 1}"
        })
    return media_assets

def transform_google_places_data(google_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Transform Google Places data to standardized format."""
    standardized_data = []
    
    for place in google_data:
        # Extract address components
        address_components = extract_address_components(place.get("formattedAddress", ""))
        
        # Generate slug
        slug = generate_slug(place.get("displayName", {}).get("text", ""))
        
        # Determine business type
        business_type = determine_business_type(place.get("types", []), place.get("displayName", {}).get("text", ""))
        
        # Prepare context for description generator
        raw_context = place.copy()
        raw_context.update(
            {
                "id": place.get("id"),
                "name": place.get("displayName", {}).get("text", ""),
                "businessType": business_type,
                "business_type": business_type,
                "city": address_components.get("city"),
                "state": address_components.get("state"),
                "full_address": address_components.get("full_address"),
                "openingHours": place.get("regularOpeningHours", {}).get("weekdayDescriptions"),
                "pricing": place.get("priceLevel") or place.get("pricingInfo"),
                "amenities": place.get("amenities") or place.get("features"),
                "uniqueNotes": place.get("editorialSummary", {}).get("text"),
                "phone": place.get("nationalPhoneNumber"),
                "website": place.get("websiteUri"),
            }
        )
        description_context = normalize_context(raw_context)
        description = generate_description(description_context)
        
        # Handle images - support up to 10 images
        images = []
        photo = ""
        photo2 = ""
        photo3 = ""

        # Check for imageUrls from enhanced data
        if "imageUrls" in place:
            image_urls = place["imageUrls"][:10]  # Limit to 10 images
            images = create_media_assets(image_urls)
            # Also populate legacy fields for backward compatibility
            if len(image_urls) >= 1:
                photo = image_urls[0]
            if len(image_urls) >= 2:
                photo2 = image_urls[1]
            if len(image_urls) >= 3:
                photo3 = image_urls[2]
        # Fallback: check for photos array and create URLs manually
        elif "photos" in place and place["photos"]:
            # Create photo URLs from photo references (up to 10)
            image_urls = []
            for photo_data in place["photos"][:10]:
                if "name" in photo_data:
                    image_urls.append(f"https://places.googleapis.com/v1/{photo_data['name']}/media?maxWidthPx=800")

            images = create_media_assets(image_urls)
            # Also populate legacy fields for backward compatibility
            if len(image_urls) >= 1:
                photo = image_urls[0]
            if len(image_urls) >= 2:
                photo2 = image_urls[1]
            if len(image_urls) >= 3:
                photo3 = image_urls[2]

        # Create standardized entry with new schema
        standardized_entry = {
            "id": place.get("id", ""),
            "name": place.get("displayName", {}).get("text", ""),
            "businessType": business_type,
            "description": description,
            "slug": slug,
            "address": address_components["street"],
            "street": address_components["street"],
            "city": address_components["city"],
            "state": address_components["state"],
            "zipCode": address_components.get("zip_code", ""),
            "full_address": address_components["full_address"],
            "phone": place.get("nationalPhoneNumber", ""),
            "latitude": place.get("location", {}).get("latitude", 0),
            "longitude": place.get("location", {}).get("longitude", 0),
            "rating": place.get("rating", 0),
            "reviewCount": place.get("userRatingCount", 0),
            "photos": images if images else None,
            "amenities": place.get("amenities") or {},
            "openingHours": place.get("regularOpeningHours", {}).get("weekdayDescriptions") or [],
            # Backward compatibility - legacy photo fields
            "photo": photo if photo else None,
            "photo2": photo2 if photo2 else None,
            "photo3": photo3 if photo3 else None,
            "images": [img["url"] for img in images] if images else []  # Legacy flat array
        }
        
        # Add website if available
        if place.get("websiteUri"):
            standardized_entry["website"] = place["websiteUri"]
        
        # Add place types for reference
        if place.get("types"):
            standardized_entry["placeTypes"] = place["types"]
        
        standardized_data.append(standardized_entry)
    
    return standardized_data

def main():
    """Main function to transform and save the data."""
    # Try to read the enhanced data with images first, fallback to original data
    enhanced_data_path = 'public/data/google_places_dog_parks_with_images.json'
    original_data_path = 'public/data/google_places_dog_parks.json'
    
    google_data = None
    data_source = ""
    
    # Try enhanced data first
    if Path(enhanced_data_path).exists():
        try:
            with open(enhanced_data_path, 'r', encoding='utf-8') as f:
                google_data = json.load(f)
            data_source = "enhanced data with images"
        except Exception as e:
            print(f"Error reading enhanced data: {e}")
    
    # Fallback to original data
    if google_data is None:
        try:
            with open(original_data_path, 'r', encoding='utf-8') as f:
                google_data = json.load(f)
            data_source = "original data (no images)"
        except Exception as e:
            print(f"Error reading original data: {e}")
            return
    
    # Transform the data
    standardized_data = transform_google_places_data(google_data)
    
    # Save the transformed data
    output_path = 'public/data/standardized_dog_parks.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(standardized_data, f, indent=2, ensure_ascii=False)
    
    print(f"Transformed {len(standardized_data)} records to standardized format")
    print(f"Data source: {data_source}")
    print(f"Output saved to: {output_path}")
    
    # Count records with images
    records_with_images = len([item for item in standardized_data if item.get("images")])
    print(f"Records with images: {records_with_images}/{len(standardized_data)}")
    
    # Print a sample entry
    if standardized_data:
        print("\nSample transformed entry:")
        sample = standardized_data[0].copy()
        # Truncate long image URLs for display
        if sample.get("images"):
            sample["images"] = [url[:50] + "..." if len(url) > 50 else url for url in sample["images"][:2]]
        if sample.get("photo") and len(sample["photo"]) > 50:
            sample["photo"] = sample["photo"][:50] + "..."
        print(json.dumps(sample, indent=2))

if __name__ == "__main__":
    main()
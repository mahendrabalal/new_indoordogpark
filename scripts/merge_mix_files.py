#!/usr/bin/env python3
"""
Merge mix.json and mixmatch.json files.
Handles duplicates by preferring entries with more complete data.
"""

import json
from pathlib import Path
from typing import Any, Dict, List, Set

def get_entry_key(entry: Dict[str, Any]) -> tuple:
    """Generate a unique key for an entry based on id, name, and slug."""
    entry_id = entry.get("id", "").strip()
    name = entry.get("name", "").strip().lower()
    slug = entry.get("slug", "").strip().lower()
    
    # Prefer id if available, otherwise use name or slug
    if entry_id and not entry_id.startswith("mixmatch_"):
        return ("id", entry_id)
    elif name:
        return ("name", name)
    elif slug:
        return ("slug", slug)
    else:
        return ("unknown", str(hash(str(entry))))

def get_data_completeness_score(entry: Dict[str, Any]) -> int:
    """Calculate a score for data completeness (higher = more complete)."""
    score = 0
    
    # Required fields
    if entry.get("id"): score += 10
    if entry.get("name"): score += 10
    if entry.get("businessType"): score += 10
    if entry.get("slug"): score += 5
    
    # Location fields
    if entry.get("latitude") and entry.get("longitude"): score += 10
    if entry.get("address"): score += 5
    if entry.get("city"): score += 5
    if entry.get("state"): score += 5
    if entry.get("zipCode"): score += 5
    
    # Contact fields
    if entry.get("phone"): score += 5
    if entry.get("website"): score += 5
    
    # Media
    if entry.get("photos") and len(entry.get("photos", [])) > 0: score += 10
    if entry.get("photo"): score += 5
    
    # Ratings
    if entry.get("rating", 0) > 0: score += 5
    if entry.get("reviewCount", 0) > 0: score += 5
    
    # Hours
    if entry.get("openingHours"): score += 5
    
    # Additional fields
    if entry.get("description"): score += 5
    if entry.get("googlePlaceId"): score += 5
    if entry.get("pricing"): score += 3
    if entry.get("placeTypes"): score += 3
    if entry.get("amenities"): score += 3
    
    return score

def normalize_entry(entry: Dict[str, Any]) -> Dict[str, Any]:
    """Normalize an entry to ensure consistent format."""
    normalized = entry.copy()
    
    # Ensure state is abbreviation (not empty)
    if normalized.get("state") == "":
        # Try to extract from full_address
        full_addr = normalized.get("full_address", "")
        if full_addr:
            parts = full_addr.split(",")
            if len(parts) >= 2:
                state_zip = parts[-2].strip()
                state_parts = state_zip.split()
                if len(state_parts) >= 1:
                    state_abbr = state_parts[0]
                    if len(state_abbr) == 2:
                        normalized["state"] = state_abbr
    
    # Ensure googlePlaceId is set if id exists and doesn't start with "mixmatch_"
    if normalized.get("id") and not normalized.get("googlePlaceId"):
        if not normalized["id"].startswith("mixmatch_"):
            normalized["googlePlaceId"] = normalized["id"]
    
    # Ensure userRatingsTotal matches reviewCount if not set
    if normalized.get("reviewCount") and not normalized.get("userRatingsTotal"):
        normalized["userRatingsTotal"] = normalized["reviewCount"]
    
    # Ensure pricing object exists
    if not normalized.get("pricing"):
        normalized["pricing"] = {
            "pricingSource": "unknown",
            "isFree": False
        }
    
    # Remove None values and empty strings for optional fields
    cleaned = {}
    for k, v in normalized.items():
        if v is not None and v != "":
            cleaned[k] = v
    
    return cleaned

def merge_entries(entry1: Dict[str, Any], entry2: Dict[str, Any]) -> Dict[str, Any]:
    """Merge two entries, preferring more complete data."""
    score1 = get_data_completeness_score(entry1)
    score2 = get_data_completeness_score(entry2)
    
    # Start with the more complete entry
    merged = (entry1 if score1 >= score2 else entry2).copy()
    other = (entry2 if score1 >= score2 else entry1)
    
    # Fill in missing fields from the other entry
    for key, value in other.items():
        if key not in merged or not merged[key]:
            if value:  # Only add if value is truthy
                merged[key] = value
        # Special handling for photos - merge arrays
        elif key == "photos" and isinstance(value, list) and isinstance(merged.get(key), list):
            existing_urls = {p.get("url") for p in merged[key] if p.get("url")}
            for photo in value:
                if photo.get("url") and photo.get("url") not in existing_urls:
                    merged[key].append(photo)
    
    return normalize_entry(merged)

def main():
    """Main function to merge the files."""
    mix_path = Path("public/data/mix.json")
    mixmatch_path = Path("public/data/mixmatch.json")
    output_path = Path("public/data/mix.json")
    backup_path = Path("public/data/mix.json.backup")
    
    # Load files
    print(f"Loading {mix_path}...")
    with open(mix_path, 'r', encoding='utf-8') as f:
        mix_data = json.load(f)
    
    print(f"Loading {mixmatch_path}...")
    with open(mixmatch_path, 'r', encoding='utf-8') as f:
        mixmatch_data = json.load(f)
    
    print(f"mix.json: {len(mix_data)} entries")
    print(f"mixmatch.json: {len(mixmatch_data)} entries")
    
    # Create a dictionary to track entries by key
    merged_dict: Dict[tuple, Dict[str, Any]] = {}
    duplicates: List[tuple] = []
    
    # Process mix.json entries
    for entry in mix_data:
        key = get_entry_key(entry)
        if key in merged_dict:
            # Merge duplicate
            duplicates.append(key)
            merged_dict[key] = merge_entries(merged_dict[key], entry)
        else:
            merged_dict[key] = normalize_entry(entry)
    
    # Process mixmatch.json entries
    for entry in mixmatch_data:
        key = get_entry_key(entry)
        if key in merged_dict:
            # Merge duplicate
            if key not in duplicates:
                duplicates.append(key)
            merged_dict[key] = merge_entries(merged_dict[key], entry)
        else:
            merged_dict[key] = normalize_entry(entry)
    
    # Convert back to list
    merged_data = list(merged_dict.values())
    
    # Sort by name for consistency
    merged_data.sort(key=lambda x: x.get("name", "").lower())
    
    print(f"\nMerge complete!")
    print(f"  - Total unique entries: {len(merged_data)}")
    print(f"  - Duplicates merged: {len(duplicates)}")
    print(f"  - From mix.json: {len(mix_data)}")
    print(f"  - From mixmatch.json: {len(mixmatch_data)}")
    print(f"  - Net new entries: {len(merged_data) - len(mix_data)}")
    
    # Create backup
    if not backup_path.exists():
        print(f"\nCreating backup at {backup_path}...")
        with open(backup_path, 'w', encoding='utf-8') as f:
            json.dump(mix_data, f, indent=2, ensure_ascii=False)
    
    # Write merged data
    print(f"Writing merged data to {output_path}...")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(merged_data, f, indent=2, ensure_ascii=False)
    
    # Print some statistics
    print(f"\nStatistics:")
    print(f"  - With photos: {sum(1 for e in merged_data if e.get('photos'))}")
    print(f"  - With opening hours: {sum(1 for e in merged_data if e.get('openingHours'))}")
    print(f"  - With websites: {sum(1 for e in merged_data if e.get('website'))}")
    print(f"  - With coordinates: {sum(1 for e in merged_data if e.get('latitude') and e.get('longitude'))}")
    
    if duplicates:
        print(f"\nDuplicates merged (showing first 10):")
        for i, key in enumerate(duplicates[:10]):
            entry = merged_dict[key]
            print(f"  {i+1}. {entry.get('name', 'Unknown')} (key: {key[0]})")

if __name__ == "__main__":
    main()













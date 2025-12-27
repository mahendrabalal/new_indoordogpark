#!/usr/bin/env python3
"""
Add unique parks from mix.json to mixmatch.json.
Keep mixmatch.json as the main file and delete mix.json.
"""

import json
from pathlib import Path
from typing import Any, Dict

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

def main():
    """Main function to add mix.json entries to mixmatch.json."""
    mix_path = Path("public/data/mix.json")
    mixmatch_path = Path("public/data/mixmatch.json")
    backup_path = Path("public/data/mixmatch.json.backup")
    
    # Load files
    print(f"Loading {mix_path}...")
    with open(mix_path, 'r', encoding='utf-8') as f:
        mix_data = json.load(f)
    
    print(f"Loading {mixmatch_path}...")
    with open(mixmatch_path, 'r', encoding='utf-8') as f:
        mixmatch_data = json.load(f)
    
    print(f"mix.json: {len(mix_data)} parks")
    print(f"mixmatch.json: {len(mixmatch_data)} parks")
    
    # Create a dictionary to track entries by key
    mixmatch_dict: Dict[tuple, Dict[str, Any]] = {}
    
    # Process mixmatch.json entries first (these are the base)
    for entry in mixmatch_data:
        key = get_entry_key(entry)
        if key not in mixmatch_dict:
            mixmatch_dict[key] = normalize_entry(entry)
    
    # Find unique entries from mix.json
    unique_from_mix = []
    duplicates = []
    
    for entry in mix_data:
        key = get_entry_key(entry)
        if key not in mixmatch_dict:
            # This is a new unique entry
            unique_from_mix.append(normalize_entry(entry))
        else:
            duplicates.append(key)
    
    # Add unique entries to mixmatch_dict
    for entry in unique_from_mix:
        key = get_entry_key(entry)
        mixmatch_dict[key] = entry
    
    # Convert back to list
    merged_data = list(mixmatch_dict.values())
    
    # Sort by name for consistency
    merged_data.sort(key=lambda x: x.get("name", "").lower())
    
    print(f"\nAnalysis:")
    print(f"  - Unique parks in mix.json (not in mixmatch.json): {len(unique_from_mix)}")
    print(f"  - Duplicate parks (already in mixmatch.json): {len(duplicates)}")
    print(f"  - Total parks in mixmatch.json (after merge): {len(merged_data)}")
    
    if unique_from_mix:
        print(f"\nNew parks added from mix.json:")
        for i, entry in enumerate(unique_from_mix[:20], 1):
            print(f"  {i}. {entry.get('name', 'Unknown')}")
        if len(unique_from_mix) > 20:
            print(f"  ... and {len(unique_from_mix) - 20} more")
    
    # Create backup
    if not backup_path.exists():
        print(f"\nCreating backup at {backup_path}...")
        with open(backup_path, 'w', encoding='utf-8') as f:
            json.dump(mixmatch_data, f, indent=2, ensure_ascii=False)
    
    # Write merged data to mixmatch.json
    print(f"\nWriting merged data to {mixmatch_path}...")
    with open(mixmatch_path, 'w', encoding='utf-8') as f:
        json.dump(merged_data, f, indent=2, ensure_ascii=False)
    
    # Delete mix.json
    print(f"Deleting {mix_path}...")
    mix_path.unlink()
    
    print(f"\n✓ Complete!")
    print(f"  - Added {len(unique_from_mix)} new parks from mix.json to mixmatch.json")
    print(f"  - mix.json has been deleted")
    print(f"  - mixmatch.json now contains {len(merged_data)} parks total")

if __name__ == "__main__":
    main()







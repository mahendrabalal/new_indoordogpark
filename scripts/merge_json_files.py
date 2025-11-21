#!/usr/bin/env python3
"""
Merge iowa.json, newyork.json, georgia.json with mixmatch.json
and save the result as mixmatch.json
"""

import json
from pathlib import Path

def load_json_file(filepath):
    """Load JSON file and return the data"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json_file(filepath, data):
    """Save data to JSON file"""
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def main():
    base_dir = Path("public/data")
    
    # Load all files
    print("Loading files...")
    mixmatch = load_json_file(base_dir / "mixmatch.json")
    iowa = load_json_file(base_dir / "iowa.json")
    newyork = load_json_file(base_dir / "newyork.json")
    georgia = load_json_file(base_dir / "georgia.json")
    
    print(f"  mixmatch.json: {len(mixmatch)} parks")
    print(f"  iowa.json: {len(iowa)} parks")
    print(f"  newyork.json: {len(newyork)} parks")
    print(f"  georgia.json: {len(georgia)} parks")
    
    # Combine all parks
    all_parks = mixmatch + iowa + newyork + georgia
    print(f"\nTotal parks before deduplication: {len(all_parks)}")
    
    # Remove duplicates based on id or googlePlaceId
    seen_ids = set()
    unique_parks = []
    duplicates = []
    
    for park in all_parks:
        park_id = park.get("id") or park.get("googlePlaceId")
        if park_id:
            if park_id not in seen_ids:
                seen_ids.add(park_id)
                unique_parks.append(park)
            else:
                duplicates.append(park.get("name", "Unknown"))
        else:
            # If no ID, include it anyway (shouldn't happen but be safe)
            unique_parks.append(park)
    
    print(f"Total parks after deduplication: {len(unique_parks)}")
    if duplicates:
        print(f"Removed {len(duplicates)} duplicate(s): {', '.join(duplicates[:5])}")
        if len(duplicates) > 5:
            print(f"  ... and {len(duplicates) - 5} more")
    
    # Save merged result
    output_file = base_dir / "mixmatch.json"
    print(f"\nSaving merged data to {output_file}...")
    save_json_file(output_file, unique_parks)
    
    print(f"✓ Successfully merged {len(unique_parks)} unique parks into mixmatch.json")

if __name__ == "__main__":
    main()






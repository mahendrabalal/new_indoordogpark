#!/usr/bin/env python3
"""
Merge mixmatch.json and mixmatch1.json into a single file.
Removes duplicates based on id/googlePlaceId and saves to mixmatch.json
"""

import json
from pathlib import Path
from typing import Dict, List, Any, Set

def get_park_id(park: Dict[str, Any]) -> str:
    """Get unique identifier for a park (id or googlePlaceId)."""
    return park.get("id") or park.get("googlePlaceId") or ""

def merge_parks(parks1: List[Dict[str, Any]], parks2: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Merge two park lists, removing duplicates based on id/googlePlaceId."""
    seen_ids: Set[str] = set()
    merged: List[Dict[str, Any]] = []
    
    # Add parks from first list
    for park in parks1:
        park_id = get_park_id(park)
        if park_id and park_id not in seen_ids:
            seen_ids.add(park_id)
            merged.append(park)
        elif not park_id:
            # Park without ID - add it anyway
            merged.append(park)
    
    # Add parks from second list (skip duplicates)
    duplicates = 0
    for park in parks2:
        park_id = get_park_id(park)
        if park_id and park_id in seen_ids:
            duplicates += 1
            continue
        elif park_id:
            seen_ids.add(park_id)
        merged.append(park)
    
    return merged, duplicates

def main():
    """Main function to merge the files."""
    mixmatch_path = Path('public/data/mixmatch.json')
    mixmatch1_path = Path('public/data/mixmatch1.json')
    backup_path = Path('public/data/mixmatch.json.backup_merge')
    
    # Load both files
    print(f"Loading {mixmatch_path}...")
    with open(mixmatch_path, 'r', encoding='utf-8') as f:
        parks1 = json.load(f)
    print(f"✓ Loaded {len(parks1)} parks from mixmatch.json")
    
    print(f"Loading {mixmatch1_path}...")
    with open(mixmatch1_path, 'r', encoding='utf-8') as f:
        parks2 = json.load(f)
    print(f"✓ Loaded {len(parks2)} parks from mixmatch1.json")
    
    # Create backup
    if mixmatch_path.exists() and not backup_path.exists():
        print(f"Creating backup: {backup_path}")
        import shutil
        shutil.copy(mixmatch_path, backup_path)
        print(f"✓ Backup created")
    
    # Merge parks
    print(f"\nMerging parks...")
    merged_parks, duplicates = merge_parks(parks1, parks2)
    
    print(f"✓ Merged {len(merged_parks)} unique parks")
    if duplicates > 0:
        print(f"  Skipped {duplicates} duplicate(s)")
    
    # Save merged result to mixmatch.json
    print(f"\nSaving merged data to {mixmatch_path}...")
    with open(mixmatch_path, 'w', encoding='utf-8') as f:
        json.dump(merged_parks, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Merge complete!")
    print(f"  Original mixmatch.json: {len(parks1)} parks")
    print(f"  mixmatch1.json: {len(parks2)} parks")
    print(f"  Merged result: {len(merged_parks)} parks")
    print(f"  Backup saved to: {backup_path}")

if __name__ == "__main__":
    main()


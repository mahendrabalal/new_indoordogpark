#!/usr/bin/env python3
"""
Copy photos from duplicate entries that have images to entries without images.
"""

import json
from pathlib import Path
from typing import Dict, List, Any

def find_parks_without_images(data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Find parks that don't have images."""
    parks_without_images = []
    
    for park in data:
        has_photos = False
        
        # Check photos array
        if park.get('photos') and isinstance(park.get('photos'), list) and len(park.get('photos', [])) > 0:
            has_photos = True
        
        # Check photo field (legacy)
        if park.get('photo'):
            has_photos = True
        
        if not has_photos:
            parks_without_images.append(park)
    
    return parks_without_images

def find_duplicate_with_photos(data: List[Dict[str, Any]], park_name: str, address: str = "") -> Dict[str, Any]:
    """Find a duplicate entry with the same name that has photos."""
    name_lower = park_name.lower()
    
    for park in data:
        if park.get('name', '').lower() == name_lower:
            has_photos = False
            if park.get('photos') and isinstance(park.get('photos'), list) and len(park.get('photos', [])) > 0:
                has_photos = True
            if park.get('photo'):
                has_photos = True
            
            # If address matches (or no address specified), return this one
            if has_photos:
                if not address or park.get('address', '').lower() == address.lower():
                    return park
    
    return None

def main():
    """Main function to copy photos from duplicates."""
    mixmatch_path = Path("public/data/mixmatch.json")
    backup_path = Path("public/data/mixmatch.json.backup")
    
    print("Loading mixmatch.json...")
    with open(mixmatch_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Find parks without images
    parks_without_images = find_parks_without_images(data)
    
    print(f"\nFound {len(parks_without_images)} parks without images")
    
    if not parks_without_images:
        print("\nAll parks already have images!")
        return
    
    # Create backup if it doesn't exist
    if not backup_path.exists():
        print(f"\nCreating backup at {backup_path}...")
        with open(backup_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    
    updated_count = 0
    
    print(f"\nCopying photos from duplicate entries...")
    for i, park in enumerate(parks_without_images, 1):
        park_name = park.get('name', 'Unknown')
        park_address = park.get('address', '')
        
        print(f"\n[{i}/{len(parks_without_images)}] {park_name}")
        
        # Find duplicate with photos
        duplicate = find_duplicate_with_photos(data, park_name, park_address)
        
        if duplicate:
            # Copy photos
            if duplicate.get('photos'):
                park_index = data.index(park)
                data[park_index]['photos'] = duplicate['photos'].copy()
                
                # Also copy photo field if it exists
                if duplicate.get('photo'):
                    data[park_index]['photo'] = duplicate['photo']
                
                print(f"  ✓ Copied {len(duplicate.get('photos', []))} photos from duplicate entry")
                updated_count += 1
            else:
                print(f"  ✗ Duplicate found but has no photos")
        else:
            print(f"  ✗ No duplicate with photos found")
    
    # Save updated data
    print(f"\nSaving updated data to {mixmatch_path}...")
    with open(mixmatch_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"\n✓ Complete!")
    print(f"  - Parks updated with photos: {updated_count}")
    print(f"  - Total parks now with images: {sum(1 for p in data if p.get('photos') or p.get('photo'))}/{len(data)}")

if __name__ == "__main__":
    main()







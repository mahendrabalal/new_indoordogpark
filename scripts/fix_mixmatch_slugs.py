#!/usr/bin/env python3
"""
Fix slugs in mixmatch.json to include city name for consistency.
This ensures all park pages are accessible via URLs that include the city.
"""

import json
import re
from pathlib import Path

def slugify(text: str) -> str:
    """Convert text to URL-friendly slug"""
    text = text.lower()
    # Handle apostrophes - convert 's to -s- and other apostrophes to -
    text = text.replace("'s", "-s-")
    text = text.replace("'", "-")
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text.strip('-')

def generate_slug(name: str, city: str) -> str:
    """Generate slug with city name"""
    name_slug = slugify(name)
    city_slug = slugify(city)
    return f"{name_slug}-{city_slug}"

def main():
    """Main function to fix slugs"""
    input_path = Path('public/data/mixmatch.json')
    backup_path = Path('public/data/mixmatch.json.backup_slugs')
    
    print(f"Loading {input_path}...")
    with open(input_path, 'r', encoding='utf-8') as f:
        parks = json.load(f)
    
    print(f"✓ Loaded {len(parks)} parks")
    
    # Create backup
    if not backup_path.exists():
        print(f"Creating backup: {backup_path}")
        import shutil
        shutil.copy(input_path, backup_path)
        print(f"✓ Backup created")
    
    # Update slugs
    updated_count = 0
    for park in parks:
        name = park.get("name", "")
        city = park.get("city", "")
        current_slug = park.get("slug", "")
        
        if not name or not city:
            continue
        
        # Generate new slug with city
        new_slug = generate_slug(name, city)
        
        # Only update if slug doesn't already include city or is different
        if current_slug != new_slug:
            park["slug"] = new_slug
            updated_count += 1
            print(f"  Updated: {name} ({city})")
            print(f"    Old: {current_slug}")
            print(f"    New: {new_slug}")
    
    # Save updated data
    print(f"\nSaving updated data to {input_path}...")
    with open(input_path, 'w', encoding='utf-8') as f:
        json.dump(parks, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Slug update complete!")
    print(f"  Total parks: {len(parks)}")
    print(f"  Slugs updated: {updated_count}")
    print(f"  Backup saved to: {backup_path}")

if __name__ == "__main__":
    main()


#!/usr/bin/env python3
"""
Clean up remaining Google Places API URLs from the JSON file.
Removes photo2, photo3, and images fields with Google URLs.
"""

import json
import re

def cleanup_parks_data():
    """Remove Google Places URLs from JSON."""
    with open('public/data/california.json', 'r') as f:
        parks = json.load(f)

    removed_count = 0

    for park in parks:
        # Remove photo2, photo3 fields
        if 'photo2' in park and 'places.googleapis.com' in park['photo2']:
            del park['photo2']
            removed_count += 1

        if 'photo3' in park and 'places.googleapis.com' in park['photo3']:
            del park['photo3']
            removed_count += 1

        # Clean up images array - remove Google URLs but keep local ones
        if 'images' in park and isinstance(park['images'], list):
            park['images'] = [img for img in park['images']
                            if not isinstance(img, str) or 'places.googleapis.com' not in img]

    # Save cleaned data
    with open('public/data/california.json', 'w') as f:
        json.dump(parks, f, indent=2)

    print(f"✓ Cleaned {removed_count} fields with Google URLs")
    print(f"✓ Parks file saved")

if __name__ == '__main__':
    cleanup_parks_data()

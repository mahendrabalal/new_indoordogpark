#!/usr/bin/env python3
"""
Script to download Google Places images locally for self-hosting.
Downloads the first photo from each park and saves to /public/images/parks/
"""

import json
import os
import requests
from pathlib import Path
from urllib.parse import urlparse
import sys
from datetime import datetime

# Configuration
DATA_FILE = 'public/data/california.json'
IMAGES_DIR = 'public/images/parks'
TIMEOUT = 30  # seconds
MAX_RETRIES = 3

def ensure_images_directory():
    """Create images directory if it doesn't exist."""
    Path(IMAGES_DIR).mkdir(parents=True, exist_ok=True)
    print(f"✓ Images directory ready: {IMAGES_DIR}")

def download_image(url, filename, retries=MAX_RETRIES):
    """
    Download an image from URL and save it locally.
    Returns True if successful, False otherwise.
    """
    filepath = os.path.join(IMAGES_DIR, filename)

    # Skip if already downloaded
    if os.path.exists(filepath):
        return True

    for attempt in range(retries):
        try:
            response = requests.get(url, timeout=TIMEOUT, stream=True)
            response.raise_for_status()

            # Write the image file
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)

            return True
        except Exception as e:
            if attempt < retries - 1:
                print(f"  ⚠ Retry {attempt + 1}/{retries} for {filename}: {str(e)[:50]}")
            else:
                print(f"  ✗ Failed to download {filename}: {str(e)[:80]}")
                return False

    return False

def get_image_filepath(park_city, park_slug):
    """Generate a filepath for the park image organized by city."""
    # Normalize city name to lowercase with hyphens
    city_folder = park_city.lower().replace(' ', '-') if park_city else 'unknown'
    filename = f"{park_slug}.jpg" if park_slug else f"{park_city.lower()}.jpg"
    return f"{city_folder}/{filename}"

def process_parks():
    """Load parks data, download images, and update JSON."""
    print(f"\n📥 Loading parks data from {DATA_FILE}...")

    with open(DATA_FILE, 'r') as f:
        parks = json.load(f)

    print(f"✓ Loaded {len(parks)} parks")

    successful_downloads = 0
    failed_downloads = 0
    no_photo_parks = 0

    print(f"\n⬇️  Starting image downloads...\n")

    for idx, park in enumerate(parks, 1):
        park_id = park.get('id')
        park_name = park.get('name', 'Unknown')
        park_city = park.get('city', 'Unknown')
        park_slug = park.get('slug', park_name.lower().replace(' ', '-'))

        # Check if park has photos
        photos = park.get('photos', [])
        if not photos:
            no_photo_parks += 1
            print(f"[{idx:3d}/{len(parks)}] ⊘ {park_name[:50]:50} (no photos)")
            continue

        # Get the first photo URL
        first_photo = photos[0]
        photo_url = first_photo.get('url') if isinstance(first_photo, dict) else first_photo

        if not photo_url:
            no_photo_parks += 1
            print(f"[{idx:3d}/{len(parks)}] ⊘ {park_name[:50]:50} (no URL)")
            continue

        # Download the image with city/slug structure
        relative_filepath = get_image_filepath(park_city, park_slug)
        filepath = os.path.join(IMAGES_DIR, relative_filepath)

        # Create city subdirectory if needed
        os.makedirs(os.path.dirname(filepath), exist_ok=True)

        print(f"[{idx:3d}/{len(parks)}] ↓ {park_name[:50]:50}", end=" ")

        if download_image(photo_url, relative_filepath):
            successful_downloads += 1
            print("✓")

            # Update the park data to use local image path
            park['photo'] = f"/images/parks/{relative_filepath}"
            # Keep photos array for reference but mark as local
            park['photos'] = [{"url": f"/images/parks/{relative_filepath}", "type": "photo", "source": "local"}]
        else:
            failed_downloads += 1
            print("✗")

    print(f"\n" + "="*80)
    print(f"📊 Download Summary:")
    print(f"  ✓ Successful:  {successful_downloads}")
    print(f"  ✗ Failed:      {failed_downloads}")
    print(f"  ⊘ No photos:   {no_photo_parks}")
    print(f"  Total parks:   {len(parks)}")
    print(f"="*80)

    # Save updated parks data
    print(f"\n💾 Saving updated parks data to {DATA_FILE}...")
    with open(DATA_FILE, 'w') as f:
        json.dump(parks, f, indent=2)

    print(f"✓ Updated {DATA_FILE} with local image paths")

    return successful_downloads > 0

if __name__ == '__main__':
    try:
        print("\n" + "="*80)
        print("🖼️  Google Places Image Downloader")
        print("="*80)

        # Check if data file exists
        if not os.path.exists(DATA_FILE):
            print(f"❌ Error: {DATA_FILE} not found!")
            sys.exit(1)

        ensure_images_directory()
        success = process_parks()

        print(f"\n✅ Image download process completed!")
        print(f"Images stored in: {IMAGES_DIR}")
        print("="*80 + "\n")

    except KeyboardInterrupt:
        print("\n\n❌ Process interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Fatal error: {e}")
        sys.exit(1)

#!/usr/bin/env python3
"""
Script to download Google Places images locally for self-hosting.
Downloads images for parks and saves to /public/images/parks/[city]/[slug].jpg
Supports multiple data files and multiple images per park.
"""

import json
import os
import requests
from pathlib import Path
from urllib.parse import urlparse
import sys
from datetime import datetime
import argparse

# Configuration
IMAGES_DIR = 'public/images/parks'
TIMEOUT = 30  # seconds
MAX_RETRIES = 3
MAX_IMAGES_PER_PARK = 3  # Download up to 3 images per park

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

def get_image_filepath(park_city, park_slug, image_index=0):
    """
    Generate a filepath for the park image organized by city.
    Structure: /images/parks/[city]/[slug].jpg (primary)
              /images/parks/[city]/[slug]-2.jpg (secondary)
              /images/parks/[city]/[slug]-3.jpg (tertiary)
    """
    # Normalize city name to lowercase with hyphens
    city_folder = park_city.lower().replace(' ', '-').replace("'", "") if park_city else 'unknown'
    
    # Normalize slug
    if not park_slug:
        park_slug = park_city.lower().replace(' ', '-')
    
    # Primary image: [slug].jpg, secondary: [slug]-2.jpg, etc.
    if image_index == 0:
        filename = f"{park_slug}.jpg"
    else:
        filename = f"{park_slug}-{image_index + 1}.jpg"
    
    return f"{city_folder}/{filename}"

def is_local_image(url):
    """Check if URL is already a local path."""
    if not url or not isinstance(url, str):
        return False
    return url.startswith('/images/') or url.startswith('./images/')

def process_parks(data_file):
    """Load parks data, download images, and update JSON."""
    print(f"\n📥 Loading parks data from {data_file}...")

    with open(data_file, 'r') as f:
        parks = json.load(f)

    print(f"✓ Loaded {len(parks)} parks")

    successful_downloads = 0
    failed_downloads = 0
    no_photo_parks = 0
    already_local = 0

    print(f"\n⬇️  Starting image downloads...\n")

    for idx, park in enumerate(parks, 1):
        park_id = park.get('id')
        park_name = park.get('name', 'Unknown')
        park_city = park.get('city', 'Unknown')
        park_slug = park.get('slug', park_name.lower().replace(' ', '-').replace("'", ""))

        # Check if already using local images
        current_photo = park.get('photo') or ''
        if current_photo and is_local_image(current_photo):
            already_local += 1
            continue

        # Get photos array or single photo field
        photos = park.get('photos', [])
        if not photos and current_photo and not is_local_image(current_photo):
            # Convert single photo to array format
            photos = [{"url": current_photo}]

        if not photos:
            no_photo_parks += 1
            print(f"[{idx:3d}/{len(parks)}] ⊘ {park_name[:50]:50} (no photos)")
            continue

        # Download up to MAX_IMAGES_PER_PARK images
        downloaded_photos = []
        print(f"[{idx:3d}/{len(parks)}] ↓ {park_name[:50]:50}", end=" ")

        for img_idx, photo in enumerate(photos[:MAX_IMAGES_PER_PARK]):
            photo_url = photo.get('url') if isinstance(photo, dict) else photo
            
            if not photo_url or is_local_image(photo_url):
                continue

            # Download the image with city/slug structure
            relative_filepath = get_image_filepath(park_city, park_slug, img_idx)
            filepath = os.path.join(IMAGES_DIR, relative_filepath)

            # Create city subdirectory if needed
            os.makedirs(os.path.dirname(filepath), exist_ok=True)

            if download_image(photo_url, relative_filepath):
                local_url = f"/images/parks/{relative_filepath}"
                downloaded_photos.append({
                    "url": local_url,
                    "type": "photo",
                    "source": "local",
                    "caption": photo.get('caption') if isinstance(photo, dict) else None
                })
                successful_downloads += 1
            else:
                failed_downloads += 1

        if downloaded_photos:
            # Update park data with local image paths
            park['photo'] = downloaded_photos[0]['url']
            park['photos'] = downloaded_photos
            print(f"✓ ({len(downloaded_photos)} images)")
        else:
            print("✗")

    print(f"\n" + "="*80)
    print(f"📊 Download Summary:")
    print(f"  ✓ Successful:  {successful_downloads} images")
    print(f"  ✗ Failed:      {failed_downloads} images")
    print(f"  ⊘ No photos:   {no_photo_parks} parks")
    print(f"  ⊙ Already local: {already_local} parks")
    print(f"  Total parks:   {len(parks)}")
    print(f"="*80)

    # Save updated parks data
    print(f"\n💾 Saving updated parks data to {data_file}...")
    with open(data_file, 'w') as f:
        json.dump(parks, f, indent=2)

    print(f"✓ Updated {data_file} with local image paths")

    return successful_downloads > 0

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Download park images locally')
    parser.add_argument(
        '--data-file',
        type=str,
        default='public/data/california.json',
        help='Path to parks JSON file (default: public/data/california.json)'
    )
    parser.add_argument(
        '--all',
        action='store_true',
        help='Process all data files (california.json, washington.json, mixmatch.json)'
    )
    
    args = parser.parse_args()

    try:
        print("\n" + "="*80)
        print("🖼️  Park Image Downloader")
        print("="*80)

        ensure_images_directory()

        data_files = []
        if args.all:
            # Process all data files
            data_files = [
                'public/data/california.json',
                'public/data/washington.json',
                'public/data/mixmatch.json',
            ]
            # Filter to only existing files
            data_files = [f for f in data_files if os.path.exists(f)]
        else:
            data_files = [args.data_file]

        if not data_files:
            print(f"❌ Error: No data files found!")
            sys.exit(1)

        total_success = 0
        for data_file in data_files:
            if not os.path.exists(data_file):
                print(f"⚠️  Skipping {data_file} (not found)")
                continue
            
            print(f"\n📁 Processing: {data_file}")
            success = process_parks(data_file)
            if success:
                total_success += 1

        print(f"\n✅ Image download process completed!")
        print(f"Images stored in: {IMAGES_DIR}")
        print(f"Structure: /images/parks/[city]/[slug].jpg")
        print("="*80 + "\n")

    except KeyboardInterrupt:
        print("\n\n❌ Process interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Fatal error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

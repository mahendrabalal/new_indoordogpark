#!/usr/bin/env python3
"""
Fetch images from business websites for parks missing images.
Attempts to scrape images from park websites and download them locally.
"""

import json
import os
import re
import time
import requests
from pathlib import Path
from typing import Dict, List, Optional
from urllib.parse import urljoin, urlparse

try:
    from bs4 import BeautifulSoup
except ImportError:
    print("Installing BeautifulSoup4...")
    import subprocess
    subprocess.check_call(['pip', 'install', 'beautifulsoup4'])
    from bs4 import BeautifulSoup

# Configuration
DATA_FILE = 'public/data/washington.json'
IMAGES_DIR = 'public/images/parks/washington'
TIMEOUT = 15  # seconds
MAX_RETRIES = 2
MAX_IMAGES_PER_PARK = 3

def download_image(url: str, filepath: Path, retries: int = MAX_RETRIES) -> bool:
    """Download an image from URL and save it locally."""
    # Skip if already downloaded
    if filepath.exists():
        return True
    
    # Create directory if needed
    filepath.parent.mkdir(parents=True, exist_ok=True)
    
    for attempt in range(retries):
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            response = requests.get(url, timeout=TIMEOUT, stream=True, headers=headers)
            response.raise_for_status()
            
            # Check if it's actually an image
            content_type = response.headers.get('content-type', '').lower()
            if not content_type.startswith('image/'):
                return False
            
            # Write the image file
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
            
            # Verify file size (at least 1KB)
            if filepath.stat().st_size < 1024:
                filepath.unlink()
                return False
            
            return True
        except Exception as e:
            if attempt < retries - 1:
                time.sleep(0.5)
            else:
                return False
    
    return False

def is_valid_image_url(url: str, base_url: str) -> bool:
    """Check if URL is a valid image URL."""
    parsed = urlparse(url)
    
    # Skip data URLs, SVGs (prefer JPG/PNG), and very small images
    if url.startswith('data:'):
        return False
    if url.lower().endswith('.svg'):
        return False
    
    # Common image extensions
    image_exts = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    if any(parsed.path.lower().endswith(ext) for ext in image_exts):
        return True
    
    # Check for image indicators in URL
    image_patterns = ['/images/', '/img/', '/photo', '/picture', '/media/', '/gallery/']
    if any(pattern in url.lower() for pattern in image_patterns):
        return True
    
    return False

def extract_images_from_html(html_content: str, base_url: str, max_images: int = MAX_IMAGES_PER_PARK) -> List[str]:
    """Extract image URLs from HTML content."""
    soup = BeautifulSoup(html_content, 'html.parser')
    image_urls = []
    
    # Find all img tags
    for img in soup.find_all('img'):
        src = img.get('src') or img.get('data-src') or img.get('data-lazy-src')
        if not src:
            continue
        
        # Convert relative URLs to absolute
        absolute_url = urljoin(base_url, src)
        
        # Filter out invalid images
        if is_valid_image_url(absolute_url, base_url):
            # Check image size attributes (skip very small images/icons)
            width = img.get('width') or img.get('data-width')
            height = img.get('height') or img.get('data-height')
            
            # Skip if explicitly small (likely icons/logos)
            if width and str(width).isdigit() and int(width) < 200:
                continue
            if height and str(height).isdigit() and int(height) < 200:
                continue
            
            image_urls.append(absolute_url)
            if len(image_urls) >= max_images:
                break
    
    # Also check for Open Graph images
    og_image = soup.find('meta', property='og:image')
    if og_image and og_image.get('content'):
        og_url = urljoin(base_url, og_image.get('content'))
        if og_url not in image_urls and is_valid_image_url(og_url, base_url):
            image_urls.insert(0, og_url)  # Prioritize OG image
    
    return image_urls[:max_images]

def fetch_images_from_website(website_url: str, park_slug: str, park_city: str) -> List[str]:
    """Fetch images from a park's website."""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
        }
        
        response = requests.get(website_url, timeout=TIMEOUT, headers=headers, allow_redirects=True)
        response.raise_for_status()
        
        # Extract images from HTML
        image_urls = extract_images_from_html(response.text, website_url)
        
        return image_urls
    except Exception as e:
        return []

def generate_local_image_path(park_city: str, park_slug: str, photo_index: int) -> str:
    """Generate local image path for a park photo."""
    city_folder = park_city.lower().replace(' ', '-') if park_city else 'unknown'
    filename = f"{park_slug}-{photo_index}.jpg"
    return f"/images/parks/washington/{city_folder}/{filename}"

def process_parks_without_images():
    """Fetch images from websites for parks missing images."""
    # Load washington.json
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Find parks without images
    parks_needing_images = []
    for park in data:
        photos = park.get('photos', [])
        if not photos or len(photos) == 0:
            website = park.get('website', '')
            if website and website.startswith('http'):
                parks_needing_images.append(park)
    
    print(f"Found {len(parks_needing_images)} parks without images that have websites")
    print("=" * 80)
    
    restored_count = 0
    downloaded_count = 0
    
    for i, park in enumerate(parks_needing_images, 1):
        park_name = park.get('name', 'Unknown')
        park_city = park.get('city', 'Unknown')
        park_slug = park.get('slug', park_name.lower().replace(' ', '-').replace('/', '-'))
        website = park.get('website', '')
        
        print(f"{i}. {park_name} ({park_city}) - Fetching from {website}...", end=" ")
        
        # Fetch images from website
        image_urls = fetch_images_from_website(website, park_slug, park_city)
        
        if not image_urls:
            print("NO IMAGES FOUND")
            continue
        
        print(f"Found {len(image_urls)} images, downloading...", end=" ")
        
        # Download images
        downloaded_photos = []
        for idx, image_url in enumerate(image_urls, 1):
            local_path = generate_local_image_path(park_city, park_slug, idx)
            filepath = Path('public') / local_path.lstrip('/')
            
            if download_image(image_url, filepath):
                downloaded_count += 1
                downloaded_photos.append({
                    "url": local_path,
                    "type": "photo",
                    "source": "website"
                })
        
        if downloaded_photos:
            # Update park with new photos
            park['photos'] = downloaded_photos
            park['photo'] = downloaded_photos[0]["url"]
            restored_count += 1
            print(f"SUCCESS ({len(downloaded_photos)} images)")
        else:
            print("FAILED (downloads failed)")
        
        # Rate limiting - be nice to websites
        time.sleep(1)  # 1 second delay between requests
    
    # Save updated data
    print(f"\n{'=' * 80}")
    print(f"Saving updated data to {DATA_FILE}...")
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Process complete!")
    print(f"  Parks processed: {len(parks_needing_images)}")
    print(f"  Parks restored: {restored_count}")
    print(f"  Images downloaded: {downloaded_count}")
    
    return restored_count, downloaded_count

def main():
    """Main function."""
    if not os.path.exists(DATA_FILE):
        print(f"❌ File not found: {DATA_FILE}")
        return
    
    print("\n" + "=" * 80)
    print("🌐 Website Image Fetcher for Washington Parks")
    print("=" * 80)
    
    try:
        restored, downloaded = process_parks_without_images()
        print(f"\n✅ Successfully restored images for {restored} parks!")
        print(f"   Downloaded {downloaded} total images")
    except KeyboardInterrupt:
        print("\n\n❌ Process interrupted by user")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()


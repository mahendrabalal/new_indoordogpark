#!/usr/bin/env python3
"""
Script to extract email addresses from park websites and add them to the JSON data.

Usage:
    python scripts/extract-emails-from-websites.py [--limit 10] [--dry-run]
"""

import json
import re
import sys
import argparse
from urllib.parse import urljoin, urlparse
from typing import Optional, List

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("❌ Required packages not installed. Run:")
    print("   pip install requests beautifulsoup4")
    sys.exit(1)


def extract_emails_from_text(text: str) -> List[str]:
    """Extract email addresses from text using regex."""
    # Email regex pattern
    pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    emails = re.findall(pattern, text)
    
    # Filter out common non-contact emails
    exclude_patterns = [
        'noreply', 'no-reply', 'donotreply', 'privacy', 'legal',
        'support@', 'help@', 'admin@', 'webmaster@', 'postmaster@',
        'example.com', 'test.com', 'placeholder'
    ]
    
    filtered = []
    for email in emails:
        email_lower = email.lower()
        if not any(pattern in email_lower for pattern in exclude_patterns):
            filtered.append(email)
    
    return filtered


def extract_email_from_url(url: str, timeout: int = 10) -> Optional[str]:
    """Extract email address from a website URL."""
    if not url or not url.startswith('http'):
        return None
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, timeout=timeout, headers=headers, allow_redirects=True)
        response.raise_for_status()
        
        # Try to parse as HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        text = soup.get_text()
        
        # Also check common email link elements
        email_links = soup.find_all('a', href=re.compile(r'^mailto:'))
        for link in email_links:
            email = link.get('href', '').replace('mailto:', '').strip()
            if email and '@' in email:
                return email.split('?')[0]  # Remove query params
        
        # Extract from text
        emails = extract_emails_from_text(text)
        if emails:
            return emails[0]  # Return first valid email
        
        return None
        
    except requests.exceptions.RequestException as e:
        print(f"   ⚠️  Error fetching {url}: {str(e)[:50]}")
        return None
    except Exception as e:
        print(f"   ⚠️  Error parsing {url}: {str(e)[:50]}")
        return None


def load_parks(filepath: str) -> List[dict]:
    """Load parks from JSON file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if isinstance(data, list):
            return data
        elif isinstance(data, dict) and 'parks' in data:
            return data['parks']
        else:
            print(f"❌ Invalid JSON structure in {filepath}")
            sys.exit(1)
    except FileNotFoundError:
        print(f"❌ File not found: {filepath}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON: {e}")
        sys.exit(1)


def save_parks(filepath: str, parks: List[dict]) -> None:
    """Save parks to JSON file."""
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(parks, f, indent=2, ensure_ascii=False)


def main():
    parser = argparse.ArgumentParser(description='Extract emails from park websites')
    parser.add_argument('--file', default='public/data/california.json',
                       help='Path to parks JSON file')
    parser.add_argument('--limit', type=int, default=10,
                       help='Limit number of parks to process')
    parser.add_argument('--dry-run', action='store_true',
                       help='Show what would be done without saving')
    parser.add_argument('--filter-type', type=str,
                       help='Filter by business type (e.g., "Indoor Dog Park")')
    
    args = parser.parse_args()
    
    print('🔍 Starting email extraction from park websites...\n')
    print(f'Configuration:')
    print(f'  File: {args.file}')
    print(f'  Limit: {args.limit}')
    print(f'  Dry run: {args.dry_run}')
    print(f'  Filter: {args.filter_type or "None"}\n')
    
    # Load parks
    parks = load_parks(args.file)
    print(f'📂 Loaded {len(parks)} parks\n')
    
    # Filter parks
    parks_to_process = []
    for park in parks:
        # Skip if already has email
        if park.get('email'):
            continue
        
        # Filter by type if specified
        if args.filter_type:
            if args.filter_type.lower() not in park.get('businessType', '').lower():
                continue
        
        # Must have website
        if not park.get('website'):
            continue
        
        parks_to_process.append(park)
        
        if len(parks_to_process) >= args.limit:
            break
    
    print(f'📊 Found {len(parks_to_process)} parks to process\n')
    
    if not parks_to_process:
        print('❌ No parks found matching criteria')
        return
    
    # Process parks
    found_count = 0
    for i, park in enumerate(parks_to_process, 1):
        name = park.get('name', 'Unknown')
        website = park.get('website', '')
        
        print(f'[{i}/{len(parks_to_process)}] {name}')
        print(f'   🌐 {website}')
        
        email = extract_email_from_url(website)
        
        if email:
            print(f'   ✅ Found: {email}')
            park['email'] = email
            found_count += 1
        else:
            print(f'   ❌ No email found')
        
        print()
    
    # Summary
    print('=' * 60)
    print('📊 Summary')
    print('=' * 60)
    print(f'Processed: {len(parks_to_process)}')
    print(f'Emails found: {found_count}')
    print(f'Success rate: {(found_count/len(parks_to_process)*100):.1f}%')
    
    # Save if not dry run
    if not args.dry_run and found_count > 0:
        # Update original parks list
        park_dict = {p.get('id'): p for p in parks}
        for park in parks_to_process:
            if park.get('email'):
                park_dict[park['id']] = park
        
        updated_parks = list(park_dict.values())
        save_parks(args.file, updated_parks)
        print(f'\n💾 Saved {found_count} emails to {args.file}')
    elif args.dry_run:
        print('\n💡 Dry run mode - no changes saved')
        print('   Remove --dry-run to save changes')


if __name__ == '__main__':
    main()





























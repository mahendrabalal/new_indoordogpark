#!/usr/bin/env python3
"""
Merge multiple dog park JSON files and deduplicate by ID.

Combines data from:
- Existing standardized_dog_parks.json
- New enhanced_indoor_dog_parks.json
- Any other dog park JSON files

Deduplicates by ID, keeping the most recent/complete data.
"""

import json
import sys
from pathlib import Path
from typing import Dict, List, Any
from datetime import datetime


def load_json_file(path: Path) -> List[Dict[str, Any]]:
    """Load and parse a JSON file."""
    try:
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        if isinstance(data, list):
            return data
        return [data]
    except Exception as e:
        print(f"Error loading {path}: {e}", file=sys.stderr)
        return []


def get_data_completeness(park: Dict[str, Any]) -> int:
    """Calculate data completeness score (higher = more complete)."""
    score = 0

    # Core fields
    if park.get('id'):
        score += 1
    if park.get('name'):
        score += 1
    if park.get('pricing'):
        score += 5  # Pricing is valuable

    # Media
    photos = park.get('photos', [])
    if isinstance(photos, list):
        score += len(photos)  # More photos = better

    # Amenities
    amenities = park.get('amenities', {})
    if isinstance(amenities, dict):
        score += len([v for v in amenities.values() if v])  # Count true amenities

    # Contact info
    if park.get('email'):
        score += 2
    if park.get('socialMedia'):
        score += 2

    # Data quality
    if park.get('dataQuality') == 'verified':
        score += 10
    elif park.get('dataQuality') == 'partial':
        score += 5

    return score


def merge_park_data(old: Dict[str, Any], new: Dict[str, Any]) -> Dict[str, Any]:
    """
    Merge two park records, keeping the more complete version.
    Intelligently combines fields from both records.
    """
    old_score = get_data_completeness(old)
    new_score = get_data_completeness(new)

    # Start with the most complete version
    merged = new.copy() if new_score >= old_score else old.copy()
    base = old if new_score >= old_score else new

    # Fill in missing fields from the other record
    for key, value in base.items():
        if key not in merged or merged[key] is None:
            merged[key] = value
        elif key == 'photos' and isinstance(value, list):
            # Combine photos, avoiding duplicates
            existing_urls = {p.get('url') for p in merged.get('photos', [])}
            for photo in value:
                if photo.get('url') not in existing_urls:
                    merged['photos'].append(photo)
        elif key == 'amenities' and isinstance(value, dict):
            # Merge amenities - if either says true, keep it true
            if isinstance(merged.get('amenities'), dict):
                for amenity, has_it in value.items():
                    if has_it and not merged['amenities'].get(amenity):
                        merged['amenities'][amenity] = True
        elif key == 'openingHours' and isinstance(value, dict):
            # Merge opening hours
            if isinstance(merged.get('openingHours'), dict):
                merged['openingHours'].update(value)

    return merged


def deduplicate_parks(parks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Deduplicate parks by ID.

    When duplicates are found, keeps the most complete/recent version.
    """
    parks_by_id: Dict[str, Dict[str, Any]] = {}

    for park in parks:
        park_id = park.get('id')
        if not park_id:
            print(f"Warning: Park without ID found: {park.get('name', 'Unknown')}", file=sys.stderr)
            continue

        if park_id in parks_by_id:
            # Merge with existing
            parks_by_id[park_id] = merge_park_data(parks_by_id[park_id], park)
        else:
            parks_by_id[park_id] = park

    return list(parks_by_id.values())


def validate_parks(parks: List[Dict[str, Any]]) -> tuple[int, int]:
    """
    Validate parks data.

    Returns: (total_parks, parks_with_pricing)
    """
    total = len(parks)
    with_pricing = len([p for p in parks if p.get('pricing')])

    return total, with_pricing


def main():
    """Main merge and deduplicate function."""
    parser_imports = __import__('argparse')
    parser = parser_imports.ArgumentParser(
        description="Merge dog park JSON files and deduplicate."
    )
    parser.add_argument(
        "--input-files",
        nargs='+',
        required=True,
        help="Input JSON files to merge (e.g., file1.json file2.json)"
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("public/data/standardized_dog_parks.json"),
        help="Output file for merged data (default: public/data/standardized_dog_parks.json)"
    )
    parser.add_argument(
        "--sort-by",
        choices=['rating', 'name', 'city', 'id'],
        default='rating',
        help="Sort output by field (default: rating)"
    )
    args = parser.parse_args()

    print("=" * 80)
    print("DOG PARKS DATA MERGE & DEDUPLICATE")
    print("=" * 80)

    all_parks = []
    file_stats = {}

    # Load all input files
    for input_file in args.input_files:
        path = Path(input_file)
        if not path.exists():
            print(f"❌ File not found: {input_file}", file=sys.stderr)
            continue

        print(f"\n📄 Loading: {path}")
        parks = load_json_file(path)
        file_stats[str(path)] = len(parks)
        all_parks.extend(parks)
        print(f"   ✓ Loaded {len(parks)} parks")

    if not all_parks:
        print("❌ No parks loaded from input files!", file=sys.stderr)
        sys.exit(1)

    print(f"\n📊 Total parks before deduplication: {len(all_parks)}")

    # Deduplicate
    print("\n🔄 Deduplicating by ID...")
    deduplicated = deduplicate_parks(all_parks)
    duplicates_removed = len(all_parks) - len(deduplicated)
    print(f"   ✓ Removed {duplicates_removed} duplicate entries")
    print(f"   ✓ Unique parks: {len(deduplicated)}")

    # Validate
    print("\n✅ Validating data...")
    total, with_pricing = validate_parks(deduplicated)
    print(f"   ✓ Total parks: {total}")
    print(f"   ✓ Parks with pricing: {with_pricing}")
    print(f"   ✓ Pricing coverage: {(with_pricing/total*100):.1f}%" if total > 0 else "   ✗ No parks")

    # Sort
    if args.sort_by == 'rating':
        deduplicated.sort(key=lambda p: (-(p.get('rating') or 0), p.get('name', '')))
    elif args.sort_by == 'name':
        deduplicated.sort(key=lambda p: p.get('name', '').lower())
    elif args.sort_by == 'city':
        deduplicated.sort(key=lambda p: (p.get('city', ''), p.get('name', '')))

    # Save
    print(f"\n💾 Saving to: {args.output}")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with open(args.output, 'w', encoding='utf-8') as f:
        json.dump(deduplicated, f, indent=2, ensure_ascii=False)
    print(f"   ✓ Saved {len(deduplicated)} parks")

    # Summary
    print("\n" + "=" * 80)
    print("MERGE SUMMARY")
    print("=" * 80)
    print(f"Input files: {len(file_stats)}")
    for file, count in file_stats.items():
        print(f"  • {file}: {count} parks")
    print(f"\nBefore: {len(all_parks)} parks")
    print(f"Duplicates removed: {duplicates_removed}")
    print(f"After: {len(deduplicated)} parks")
    print(f"\nWith pricing: {with_pricing} ({(with_pricing/total*100):.1f}%)")
    print(f"Output: {args.output}")
    print("=" * 80)


if __name__ == "__main__":
    main()

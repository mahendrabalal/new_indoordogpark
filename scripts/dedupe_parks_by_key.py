#!/usr/bin/env python3
"""
Deduplicate a parks JSON array by a composite key (default: name|city|state).

Why:
- Some datasets (notably `public/data/mixmatch.json`) can contain the *same park*
  more than once with different IDs/place IDs.
- `scripts/merge_and_deduplicate.py` deduplicates by `id` only, so these duplicates remain.

This script:
- Groups by a normalized key (default: name|city|state)
- Picks the "best" record using a completeness score (prefers local photos, more photos, verified)
- Writes a deduped output file AND an optional report of removed duplicates

Usage:
  python3 scripts/dedupe_parks_by_key.py \\
    --input public/data/mixmatch.json \\
    --output public/data/mixmatch.deduped.json \\
    --report public/data/mixmatch.dedupe-report.json
"""

from __future__ import annotations

import argparse
import json
from collections import defaultdict
from pathlib import Path
from typing import Any, Dict, List, Tuple


def _norm(s: Any) -> str:
    return str(s or "").strip().lower()


def park_key_name_city_state(park: Dict[str, Any]) -> str:
    name = _norm(park.get("name"))
    city = _norm(park.get("city"))
    state = _norm(park.get("state"))
    return f"{name}|{city}|{state}"


def get_data_completeness(park: Dict[str, Any]) -> int:
    """
    Higher score = keep this record when resolving duplicates.
    Mirrors the intent of scripts/merge_and_deduplicate.py (photos/verified are valuable).
    """
    score = 0

    # Core fields
    if park.get("id"):
        score += 1
    if park.get("name"):
        score += 1
    if park.get("description"):
        score += 1
    if park.get("phone"):
        score += 1
    if park.get("website"):
        score += 1

    # Location
    if park.get("full_address"):
        score += 2
    if park.get("latitude") is not None and park.get("longitude") is not None:
        score += 2

    # Media
    photos = park.get("photos", [])
    if isinstance(photos, list):
        score += len(photos)
        local_images = [
            p for p in photos
            if isinstance(p, dict) and "/images/parks/" in str(p.get("url", ""))
        ]
        score += len(local_images) * 2

    # Data quality
    if park.get("dataQuality") == "verified":
        score += 10
    elif park.get("dataQuality") == "partial":
        score += 5

    # Ratings (weak signal but helpful)
    rating = park.get("rating")
    if isinstance(rating, (int, float)) and rating > 0:
        score += 1
    review_count = park.get("reviewCount")
    if isinstance(review_count, int) and review_count > 0:
        score += 1

    return score


def merge_records(best: Dict[str, Any], other: Dict[str, Any]) -> Dict[str, Any]:
    """
    Keep `best` but fill missing fields from `other` and union photos.
    """
    merged = dict(best)

    for key, value in other.items():
        if key not in merged or merged[key] in (None, ""):
            merged[key] = value
        elif key == "photos" and isinstance(value, list):
            existing = merged.get("photos")
            if not isinstance(existing, list):
                merged["photos"] = value
                continue
            existing_urls = {p.get("url") for p in existing if isinstance(p, dict)}
            for photo in value:
                if isinstance(photo, dict) and photo.get("url") and photo.get("url") not in existing_urls:
                    existing.append(photo)
                    existing_urls.add(photo.get("url"))

    # Ensure photo points to first photos entry if missing
    if (not merged.get("photo")) and isinstance(merged.get("photos"), list) and merged["photos"]:
        first = merged["photos"][0]
        if isinstance(first, dict) and first.get("url"):
            merged["photo"] = first["url"]

    return merged


def main() -> int:
    parser = argparse.ArgumentParser(description="Deduplicate parks JSON by a composite key (default: name|city|state).")
    parser.add_argument("--input", type=Path, required=True, help="Input JSON file (array of parks).")
    parser.add_argument("--output", type=Path, required=True, help="Output JSON file (deduped).")
    parser.add_argument("--report", type=Path, required=False, help="Optional report JSON file describing removed duplicates.")
    args = parser.parse_args()

    if not args.input.exists():
        print(f"❌ Input not found: {args.input}")
        return 1

    parks = json.loads(args.input.read_text(encoding="utf-8"))
    if not isinstance(parks, list):
        print("❌ Input must be a JSON array")
        return 1

    groups: Dict[str, List[Dict[str, Any]]] = defaultdict(list)
    for p in parks:
        if not isinstance(p, dict):
            continue
        groups[park_key_name_city_state(p)].append(p)

    deduped: List[Dict[str, Any]] = []
    removed_report: List[Dict[str, Any]] = []

    for key, items in groups.items():
        if len(items) == 1:
            deduped.append(items[0])
            continue

        scored = sorted(((get_data_completeness(p), p) for p in items), key=lambda t: t[0], reverse=True)
        best_score, best = scored[0]

        merged_best = dict(best)
        removed = []
        for score, other in scored[1:]:
            merged_best = merge_records(merged_best, other)
            removed.append(
                {
                    "id": other.get("id"),
                    "googlePlaceId": other.get("googlePlaceId"),
                    "name": other.get("name"),
                    "city": other.get("city"),
                    "state": other.get("state"),
                    "score": score,
                }
            )

        deduped.append(merged_best)
        removed_report.append(
            {
                "key": key,
                "kept": {
                    "id": best.get("id"),
                    "googlePlaceId": best.get("googlePlaceId"),
                    "name": best.get("name"),
                    "city": best.get("city"),
                    "state": best.get("state"),
                    "score": best_score,
                },
                "removed": removed,
            }
        )

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(deduped, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(json.dumps(removed_report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print("✅ Deduplication complete")
    print(f"  - Input parks:  {len(parks)}")
    print(f"  - Output parks: {len(deduped)}")
    print(f"  - Duplicates removed (by key): {len(parks) - len(deduped)}")
    print(f"  - Output: {args.output}")
    if args.report:
        print(f"  - Report: {args.report}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())



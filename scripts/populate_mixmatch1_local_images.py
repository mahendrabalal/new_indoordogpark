#!/usr/bin/env python3
"""
Populate `photos` + `photo` fields in public/data/mixmatch1.json using ALREADY downloaded local images.

This avoids Google Places API calls (no network required) by mapping records to files under:
  public/images/parks/{city-folder}/{slug}.jpg
  public/images/parks/{city-folder}/{slug}-2.jpg
  ...

It uses the same slug + city folder logic as scripts/fetch_and_download_mixmatch1_images.py.

Usage:
  python3 scripts/populate_mixmatch1_local_images.py
"""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any, Dict, List

ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "public/data/mixmatch1.json"
IMAGES_DIR = ROOT / "public/images/parks"

MAX_IMAGES_PER_PARK = 5


def generate_slug(name: str) -> str:
    slug = (name or "").lower()
    slug = re.sub(r"[^a-z0-9\s-]", "", slug)
    slug = re.sub(r"[\s-]+", "-", slug).strip("-")
    return slug


def city_folder_name(city: str) -> str:
    folder = (city or "").lower().replace(" ", "-").replace("'", "").replace(",", "")
    if ", " in folder:
        folder = folder.split(", ")[0]
    return folder or "unknown"


def local_image_relpaths(city: str, slug: str) -> List[str]:
    folder = city_folder_name(city)
    paths: List[str] = []
    # primary: slug.jpg, then slug-2.jpg...
    for idx in range(MAX_IMAGES_PER_PARK):
        filename = f"{slug}.jpg" if idx == 0 else f"{slug}-{idx + 1}.jpg"
        paths.append(f"{folder}/{filename}")
    return paths


def main() -> int:
    if not DATA_FILE.exists():
        print(f"❌ Missing file: {DATA_FILE}")
        return 1

    parks: List[Dict[str, Any]] = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    if not isinstance(parks, list):
        print("❌ mixmatch1.json must be a JSON array")
        return 1

    updated = 0
    with_photos = 0

    for park in parks:
        name = park.get("name") or ""
        city = park.get("city") or ""
        slug = generate_slug(name)

        # If photos already exist, keep them.
        existing = park.get("photos")
        if isinstance(existing, list) and len(existing) > 0:
            with_photos += 1
            if not park.get("photo") and isinstance(existing[0], dict) and existing[0].get("url"):
                park["photo"] = existing[0]["url"]
                updated += 1
            continue

        rels = local_image_relpaths(city, slug)
        found: List[Dict[str, Any]] = []
        for rel in rels:
            full = IMAGES_DIR / rel
            if full.exists():
                found.append(
                    {
                        "url": f"/images/parks/{rel}",
                        "type": "photo",
                        "source": "google_places",
                        "caption": None,
                    }
                )

        if found:
            park["photos"] = found
            park["photo"] = found[0]["url"]
            updated += 1
            with_photos += 1

    DATA_FILE.write_text(json.dumps(parks, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print("✅ mixmatch1 local-image population complete")
    print(f"  - Parks: {len(parks)}")
    print(f"  - Parks with photos now: {with_photos}")
    print(f"  - Parks updated: {updated}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())



#!/usr/bin/env python3
"""
Merge raw `public/data/mixmatch1.json` parks into the app dataset `public/data/mixmatch.json`.

Key points:
- mixmatch1 is a raw scrape/export format.
- mixmatch is the standardized DogPark schema (same shape as california.json / washington.json).
- mixmatch1 may contain duplicate `place_id` values; we generate unique IDs so nothing is lost:
    id = place_id (if unique)
    id = place_id__{slug}-{citySlug} (if duplicate in mixmatch1 OR collides in mixmatch)
  while keeping `googlePlaceId` = original place_id for all records.

No network required.

Usage:
  python3 scripts/merge_mixmatch1_into_mixmatch.py
"""

from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path
from typing import Any, Dict, List, Optional

ROOT = Path(__file__).resolve().parents[1]
MIXMATCH1_PATH = ROOT / "public/data/mixmatch1.json"
MIXMATCH_PATH = ROOT / "public/data/mixmatch.json"


STATE_NAME_TO_ABBR = {
    "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR",
    "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE",
    "Florida": "FL", "Georgia": "GA", "Hawaii": "HI", "Idaho": "ID",
    "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS",
    "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
    "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS",
    "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV",
    "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY",
    "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK",
    "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
    "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT",
    "Vermont": "VT", "Virginia": "VA", "Washington": "WA", "West Virginia": "WV",
    "Wisconsin": "WI", "Wyoming": "WY",
}


def to_state_abbr(state_name: str) -> str:
    if not state_name:
        return ""
    state_name = state_name.strip()
    if len(state_name) == 2 and state_name.isalpha():
        return state_name.upper()
    return STATE_NAME_TO_ABBR.get(state_name, state_name[:2].upper())


def slugify(text: str) -> str:
    slug = (text or "").lower()
    slug = re.sub(r"[^a-z0-9\s-]", "", slug)
    slug = re.sub(r"[\s-]+", "-", slug).strip("-")
    return slug


def safe_float(value: Any, default: float = 0.0) -> float:
    if value is None or value == "":
        return default
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def safe_int(value: Any, default: int = 0) -> int:
    if value is None or value == "":
        return default
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


def normalize_opening_hours(working_hours: Any) -> Optional[Dict[str, str]]:
    if not isinstance(working_hours, dict):
        return None
    out: Dict[str, str] = {}
    for day, hours in working_hours.items():
        if not isinstance(hours, str):
            continue
        val = hours.strip()
        if not val or val.lower() == "closed":
            continue
        out[str(day)] = val
    return out or None


def determine_business_type(category: str, type_field: str, subtypes: str, name: str) -> str:
    name_lower = (name or "").lower()
    category_lower = (category or "").lower()
    type_lower = (type_field or "").lower()
    subtypes_lower = (subtypes or "").lower()

    if any(keyword in name_lower for keyword in ["indoor", "waterland", "doggieland", "playland"]):
        return "Indoor Dog Park"
    if "indoor" in subtypes_lower or "indoor" in category_lower:
        return "Indoor Dog Park"
    if "dog park" in category_lower or "dog park" in type_lower or "dog park" in subtypes_lower:
        return "Dog Park"
    if any(keyword in category_lower for keyword in ["cafe", "bar", "restaurant", "food", "store", "shop"]):
        return "Dog-Friendly Establishment"
    if any(keyword in type_lower for keyword in ["cafe", "bar", "restaurant", "food", "store", "shop"]):
        return "Dog-Friendly Establishment"
    if any(keyword in category_lower for keyword in ["day care", "daycare", "boarding", "groomer"]):
        return "Dog-Friendly Establishment"
    return "Dog Park"


def normalize_photos(raw_item: Dict[str, Any]) -> List[Dict[str, Any]]:
    photos: List[Dict[str, Any]] = []
    existing = raw_item.get("photos")
    if isinstance(existing, list):
        for p in existing:
            if isinstance(p, dict) and isinstance(p.get("url"), str) and p.get("url").strip():
                photos.append(
                    {
                        "url": p.get("url").strip(),
                        "type": p.get("type", "photo"),
                        "source": p.get("source"),
                        "caption": p.get("caption"),
                    }
                )
    return photos


def make_unique_id(place_id: str, name: str, city: str) -> str:
    return f"{place_id}__{slugify(name)}-{slugify(city)}"


def transform_mixmatch1_item(raw_item: Dict[str, Any], unique_id: str, place_id: str) -> Optional[Dict[str, Any]]:
    name = raw_item.get("name") or ""
    if not name:
        return None

    state_full = raw_item.get("state") or raw_item.get("us_state") or ""
    state = to_state_abbr(state_full) if state_full else ""

    business_type = determine_business_type(
        raw_item.get("category", ""),
        raw_item.get("type", ""),
        raw_item.get("subtypes", ""),
        name,
    )

    photos = normalize_photos(raw_item)
    primary_photo = raw_item.get("photo") if isinstance(raw_item.get("photo"), str) else (photos[0]["url"] if photos else None)

    entry: Dict[str, Any] = {
        "id": unique_id,
        "name": name,
        "businessType": business_type,
        "description": raw_item.get("description") or raw_item.get("shortDescription") or raw_item.get("marketingDescription") or "",
        "slug": slugify(name),
        "address": raw_item.get("street") or "",
        "street": raw_item.get("street") or "",
        "city": raw_item.get("city") or "",
        "state": state,
        "zipCode": str(raw_item.get("postal_code")) if raw_item.get("postal_code") not in (None, "") else None,
        "full_address": raw_item.get("full_address") or "",
        "latitude": raw_item.get("latitude"),
        "longitude": raw_item.get("longitude"),
        "googlePlaceId": place_id,
        "phone": raw_item.get("phone") or None,
        "website": raw_item.get("site") or raw_item.get("website") or None,
        "photos": photos,
        "photo": primary_photo,
        "rating": safe_float(raw_item.get("rating"), 0.0),
        "reviewCount": safe_int(raw_item.get("reviews") or raw_item.get("reviewCount"), 0),
        "userRatingsTotal": safe_int(raw_item.get("reviews") or raw_item.get("userRatingsTotal"), 0),
        "pricing": {"pricingSource": "unknown", "isFree": False},
        "placeTypes": ["point_of_interest", "establishment"],
        "lastUpdated": None,
        "dataQuality": "verified" if raw_item.get("verified") == "TRUE" else "partial",
        "openingHours": normalize_opening_hours(raw_item.get("working_hours")),
        "faqs": [],
        "amenities": {},
    }

    # Drop nulls
    return {k: v for k, v in entry.items() if v is not None}


def load_json_array(path: Path) -> List[Dict[str, Any]]:
    if not path.exists():
        return []
    data = json.loads(path.read_text(encoding="utf-8"))
    return data if isinstance(data, list) else []


def main() -> int:
    if not MIXMATCH1_PATH.exists():
        print(f"❌ Missing input: {MIXMATCH1_PATH}")
        return 1

    mixmatch1 = load_json_array(MIXMATCH1_PATH)
    existing = load_json_array(MIXMATCH_PATH)

    existing_by_id: Dict[str, Dict[str, Any]] = {}
    for p in existing:
        if isinstance(p, dict) and isinstance(p.get("id"), str):
            existing_by_id[p["id"]] = p

    place_ids = [p.get("place_id") for p in mixmatch1 if isinstance(p, dict) and isinstance(p.get("place_id"), str)]
    place_id_counts = Counter(place_ids)

    added = 0
    updated = 0
    skipped = 0

    # If previous runs created suffixed duplicates for *unique* place_ids (collisions with existing IDs),
    # merge those back into the canonical record and remove the duplicate entry.
    for pid, count in place_id_counts.items():
        if count != 1:
            continue
        if pid in existing_by_id:
            # Find any generated duplicates with same googlePlaceId that start with pid__
            dup_ids = [
                eid for eid, park in existing_by_id.items()
                if isinstance(eid, str)
                and eid.startswith(f"{pid}__")
                and park.get("googlePlaceId") == pid
            ]
            if dup_ids:
                canonical = dict(existing_by_id[pid])
                for dup_id in dup_ids:
                    dup = existing_by_id.get(dup_id)
                    if isinstance(dup, dict):
                        # Merge dup into canonical (prefer canonical, fill gaps, union photos)
                        for k, v in dup.items():
                            if k not in canonical or canonical[k] in (None, "", [], {}):
                                canonical[k] = v
                        canon_photos = canonical.get("photos") if isinstance(canonical.get("photos"), list) else []
                        dup_photos = dup.get("photos") if isinstance(dup.get("photos"), list) else []
                        canon_urls = {p.get("url") for p in canon_photos if isinstance(p, dict)}
                        for ph in dup_photos:
                            if isinstance(ph, dict) and ph.get("url") and ph.get("url") not in canon_urls:
                                canon_photos.append(ph)
                                canon_urls.add(ph.get("url"))
                        canonical["photos"] = canon_photos
                        if not canonical.get("photo") and canon_photos:
                            canonical["photo"] = canon_photos[0].get("url")
                    # Remove the generated duplicate
                    existing_by_id.pop(dup_id, None)
                existing_by_id[pid] = canonical

    for raw in mixmatch1:
        if not isinstance(raw, dict):
            skipped += 1
            continue
        place_id = raw.get("place_id")
        if not isinstance(place_id, str) or not place_id:
            skipped += 1
            continue

        # Generate unique stable ID when needed.
        # If mixmatch1 contains duplicate place_ids, we must split them into multiple records.
        # Otherwise, prefer using the canonical ID == place_id so we merge into existing records.
        if place_id_counts.get(place_id, 0) > 1:
            unique_id = make_unique_id(place_id, raw.get("name") or "", raw.get("city") or "")
        else:
            unique_id = place_id

        incoming = transform_mixmatch1_item(raw, unique_id=unique_id, place_id=place_id)
        if not incoming:
            skipped += 1
            continue

        if unique_id in existing_by_id:
            # Merge: keep existing as base, fill gaps from incoming, prefer local photos
            merged = dict(existing_by_id[unique_id])
            for k, v in incoming.items():
                if k not in merged or merged[k] in (None, "", [], {}):
                    merged[k] = v
            # photos merge
            ex_photos = merged.get("photos") if isinstance(merged.get("photos"), list) else []
            in_photos = incoming.get("photos") if isinstance(incoming.get("photos"), list) else []
            ex_urls = {p.get("url") for p in ex_photos if isinstance(p, dict)}
            for ph in in_photos:
                if isinstance(ph, dict) and ph.get("url") and ph.get("url") not in ex_urls:
                    ex_photos.append(ph)
                    ex_urls.add(ph.get("url"))
            merged["photos"] = ex_photos
            if not merged.get("photo") and ex_photos:
                merged["photo"] = ex_photos[0].get("url")

            existing_by_id[unique_id] = merged
            updated += 1
        else:
            existing_by_id[unique_id] = incoming
            added += 1

    merged_list = list(existing_by_id.values())
    merged_list.sort(key=lambda p: (str(p.get("state", "")), str(p.get("city", "")), str(p.get("name", ""))))
    MIXMATCH_PATH.write_text(json.dumps(merged_list, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print("✅ Merge complete")
    print(f"  - Existing mixmatch: {len(existing)}")
    print(f"  - Incoming mixmatch1: {len(mixmatch1)}")
    print(f"  - Added: {added}")
    print(f"  - Updated: {updated}")
    print(f"  - Skipped: {skipped}")
    print(f"  - Output total: {len(merged_list)}")
    print(f"  - Output: {MIXMATCH_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

def safe_float(value: Any, default: float = 0.0) -> float:
    if value is None or value == "":
        return default
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def safe_int(value: Any, default: int = 0) -> int:
    if value is None or value == "":
        return default
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


def normalize_opening_hours(working_hours: Any) -> Optional[Dict[str, str]]:
    if not isinstance(working_hours, dict):
        return None
    out: Dict[str, str] = {}
    for day, hours in working_hours.items():
        if not isinstance(hours, str):
            continue
        val = hours.strip()
        if not val or val.lower() == "closed":
            continue
        out[str(day)] = val
    return out or None


def determine_business_type(category: str, type_field: str, subtypes: str, name: str) -> str:
    name_lower = (name or "").lower()
    category_lower = (category or "").lower()
    type_lower = (type_field or "").lower()
    subtypes_lower = (subtypes or "").lower()

    if any(keyword in name_lower for keyword in ["indoor", "waterland", "doggieland", "playland"]):
        return "Indoor Dog Park"
    if "indoor" in subtypes_lower or "indoor" in category_lower:
        return "Indoor Dog Park"
    if "dog park" in category_lower or "dog park" in type_lower or "dog park" in subtypes_lower:
        return "Dog Park"
    if any(keyword in category_lower for keyword in ["cafe", "bar", "restaurant", "food", "store", "shop"]):
        return "Dog-Friendly Establishment"
    if any(keyword in type_lower for keyword in ["cafe", "bar", "restaurant", "food", "store", "shop"]):
        return "Dog-Friendly Establishment"
    if any(keyword in category_lower for keyword in ["day care", "daycare", "boarding", "groomer"]):
        return "Dog-Friendly Establishment"
    return "Dog Park"


def extract_amenities(about: Any, subtypes: str) -> Optional[Dict[str, bool]]:
    amenities: Dict[str, bool] = {}

    if isinstance(about, dict):
        accessibility = about.get("Accessibility")
        if isinstance(accessibility, dict):
            if accessibility.get("Wheelchair accessible entrance"):
                amenities["handicapAccess"] = True
            if accessibility.get("Wheelchair accessible parking lot"):
                amenities["parking"] = True

    st = (subtypes or "").lower()
    if "day care" in st or "daycare" in st:
        amenities["daycare"] = True
    if "groomer" in st or "grooming" in st:
        amenities["grooming"] = True
    if "trainer" in st or "training" in st:
        amenities["training"] = True

    return amenities or None


def normalize_photos(raw_item: Dict[str, Any]) -> Optional[List[Dict[str, Any]]]:
    """
    mixmatch1 may have:
    - photos: [{url,type,source,caption}, ...] (from our downloader script)
    - street_view / logo fields
    """
    photos: List[Dict[str, Any]] = []

    existing = raw_item.get("photos")
    if isinstance(existing, list) and existing:
        for p in existing:
            if isinstance(p, dict) and isinstance(p.get("url"), str) and p.get("url").strip():
                # Keep as-is
                photos.append(
                    {
                        "url": p.get("url"),
                        "type": p.get("type", "photo"),
                        "source": p.get("source"),
                        "caption": p.get("caption"),
                    }
                )
            elif isinstance(p, str) and p.strip():
                photos.append({"url": p.strip(), "type": "photo", "source": "google_places"})

    if photos:
        return photos

    street_view = raw_item.get("street_view")
    logo = raw_item.get("logo")
    if isinstance(street_view, str) and street_view.strip():
        photos.append({"url": street_view.strip(), "type": "photo", "source": "google_street_view", "caption": None})
    if isinstance(logo, str) and logo.strip() and logo.strip() != street_view:
        photos.append({"url": logo.strip(), "type": "photo", "source": "website", "caption": "Logo"})

    return photos or None


def transform_mixmatch1_item(raw_item: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    place_id = raw_item.get("place_id") or raw_item.get("id")
    name = raw_item.get("name") or ""
    if not place_id or not name:
        return None

    state_full = raw_item.get("state") or raw_item.get("us_state") or ""
    state = to_state_abbr(state_full) if state_full else ""

    business_type = determine_business_type(
        raw_item.get("category", ""),
        raw_item.get("type", ""),
        raw_item.get("subtypes", ""),
        name,
    )

    photos = normalize_photos(raw_item)
    primary_photo = photos[0]["url"] if photos else None

    # Keep placeTypes consistent with other datasets (the UI doesn't rely on these heavily)
    place_types = ["point_of_interest", "establishment"]

    entry: Dict[str, Any] = {
        "id": place_id,
        "name": name,
        "businessType": business_type,
        "description": raw_item.get("description") or raw_item.get("shortDescription") or raw_item.get("marketingDescription") or "",
        "slug": slugify(name),
        "address": raw_item.get("street") or "",
        "street": raw_item.get("street") or "",
        "city": raw_item.get("city") or "",
        "state": state,
        "zipCode": str(raw_item.get("postal_code")) if raw_item.get("postal_code") not in (None, "") else None,
        "full_address": raw_item.get("full_address") or "",
        "latitude": raw_item.get("latitude"),
        "longitude": raw_item.get("longitude"),
        "googlePlaceId": place_id,
        "phone": raw_item.get("phone") or None,
        "website": raw_item.get("site") or raw_item.get("website") or None,
        "photos": photos or [],
        "photo": primary_photo,
        "rating": safe_float(raw_item.get("rating"), 0.0),
        "reviewCount": safe_int(raw_item.get("reviews") or raw_item.get("reviewCount"), 0),
        "userRatingsTotal": safe_int(raw_item.get("reviews") or raw_item.get("userRatingsTotal"), 0),
        "pricing": {"pricingSource": "unknown", "isFree": False},
        "placeTypes": place_types,
        "lastUpdated": None,
        "dataQuality": "verified" if raw_item.get("verified") == "TRUE" else "partial",
        "openingHours": normalize_opening_hours(raw_item.get("working_hours")),
        "faqs": [],
        "amenities": extract_amenities(raw_item.get("about"), raw_item.get("subtypes", "")) or {},
    }

    # Remove nulls while keeping empty arrays/objects where we intentionally set them
    entry = {k: v for k, v in entry.items() if v is not None}
    return entry


def merge_records(existing: Dict[str, Any], incoming: Dict[str, Any]) -> Dict[str, Any]:
    """
    Prefer existing (it may already have locally downloaded images),
    but fill obvious gaps from incoming.
    """
    merged = dict(existing)

    # Fill missing scalars
    for key in ["description", "phone", "website", "zipCode", "full_address", "state", "city", "street", "address"]:
        if (not merged.get(key)) and incoming.get(key):
            merged[key] = incoming[key]

    # Fill coords if missing
    if merged.get("latitude") in (None, "") and incoming.get("latitude") not in (None, ""):
        merged["latitude"] = incoming["latitude"]
    if merged.get("longitude") in (None, "") and incoming.get("longitude") not in (None, ""):
        merged["longitude"] = incoming["longitude"]

    # Prefer existing photos if they look local, otherwise use incoming
    existing_photos = merged.get("photos") if isinstance(merged.get("photos"), list) else []
    incoming_photos = incoming.get("photos") if isinstance(incoming.get("photos"), list) else []

    def has_local(photos: List[Any]) -> bool:
        for p in photos:
            if isinstance(p, dict) and isinstance(p.get("url"), str) and "/images/parks/" in p.get("url"):
                return True
        return False

    if (not existing_photos) or (not has_local(existing_photos) and has_local(incoming_photos)):
        merged["photos"] = incoming_photos
        merged["photo"] = incoming.get("photo") or (incoming_photos[0]["url"] if incoming_photos else merged.get("photo"))

    # Ensure defaults exist
    merged.setdefault("pricing", {"pricingSource": "unknown", "isFree": False})
    merged.setdefault("placeTypes", ["point_of_interest", "establishment"])
    merged.setdefault("faqs", [])
    merged.setdefault("amenities", merged.get("amenities") or {})
    merged.setdefault("dataQuality", merged.get("dataQuality") or "partial")
    merged.setdefault("lastUpdated", None)

    return merged


def load_json_array(path: Path) -> List[Dict[str, Any]]:
    if not path.exists():
        return []
    return json.loads(path.read_text(encoding="utf-8"))


def main() -> int:
    if not MIXMATCH1_PATH.exists():
        print(f"❌ Missing input: {MIXMATCH1_PATH}")
        return 1

    mixmatch1 = load_json_array(MIXMATCH1_PATH)
    mixmatch_existing = load_json_array(MIXMATCH_PATH)

    by_id: Dict[str, Dict[str, Any]] = {}
    for p in mixmatch_existing:
        pid = p.get("id")
        if isinstance(pid, str) and pid:
            by_id[pid] = p

    added = 0
    updated = 0
    skipped = 0

    for raw in mixmatch1:
        incoming = transform_mixmatch1_item(raw)
        if not incoming:
            skipped += 1
            continue
        pid = incoming["id"]
        if pid in by_id:
            by_id[pid] = merge_records(by_id[pid], incoming)
            updated += 1
        else:
            by_id[pid] = incoming
            added += 1

    merged_list = list(by_id.values())
    merged_list.sort(key=lambda p: (str(p.get("state", "")), str(p.get("city", "")), str(p.get("name", ""))))

    MIXMATCH_PATH.write_text(json.dumps(merged_list, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print("✅ Merge complete")
    print(f"  - Existing: {len(mixmatch_existing)}")
    print(f"  - Incoming (mixmatch1): {len(mixmatch1)}")
    print(f"  - Added: {added}")
    print(f"  - Updated (matched IDs): {updated}")
    print(f"  - Skipped (missing id/name): {skipped}")
    print(f"  - Output: {MIXMATCH_PATH} ({len(merged_list)} total)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())



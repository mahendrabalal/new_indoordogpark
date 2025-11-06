#!/usr/bin/env python3
"""
Fetch the first N (default: 10) indoor dog park results in California using
the Google Places API (New).

The script reads the API key from a `.env` file, issues a Places Text Search
request, and prints a compact summary. Optionally, results can be saved to
CSV or JSON for later use.
"""

from __future__ import annotations

import argparse
import csv
import json
import os
import sys
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional

import requests

PLACES_TEXT_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText"
DEFAULT_FIELD_MASK = ",".join(
    [
        "places.id",
        "places.displayName",
        "places.formattedAddress",
        "places.location",
        "places.websiteUri",
        "places.nationalPhoneNumber",
        "places.types",
        "places.rating",
        "places.userRatingCount",
    ]
)
CALIFORNIA_LOCATION_RESTRICTION = {
    "rectangle": {
        "low": {"latitude": 32.528832, "longitude": -124.482003},
        "high": {"latitude": 42.009516, "longitude": -114.131211},
    }
}


def load_api_key(env_path: Path, env_var: str = "google_place_api") -> str:
    """Load the Google Places API key from a dotenv-style file."""
    if env_var in os.environ and os.environ[env_var]:
        return os.environ[env_var]

    if not env_path.exists():
        raise FileNotFoundError(f"Cannot find environment file: {env_path}")

    key = None
    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            continue
        name, value = line.split("=", 1)
        if name.strip() == env_var:
            key = value.strip().strip('"').strip("'")
            break

    if not key:
        raise KeyError(f"Environment variable `{env_var}` not found in {env_path}")
    return key


def search_places(
    api_key: str,
    query: str,
    max_results: int,
    language: str = "en",
    location_restriction: Optional[Dict[str, Any]] = None,
) -> List[Dict[str, Any]]:
    """Execute a Places Text Search request and return the list of places."""
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": api_key,
        "X-Goog-FieldMask": DEFAULT_FIELD_MASK,
    }
    payload = {
        "textQuery": query,
        "maxResultCount": max_results,
        "languageCode": language,
        "regionCode": "US",
    }
    if location_restriction:
        payload["locationRestriction"] = location_restriction
    response = requests.post(
        PLACES_TEXT_SEARCH_URL,
        headers=headers,
        json=payload,
        timeout=30,
    )
    try:
        response.raise_for_status()
    except requests.HTTPError as exc:
        detail = exc.response.text if exc.response is not None else ""
        raise RuntimeError(f"Places API request failed: {detail}") from exc

    data = response.json()
    return data.get("places", [])


def flatten_place(place: Dict[str, Any]) -> Dict[str, Any]:
    """Convert a place record into a flattened dictionary for export."""
    location = place.get("location", {})
    display_name = place.get("displayName", {}) or {}

    return {
        "place_id": place.get("id", ""),
        "name": display_name.get("text", ""),
        "address": place.get("formattedAddress", ""),
        "latitude": location.get("latitude"),
        "longitude": location.get("longitude"),
        "website": place.get("websiteUri", ""),
        "phone": place.get("nationalPhoneNumber", ""),
        "rating": place.get("rating"),
        "user_ratings_total": place.get("userRatingCount"),
        "types": ",".join(place.get("types", [])),
    }


def write_csv(rows: Iterable[Dict[str, Any]], output_path: Path) -> None:
    """Persist rows into a CSV file."""
    rows = list(rows)
    if not rows:
        print("No places to write to CSV.", file=sys.stderr)
        return

    fieldnames = list(rows[0].keys())
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with output_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def write_json(records: List[Dict[str, Any]], output_path: Path) -> None:
    """Persist data to a JSON file."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(records, indent=2), encoding="utf-8")


def print_summary(records: List[Dict[str, Any]]) -> None:
    """Print a compact summary of places to stdout."""
    if not records:
        print("No matching places found.")
        return

    for idx, record in enumerate(records, start=1):
        name = record.get("name") or "(no name)"
        address = record.get("address") or "(no address)"
        phone = record.get("phone") or "n/a"
        website = record.get("website") or "n/a"
        rating = record.get("rating")
        ratings_total = record.get("user_ratings_total")
        rating_str = (
            f"{rating:.1f} ⭐ ({ratings_total} reviews)"
            if rating is not None and ratings_total is not None
            else "no rating"
        )

        print(f"{idx}. {name}")
        print(f"   Address: {address}")
        print(f"   Phone:   {phone}")
        print(f"   Website: {website}")
        print(f"   Rating:  {rating_str}")
        print()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Fetch indoor dog parks in California via Google Places API (New)."
    )
    parser.add_argument(
        "--env-file",
        type=Path,
        default=Path(".env"),
        help="Path to the dotenv file containing `google_place_api` (default: .env)",
    )
    parser.add_argument(
        "--query",
        default="indoor dog park in California",
        help="Free text query sent to Places Text Search (default: %(default)s)",
    )
    parser.add_argument(
        "--max-results",
        type=int,
        default=10,
        help="Number of results to request from the API (default: %(default)s)",
    )
    parser.add_argument(
        "--language",
        default="en",
        help="Response language code (default: %(default)s)",
    )
    parser.add_argument(
        "--no-location-filter",
        action="store_true",
        help="Disable the default California bounding box filter.",
    )
    parser.add_argument(
        "--csv",
        type=Path,
        help="Optional path to write the flattened results as CSV.",
    )
    parser.add_argument(
        "--json",
        type=Path,
        help="Optional path to write the raw place records as JSON.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    try:
        api_key = load_api_key(args.env_file)
    except Exception as exc:  # noqa: BLE001 - surface clear error to caller
        print(f"Error loading API key: {exc}", file=sys.stderr)
        sys.exit(1)

    try:
        places = search_places(
            api_key=api_key,
            query=args.query,
            max_results=args.max_results,
            language=args.language,
            location_restriction=(
                None
                if args.no_location_filter
                else CALIFORNIA_LOCATION_RESTRICTION
            ),
        )
    except Exception as exc:  # noqa: BLE001 - requests errors bubble up
        print(exc, file=sys.stderr)
        sys.exit(2)

    flattened = [flatten_place(place) for place in places]

    print_summary(flattened)

    if args.csv:
        write_csv(flattened, args.csv)
        print(f"Wrote CSV to {args.csv}", file=sys.stderr)
    if args.json:
        write_json(places, args.json)
        print(f"Wrote JSON to {args.json}", file=sys.stderr)


if __name__ == "__main__":
    main()

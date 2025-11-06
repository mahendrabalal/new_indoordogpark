#!/usr/bin/env python3
"""
Scrape candidate indoor dog park locations in California using open data.

The script pulls dog-park features from OpenStreetMap (via the public Overpass API)
and flags records that look like indoor facilities based on structured tags or
keyword heuristics. The output is a CSV you can review, enrich, or merge with
other sources.
"""

from __future__ import annotations

import argparse
import csv
import json
import re
import sys
from pathlib import Path
from time import sleep
from typing import Dict, Iterable, List, Tuple

import requests

OVERPASS_URL = "https://overpass-api.de/api/interpreter"
OVERPASS_QUERY = """
[out:json][timeout:180];
area["ISO3166-2"="US-CA"][admin_level=4];
(
  node["leisure"="dog_park"](area);
  way["leisure"="dog_park"](area);
  relation["leisure"="dog_park"](area);
);
out center tags;
"""

# Keywords that often indicate an indoor facility when they appear in metadata.
INDOOR_KEYWORDS = re.compile(
    r"\b(indoor|inside|climate[- ]?controlled|covered|warehouse|gym|playhouse|training\s+center|training\s+facility|canine\s+club)\b",
    re.IGNORECASE,
)


def fetch_osm(retries: int = 3, backoff: int = 5) -> Dict:
    """Fetch all dog park features in California from Overpass."""
    for attempt in range(1, retries + 1):
        try:
            resp = requests.get(
                OVERPASS_URL,
                params={"data": OVERPASS_QUERY},
                timeout=180,
                headers={
                    "User-Agent": "indoor-dog-parks-ca/1.0 (+https://github.com/mahendrabalal/scraper)"
                },
            )
            resp.raise_for_status()
            return resp.json()
        except requests.HTTPError as exc:
            status = exc.response.status_code if exc.response is not None else "?"
            is_retryable = isinstance(status, int) and 500 <= status < 600
            if not is_retryable or attempt == retries:
                raise
        except requests.RequestException:
            if attempt == retries:
                raise
        sleep(backoff * attempt)
    raise RuntimeError("Failed to fetch data from Overpass after retries")


def element_center(element: Dict) -> Tuple[float, float]:
    """Return a (lat, lon) tuple for a node/way/relation."""
    if "center" in element:
        return element["center"]["lat"], element["center"]["lon"]
    return element.get("lat"), element.get("lon")


def assess_indoor(tags: Dict[str, str]) -> Tuple[bool, int, List[str]]:
    """
    Determine whether tags imply an indoor dog park.

    Returns (is_indoor, score, evidence)
    where `score` is a simple heuristic (higher = stronger signal).
    """
    score = 0
    evidence: List[str] = []

    if tags.get("indoor") == "yes":
        score += 3
        evidence.append("tag:indoor=yes")
    if tags.get("covered") == "yes":
        score += 2
        evidence.append("tag:covered=yes")
    if tags.get("location") == "indoor":
        score += 2
        evidence.append("tag:location=indoor")

    text_fields = [
        ("name", tags.get("name", "")),
        ("description", tags.get("description", "")),
        ("note", tags.get("note", "")),
        ("website", tags.get("website", "")),
        ("operator", tags.get("operator", "")),
    ]

    for field_name, value in text_fields:
        if value and INDOOR_KEYWORDS.search(value):
            score += 1
            evidence.append(f"keyword:{field_name}")

    return score > 0, score, evidence


def build_osm_url(element: Dict) -> str:
    """Construct a link back to the OSM object."""
    osm_type = element["type"]
    osm_id = element["id"]
    return f"https://www.openstreetmap.org/{osm_type}/{osm_id}"


def to_row(element: Dict) -> Dict[str, str]:
    """Convert an OSM element into a flattened CSV row."""
    tags = element.get("tags", {})
    lat, lon = element_center(element)
    is_indoor, score, evidence = assess_indoor(tags)

    row = {
        "name": tags.get("name", "").strip(),
        "latitude": f"{lat:.6f}" if lat is not None else "",
        "longitude": f"{lon:.6f}" if lon is not None else "",
        "street": tags.get("addr:street", "").strip(),
        "housenumber": tags.get("addr:housenumber", "").strip(),
        "city": tags.get("addr:city", "").strip(),
        "state": tags.get("addr:state", "").strip(),
        "postcode": tags.get("addr:postcode", "").strip(),
        "website": tags.get("website", "").strip(),
        "phone": tags.get("phone", tags.get("contact:phone", "")).strip(),
        "opening_hours": tags.get("opening_hours", "").strip(),
        "operator": tags.get("operator", "").strip(),
        "indoor_candidate": "yes" if is_indoor else "no",
        "indoor_score": str(score),
        "indoor_evidence": ";".join(evidence),
        "osm_url": build_osm_url(element),
    }
    return row


def write_csv(elements: Iterable[Dict], out_path: Path) -> None:
    """Write processed records to a CSV file."""
    rows = [to_row(el) for el in elements]
    if not rows:
        print("No dog parks found in the Overpass response", file=sys.stderr)
        return

    fieldnames = list(rows[0].keys())
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Build a CSV of California dog parks with indoor heuristics using OSM data."
    )
    parser.add_argument(
        "--output",
        "-o",
        type=Path,
        default=Path("data/indoor_dog_parks_ca.csv"),
        help="Where to write the CSV (default: data/indoor_dog_parks_ca.csv)",
    )
    parser.add_argument(
        "--json",
        type=Path,
        help="Optional path to save the raw Overpass JSON for reuse/debugging.",
    )
    args = parser.parse_args()

    data = fetch_osm()
    elements = data.get("elements", [])

    print(f"Fetched {len(elements)} dog park features from OSM.", file=sys.stderr)

    if args.json:
        args.json.parent.mkdir(parents=True, exist_ok=True)
        args.json.write_text(json.dumps(data, indent=2), encoding="utf-8")
        print(f"Saved raw JSON to {args.json}", file=sys.stderr)

    write_csv(elements, args.output)
    print(f"Wrote CSV to {args.output}", file=sys.stderr)


if __name__ == "__main__":
    main()

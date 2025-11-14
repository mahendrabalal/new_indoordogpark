import argparse
import hashlib
import json
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional

from description_generator import generate_description, normalize_context, validate_description

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
logger = logging.getLogger("regenerate_descriptions")


def load_cache(path: Path) -> Dict[str, Any]:
    if not path.exists():
        return {}
    try:
        with path.open("r", encoding="utf-8") as cache_file:
            return json.load(cache_file)
    except Exception as exc:  # pragma: no cover - defensive
        logger.warning("Failed to load cache %s: %s", path, exc)
        return {}


def save_cache(path: Path, cache: Dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as cache_file:
        json.dump(cache, cache_file, indent=2, ensure_ascii=False)


def context_hash(context: Dict[str, Any]) -> str:
    relevant = {
        key: context.get(key)
        for key in [
            "name",
            "city",
            "state",
            "business_type",
            "amenities",
            "opening_hours",
            "pricing",
            "unique_notes",
            "place_types",
            "indoor_outdoor",
            "size_category",
            "surface_type",
        ]
    }
    payload = json.dumps(relevant, sort_keys=True, default=str)
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def regenerate(
    parks: List[Dict[str, Any]],
    *,
    force: bool,
    limit: Optional[int],
    resume_from: Optional[str],
    cache: Dict[str, Any],
    template_only: bool,
) -> Dict[str, int]:
    stats = {"processed": 0, "regenerated": 0, "cached": 0, "errors": 0}
    remaining = limit
    started = resume_from is None

    for park in parks:
        park_id = park.get("id") or park.get("slug")
        if not started:
            if park_id == resume_from or park.get("slug") == resume_from:
                started = True
            else:
                continue

        stats["processed"] += 1

        context = normalize_context(park)
        digest = context_hash(context)
        cache_entry = cache.get(context["id"])

        if cache_entry and cache_entry.get("hash") == digest and not force:
            park["description"] = cache_entry["description"]
            stats["cached"] += 1
            continue

        try:
            description = generate_description(context, force_template=template_only)
        except Exception as exc:  # pragma: no cover - defensive
            logger.error("Description generation failed for %s: %s", park.get("name"), exc)
            stats["errors"] += 1
            continue

        if not validate_description(description):
            logger.error("Generated description did not meet requirements for %s", park.get("name"))
            stats["errors"] += 1
            continue

        park["description"] = description
        cache[context["id"]] = {"hash": digest, "description": description}
        stats["regenerated"] += 1

        if remaining is not None:
            remaining -= 1
            if remaining <= 0:
                break

    return stats


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Regenerate dog park descriptions.")
    parser.add_argument(
        "--input",
        default="public/data/california.json",
        help="Source JSON file containing park data.",
    )
    parser.add_argument(
        "--output",
        help="Output file path. Defaults to <input>.updated.json unless --in-place is set.",
    )
    parser.add_argument(
        "--cache",
        default="public/data/descriptions_cache.json",
        help="Cache file storing previously generated descriptions.",
    )
    parser.add_argument("--force", action="store_true", help="Ignore cache and regenerate everything.")
    parser.add_argument("--dry-run", action="store_true", help="Compute text but do not write files.")
    parser.add_argument("--limit", type=int, help="Limit the number of parks regenerated.")
    parser.add_argument(
        "--resume-from",
        dest="resume_from",
        help="Resume processing once this park ID or slug is encountered.",
    )
    parser.add_argument(
        "--template-only",
        action="store_true",
        help="Bypass LLM providers and use the deterministic template only.",
    )
    parser.add_argument(
        "--in-place",
        action="store_true",
        help="Overwrite the input file with regenerated descriptions.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    input_path = Path(args.input).resolve()
    if not input_path.exists():
        raise FileNotFoundError(f"Input file not found: {input_path}")

    if args.in_place:
        output_path = input_path
    elif args.output:
        output_path = Path(args.output).resolve()
    else:
        output_path = input_path.with_name(f"{input_path.stem}.updated{input_path.suffix}")

    cache_path = Path(args.cache).resolve()

    with input_path.open("r", encoding="utf-8") as source_file:
        parks = json.load(source_file)

    cache = load_cache(cache_path)
    stats = regenerate(
        parks,
        force=args.force,
        limit=args.limit,
        resume_from=args.resume_from,
        cache=cache,
        template_only=args.template_only,
    )

    logger.info(
        "Regeneration summary: processed=%s regenerated=%s cached=%s errors=%s",
        stats["processed"],
        stats["regenerated"],
        stats["cached"],
        stats["errors"],
    )

    if args.dry_run:
        logger.info("Dry run enabled; skipping write.")
        return

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as destination:
        json.dump(parks, destination, indent=2, ensure_ascii=False)
        destination.write("\n")

    save_cache(cache_path, cache)
    logger.info("Updated data written to %s", output_path)


if __name__ == "__main__":
    main()


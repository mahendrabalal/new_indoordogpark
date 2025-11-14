import hashlib
import logging
import os
from typing import Any, Dict, List, Optional, Sequence

try:
    import requests  # type: ignore
except ImportError:  # pragma: no cover - optional dependency
    requests = None  # type: ignore

TARGET_DESCRIPTION_CHARS = int(os.getenv("PARK_DESC_TARGET_CHARS", "1500"))
MIN_DESCRIPTION_CHARS = int(os.getenv("PARK_DESC_MIN_CHARS", "1450"))
MAX_DESCRIPTION_CHARS = int(os.getenv("PARK_DESC_MAX_CHARS", "1650"))

logger = logging.getLogger(__name__)

try:
    from openai import OpenAI  # type: ignore
except ImportError:  # pragma: no cover - optional dependency
    OpenAI = None  # type: ignore

try:
    import anthropic  # type: ignore
except ImportError:  # pragma: no cover - optional dependency
    anthropic = None  # type: ignore


def _first_present(source: Dict[str, Any], keys: Sequence[Any]) -> Any:
    for key in keys:
        if isinstance(key, (list, tuple)):
            value: Any = source
            for part in key:
                if isinstance(value, dict):
                    value = value.get(part)
                else:
                    value = None
                    break
        else:
            value = source.get(key)
        if value not in (None, "", []):
            return value
    return None


def _extract_name(raw_value: Any) -> str:
    if isinstance(raw_value, dict):
        return raw_value.get("text") or raw_value.get("value") or ""
    return str(raw_value or "").strip()


def _normalize_hours(raw_hours: Any) -> List[str]:
    if not raw_hours:
        return []
    if isinstance(raw_hours, dict):
        return [f"{day}: {hours}" for day, hours in raw_hours.items() if hours]
    if isinstance(raw_hours, list):
        return [str(item) for item in raw_hours if item]
    return [str(raw_hours)]


def _normalize_amenities(raw_amenities: Any) -> List[str]:
    amenities: List[str] = []
    if isinstance(raw_amenities, list):
        for entry in raw_amenities:
            if isinstance(entry, str):
                amenities.append(entry)
            elif isinstance(entry, dict):
                label = entry.get("label") or entry.get("name") or entry.get("title")
                if label:
                    amenities.append(label)
    elif isinstance(raw_amenities, dict):
        for key, value in raw_amenities.items():
            if isinstance(value, bool) and value:
                amenities.append(key.replace("_", " ").title())
            elif isinstance(value, str) and value:
                amenities.append(value)
    elif isinstance(raw_amenities, str):
        amenities.append(raw_amenities)
    return amenities


def _city_from_full_address(full_address: Optional[str]) -> Optional[str]:
    if not full_address or "," not in full_address:
        return None
    parts = [part.strip() for part in full_address.split(",")]
    if len(parts) >= 2 and parts[1]:
        return parts[1]
    return None


def normalize_context(raw: Dict[str, Any]) -> Dict[str, Any]:
    """Normalize upstream data into a common context payload."""
    name = _extract_name(_first_present(raw, ["name", "displayName", "display_name"]) or "")
    if not name:
        name = raw.get("slug") or raw.get("id") or "Unnamed Dog Park"

    business_type = (
        _first_present(raw, ["businessType", "business_type"]) or raw.get("type") or "Dog Park"
    )

    city = _first_present(
        raw,
        ["city", "locality", "municipality", ("address", "city"), ("address", "locality")],
    )
    city = city or _city_from_full_address(raw.get("full_address"))
    city = city or "California"

    state = _first_present(raw, ["state", ("address", "state"), "region"]) or "CA"

    rating = raw.get("rating") or raw.get("averageRating")
    review_count = (
        raw.get("reviewCount") or raw.get("userRatingCount") or raw.get("userRatingsTotal")
    )
    amenities = _normalize_amenities(
        raw.get("amenities") or raw.get("amenityDetails") or raw.get("features")
    )
    opening_hours = _normalize_hours(
        raw.get("openingHours")
        or raw.get("hours")
        or raw.get("regularOpeningHours", {}).get("weekdayDescriptions")
    )

    pricing = raw.get("pricing") or raw.get("pricingInfo") or raw.get("pricing_info")
    neighborhood = (
        raw.get("neighborhood")
        or raw.get("shortFormattedAddress")
        or raw.get("full_address")
        or raw.get("address")
    )
    phone = raw.get("phone") or raw.get("formattedPhoneNumber") or raw.get("nationalPhoneNumber")
    website = raw.get("website") or raw.get("websiteUri")
    unique_notes = (
        raw.get("uniqueNotes")
        or raw.get("descriptionSeed")
        or raw.get("editorialSummary", {}).get("text")
        or raw.get("summary")
    )

    context = {
        "id": raw.get("id") or raw.get("googlePlaceId") or raw.get("slug") or name,
        "name": name,
        "business_type": str(business_type),
        "city": str(city),
        "state": str(state),
        "neighborhood": neighborhood,
        "full_address": raw.get("full_address") or raw.get("formattedAddress"),
        "latitude": raw.get("latitude") or raw.get("location", {}).get("latitude"),
        "longitude": raw.get("longitude") or raw.get("location", {}).get("longitude"),
        "rating": rating,
        "review_count": review_count,
        "amenities": amenities,
        "opening_hours": opening_hours,
        "pricing": pricing,
        "phone": phone,
        "website": website,
        "unique_notes": unique_notes,
        "place_types": raw.get("placeTypes") or raw.get("types") or [],
        "indoor_outdoor": raw.get("indoor_outdoor"),
        "size_category": raw.get("size_category") or raw.get("sizeCategory"),
        "surface_type": raw.get("surface_type") or raw.get("surfaceType"),
    }
    context["_is_normalized"] = True
    return context


def _choose_variant(context: Dict[str, Any], variants: Sequence[str]) -> str:
    if not variants:
        return ""
    digest_source = str(context.get("id") or context.get("name"))
    digest = hashlib.md5(digest_source.encode("utf-8")).hexdigest()
    index = int(digest, 16) % len(variants)
    return variants[index]


def _format_rating(context: Dict[str, Any]) -> Optional[str]:
    rating = context.get("rating")
    reviews = context.get("review_count")
    if not rating:
        return None
    rating_text = f"{float(rating):.1f}-star"
    if reviews:
        rating_text += f" average across {int(reviews)} reviews"
    return rating_text


def _format_pricing(pricing: Any) -> Optional[str]:
    if not pricing:
        return None
    if isinstance(pricing, (int, float)):
        return f"level {int(pricing)} pricing"
    if isinstance(pricing, dict):
        if pricing.get("isFree"):
            return "complimentary access for the community"
        if pricing.get("pricingType"):
            return f"{pricing['pricingType']} memberships"
        tier = pricing.get("tier") or pricing.get("priceLevel")
        if tier:
            return f"{tier} pricing"
    if isinstance(pricing, str):
        return pricing
    return None


def _format_hours(opening_hours: List[str]) -> Optional[str]:
    if not opening_hours:
        return None
    preview = "; ".join(opening_hours[:3])
    if len(opening_hours) > 3:
        preview += "; hours vary later in the week"
    return preview


def _describe_amenities(context: Dict[str, Any]) -> str:
    amenities = context.get("amenities") or []
    business_type = str(context.get("business_type", "Dog Park")).lower()
    if amenities:
        highlighted = ", ".join(sorted(set(amenities[:6])))
        return f"It layers {highlighted} with thoughtful zoning so every pup finds their ideal pace."
    if "indoor" in business_type:
        return (
            "Climate-controlled play studios, sanitized turf, and lounge seating ensure an indoor experience "
            "that stays spotless even on rainy Bay Area afternoons."
        )
    if "friendly establishment" in business_type:
        return (
            "Expect cafe-style seating, water bowls under every table, and staff who memorize each dog's quirks."
        )
    return (
        "Expansive turf runs, agility challenges, and shaded rest nooks stretch across the property so dogs can "
        "sprint, sniff, and reset without ever feeling crowded."
    )


def _programming_sentence(context: Dict[str, Any]) -> str:
    business_type = str(context.get("business_type", "Dog Park")).lower()
    city = context.get("city")
    name = context.get("name")
    programs = [
        f"{name} curates small-group play dates, confidence-building agility rotations, and gentle introductions for new rescues.",
        f"Weekly enrichment labs, pop-up adoption drives, and local vendor markets keep {city}'s canine calendar fresh.",
        "Certified behavior teams circulate through each yard, coaching leash manners and offering quick progress reports.",
    ]
    if "indoor" in business_type:
        programs[0] = (
            "Indoor movement circuits, scent-work corners, and climbing rigs rotate monthly so regulars always spot something new."
        )
    return " ".join(programs)


def _care_sentence(context: Dict[str, Any]) -> str:
    name = context.get("name")
    phone = context.get("phone")
    website = context.get("website")
    contact_phrase = ""
    if website:
        contact_phrase = f"Check {website} for day passes, vaccination policies, and community spotlights."
    elif phone:
        contact_phrase = f"Call {phone} for availability, temperament screenings, and orientation dates."
    else:
        contact_phrase = "Reach out directly to confirm availability, vaccination requirements, and orientation times."
    return (
        f"Health-forward protocols guide every visit at {name}, from double-gated entries to staff-monitored hydration breaks. "
        f"{contact_phrase}"
    )


def _create_filler_sentences(context: Dict[str, Any]) -> List[str]:
    name = context.get("name")
    city = context.get("city")
    state = context.get("state")
    fillers = [
        f"Plenty of shade sails, misting fans, and bench swings encourage guardians to linger while their dogs make new friends in {city}.",
        f"Local trainers frequently cite {name} as a dependable neutral ground for socialization sessions and leash reactivity breakthroughs.",
        f"The team collaborates with shelters across {city} to host confidence clinics that help shy rescues blossom.",
        f"Signature photo moments pop up throughout the grounds, from muraled tunnel runs to {state}-shaped splash pads.",
        f"Members love the way staff rotates toys and agility props weekly so the environment feels fresh without overwhelming sensitive dogs.",
        f"Cleanliness stays top-of-mind thanks to hospital-grade turf care, paw rinsing stations, and stocked towel carts.",
        f"The park newsletter spotlights adoptable dogs, volunteer opportunities, and small businesses that fuel {city}'s pet economy.",
        f"Seasonal festivals transform the campus with costume parades, pup-friendly dessert bars, and charity raffles.",
        f"Thoughtful lighting and monitored evening sessions extend the play window for commuters who rely on twilight romps.",
        f"Wayfinding signage makes it simple to explore every corner, whether you're chasing zoomies or enjoying a quiet cuddle lawn.",
    ]
    return fillers


def _ensure_length(paragraphs: List[str], context: Dict[str, Any]) -> List[str]:
    def total_length() -> int:
        return len("\n\n".join(paragraphs))

    fillers = _create_filler_sentences(context)
    idx = 0
    while total_length() < TARGET_DESCRIPTION_CHARS:
        filler = fillers[idx % len(fillers)]
        paragraphs[idx % len(paragraphs)] += " " + filler
        idx += 1
        if idx > len(fillers) * 3 and total_length() > MIN_DESCRIPTION_CHARS:
            break

    while total_length() < MIN_DESCRIPTION_CHARS:
        filler = fillers[idx % len(fillers)]
        paragraphs[idx % len(paragraphs)] += " " + filler
        idx += 1

    combined = "\n\n".join(paragraphs)
    if len(combined) > MAX_DESCRIPTION_CHARS:
        trimmed_text = combined[:MAX_DESCRIPTION_CHARS]
        if ". " in trimmed_text:
            trimmed_text = trimmed_text.rsplit(". ", 1)[0] + "."
        combined = trimmed_text
        split = [p.strip() for p in combined.split("\n\n") if p.strip()]
        if len(split) == 1:
            midpoint = len(split[0]) // 2
            split = [split[0][:midpoint].strip(), split[0][midpoint:].strip()]
        paragraphs = split[:2]

    return [p.strip() for p in paragraphs]


def _template_paragraphs(context: Dict[str, Any]) -> List[str]:
    name = context.get("name")
    city = context.get("city")
    state = context.get("state")
    business_type = context.get("business_type", "Dog Park").lower()
    neighborhood = context.get("neighborhood")
    rating_text = _format_rating(context)
    pricing_text = _format_pricing(context.get("pricing"))
    hours_text = _format_hours(context.get("opening_hours", []))
    unique_notes = context.get("unique_notes")

    hook = _choose_variant(
        context,
        [
            f"{name} anchors {city}'s dog-loving rhythm as a {business_type} that marries expansive play yards with concierge-level care.",
            f"In {city}, {name} has become synonymous with dependable off-leash freedom, blending neighborhood charm with pro-grade amenities.",
            f"{name} is the beating heart of {city}'s canine community, offering a {business_type} experience tailored to social, curious pups.",
            f"Perched in {city}, {name} delivers a {business_type} experience where energetic romps and mindful training feel perfectly balanced.",
        ],
    )

    location_sentence = (
        f"Located in {city}, {state}, the park is tucked near {neighborhood} and easy to reach for commuters and weekend adventurers alike."
        if neighborhood
        else f"Situated in the heart of {city}, {state}, it remains a quick hop for residents across the metro area."
    )

    rating_sentence = (
        f"Guests rave about its {rating_text}, pointing to spotless grounds, intuitive traffic flow, and staff who remember every pup's quirks."
        if rating_text
        else f"Regulars will tell you the energy here feels equal parts boutique and community commons."
    )

    notes_sentence = (
        f"{unique_notes}"
        if unique_notes
        else "The campus layers mature trees with long sight lines so guardians can relax while still keeping eyes on the action."
    )

    hours_sentence = (
        f"Hours currently rotate through {hours_text}, giving early birds and twilight walkers plenty of daylight options."
        if hours_text
        else "Morning, afternoon, and twilight blocks are thoughtfully staggered to keep crowds light and vibes relaxed."
    )

    pricing_sentence = (
        f"Access runs on {pricing_text}, with flexible passes that welcome both spontaneous drop-ins and devoted regulars."
        if pricing_text
        else "Drop-in passes, punch cards, and community days keep the experience accessible without sacrificing premium touches."
    )

    paragraph_one = " ".join(
        [hook, location_sentence, rating_sentence, notes_sentence, hours_sentence, pricing_sentence]
    )

    amenity_sentence = _describe_amenities(context)
    programs_sentence = _programming_sentence(context)
    care_sentence = _care_sentence(context)
    community_sentence = (
        f"{name} partners with nearby shelters, trainers, and pet-forward cafes to keep {city}'s vibrant dog scene moving together."
    )

    paragraph_two = " ".join(
        [
            amenity_sentence,
            programs_sentence,
            care_sentence,
            community_sentence,
        ]
    )

    return _ensure_length([paragraph_one, paragraph_two], context)


def _build_prompt(context: Dict[str, Any]) -> str:
    amenities = ", ".join(context.get("amenities") or []) or "agility sets, shaded seating, rinse stations"
    hours = "; ".join(context.get("opening_hours") or []) or "Seasonal schedule"
    rating = _format_rating(context) or "community-loved reputation"
    pricing = _format_pricing(context.get("pricing")) or "flexible membership options"
    prompt = f"""
Write a high-quality visitor guide for a dog-focused venue. Output must be exactly two paragraphs separated by a blank line and total roughly 1,500 characters.
- Tone: warm, expert, descriptive, specific to the location.
- Mention location, vibe, amenities, programming, staff philosophy, cleanliness, and how to plan a visit.
- Avoid bullet lists, boring phrases, or repeating the same sentence structure.

Context:
Name: {context.get('name')}
Business Type: {context.get('business_type')}
City: {context.get('city')}, {context.get('state')}
Neighborhood: {context.get('neighborhood') or 'N/A'}
Rating: {rating}
Amenities: {amenities}
Hours: {hours}
Pricing: {pricing}
Unique Notes: {context.get('unique_notes') or 'N/A'}
Website: {context.get('website') or 'N/A'}
Phone: {context.get('phone') or 'N/A'}
"""
    return prompt.strip()


def _effective_provider() -> Optional[str]:
    provider = os.getenv("PARK_DESC_MODEL_PROVIDER")
    if provider:
        return provider.lower()
    if os.getenv("OPENAI_API_KEY") or os.getenv("Z_AI_API_KEY"):
        return "openai"
    if os.getenv("ANTHROPIC_API_KEY"):
        return "anthropic"
    return None


def _call_text_model(prompt: str) -> Optional[str]:
    provider = _effective_provider()
    if not provider:
        return None

    try:
        if provider == "openai":
            base_url = os.getenv("OPENAI_BASE_URL", "").rstrip("/")
            model_name = os.getenv("PARK_DESC_OPENAI_MODEL", "").lower()
            if any(
                domain in base_url
                for domain in ["api.z.ai", "bigmodel.cn"]
            ) or "glm" in model_name:
                return _call_glm_chat_completions(prompt, base_url=base_url or "https://api.z.ai/v1")
            if OpenAI is None:
                logger.warning("OpenAI client not installed; falling back to template descriptions.")
                return None
            api_key = os.getenv("OPENAI_API_KEY") or os.getenv("Z_AI_API_KEY")
            if not api_key:
                logger.warning("OPENAI_API_KEY not set; falling back to template descriptions.")
                return None
            client = OpenAI(api_key=api_key)
            model = os.getenv("PARK_DESC_OPENAI_MODEL", "gpt-4.1-mini")
            max_tokens = int(os.getenv("PARK_DESC_MAX_TOKENS", "900"))
            temperature = float(os.getenv("PARK_DESC_MODEL_TEMPERATURE", "0.7"))
            response = client.responses.create(
                model=model,
                input=prompt,
                temperature=temperature,
                max_output_tokens=max_tokens,
            )
            if response.output and response.output[0].content:
                return response.output[0].content[0].text.strip()
            return None

        if provider == "anthropic":
            if anthropic is None:
                logger.warning("Anthropic SDK not installed; falling back to template descriptions.")
                return None
            api_key = os.getenv("ANTHROPIC_API_KEY")
            if not api_key:
                logger.warning("ANTHROPIC_API_KEY not set; falling back to template descriptions.")
                return None
            client = anthropic.Anthropic(api_key=api_key)
            model = os.getenv("PARK_DESC_ANTHROPIC_MODEL", "claude-3-5-sonnet-20240620")
            temperature = float(os.getenv("PARK_DESC_MODEL_TEMPERATURE", "0.7"))
            response = client.messages.create(
                model=model,
                temperature=temperature,
                max_tokens=int(os.getenv("PARK_DESC_MAX_TOKENS", "900")),
                messages=[{"role": "user", "content": prompt}],
            )
            if response.content:
                return response.content[0].text.strip()
            return None
    except Exception as exc:  # pragma: no cover - defensive logging
        logger.warning("Text model provider failed: %s", exc)
        return None

    logger.warning("Unsupported PARK_DESC_MODEL_PROVIDER '%s'; using template.", provider)
    return None


def _call_glm_chat_completions(prompt: str, base_url: str) -> Optional[str]:
    if requests is None:
        logger.warning("Requests library not installed; cannot call GLM chat completions.")
        return None
    api_key = os.getenv("OPENAI_API_KEY") or os.getenv("Z_AI_API_KEY")
    if not api_key:
        logger.warning("No API key available for GLM provider; falling back to template descriptions.")
        return None

    endpoint = f"{base_url.rstrip('/')}/chat/completions"
    model = os.getenv("PARK_DESC_OPENAI_MODEL", "glm-4")
    temperature = float(os.getenv("PARK_DESC_MODEL_TEMPERATURE", "0.7"))
    max_tokens = int(os.getenv("PARK_DESC_MAX_TOKENS", "900"))

    payload = {
        "model": model,
        "messages": [
            {
                "role": "system",
                "content": "You are an expert travel copywriter producing premium dog-park descriptions.",
            },
            {"role": "user", "content": prompt},
        ],
        "temperature": temperature,
        "max_tokens": max_tokens,
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
    }

    try:
        response = requests.post(endpoint, json=payload, headers=headers, timeout=60)
        response.raise_for_status()
    except requests.exceptions.RequestException as exc:
        logger.warning("GLM chat completion request failed: %s", exc)
        return None

    try:
        data = response.json()
        return data["choices"][0]["message"]["content"].strip()
    except (KeyError, IndexError, ValueError) as exc:
        logger.warning("Unexpected GLM response format: %s", exc)
        return None


def _clean_model_output(text: str) -> str:
    paragraphs = [p.strip() for p in text.strip().split("\n\n") if p.strip()]
    if len(paragraphs) < 2:
        joined = " ".join(paragraphs)
        halfway = max(len(joined) // 2, 1)
        paragraphs = [joined[:halfway].strip(), joined[halfway:].strip()]
    if len(paragraphs) > 2:
        paragraphs = [" ".join(paragraphs[: len(paragraphs) // 2]), " ".join(paragraphs[len(paragraphs) // 2 :])]
    return "\n\n".join(paragraphs[:2])


def validate_description(description: str) -> bool:
    if not description:
        return False
    paragraphs = [p for p in description.split("\n\n") if p.strip()]
    length = len(description)
    return (
        len(paragraphs) == 2
        and MIN_DESCRIPTION_CHARS <= length <= MAX_DESCRIPTION_CHARS
        and not description.lower().startswith("{{")
    )


def generate_description(context: Dict[str, Any], *, force_template: bool = False) -> str:
    normalized = context if context.get("_is_normalized") else normalize_context(context)
    description: Optional[str] = None

    if not force_template:
        prompt = _build_prompt(normalized)
        description = _call_text_model(prompt)
        if description:
            description = _clean_model_output(description)

    if not description:
        paragraphs = _template_paragraphs(normalized)
        description = "\n\n".join(paragraphs)

    if not validate_description(description):
        paragraphs = _ensure_length(
            [p.strip() for p in description.split("\n\n")[:2] if p.strip()] or _template_paragraphs(normalized),
            normalized,
        )
        description = "\n\n".join(paragraphs)

    return description.strip()


import argparse
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

from description_generator import normalize_context

FAQ_COUNT = 5


def format_currency(value: Optional[float]) -> Optional[str]:
    if value is None:
        return None
    return f"${value:,.2f}".rstrip('0').rstrip('.')


def format_amenity_name(key: str) -> str:
    parts: List[str] = []
    current = ''
    for char in key:
        if char.isupper() and current:
            parts.append(current)
            current = char
        else:
            current += char
    if current:
        parts.append(current)
    label = ' '.join(parts).replace('_', ' ').strip()
    return label[:1].upper() + label[1:]


def extract_amenities(park: Dict[str, Any]) -> List[str]:
    amenities = park.get('amenities') or {}
    if isinstance(amenities, dict):
        return [format_amenity_name(key) for key, value in amenities.items() if value]
    if isinstance(amenities, list):
        return [str(item).title() for item in amenities]
    return []


def describe_pricing(park: Dict[str, Any]) -> str:
    pricing = park.get('pricing') or {}
    name = park.get('name')
    if not pricing:
        return (
            f"Day-use pricing at {name} varies by season and special programming. "
            "Call ahead to confirm current drop-in rates or membership packages."
        )

    if pricing.get('isFree'):
        return (
            f"Access to {name} is complimentary for the community. "
            "Bring a leash for arrival and plan to sign the standard waiver on site."
        )

    price_bits: List[str] = []
    if pricing.get('dropInFee') is not None:
        price_bits.append(f"single-session drop-ins start at {format_currency(pricing['dropInFee'])}")
    if pricing.get('dailyRate') is not None:
        price_bits.append(f"day passes average {format_currency(pricing['dailyRate'])}")
    if pricing.get('monthlyRate') is not None:
        price_bits.append(f"monthly memberships run about {format_currency(pricing['monthlyRate'])}")
    if pricing.get('hourlyRate') is not None:
        price_bits.append(f"hourly rentals begin around {format_currency(pricing['hourlyRate'])}")

    if price_bits:
        summary = '; '.join(price_bits)
        return (
            f"{summary.capitalize()}. "
            "Rates may shift for peak times or add-on services, so confirm availability before you arrive."
        )

    details = pricing.get('pricingDetails')
    if details:
        return details

    return (
        f"{name} offers flexible memberships and punch cards so you can tailor visits to your routine. "
        "Contact the desk for the latest promotions or multi-dog discounts."
    )


def describe_amenities(park: Dict[str, Any]) -> str:
    name = park.get('name')
    amenities = extract_amenities(park)
    if amenities:
        highlighted = ', '.join(amenities[:5])
        if len(amenities) > 5:
            highlighted += ', and more'
        return (
            f"{name} highlights {highlighted}. "
            "Separate play zones and double-gated entries keep energy levels balanced for every pup."
        )

    return (
        f"The team rotates toys, agility props, and splash features weekly so repeat visits to {name} never feel stale. "
        "Expect shaded seating, rinse stations, and staff roaming the yards to keep playgroups safe."
    )


def describe_hours_and_parking(park: Dict[str, Any]) -> str:
    name = park.get('name')
    city = park.get('city')
    hours = park.get('openingHours') or {}
    parking = park.get('amenities', {}).get('parking') if isinstance(park.get('amenities'), dict) else None

    if park.get('hours24x7'):
        hours_text = f"{name} is open 24/7 with lighting for safe evening pick-ups."
    elif isinstance(hours, dict) and hours:
        sample = list(hours.items())[:2]
        formatted = '; '.join(f"{day}: {slot}" for day, slot in sample)
        hours_text = f"Core play blocks typically run {formatted}. Hours expand during peak season, so double-check before leaving home."
    else:
        hours_text = "Hours rotate with weather and staffing, so call ahead to confirm current play blocks."

    parking_text = (
        "On-site parking is available right next to the gates."
        if parking
        else "Street and shared-lot parking is available nearby; arrive a few minutes early to grab a spot."
    )

    return f"{hours_text} {parking_text} Use posted signage around {city} to navigate any temporary closures."


def describe_check_in(park: Dict[str, Any]) -> str:
    name = park.get('name')
    website = park.get('website')
    requirements = [
        'proof of current rabies and core vaccinations',
        'a leash for entry and exit',
        'an ID tag with up-to-date contact info',
    ]
    requirement_text = ', '.join(requirements[:-1]) + f", and {requirements[-1]}"
    next_steps = (
        f"Download the waiver from {website} and submit your dog profile before your visit."
        if website
        else "Arrive 10 minutes early so staff can review your waiver and temperament notes."
    )
    return f"Bring {requirement_text} to breeze through check-in at {name}. {next_steps}"


def describe_contact(park: Dict[str, Any]) -> str:
    name = park.get('name')
    phone = park.get('phone')
    website = park.get('website')
    contact_bits: List[str] = []
    if phone:
        contact_bits.append(f"call {phone}")
    if website:
        contact_bits.append(f"visit {website}")
    if not contact_bits:
        contact_bits.append('message the team on social or stop by the front desk')

    contact_text = ', and '.join(contact_bits) if len(contact_bits) > 1 else contact_bits[0]
    return (
        f"For reservations, temperament assessments, or party rentals, {contact_text}. "
        f"The concierge team at {name} typically replies within one business day."
    )


def describe_safety(park: Dict[str, Any]) -> str:
    name = park.get('name')
    business_type = (park.get('businessType') or park.get('business_type') or 'Dog Park').lower()
    amenities = park.get('amenities') or {}
    mentions: List[str] = []
    if isinstance(amenities, dict):
        if amenities.get('fencing'):
            mentions.append('full-perimeter fencing')
        if amenities.get('lighting'):
            mentions.append('LED lighting for evening play')
        if amenities.get('dogWashStation'):
            mentions.append('on-site wash stations')
        if amenities.get('training'):
            mentions.append('trainer-led playgroups')

    detail = ', '.join(mentions) if mentions else 'double-gated entries, roaming attendants, and small-group rotations'

    return (
        f"Safety at {name} comes first: {detail} keep every session orderly. "
        f"Staff monitor body language and may pause play to reset groups, especially at this {business_type} during busy hours."
    )


def build_faqs(park: Dict[str, Any]) -> List[Dict[str, Any]]:
    normalized = normalize_context(park)
    faqs = [
        {
            'question': f"What should I bring for check-in at {normalized['name']}?",
            'answer': describe_check_in(park),
        },
        {
            'question': f"How does pricing work at {normalized['name']}?",
            'answer': describe_pricing(park),
        },
        {
            'question': f"Which amenities does {normalized['name']} offer?",
            'answer': describe_amenities(park),
        },
        {
            'question': f"When is {normalized['name']} open and where do I park?",
            'answer': describe_hours_and_parking(park),
        },
        {
            'question': f"How do I contact the team at {normalized['name']}?",
            'answer': describe_contact(park),
        },
    ]

    if FAQ_COUNT < len(faqs):
        return faqs[:FAQ_COUNT]
    return faqs


def main() -> None:
    parser = argparse.ArgumentParser(description='Generate structured FAQs for each park.')
    parser.add_argument('--input', default='public/data/california.json', help='Path to the park data JSON.')
    parser.add_argument(
        '--output',
        default=None,
        help='Where to save the updated data. Defaults to overwriting the input file.',
    )
    parser.add_argument('--dry-run', action='store_true', help='Print sample output without writing.')
    args = parser.parse_args()

    input_path = Path(args.input).resolve()
    output_path = Path(args.output).resolve() if args.output else input_path

    with input_path.open('r', encoding='utf-8') as source:
        parks = json.load(source)

    timestamp = datetime.now(timezone.utc).isoformat()
    for park in parks:
        faqs = build_faqs(park)
        for faq in faqs:
            faq['lastUpdated'] = timestamp
        park['faqs'] = faqs

    if args.dry_run:
        print(json.dumps(parks[0]['faqs'], indent=2))
        return

    with output_path.open('w', encoding='utf-8') as destination:
        json.dump(parks, destination, indent=2, ensure_ascii=False)
        destination.write('\n')


if __name__ == '__main__':
    main()


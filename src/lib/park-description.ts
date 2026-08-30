import { DogPark } from '@/types/dog-park';
import { getStateName } from '@/lib/state';

export function formatBusinessTypeName(type?: string): string {
  if (!type) return 'Dog Park & Facility';
  const lower = type.toLowerCase();
  if (lower.includes('training') || lower.includes('trainer')) {
    if (lower.includes('academy')) return 'Dog Training Academy';
    return 'Dog Training Facility';
  }
  if (lower.includes('daycare')) return 'Dog Daycare & Play Park';
  if (lower.includes('indoor')) return 'Indoor Dog Park';
  if (lower.includes('friendly') || lower.includes('establishment')) return 'Dog-Friendly Establishment';
  if (lower.includes('park')) return 'Dog Park';
  return type;
}

export interface ParkHighlight {
  icon: string;
  label: string;
  value: string;
  subtext?: string;
  badgeClass?: string;
}

/**
 * Generates an array of structured highlight cards for the listing
 */
export function getParkHighlights(park: DogPark): ParkHighlight[] {
  const highlights: ParkHighlight[] = [];

  // 1. Service Type
  const typeName = formatBusinessTypeName(park.businessType);
  highlights.push({
    icon: typeName.includes('Training') ? 'bi-mortarboard-fill' : typeName.includes('Indoor') ? 'bi-house-heart-fill' : 'bi-tree-fill',
    label: 'Category',
    value: typeName,
    subtext: park.indoorOutdoor ? `${park.indoorOutdoor.charAt(0).toUpperCase() + park.indoorOutdoor.slice(1)} Environment` : 'Pet Care & Recreation',
    badgeClass: 'text-indigo-600 bg-indigo-50 border-indigo-100',
  });

  // 2. Rating & Reviews
  if (park.rating && park.rating > 0) {
    highlights.push({
      icon: 'bi-star-fill',
      label: 'Rating Score',
      value: `${park.rating.toFixed(1)} / 5.0`,
      subtext: `${park.reviewCount || 0} Google Reviews`,
      badgeClass: 'text-amber-600 bg-amber-50 border-amber-100',
    });
  } else {
    highlights.push({
      icon: 'bi-shield-check',
      label: 'Listing Status',
      value: 'Community Verified',
      subtext: 'Directory Listing',
      badgeClass: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    });
  }

  // 3. Location / City
  const stateName = getStateName(park.state) || park.state || 'CA';
  highlights.push({
    icon: 'bi-geo-alt-fill',
    label: 'Location',
    value: park.city,
    subtext: `${stateName}, USA`,
    badgeClass: 'text-rose-600 bg-rose-50 border-rose-100',
  });

  // 4. Pricing / Access
  if (park.pricing?.isFree) {
    highlights.push({
      icon: 'bi-tag-fill',
      label: 'Admission',
      value: 'Free Access',
      subtext: 'Open to the public',
      badgeClass: 'text-teal-600 bg-teal-50 border-teal-100',
    });
  } else if (park.pricing?.priceRange) {
    highlights.push({
      icon: 'bi-cash-coin',
      label: 'Price Range',
      value: park.pricing.priceRange,
      subtext: park.pricing.pricingType ? `Model: ${park.pricing.pricingType}` : 'Flexible Rates',
      badgeClass: 'text-blue-600 bg-blue-50 border-blue-100',
    });
  } else {
    highlights.push({
      icon: 'bi-clock-history',
      label: 'Availability',
      value: park.hours24x7 ? 'Open 24/7' : 'Standard Hours',
      subtext: 'Call for current schedule',
      badgeClass: 'text-cyan-600 bg-cyan-50 border-cyan-100',
    });
  }

  return highlights;
}

/**
 * Generates natural, comprehensive multi-paragraph description
 * for listings where park.description is empty or very short.
 */
export function generateParkDescriptionParagraphs(park: DogPark): string[] {
  const existingDesc = park.description?.trim();
  if (existingDesc && existingDesc.length >= 120) {
    return existingDesc.split(/\n\s*\n/).filter(Boolean);
  }

  const paragraphs: string[] = [];
  const stateName = getStateName(park.state) || park.state || 'California';
  const typeName = formatBusinessTypeName(park.businessType).toLowerCase();

  // Paragraph 1: Rich Introduction
  let p1 = `**${park.name}** is a dedicated ${typeName} serving pet parents in ${park.city} and the surrounding ${stateName} communities.`;
  
  if (park.rating && park.rating >= 4.0) {
    p1 += ` Holding an impressive **${park.rating.toFixed(1)}-star customer rating** across **${park.reviewCount || 'multiple'} verified reviews**, this facility is recognized locally for quality care, attentive service, and a welcoming environment for dogs of various breeds and temperaments.`;
  } else if (park.full_address) {
    p1 += ` Conveniently situated at ${park.full_address}, it provides a secure, well-maintained space designed specifically for canine wellness, activity, and socialization.`;
  }
  paragraphs.push(p1);

  // Paragraph 2: Amenities and Environment
  const features: string[] = [];
  if (park.indoorOutdoor === 'indoor') {
    features.push('fully climate-controlled indoor play areas that keep pups comfortable regardless of the weather');
  } else if (park.indoorOutdoor === 'both') {
    features.push('both indoor climate-controlled spaces and secure outdoor play yards');
  } else if (park.indoorOutdoor === 'outdoor') {
    features.push('spacious outdoor yards with ample room for exercise and off-leash exploration');
  }

  if (park.amenities) {
    const amenityKeys = Object.entries(park.amenities)
      .filter(([, v]) => v === true)
      .map(([k]) => k.replace(/([A-Z])/g, ' $1').toLowerCase().trim());
    if (amenityKeys.length > 0) {
      features.push(`amenities including ${amenityKeys.slice(0, 4).join(', ')}`);
    }
  }

  if (features.length > 0) {
    paragraphs.push(
      `Visitors can enjoy ${features.join(', along with ')}. Whether you are seeking structured behavioral coaching, energetic playgroups, or safe off-leash socialization, the facility offers a thoughtfully curated space to support your dog's physical and mental enrichment.`
    );
  } else {
    paragraphs.push(
      `Whether you are looking to brush up on obedience commands, introduce your pup to new playmates, or establish good behavioral foundations, **${park.name}** offers the setting and support necessary for pet owners in ${park.city}.`
    );
  }

  // Paragraph 3: Health, Safety & Visiting Tips
  const safetyPoints: string[] = [];
  if (park.rules?.vaccinationsRequired !== false) {
    safetyPoints.push('up-to-date core vaccination records (such as Rabies, DHPP, and Bordetella)');
  }
  safetyPoints.push('a standard non-retractable leash for entry and exit');
  safetyPoints.push('an ID tag with current contact details');

  paragraphs.push(
    `**Visiting Tips & Requirements:** To ensure a safe and harmonious atmosphere for all dogs and staff, pet parents should prepare ${safetyPoints.join(', ')}. First-time visitors are encouraged to contact the team ahead of time to confirm registration prerequisites or schedule an initial temperament assessment.`
  );

  return paragraphs;
}

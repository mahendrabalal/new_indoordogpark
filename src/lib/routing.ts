/**
 * Loose structural type accepted by routing helpers.
 * Using a plain interface instead of Partial<DogPark> so that
 * ParkSubmission and other compatible shapes can be passed without a cast.
 */
interface RoutablePark {
  slug?: string | null;
  id?: string;
  businessType?: string | null;
}

const KNOWN_PARK_REDIRECTS: Record<string, string> = {
  'petsmart-doggie-day-camp': 'petsmart-doggie-day-camp-secaucus',
  'barking-hound-village-buckhead': 'barking-hound-village-buckhead-atlanta',
  'barking-hound-village-cheshire': 'barking-hound-village-cheshire-atlanta',
  'woofs-n-whiskers': 'woofs-n-whiskers-brooklyn',
  'zen-canine-club': 'zen-canine-club-miami-lakes',
  'hi-bk-doggy-daycare': 'hi-bk-doggy-daycare-brooklyn',
  'the-martial-arfs-dog-training-fitness-center': 'the-martial-arfs-dog-training-fitness-center-carle-place',
  'pet-super-nanny': 'pet-super-nanny-brooklyn',
  'prospect-park-carousel': 'prospect-park-carousel-brooklyn',
  'digs-canine-hotel-spa-daycare': 'digs-canine-hotel-spa-daycare-brooklyn',
  'indoor-dog-park-california-california': 'indoor-dog-park-california',
};

export function cleanParkSlug(rawSlug: string): string {
  let slug = rawSlug;
  if (KNOWN_PARK_REDIRECTS[slug]) {
    slug = KNOWN_PARK_REDIRECTS[slug];
  }
  const parts = slug.split('-');
  if (parts.length >= 2) {
    const last = parts[parts.length - 1];
    const secondLast = parts[parts.length - 2];
    if (last === secondLast && last.length > 2) {
      slug = parts.slice(0, -1).join('-');
    }
  }
  return slug;
}

export function getParkUrl(park: RoutablePark): string {
  const rawSlug = park.slug || park.id;
  if (!rawSlug) return '#';

  const slug = cleanParkSlug(rawSlug);

  if (isDogTrainingFacility(park)) {
    return `/dog-training/${slug}`;
  }

  if (isDogFriendlyEstablishment(park)) {
    return `/dog-friendly/${slug}`;
  }

  return `/parks/${slug}`;
}

export function isDogTrainingFacility(park: RoutablePark): boolean {
  const type = park.businessType?.toLowerCase() || '';
  return type.includes('training') || type.includes('trainer');
}

export function isDogFriendlyEstablishment(park: RoutablePark): boolean {
  const type = park.businessType?.toLowerCase() || '';
  return (
    type.includes('friendly') ||
    type.includes('establishment') ||
    type.includes('bar') ||
    type.includes('restaurant') ||
    type.includes('cafe')
  );
}

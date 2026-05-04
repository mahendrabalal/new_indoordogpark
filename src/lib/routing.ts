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

export function getParkUrl(park: RoutablePark): string {
  const slug = park.slug || park.id;
  if (!slug) return '#';

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

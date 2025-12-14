/**
 * Valid business types for dog parks
 */
export const VALID_BUSINESS_TYPES = [
  'Dog Park',
  'Indoor Dog Park',
  'Dog-Friendly Establishment',
  'General Play / Daycare Parks',
  'Agility & Training Parks',
  'Themed & Enrichment Parks',
  'Specialty / Social Parks',
] as const;

export type ValidBusinessType = typeof VALID_BUSINESS_TYPES[number];

/**
 * Mapping of common invalid/URL-friendly type values to valid business types
 */
const TYPE_NORMALIZATION_MAP: Record<string, ValidBusinessType> = {
  'training': 'Agility & Training Parks',
  'agility': 'Agility & Training Parks',
  'agility-training': 'Agility & Training Parks',
  'agility-and-training': 'Agility & Training Parks',
  'daycare': 'General Play / Daycare Parks',
  'general-play': 'General Play / Daycare Parks',
  'general': 'General Play / Daycare Parks',
  'themed': 'Themed & Enrichment Parks',
  'enrichment': 'Themed & Enrichment Parks',
  'specialty': 'Specialty / Social Parks',
  'social': 'Specialty / Social Parks',
  'indoor': 'Indoor Dog Park',
  'dog-park': 'Dog Park',
  'dog-friendly': 'Dog-Friendly Establishment',
};

/**
 * Normalizes a type parameter to a valid business type
 * @param type - The type parameter from URL or user input
 * @returns The normalized valid business type, or null if invalid
 */
export function normalizeTypeParameter(type: string | undefined | null): ValidBusinessType | null {
  if (!type || typeof type !== 'string') {
    return null;
  }

  const trimmed = type.trim();
  
  // Check if it's already a valid type
  if (VALID_BUSINESS_TYPES.includes(trimmed as ValidBusinessType)) {
    return trimmed as ValidBusinessType;
  }

  // Try normalization map (case-insensitive)
  const normalized = TYPE_NORMALIZATION_MAP[trimmed.toLowerCase()];
  if (normalized) {
    return normalized;
  }

  // Try partial match (case-insensitive)
  const lowerTrimmed = trimmed.toLowerCase();
  for (const validType of VALID_BUSINESS_TYPES) {
    if (validType.toLowerCase() === lowerTrimmed || 
        validType.toLowerCase().includes(lowerTrimmed) ||
        lowerTrimmed.includes(validType.toLowerCase())) {
      return validType;
    }
  }

  return null;
}

/**
 * Checks if a type parameter is valid
 */
export function isValidTypeParameter(type: string | undefined | null): boolean {
  return normalizeTypeParameter(type) !== null;
}

























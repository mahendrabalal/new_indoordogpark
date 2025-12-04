/**
 * SEO Utility Functions
 * 
 * This file contains reusable functions to ensure consistent SEO best practices
 * across the application. All functions follow industry standards and Google's
 * recommendations.
 */

import { Metadata } from 'next';
import { SITE_URL } from './metadata';

/**
 * Validates and truncates title to SEO-optimal length
 * Google displays ~60 characters, but can handle up to ~70
 * Best practice: Keep to 60 for guaranteed display
 */
export function createSEOTitle(title: string, maxLength = 60): string {
  if (!title || title.length === 0) {
    return 'Indoor Dog Park';
  }

  if (title.length <= maxLength) {
    return title.trim();
  }

  // Try to truncate at word boundary
  const truncated = title.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  // If we found a space after position 50, use it for cleaner truncation
  if (lastSpace >= 50) {
    return truncated.substring(0, lastSpace).trim() + '...';
  }

  // Otherwise, truncate at 57 and add ellipsis (total exactly 60)
  return truncated.substring(0, 57).trim() + '...';
}

/**
 * Validates and truncates meta description to SEO-optimal length
 * Google displays ~155-160 characters
 * Best practice: Keep to 155 for guaranteed display
 */
export function createSEODescription(description: string, maxLength = 155): string {
  if (!description || description.length === 0) {
    return '';
  }

  if (description.length <= maxLength) {
    return description.trim();
  }

  // Try to truncate at word boundary
  const truncated = description.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > 0) {
    return truncated.slice(0, lastSpace).trim() + '…';
  }

  return truncated.trim() + '…';
}

/**
 * Creates absolute canonical URL
 * Always use absolute URLs for canonical tags (SEO best practice)
 */
export function createCanonicalUrl(path: string): string {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}

/**
 * Validates image alt text
 * Returns true if alt text is descriptive (not generic)
 */
export function isValidAltText(alt: string | undefined | null): boolean {
  if (!alt || alt.trim().length === 0) {
    return false;
  }

  // Common generic alt texts to avoid
  const genericAltTexts = [
    'image',
    'photo',
    'picture',
    'img',
    'photo1',
    'image1',
    'placeholder',
  ];

  const lowerAlt = alt.toLowerCase().trim();
  return !genericAltTexts.includes(lowerAlt) && alt.length >= 10;
}

/**
 * Generates SEO-friendly slug from string
 * Converts to lowercase, replaces spaces with hyphens, removes special chars
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Validates URL structure
 * Checks if URL follows SEO best practices
 */
export function isValidSEOUrl(url: string): boolean {
  // Must be lowercase
  if (url !== url.toLowerCase()) {
    return false;
  }

  // No underscores (use hyphens)
  if (url.includes('_')) {
    return false;
  }

  // No special characters except hyphens
  if (!/^[a-z0-9/-]+$/.test(url)) {
    return false;
  }

  // No double hyphens
  if (url.includes('--')) {
    return false;
  }

  // Not too long (75 characters is ideal, 100 is max)
  if (url.length > 100) {
    return false;
  }

  return true;
}

/**
 * Generates keywords array from content
 * Extracts relevant keywords for meta keywords (though less important now)
 */
export function extractKeywords(
  content: string,
  additionalKeywords: string[] = []
): string[] {
  const keywords = new Set<string>();

  // Add provided keywords
  additionalKeywords.forEach((keyword) => {
    if (keyword && keyword.trim().length > 0) {
      keywords.add(keyword.toLowerCase().trim());
    }
  });

  // Extract common dog park related terms
  const commonTerms = [
    'indoor dog park',
    'dog park',
    'dog-friendly',
    'pet services',
    'dog training',
    'dog daycare',
    'dog boarding',
  ];

  const lowerContent = content.toLowerCase();

  commonTerms.forEach((term) => {
    if (lowerContent.includes(term)) {
      keywords.add(term);
    }
  });

  return Array.from(keywords).slice(0, 10); // Limit to 10 keywords
}

/**
 * Validates structured data object
 * Removes undefined/null values and validates required fields
 */
export function cleanStructuredData(data: Record<string, unknown>): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    // Skip undefined and null values
    if (value === undefined || value === null) {
      continue;
    }

    // Recursively clean nested objects
    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
      const cleanedNested = cleanStructuredData(value as Record<string, unknown>);
      if (Object.keys(cleanedNested).length > 0) {
        cleaned[key] = cleanedNested;
      }
    } else if (Array.isArray(value)) {
      // Clean array items
      const cleanedArray = value
        .map((item) => {
          if (typeof item === 'object' && item !== null) {
            return cleanStructuredData(item as Record<string, unknown>);
          }
          return item;
        })
        .filter((item) => item !== undefined && item !== null);

      if (cleanedArray.length > 0) {
        cleaned[key] = cleanedArray;
      }
    } else {
      // Keep primitive values
      cleaned[key] = value;
    }
  }

  return cleaned;
}

/**
 * Creates Open Graph metadata
 * Ensures consistent OG tags across all pages
 */
export function createOpenGraphMetadata(
  title: string,
  description: string,
  url: string,
  image?: string,
  type: 'website' | 'article' = 'website'
): Metadata['openGraph'] {
  const ogImage = image || `${SITE_URL}/images/hero/hero.webp`;

  return {
    title: createSEOTitle(title, 60),
    description: createSEODescription(description, 155),
    url: createCanonicalUrl(url),
    siteName: 'Indoor Dog Park',
    locale: 'en_US',
    type,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: title,
        type: 'image/webp',
      },
    ],
  };
}

/**
 * Creates Twitter Card metadata
 * Ensures consistent Twitter Card tags
 */
export function createTwitterCardMetadata(
  title: string,
  description: string,
  image?: string
): Metadata['twitter'] {
  const twitterImage = image || `${SITE_URL}/images/hero/hero.webp`;

  return {
    card: 'summary_large_image',
    title: createSEOTitle(title, 60),
    description: createSEODescription(description, 155),
    images: [twitterImage],
    site: '@indoordogpark',
    creator: '@indoordogpark',
  };
}

/**
 * Validates heading hierarchy
 * Checks if headings follow proper H1 → H2 → H3 structure
 */
export function validateHeadingHierarchy(headings: Array<{ level: number; text: string }>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  let previousLevel = 0;

  // Must have exactly one H1
  const h1Count = headings.filter((h) => h.level === 1).length;
  if (h1Count === 0) {
    errors.push('Missing H1 heading');
  } else if (h1Count > 1) {
    errors.push(`Multiple H1 headings found (${h1Count}). Should have exactly one.`);
  }

  // Check hierarchy (no skipping levels)
  for (const heading of headings) {
    if (previousLevel > 0 && heading.level > previousLevel + 1) {
      errors.push(
        `Heading hierarchy error: H${heading.level} follows H${previousLevel}. Cannot skip levels.`
      );
    }
    previousLevel = heading.level;
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generates breadcrumb items for schema
 * Creates proper breadcrumb structure
 */
export function createBreadcrumbItems(
  items: Array<{ name: string; url?: string }>
): Array<{ name: string; url: string }> {
  return items.map((item, index) => ({
    name: item.name,
    url: item.url || (index === 0 ? '/' : `/${createSlug(item.name)}`),
  }));
}

/**
 * Calculates reading time for content
 * Assumes average reading speed of 200 words per minute
 */
export function calculateReadingTime(content: string): number {
  if (!content) return 0;

  // Remove HTML tags and get word count
  const plainText = content.replace(/<[^>]*>/g, ' ');
  const words = plainText.split(/\s+/).filter(Boolean).length;

  // Calculate minutes (minimum 1 minute)
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Validates meta description quality
 * Checks if description is descriptive enough
 */
export function isQualityDescription(description: string): {
  valid: boolean;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 100;

  // Check length
  if (description.length < 120) {
    score -= 20;
    feedback.push('Description is too short (aim for 120-155 characters)');
  } else if (description.length > 160) {
    score -= 20;
    feedback.push('Description is too long (aim for 120-155 characters)');
  }

  // Check for call-to-action
  if (!/[!?.]/.test(description)) {
    score -= 10;
    feedback.push('Consider adding a call-to-action or question');
  }

  // Check for keywords
  const keywordTerms = ['dog park', 'indoor', 'California', 'dog-friendly'];
  const hasKeywords = keywordTerms.some((term) =>
    description.toLowerCase().includes(term)
  );
  if (!hasKeywords) {
    score -= 15;
    feedback.push('Consider including relevant keywords naturally');
  }

  return {
    valid: score >= 70,
    score,
    feedback,
  };
}

/**
 * Creates SEO-optimized metadata object
 * Combines all SEO best practices into one function
 */
export function createSEOMetadata(
  title: string,
  description: string,
  path: string,
  options?: {
    image?: string;
    type?: 'website' | 'article';
    keywords?: string[];
    publishedTime?: string;
    modifiedTime?: string;
    authors?: Array<{ name: string; url?: string }>;
  }
): Metadata {
  const canonical = createCanonicalUrl(path);
  const seoTitle = createSEOTitle(title);
  const seoDescription = createSEODescription(description);

  // Build OpenGraph metadata
  const baseOpenGraph = createOpenGraphMetadata(seoTitle, seoDescription, path, options?.image, options?.type);
  
  // Add article-specific fields only if type is 'article'
  let openGraph = baseOpenGraph;
  if (options?.type === 'article' && options?.publishedTime) {
    openGraph = {
      ...baseOpenGraph,
      type: 'article',
      publishedTime: options.publishedTime,
      ...(options.modifiedTime && { modifiedTime: options.modifiedTime }),
      ...(options.authors && options.authors.length > 0 && {
        authors: options.authors.map(author => author.name),
      }),
    };
  }

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: options?.keywords || extractKeywords(description),
    authors: options?.authors,
    alternates: {
      canonical,
    },
    openGraph,
    twitter: createTwitterCardMetadata(seoTitle, seoDescription, options?.image),
  };
}


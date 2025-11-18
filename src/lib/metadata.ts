import { Metadata } from 'next';
import { DogPark } from '@/types/dog-park';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indoordogpark.org';

export function createMetaDescription(value: string, maxLength = 155): string {
  if (!value) return '';
  if (value.length <= maxLength) return value.trim();
  const truncated = value.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return `${truncated.slice(0, lastSpace > 0 ? lastSpace : truncated.length).trim()}…`;
}

export function generateParkMetadata(park: DogPark): Metadata {
  const canonicalPath = `/parks/${park.slug || park.id}`;
  const canonical = `${SITE_URL}${canonicalPath}`;
  const title = `${park.name} | ${park.businessType} in ${park.city}, CA`;
  const description = createMetaDescription(
    park.description ||
      `Discover ${park.name}, a ${park.businessType.toLowerCase()} located in ${park.city}, California.`
  );

  const representativeImage =
    park.photo || park.photos?.[0]?.url || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5';

  return {
    title,
    description,
    keywords: [
      park.name,
      park.city,
      'California dog parks',
      'indoor dog park',
      park.businessType,
      `${park.city} dog park`,
      'dog-friendly',
      'pet park',
    ],
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      locale: 'en_US',
      url: canonical,
      siteName: 'Indoor Dog Park',
      images: [
        {
          url: representativeImage,
          width: 1200,
          height: 630,
          alt: `${park.name} in ${park.city}, California`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [representativeImage],
    },
  };
}

export function generateParkSchema(park: DogPark) {
  const canonicalPath = `/parks/${park.slug || park.id}`;
  const canonical = `${SITE_URL}${canonicalPath}`;
  const imageUrl =
    park.photo || park.photos?.[0]?.url || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5';
  const priceRange = park.pricing?.isFree
    ? 'Free'
    : park.pricing?.priceRange || park.pricing?.pricingType || undefined;

  // Determine business type for schema
  const schemaType = park.businessType === 'Dog Park' 
    ? 'Park' 
    : park.businessType === 'Indoor Dog Park'
    ? 'SportsActivityLocation'
    : 'LocalBusiness';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const baseSchema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: park.name,
    description: park.description,
    image: imageUrl,
    url: canonical,
    '@id': canonical,
    telephone: park.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: park.street,
      addressLocality: park.city,
      addressRegion: park.state,
      postalCode: park.zipCode,
      addressCountry: 'US',
    },
  };

  // Add geo coordinates if available
  if (park.latitude && park.longitude) {
    baseSchema.geo = {
      '@type': 'GeoCoordinates',
      latitude: park.latitude,
      longitude: park.longitude,
    };
  }

  // Add opening hours if available
  if (park.openingHours) {
    baseSchema.openingHoursSpecification = Object.entries(park.openingHours).map(([day, hours]) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: day,
      opens: hours.split('-')[0]?.trim() || '00:00',
      closes: hours.split('-')[1]?.trim() || '23:59',
    }));
  }

  // Add rating if available
  if (park.rating && park.reviewCount) {
    baseSchema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: park.rating,
      reviewCount: park.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  // Add price range if available
  if (priceRange) {
    baseSchema.priceRange = priceRange;
  }

  // Add website if available
  if (park.website) {
    baseSchema.sameAs = [park.website];
  }

  return baseSchema;
}

export interface BreadcrumbItem {
  name: string;
  url?: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url && { item: `${SITE_URL}${item.url}` }),
    })),
  };
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateBlogPostSchema(post: {
  title: string;
  description: string;
  slug: string;
  date: string;
  modified?: string;
  author?: { name: string };
  image?: string;
}) {
  const canonical = `${SITE_URL}/blog/${post.slug}`;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.image || `${SITE_URL}/images/og-image.jpg`,
    datePublished: post.date,
    dateModified: post.modified || post.date,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Indoor Dog Park Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Indoor Dog Park',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logo/logo-512.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonical,
    },
  };
}

/**
 * Generates Review schemas with proper itemReviewed fields
 * This fixes the Google Search Console error about invalid itemReviewed object type
 */
export function generateReviewSchemas(
  reviews: Array<{
    id: string;
    rating: number;
    title?: string | null;
    content?: string | null;
    created_at: string;
  }>,
  park: DogPark
) {
  const canonicalPath = `/parks/${park.slug || park.id}`;
  const canonical = `${SITE_URL}${canonicalPath}`;

  // Determine business type for schema (must match the main park schema)
  const schemaType = park.businessType === 'Dog Park' 
    ? 'Park' 
    : park.businessType === 'Indoor Dog Park'
    ? 'SportsActivityLocation'
    : 'LocalBusiness';

  // Create the itemReviewed object (the business being reviewed)
  // This is required by Google for Review snippets to work
  // Best practice: Use @id to reference the main schema instead of duplicating all data
  const itemReviewed = {
    '@type': schemaType,
    '@id': canonical, // References the main park schema
    name: park.name,
    // Include minimal required fields for Google's validation
    address: {
      '@type': 'PostalAddress',
      streetAddress: park.street,
      addressLocality: park.city,
      addressRegion: park.state,
      postalCode: park.zipCode,
      addressCountry: 'US',
    },
  };

  // Generate Review schemas for each review
  // Only include reviews that have a rating and some text content
  return reviews
    .filter((review) => {
      const hasRating = review.rating && review.rating >= 1 && review.rating <= 5;
      const hasContent = review.content || review.title;
      return hasRating && hasContent;
    })
    .map((review) => {
      const reviewBody = review.content || review.title || '';
      
      return {
        '@context': 'https://schema.org',
        '@type': 'Review',
        '@id': `${canonical}#review-${review.id}`,
        itemReviewed,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating,
          bestRating: 5,
          worstRating: 1,
        },
        author: {
          '@type': 'Person',
          // Best practice: Use actual user names when available, fallback to 'Anonymous'
          // For privacy, consider using first name + last initial or username
          name: 'Anonymous', // TODO: Enhance with actual user data when available
        },
        reviewBody,
        ...(review.title && { name: review.title }),
        datePublished: review.created_at,
      };
    });
}

/**
 * Generates CollectionPage schema for the home page
 * This helps search engines understand the page contains a collection of items (dog parks)
 * 
 * Best practices followed:
 * - Uses JSON-LD format (recommended by Google)
 * - numberOfItems matches itemListElement length
 * - All URLs are absolute
 * - Includes @id for better entity linking
 */
export function generateCollectionPageSchema(parks: DogPark[]) {
  const canonical = SITE_URL;
  const displayedParks = parks.slice(0, 20); // Limit to first 20 for performance
  
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${canonical}#webpage`,
    name: 'Indoor Dog Parks Directory',
    description: 'Find year-round indoor dog parks across California. Search by city, neighborhood, or zip to discover safe, climate-controlled play spaces for your dog.',
    url: canonical,
    mainEntity: {
      '@type': 'ItemList',
      '@id': `${canonical}#itemlist`,
      numberOfItems: displayedParks.length, // Matches actual items in list
      itemListElement: displayedParks.map((park, index) => {
        const parkUrl = `${SITE_URL}/parks/${park.slug || park.id}`;
        return {
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': park.businessType === 'Dog Park' ? 'Park' : park.businessType === 'Indoor Dog Park' ? 'SportsActivityLocation' : 'LocalBusiness',
            '@id': parkUrl,
            name: park.name,
            url: parkUrl,
            address: {
              '@type': 'PostalAddress',
              addressLocality: park.city,
              addressRegion: park.state,
              addressCountry: 'US',
            },
            ...(park.rating && park.reviewCount && {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: park.rating,
                reviewCount: park.reviewCount,
              },
            }),
          },
        };
      }),
    },
  };
}

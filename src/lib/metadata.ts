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

/**
 * Creates an SEO-friendly title that's 60 characters or less
 * Truncates at word boundary when possible to avoid cutting words
 */
export function createSEOTitle(fullTitle: string, maxLength = 60): string {
  if (fullTitle.length <= maxLength) return fullTitle;
  
  // Try to truncate at a word boundary (space) near maxLength
  const truncated = fullTitle.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  // If we found a space after position 50, use it for cleaner truncation
  // This ensures we have room for "..." (3 chars) and stay <= 60 total
  if (lastSpace >= 50) {
    return truncated.substring(0, lastSpace) + '...';
  } else {
    // Otherwise, truncate at 57 and add ellipsis (total exactly 60)
    return truncated.substring(0, 57) + '...';
  }
}

/**
 * Generates unique SEO keywords for each park based on its characteristics
 * This creates more specific, searchable titles instead of generic "Complete Visitor Guide"
 * Returns unique features/amenities that differentiate this park from others
 */
function generateUniqueParkKeywords(park: DogPark): string {
  const keywords: string[] = [];
  
  // Add amenity-based keywords (prioritize unique features)
  if (park.amenities) {
    const amenityKeywords: string[] = [];
    
    // Priority 1: Unique activity features
    if (park.amenities.agilityCourse) amenityKeywords.push('Agility Course');
    if (park.amenities.swimming) amenityKeywords.push('Swimming Pool');
    if (park.amenities.training) amenityKeywords.push('Training Classes');
    if (park.amenities.grooming) amenityKeywords.push('Grooming Services');
    if (park.amenities.daycare) amenityKeywords.push('Daycare');
    
    // Priority 2: Size-specific areas
    if (park.amenities.smallDogArea && park.amenities.largeDogArea) {
      amenityKeywords.push('All Dog Sizes');
    } else if (park.amenities.smallDogArea) {
      amenityKeywords.push('Small Dogs');
    } else if (park.amenities.largeDogArea) {
      amenityKeywords.push('Large Dogs');
    }
    
    // Priority 3: Convenience features
    if (park.amenities.dogWashStation) amenityKeywords.push('Wash Station');
    if (park.amenities.parking) amenityKeywords.push('Parking Available');
    
    // Add top 2 most relevant amenity keywords
    if (amenityKeywords.length > 0) {
      keywords.push(...amenityKeywords.slice(0, 2));
    }
  }
  
  // Add pricing keywords
  if (park.pricing?.isFree) {
    keywords.push('Free Entry');
  } else if (park.pricing?.pricingType === 'membership') {
    keywords.push('Membership Available');
  }
  
  // Add rating-based keywords for highly-rated parks
  if (park.rating >= 4.5 && park.reviewCount >= 50) {
    keywords.push('Top Rated');
  } else if (park.rating >= 4.0 && park.reviewCount >= 20) {
    keywords.push('Highly Rated');
  }
  
  // Add 24/7 keyword if applicable
  if (park.hours24x7) {
    keywords.push('Open 24/7');
  }
  
  // Add indoor/outdoor distinction if relevant
  if (park.indoorOutdoor === 'indoor') {
    keywords.push('Climate Controlled');
  } else if (park.indoorOutdoor === 'both') {
    keywords.push('Indoor & Outdoor');
  }
  
  // If no unique keywords found, use business type as fallback
  if (keywords.length === 0) {
    if (park.businessType === 'Indoor Dog Park') {
      keywords.push('Year-Round Access');
    } else if (park.businessType === 'Dog-Friendly Establishment') {
      keywords.push('Pet Welcome');
    } else {
      keywords.push(park.businessType);
    }
  }
  
  // Join keywords and ensure it's not too long (max 35 chars for the keyword part)
  let keywordString = keywords.slice(0, 3).join(' • '); // Use bullet separator for readability
  if (keywordString.length > 35) {
    // Keep only the first 2 keywords if too long
    keywordString = keywords.slice(0, 2).join(' • ');
    if (keywordString.length > 35) {
      // If still too long, use just the first keyword
      keywordString = keywords[0] || park.businessType;
    }
  }
  
  return keywordString;
}

export function generateParkMetadata(park: DogPark): Metadata {
  const canonicalPath = `/parks/${park.slug || park.id}`;
  const canonical = `${SITE_URL}${canonicalPath}`;
  
  // Generate unique keywords for this park
  const uniqueKeywords = generateUniqueParkKeywords(park);
  const stateAbbr = park.state || 'CA';
  const stateName = park.state === 'NY' ? 'New York' : park.state === 'CA' ? 'California' : park.state || 'California';
  
  // Create full title with unique keywords instead of generic "Indoor Dog Park"
  // Format: "Park Name | Business Type in City, State | Unique Keywords"
  const fullTitleWithTemplate = `${park.name} | ${park.businessType} in ${park.city}, ${stateAbbr} | ${uniqueKeywords}`;
  const title = createSEOTitle(fullTitleWithTemplate, 60);
  
  const description = createMetaDescription(
    park.description ||
      `Discover ${park.name}, a ${park.businessType.toLowerCase()} located in ${park.city}, ${stateName}.`
  );

  const representativeImage =
    park.photo || park.photos?.[0]?.url || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5';

  // Determine published and modified dates
  // Use approvedAt or submittedAt for publishedTime, lastUpdated for modifiedTime
  // Ensure dates are in ISO 8601 format for proper SEO tool detection
  let publishedTime: string | undefined = undefined;
  let modifiedTime: string | undefined = undefined;

  if (park.approvedAt || park.submittedAt) {
    const dateStr = park.approvedAt || park.submittedAt;
    if (dateStr) {
      // Ensure it's a valid ISO 8601 date string
      try {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          publishedTime = date.toISOString();
        }
      } catch {
        // If date parsing fails, use the original string if it looks like ISO format
        if (dateStr.match(/^\d{4}-\d{2}-\d{2}/)) {
          publishedTime = dateStr;
        }
      }
    }
  }

  if (park.lastUpdated) {
    try {
      const date = new Date(park.lastUpdated);
      if (!isNaN(date.getTime())) {
        modifiedTime = date.toISOString();
      }
    } catch {
      if (park.lastUpdated.match(/^\d{4}-\d{2}-\d{2}/)) {
        modifiedTime = park.lastUpdated;
      }
    }
  } else if (publishedTime) {
    // Fallback to published time if no modified time
    modifiedTime = publishedTime;
  }

  return {
    title: {
      absolute: title, // Use absolute to bypass template and have full control
    },
    description,
    keywords: [
      park.name,
      park.city,
      park.state === 'NY' ? 'New York dog parks' : 'California dog parks',
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
      title, // Use truncated title for OpenGraph too
      description,
      type: 'article',
      locale: 'en_US',
      url: canonical,
      siteName: 'Indoor Dog Park',
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      images: [
        {
          url: representativeImage,
          width: 1200,
          height: 630,
          alt: `${park.name} in ${park.city}, ${stateName}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title, // Use truncated title for Twitter too
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
  // Use SportsActivityLocation for all dog parks - it's more semantically accurate
  // for recreational facilities and extends LocalBusiness, supporting aggregateRating
  // and all business properties. This follows industry best practices (Yelp, TripAdvisor)
  // and provides better SEO than generic LocalBusiness.
  const schemaType = 'SportsActivityLocation'; // All dog parks are recreational facilities

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
    baseSchema.openingHoursSpecification = Object.entries(park.openingHours)
      .filter(([, hours]) => hours && typeof hours === 'string') // Only process string values
      .map(([day, hours]) => {
        const hoursStr = String(hours);
        return {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: day,
          opens: hoursStr.split('-')[0]?.trim() || '00:00',
          closes: hoursStr.split('-')[1]?.trim() || '23:59',
        };
      });
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
  // Use SportsActivityLocation for all dog parks to maintain consistency
  // and support aggregateRating and all business properties
  const schemaType = 'SportsActivityLocation'; // All dog parks are recreational facilities

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
            '@type': 'SportsActivityLocation', // All dog parks are recreational facilities
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

import { DogPark } from '@/types/dog-park';

interface ParkDetailSchemaProps {
  park: DogPark;
  url: string;
}

/**
 * ParkDetailSchema component generates structured data (JSON-LD) for park detail pages
 * Uses schema.org LocalBusiness and Place types for SEO benefits
 */
export default function ParkDetailSchema({ park, url }: ParkDetailSchemaProps) {
  // Generate structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: park.name,
    description: park.description || `${park.businessType} in ${park.city}, ${park.state}`,
    url: url,
    telephone: park.phone || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: park.address,
      addressLocality: park.city,
      addressRegion: park.state,
      postalCode: park.zipCode || '',
      addressCountry: 'US',
    },
    ...(park.latitude && park.longitude && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: park.latitude,
        longitude: park.longitude,
      },
    }),
    category: park.businessType,
    ...(park.photo && {
      image: [
        park.photo,
        ...(park.photos?.map(p => p.url).filter(Boolean) || []),
      ].filter((url, index, arr) => arr.indexOf(url) === index), // Deduplicate
    }),
    aggregateRating: park.rating ? {
      '@type': 'AggregateRating',
      ratingValue: park.rating.toString(),
      reviewCount: park.reviewCount || park.userRatingsTotal || 0,
      bestRating: '5',
      worstRating: '1',
    } : undefined,
    priceRange: park.pricing ? getPriceRange(park.pricing) : undefined,
    openingHours: park.openingHours ? formatOpeningHours(park.openingHours) : undefined,
    ...(park.website && {
      sameAs: [park.website],
    }),
    // Additional properties for dog parks
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Business Type',
        value: park.businessType,
      },
      {
        '@type': 'PropertyValue',
        name: 'Features',
        value: park.amenities
          ? Object.entries(park.amenities)
              .filter(([, value]) => value === true)
              .map(([key]) => key.replace(/([A-Z])/g, ' $1').trim())
              .join(', ')
          : 'Standard amenities',
      },
      ...(park.sizeCategory ? [{
        '@type': 'PropertyValue',
        name: 'Size Category',
        value: park.sizeCategory,
      }] : []),
      ...(park.surfaceType ? [{
        '@type': 'PropertyValue',
        name: 'Surface Type',
        value: park.surfaceType,
      }] : []),
    ],
  };

  // Helper function to format price range
  function getPriceRange(pricing: {
    isFree?: boolean;
    priceRange?: string;
    dropInFee?: number;
    dailyRate?: number;
    hourlyRate?: number;
    monthlyRate?: number;
  }): string {
    if (pricing.isFree) return 'Free';
    if (pricing.priceRange) return pricing.priceRange;
    if (pricing.dropInFee) return `$${pricing.dropInFee}`;
    if (pricing.dailyRate) return `$${pricing.dailyRate}`;
    if (pricing.hourlyRate) return `$${pricing.hourlyRate}`;
    if (pricing.monthlyRate) return `$${pricing.monthlyRate}`;
    return '$$';
  }

  // Helper function to format opening hours for schema.org
  function formatOpeningHours(hours: Record<string, string>): string[] {
    const dayMap: { [key: string]: string } = {
      monday: 'Mo',
      tuesday: 'Tu',
      wednesday: 'We',
      thursday: 'Th',
      friday: 'Fr',
      saturday: 'Sa',
      sunday: 'Su',
    };

    const formattedHours: string[] = [];
    const dayGroups: { [key: string]: string[] } = {};

    // Group days by same hours
    Object.entries(hours).forEach(([day, time]) => {
      const dayAbbr = dayMap[day.toLowerCase()];
      if (dayAbbr && time && time !== 'Closed') {
        if (!dayGroups[time]) {
          dayGroups[time] = [];
        }
        dayGroups[time].push(dayAbbr);
      }
    });

    // Format grouped hours
    Object.entries(dayGroups).forEach(([time, days]) => {
      // Sort days in correct order (Mo-Su)
      const dayOrder = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
      const sortedDays = days.sort((a, b) =>
        dayOrder.indexOf(a) - dayOrder.indexOf(b)
      );

      // Group consecutive days
      const ranges: string[] = [];
      let currentRange = [sortedDays[0]];

      for (let i = 1; i < sortedDays.length; i++) {
        const currentDay = sortedDays[i];
        const lastDay = sortedDays[i - 1];
        const dayIndex = dayOrder.indexOf(currentDay);
        const lastIndex = dayOrder.indexOf(lastDay);

        if (dayIndex === lastIndex + 1) {
          currentRange.push(currentDay);
        } else {
          ranges.push(currentRange.join('-'));
          currentRange = [currentDay];
        }
      }
      ranges.push(currentRange.join('-'));

      ranges.forEach(range => {
        formattedHours.push(`${range} ${time}`);
      });
    });

    // Add closed days
    Object.entries(hours).forEach(([day, time]) => {
      const dayAbbr = dayMap[day.toLowerCase()];
      if (dayAbbr && (!time || time === 'Closed')) {
        formattedHours.push(`${dayAbbr} Closed`);
      }
    });

    return formattedHours;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  );
}
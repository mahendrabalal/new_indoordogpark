import { Metadata } from 'next';
import { DogPark } from '@/types/dog-park';

export function generateParkMetadata(park: DogPark): Metadata {
  const title = `${park.name} | ${park.businessType} in ${park.city}, CA`;
  const description = park.description.substring(0, 155) + '...';

  return {
    title,
    description,
    keywords: [
      park.name,
      park.city,
      'California',
      'dog park',
      park.businessType,
      `dog parks in ${park.city}`,
      `${park.city} dog park`,
      'dog-friendly',
      'pet park',
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_US',
      url: `https://dogplaces.com/parks/${park.slug || park.id}`,
      images: [
        {
          url: park.photo || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
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
      images: [park.photo || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5'],
    },
    alternates: {
      canonical: `https://dogplaces.com/parks/${park.slug || park.id}`,
    },
  };
}

export function generateParkSchema(park: DogPark) {
  return {
    '@context': 'https://schema.org',
    '@type': park.businessType === 'Dog Park' ? 'Park' : 'LocalBusiness',
    name: park.name,
    description: park.description,
    image: park.photo || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
    url: `https://dogplaces.com/parks/${park.slug || park.id}`,
    telephone: park.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: park.street,
      addressLocality: park.city,
      addressRegion: park.state,
      postalCode: park.zipCode,
      addressCountry: 'US',
    },
    geo: park.latitude && park.longitude ? {
      '@type': 'GeoCoordinates',
      latitude: park.latitude,
      longitude: park.longitude,
    } : undefined,
    openingHoursSpecification: park.openingHours ? Object.entries(park.openingHours).map(([day, hours]) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: day,
      opens: hours.split('-')[0]?.trim() || '00:00',
      closes: hours.split('-')[1]?.trim() || '23:59',
    })) : undefined,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: park.rating,
      reviewCount: park.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    priceRange: park.pricing?.isFree ? 'Free' : park.pricing?.priceRange || '$',
  };
}

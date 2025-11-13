import { Metadata } from 'next';
import { CityData } from './cityData';

export function generateCityMetadata(city: CityData): Metadata {
  const title = `Dog Parks in ${city.name}, ${city.state} | Directory & Reviews`;
  const description = `Explore ${city.parkCount} dog parks in ${city.name}, ${city.state}. Find the best dog-friendly parks, reviews, ratings, and amenities for your pet.`;

  return {
    title,
    description,
    keywords: [
      `${city.name} dog parks`,
      `dog parks in ${city.name}`,
      `${city.name} ${city.state} dog park`,
      `dog parks near ${city.name}`,
      'California dog parks',
      'dog park directory',
      'pet parks',
      'dog-friendly parks',
      city.name,
      city.state,
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_US',
      url: `https://dogplaces.com/cities/${city.slug}`,
      images: [
        {
          url: city.featuredImage || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          width: 1200,
          height: 630,
          alt: `Dog parks in ${city.name}, ${city.state}`,
        },
      ],
      siteName: 'California Dog Parks Directory',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [city.featuredImage || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'],
    },
    alternates: {
      canonical: `https://dogplaces.com/cities/${city.slug}`,
    },
  };
}

export function generateCitySchema(city: CityData, parkCount: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Dog Parks in ${city.name}, ${city.state}`,
    description: `Directory of ${parkCount} dog parks in ${city.name}, ${city.state}`,
    url: `https://dogplaces.com/cities/${city.slug}`,
    image: city.featuredImage || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
    inLanguage: 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      name: 'California Dog Parks Directory',
      url: 'https://dogplaces.com',
    },
    mainEntity: {
      '@type': 'City',
      name: city.name,
      addressRegion: city.state,
      addressCountry: 'US',
      geo: city.latitude && city.longitude ? {
        '@type': 'GeoCoordinates',
        latitude: city.latitude,
        longitude: city.longitude,
      } : undefined,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: city.avgRating,
      reviewCount: city.totalReviews,
      bestRating: 5,
      worstRating: 1,
    },
  };
}

export function generateCityBreadcrumbSchema(city: CityData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://dogplaces.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Cities',
        item: 'https://dogplaces.com/cities',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${city.name}, ${city.state}`,
        item: `https://dogplaces.com/cities/${city.slug}`,
      },
    ],
  };
}

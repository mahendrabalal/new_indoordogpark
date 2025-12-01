import { Suspense } from 'react';
import type { Metadata } from 'next';
import HomePageClient from '../HomePageClient';
import { getAllStaticParks } from '@/lib/parks-data';
import { generateCollectionPageSchema } from '@/lib/metadata';
import { DogPark } from '@/types/dog-park';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indoordogpark.org';
const siteName = 'Indoor Dog Park';
const ogImageUrl = `${siteUrl.replace(/\/$/, '')}/images/hero/hero.webp`;

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Dog Training Facilities | Indoor Training Centers Near Me';
  const description =
    'Find indoor dog training facilities and agility centers. Discover professional training spaces with climate-controlled environments for year-round training.';
  const canonicalUrl = '/training-facilities';

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: 'dog training facilities, indoor dog training, agility centers, dog training classes, professional dog training',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      url: `${siteUrl}${canonicalUrl}`,
      title,
      description,
      siteName,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: 'Dog Training Facilities - Indoor Training Centers',
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
      site: '@indoordogpark',
      creator: '@indoordogpark',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// Filter parks that offer training services
function filterTrainingFacilities(parks: DogPark[]): DogPark[] {
  const trainingKeywords = ['training', 'agility', 'obedience', 'class', 'instructor', 'trainer'];
  
  return parks.filter(park => {
    // Check if park has training amenity
    const hasTrainingAmenity = park.amenities?.training === true;
    
    // Check if business type is training-related
    const isTrainingBusinessType = park.businessType === 'Agility & Training Parks';
    
    // Check name, description for training keywords
    const nameLower = park.name.toLowerCase();
    const descriptionLower = (park.description || '').toLowerCase();
    const businessTypeLower = (park.businessType || '').toLowerCase();
    
    const hasTrainingKeyword = trainingKeywords.some(keyword => 
      nameLower.includes(keyword) || 
      descriptionLower.includes(keyword) ||
      businessTypeLower.includes(keyword)
    );
    
    return hasTrainingAmenity || isTrainingBusinessType || hasTrainingKeyword;
  });
}

export const revalidate = 60 * 60; // Refresh hourly

export default async function TrainingFacilitiesPage() {
  // Get all parks and filter for training facilities
  const allParks = await getAllStaticParks();
  const filteredParks = filterTrainingFacilities(allParks);
  
  // Take first 20 for initial display
  const initialParks = filteredParks.slice(0, 20);
  const collectionPageSchema = generateCollectionPageSchema(initialParks);

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <Suspense fallback={
        <div className="loading">
          <i className="bi bi-hourglass-split"></i> Loading dog parks...
        </div>
      }>
        <HomePageClient
          initialParks={initialParks}
          initialPagination={{
            page: 1,
            limit: 20,
            totalParks: filteredParks.length,
            totalPages: Math.ceil(filteredParks.length / 20),
            hasMore: filteredParks.length > 20,
          }}
          initialShowSearchLayout={true}
        />
      </Suspense>
    </>
  );
}

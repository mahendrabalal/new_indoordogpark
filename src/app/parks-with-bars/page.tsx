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
  const title = 'Indoor Dog Parks with Bars | Dog-Friendly Bars & Play Spaces';
  const description =
    'Discover indoor dog parks with bars and restaurants. Find climate-controlled play spaces where you can enjoy drinks while your dog plays. Search by city or location.';
  const canonicalUrl = '/parks-with-bars';

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: 'indoor dog parks with bars, dog-friendly bars, dog parks with restaurants, indoor dog play spaces with food',
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
          alt: 'Indoor Dog Parks with Bars - Dog-Friendly Bars & Play Spaces',
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

// Filter parks that have bars, restaurants, or food service
function filterParksWithBars(parks: DogPark[]): DogPark[] {
  const barKeywords = ['bar', 'restaurant', 'cafe', 'food', 'dining', 'pub', 'brewery', 'bistro', 'grill'];
  
  return parks.filter(park => {
    const nameLower = park.name.toLowerCase();
    const descriptionLower = (park.description || '').toLowerCase();
    const businessTypeLower = (park.businessType || '').toLowerCase();
    
    // Check if name, description, or business type contains bar-related keywords
    const hasBarKeyword = barKeywords.some(keyword => 
      nameLower.includes(keyword) || 
      descriptionLower.includes(keyword) ||
      businessTypeLower.includes(keyword)
    );
    
    return hasBarKeyword;
  });
}

export const revalidate = 60 * 60; // Refresh hourly

export default async function ParksWithBarsPage() {
  // Get all parks and filter for those with bars
  const allParks = await getAllStaticParks();
  const filteredParks = filterParksWithBars(allParks);
  
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

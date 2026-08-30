import { Suspense } from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import HomePageClient from './HomePageClient';
import { getPaginatedStaticParks } from '@/lib/parks-data';
import { generateCollectionPageSchema } from '@/lib/metadata';
import { normalizeTypeParameter } from '@/lib/type-normalizer';

type HomePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indoordogpark.org';
const siteName = 'Indoor Dog Park';
const ogImageUrl = `${siteUrl.replace(/\/$/, '')}/images/hero/hero.webp`;

// Helper to get parameter value from searchParams
function getParamValue(
  value: string | string[] | undefined
): string {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }
  return value ?? '';
}

// Generate metadata for homepage
export async function generateMetadata({
  searchParams,
}: HomePageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const title = 'Find Indoor Dog Parks Near Me | Verified Parks & Dog Bars | IndoorDogPark.org';
  const description =
    'Find the best indoor dog parks near you in 2026. Search 500+ verified climate-controlled indoor dog parks, dog bars, agility arenas & swimming pools with real reviews and hours.';

  const isFiltered = hasActiveSearchParams(resolvedSearchParams);

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: '/',
    },
    // Best practice: don't index infinite combinations of filter/search URLs
    // Keep them crawlable so bots can discover park/city pages.
    robots: {
      index: !isFiltered,
      follow: true,
      googleBot: {
        index: !isFiltered,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      url: siteUrl,
      title,
      description,
      siteName,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: 'Indoor Dog Park - Find Indoor Dog Parks & Play Areas',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
      site: '@indoordogpark',
      creator: '@indoordogpark',
    },
  };
}

function hasActiveSearchParams(
  searchParams: Record<string, string | string[] | undefined> = {}
) {
  // If there are any keys in searchParams at all, consider it filtered
  // This safely catches all filters like amenities, radius, q, type, minRating, etc.
  // without needing to maintain an exhaustive list.
  return Object.keys(searchParams).length > 0;
}

export const revalidate = 86400; // Refresh server-rendered home data every 24 hours

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = (await searchParams) || {};
  // Redirect if default or unnecessary parameters are present
  const sortByParam = getParamValue(resolvedSearchParams.sortBy);
  if (sortByParam === 'relevance') {
    const newSearchParams = new URLSearchParams();

    // Copy all other parameters
    Object.entries(resolvedSearchParams).forEach(([key, value]) => {
      if (key !== 'sortBy' && value) {
        newSearchParams.set(key, getParamValue(value));
      }
    });

    const redirectUrl = newSearchParams.toString()
      ? `/?${newSearchParams.toString()}`
      : '/';

    redirect(redirectUrl);
  }

  // Existing validation for type parameter
  const typeParam = getParamValue(resolvedSearchParams.type);
  if (typeParam && typeParam !== 'all') {
    const normalizedType = normalizeTypeParameter(typeParam);

    // If type is invalid, redirect to homepage without the invalid type parameter
    // This prevents soft 404s from invalid type values
    if (!normalizedType) {
      const newSearchParams = new URLSearchParams();

      // Preserve other valid search parameters
      const query = getParamValue(resolvedSearchParams.q);
      if (query) newSearchParams.set('q', query);

      const minRating = getParamValue(resolvedSearchParams.minRating);
      if (minRating) newSearchParams.set('minRating', minRating);

      const priceRange = getParamValue(resolvedSearchParams.priceRange);
      if (priceRange) newSearchParams.set('priceRange', priceRange);

      const city = getParamValue(resolvedSearchParams.city);
      if (city) newSearchParams.set('city', city);

      const listingType = getParamValue(resolvedSearchParams.listingType);
      if (listingType && (listingType === 'featured' || listingType === 'free')) {
        newSearchParams.set('listingType', listingType);
      }

      const redirectUrl = newSearchParams.toString()
        ? `/?${newSearchParams.toString()}`
        : '/';

      redirect(redirectUrl);
    }

    // If type was normalized, redirect to the normalized version
    if (normalizedType !== typeParam) {
      const newSearchParams = new URLSearchParams();
      newSearchParams.set('type', normalizedType);

      // Preserve other search parameters
      const query = getParamValue(resolvedSearchParams.q);
      if (query) newSearchParams.set('q', query);

      const minRating = getParamValue(resolvedSearchParams.minRating);
      if (minRating) newSearchParams.set('minRating', minRating);

      const priceRange = getParamValue(resolvedSearchParams.priceRange);
      if (priceRange) newSearchParams.set('priceRange', priceRange);

      const city = getParamValue(resolvedSearchParams.city);
      if (city) newSearchParams.set('city', city);

      const listingType = getParamValue(resolvedSearchParams.listingType);
      if (listingType && (listingType === 'featured' || listingType === 'free')) {
        newSearchParams.set('listingType', listingType);
      }

      redirect(`/?${newSearchParams.toString()}`);
    }
  }

  const initialShowSearchLayout = hasActiveSearchParams(resolvedSearchParams);
  const initialData = await getPaginatedStaticParks(1, 20);
  const collectionPageSchema = generateCollectionPageSchema(initialData.data);

  const homepageFAQSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do I find indoor dog parks near me?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Use our interactive Indoor Dog Park directory above to browse verified indoor play facilities, dog swimming pools, dog bars, and agility courses by city or state across the US. Filter by amenities, pricing, and dog sizes.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is an indoor dog park?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'An indoor dog park is a climate-controlled, fully enclosed recreational facility with pet-safe synthetic turf (like K9Grass) or padded rubber flooring where dogs can exercise and socialize off-leash in any weather, including rain, snow, and extreme summer heat.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does an indoor dog park cost?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Most indoor dog parks offer single-visit day passes between $10 and $25 per dog, with monthly memberships typically ranging from $35 to $95. Many facilities offer multi-dog discounts or punch passes.',
        },
      },
      {
        '@type': 'Question',
        name: 'What are the rules and vaccination requirements for indoor dog parks?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'To protect all dogs, reputable indoor facilities require proof of up-to-date vaccinations (Rabies, DHPP/DA2PP, and Bordetella). Most locations also require dogs over 6 to 12 months old to be spayed or neutered and pass a quick temperament test.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are there separate areas for small dogs at indoor dog parks?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! The majority of verified indoor dog parks provide separate, dedicated play arenas for small or shy dogs (typically under 25–30 lbs) to ensure safe and comfortable play away from large, high-energy breeds.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageFAQSchema) }}
      />
      <Suspense fallback={
        <div className="loading">
          <i className="bi bi-hourglass-split"></i> Loading dog parks...
        </div>
      }>
        <HomePageClient
          initialParks={initialData.data}
          initialShowSearchLayout={initialShowSearchLayout}
        />
      </Suspense>
    </>
  );
}
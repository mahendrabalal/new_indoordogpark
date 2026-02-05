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
  const title = 'Indoor Parks for Dogs Near Me | Find Indoor Dog Parks';
  const description =
    'Find indoor parks for dogs near you. Search 500+ climate-controlled indoor dog parks across the US. Bars, training facilities & more. Search by city or zip code.';

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
  const query = getParamValue(searchParams.q).trim();
  if (query) {
    return true;
  }

  const type = getParamValue(searchParams.type).trim();
  if (type && type !== 'all') {
    return true;
  }

  if (getParamValue(searchParams.minRating).trim()) return true;
  if (getParamValue(searchParams.priceRange).trim()) return true;
  if (getParamValue(searchParams.city).trim()) return true;
  if (getParamValue(searchParams.sortBy).trim()) return true;
  if (getParamValue(searchParams.listingType).trim()) return true;

  return false;
}

export const revalidate = 3600; // Refresh server-rendered home data hourly

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
          initialParks={initialData.data}
          initialShowSearchLayout={initialShowSearchLayout}
        />
      </Suspense>
    </>
  );
}
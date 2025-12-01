import { Suspense } from 'react';
import type { Metadata } from 'next';
import HomePageClient from './HomePageClient';
import { getPaginatedStaticParks } from '@/lib/parks-data';
import { generateCollectionPageSchema } from '@/lib/metadata';

type HomePageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
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
export async function generateMetadata(): Promise<Metadata> {
  const title = 'Find Indoor Dog Parks Near Me | Indoor Dog Park';
  const description =
    'Search 500+ indoor dog parks across the US. Find climate-controlled play spaces, parks with bars, and training facilities. Search by city or zip code.';

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: '/',
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

  return false;
}

export const revalidate = 60 * 60; // Refresh server-rendered home data hourly

export default async function HomePage({ searchParams = {} }: HomePageProps) {
  const initialShowSearchLayout = hasActiveSearchParams(searchParams);
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
          initialPagination={initialData.pagination}
          initialShowSearchLayout={initialShowSearchLayout}
        />
      </Suspense>
    </>
  );
}
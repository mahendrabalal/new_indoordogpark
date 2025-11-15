import { Suspense } from 'react';
import type { Metadata } from 'next';
import HomePageClient from './HomePageClient';
import { getPaginatedStaticParks } from '@/lib/parks-data';

type HomePageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indoordogpark.org';
const siteName = 'Indoor Dog Park';
const heroTitle = 'Best Indoor Dog Parks in California | Indoor Dog Park';
const heroDescription =
  'Find year-round indoor dog parks across California. Search by city, neighborhood, or zip to discover safe, climate-controlled play spaces for your dog.';
const publishedTime = '2024-01-15T00:00:00.000Z';
const modifiedTime = '2025-11-15T00:00:00.000Z';
const ogImageUrl = `${siteUrl.replace(/\/$/, '')}/images/hero/hero.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: heroTitle,
  description: heroDescription,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: 'article',
    url: siteUrl,
    title: heroTitle,
    description: heroDescription,
    siteName,
    publishedTime,
    modifiedTime,
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
    title: heroTitle,
    description: heroDescription,
    images: [ogImageUrl],
    site: '@indoordogpark',
    creator: '@indoordogpark',
  },
};

function hasActiveSearchParams(
  searchParams: Record<string, string | string[] | undefined> = {}
) {
  const getParamValue = (value: string | string[] | undefined) => {
    if (Array.isArray(value)) {
      return value[0] ?? '';
    }
    return value ?? '';
  };

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

  return (
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
  );
}
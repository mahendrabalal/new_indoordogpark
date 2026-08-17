import { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllStaticParks } from '@/lib/parks-data';
import { SITE_URL } from '@/lib/metadata';
import ParksDirectoryClient from './ParksDirectoryClient';

export const revalidate = 86400; // 24 hours

const siteUrl = SITE_URL || 'https://www.indoordogpark.org';

export const metadata: Metadata = {
  title: 'Browse All Dog Parks | Indoor Dog Park Directory',
  description:
    'Browse 500+ indoor dog parks, off-leash areas, and dog-friendly venues across the US. Filter by state, city, type, rating, and price. Find the perfect park for your pup.',
  keywords: [
    'dog parks near me',
    'indoor dog parks',
    'dog park directory',
    'off leash dog parks',
    'dog friendly places',
    'find dog parks',
    'dog park map',
  ],
  alternates: {
    canonical: '/parks',
  },
  openGraph: {
    title: 'Browse All Dog Parks | Indoor Dog Park Directory',
    description:
      'Browse 500+ indoor dog parks, off-leash areas, and dog-friendly venues across the US.',
    url: `${siteUrl}/parks`,
    type: 'website',
    images: ['/images/hero/hero.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function ParksPage() {
  const allParks = await getAllStaticParks();

  // Pre-compute aggregate stats for the hero
  const totalParks = allParks.length;
  const uniqueStates = new Set(allParks.map((p) => p.state)).size;
  const uniqueCities = new Set(allParks.map((p) => p.city)).size;
  const avgRating =
    allParks.length > 0
      ? (allParks.reduce((sum, p) => sum + (p.rating || 0), 0) / allParks.length).toFixed(1)
      : '0';

  const stats = { totalParks, uniqueStates, uniqueCities, avgRating };

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto" />
            <p className="mt-4 text-slate-500">Loading parks directory…</p>
          </div>
        </div>
      }
    >
      <ParksDirectoryClient initialParks={allParks} stats={stats} />
    </Suspense>
  );
}

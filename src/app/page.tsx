import { Suspense } from 'react';
import HomePageClient from './HomePageClient';
import { getPaginatedStaticParks } from '@/lib/parks-data';

export const revalidate = 60 * 60; // Refresh server-rendered home data hourly

export default async function HomePage() {
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
      />
    </Suspense>
  );
}
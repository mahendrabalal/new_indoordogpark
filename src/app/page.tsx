import { Suspense } from 'react';
import HomePageClient from './HomePageClient';

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="loading">
          <i className="bi bi-hourglass-split" aria-hidden="true"></i> Loading dog parks...
        </div>
      }
    >
      <HomePageClient />
    </Suspense>
  );
}
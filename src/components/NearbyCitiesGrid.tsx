'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface NearbyCity {
  slug: string;
  name: string;
  state: string;
  featuredImage?: string;
  parkCount: number;
  avgRating: number;
}

interface NearbyCitiesGridProps {
  cities: NearbyCity[];
}

export default function NearbyCitiesGrid({ cities }: NearbyCitiesGridProps) {
  const [showAll, setShowAll] = useState(false);

  // Show only first 3 cities initially (1 row)
  const initialCount = 3;
  const displayCities = showAll ? cities : cities.slice(0, initialCount);
  const hasMore = cities.length > initialCount;
  const remainingCount = cities.length - initialCount;

  return (
    <>
      <div className="nearby-cities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        {displayCities.map((nearby) => (
          <Link key={nearby.slug} href={`/cities/${nearby.slug}`} className="nearby-city-card" style={{ display: 'block', textDecoration: 'none', borderRadius: '12px', overflow: 'hidden', background: 'white', border: '1px solid #e2e8f0', transition: 'transform 0.2s' }}>
            <div className="nearby-city-image" style={{ position: 'relative', height: '180px', backgroundColor: '#f1f5f9' }}>
              {nearby.featuredImage ? (
                <Image
                  src={nearby.featuredImage}
                  alt={`Dog parks in ${nearby.name}, ${nearby.state}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  style={{ objectFit: 'cover' }}
                  unoptimized={nearby.featuredImage.startsWith('/images/')}
                />
              ) : (
                <div className="city-card-placeholder" style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                  color: '#cbd5e1'
                }}>
                  <i className="bi bi-geo-alt-fill" style={{ fontSize: '3rem', opacity: 0.8 }} />
                </div>
              )}
            </div>
            <div className="nearby-city-content" style={{ padding: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#0f172a' }}>{nearby.name}</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>{nearby.parkCount} parks · {nearby.avgRating.toFixed(1)} avg rating</p>
            </div>
          </Link>
        ))}
      </div>

      {hasMore && !showAll && (
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button
            onClick={() => setShowAll(true)}
            className="hero-cta primary"
          >
            <i className="bi bi-chevron-down" />
            Show More ({remainingCount} more)
          </button>
        </div>
      )}
    </>
  );
}


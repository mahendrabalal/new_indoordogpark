'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { ParkSubmission } from '@/types/park-submission';
import { getParkUrl } from '@/lib/routing';

interface CityPremiumSpotlightProps {
  city: string;
  state?: string;
}

const highlightCards = [
  {
    icon: 'bi-megaphone',
    title: 'Pinned above free listings',
    copy: 'Premium partners appear before every other card within the city directory.',
  },
  {
    icon: 'bi-envelope-paper',
    title: 'Lead-friendly CTAs',
    copy: 'Direct website + phone buttons encourage bookings straight from this page.',
  },
  {
    icon: 'bi-clock-history',
    title: 'Always-on exposure',
    copy: 'Featured cards show even when we haven’t processed new static data yet.',
  },
];

export default function CityPremiumSpotlight({ city, state }: CityPremiumSpotlightProps) {
  const [premiumParks, setPremiumParks] = useState<ParkSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadPremiumParks = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/parks/featured', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Failed to load premium data');
        }
        const data = await response.json();
        if (!isMounted) return;

        const normalizedCity = city.toLowerCase();
        const normalizedState = state?.toLowerCase();

        const filtered: ParkSubmission[] = (data.parks || []).filter((park: ParkSubmission) => {
          const matchesCity =
            park.city?.toLowerCase() === normalizedCity ||
            park.city?.toLowerCase().includes(normalizedCity);
          if (!matchesCity) return false;

          if (!normalizedState || !park.state) return true;
          return park.state.toLowerCase() === normalizedState;
        });

        setPremiumParks(filtered);
        setError(null);
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError('Premium placements are loading slowly. Try refreshing in a moment.');
          setPremiumParks([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPremiumParks();

    return () => {
      isMounted = false;
    };
  }, [city, state]);

  const renderSkeleton = () => (
    <div className="city-premium-grid">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={`premium-skeleton-${index}`} className="city-premium-card animate-pulse">
          <div className="city-premium-media bg-slate-200" />
          <div className="h-4 w-1/2 rounded bg-slate-200" />
          <div className="mt-2 h-3 w-3/4 rounded bg-slate-200" />
          <div className="mt-4 h-16 rounded bg-slate-100" />
        </div>
      ))}
    </div>
  );

  const renderCards = () => (
    <div
      className={
        premiumParks.length === 1
          ? 'city-premium-grid city-premium-grid-single'
          : 'city-premium-grid'
      }
    >
      {premiumParks.map((park) => (
        <article key={park.id} className="city-premium-card relative group transition-all hover:-translate-y-1 hover:shadow-xl">
          {park.slug && (
            <Link href={getParkUrl(park)} className="absolute inset-0 z-10">
              <span className="sr-only">View {park.name} details</span>
            </Link>
          )}
          <div className="city-premium-media">
            {park.photos && park.photos.length > 0 ? (
              <Image
                src={
                  park.photos[0].url ||
                  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80'
                }
                alt={`${park.name} - ${park.businessType} in ${park.city}, ${park.state} | Premium Featured Listing`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                // Industry best practice: Always unoptimize to avoid 402 errors from Next.js Image Optimization API
                unoptimized={true}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-blue-200" />
            )}
            <span className="city-premium-pill">
              <i className="bi bi-star-fill" /> Premium
            </span>
          </div>

          <div className="city-premium-copy">
            <p className="city-premium-eyebrow">{park.businessType}</p>
            <h3>{park.name}</h3>
            <p className="city-premium-location">
              <i className="bi bi-geo-alt" /> {park.city}, {park.state}
            </p>
            <p className="city-premium-description">
              {park.description ? `${park.description.slice(0, 180)}${park.description.length > 180 ? '…' : ''}` : 'Premium listing with concierge support.'}
            </p>
          </div>

          <div className="city-premium-card-actions relative z-20">
            {park.slug && (
              <Link href={getParkUrl(park)} className="city-premium-primary">
                View profile
                <i className="bi bi-arrow-right" />
              </Link>
            )}
            <div className="city-premium-meta">
              {park.phone && (
                <span>
                  <i className="bi bi-telephone" /> {park.phone}
                </span>
              )}
              {park.website && (
                <a href={park.website} target="_blank" rel="noreferrer">
                  <i className="bi bi-box-arrow-up-right" /> Website
                </a>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );

  return (
    <section className="city-premium-section" aria-labelledby="city-premium-heading">
      <div className="section-shell">
        <div className="city-premium-header">
          <div>
            <span className="section-eyebrow">Premium spotlight</span>
            <h2 id="city-premium-heading">Premium parks in {city}</h2>
            <p>Partners highlighted here are currently investing in featured placement across this guide.</p>
          </div>
          <div className="city-premium-header-actions">
            <Link href="/list-your-park" className="hero-cta primary">
              Feature my park
            </Link>
            <Link href="/contact" className="hero-cta ghost">
              Talk to sales
            </Link>
          </div>
        </div>

        <div className="city-premium-values">
          {highlightCards.map((card) => (
            <div key={card.title} className="city-premium-value-card">
              <div className="city-premium-value-icon">
                <i className={`bi ${card.icon}`} />
              </div>
              <h4>{card.title}</h4>
              <p>{card.copy}</p>
            </div>
          ))}
        </div>

        {isLoading && renderSkeleton()}

        {!isLoading && premiumParks.length > 0 && renderCards()}

        {!isLoading && premiumParks.length === 0 && (
          <div className="city-premium-empty">
            <div>
              <i className="bi bi-buildings" />
              <h3>No premium partners in {city} yet</h3>
              <p>
                Claim this placement for $9.99/mo and jump ahead of every free listing in the {city} directory.
              </p>
            </div>
            <Link href="/list-your-park" className="hero-cta primary">
              Claim this slot
            </Link>
          </div>
        )}

        {error && (
          <p className="city-premium-error" role="status">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}


'use client';

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { ParkSubmission } from '@/types/park-submission';

const valueProps = [
  {
    icon: 'bi-broadcast-pin',
    title: 'Homepage spotlight',
    copy: 'Pinned in the statewide hero rail, reaching pet parents researching their next outing.',
  },
  {
    icon: 'bi-geo-alt',
    title: 'City guide priority',
    copy: 'Premium cards sit above the free directory on every relevant city page for guaranteed visibility.',
  },
  {
    icon: 'bi-lightning-charge',
    title: 'Direct booking CTAs',
    copy: 'Custom contact buttons, phone links, and website prompts designed to drive inquiries faster.',
  },
  {
    icon: 'bi-graph-up',
    title: 'Monthly performance email',
    copy: 'Simple analytics snapshot so you can share impact with partners and justify the spend.',
  },
];

function truncateCopy(text?: string, limit = 220) {
  if (!text) return '';
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).trim()}…`;
}

export default function FeaturedParks() {
  const [featuredParks, setFeaturedParks] = useState<ParkSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedParks = async () => {
      try {
        const response = await fetch('/api/parks/featured', { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          setFeaturedParks(data.parks || []);
        }
      } catch (error) {
        console.error('Failed to fetch featured parks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedParks();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-4 max-w-3xl mx-auto">
            <div className="h-8 rounded-full bg-slate-200" />
            <div className="h-4 rounded-full bg-slate-200 w-3/4" />
          </div>
        </div>
      </section>
    );
  }

  if (!featuredParks || featuredParks.length === 0) {
    return null;
  }

  const spotlightPark = featuredParks[0];

  return (
    <section className="py-20 bg-gradient-to-b from-white via-slate-50 to-white" aria-labelledby="premium-featured-heading">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-purple-500">Premium partner network</p>
            <h2 id="premium-featured-heading" className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Featured indoor dog parks investing in elevated placement
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              These partners invest $9.99/mo for concierge visibility across the directory. They appear on every
              relevant page, get upgraded photo treatments, and receive quarterly performance updates.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/list-your-park"
              className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-300/40 transition hover:bg-purple-700"
            >
              <i className="bi bi-stars" /> List your park for $9.99/mo
            </Link>
            <Link
              href="/list-your-park"
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
            >
              See how placements work
              <i className="bi bi-arrow-up-right" />
            </Link>
          </div>
        </div>

        {spotlightPark && (
          <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <article className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl">
              <div className="absolute inset-0">
                {spotlightPark.photos && spotlightPark.photos.length > 0 ? (
                  <Image
                    src={
                      spotlightPark.photos[0].url ||
                      'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=1200&q=80'
                    }
                    alt={`${spotlightPark.name} - ${spotlightPark.businessType} in ${spotlightPark.city}, ${spotlightPark.state} | Featured Premium Listing`}
                    fill
                    className="object-cover opacity-60"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-slate-900 to-slate-800 opacity-70" />
                )}
              </div>
              <div className="relative z-10 flex h-full flex-col justify-end gap-4 p-8 md:p-10">
                <span className="inline-flex items-center gap-2 self-start rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em]">
                  <i className="bi bi-lightning-charge-fill text-amber-300" /> Spotlight
                </span>
                <div>
                  <h3 className="text-3xl font-bold">{spotlightPark.name}</h3>
                  <p className="mt-2 text-slate-100">{spotlightPark.city}, {spotlightPark.state}</p>
                  <p className="mt-4 text-base text-slate-200 max-w-2xl">
                    {truncateCopy(spotlightPark.description, 260)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-slate-100">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
                    <i className="bi bi-door-open" /> {spotlightPark.businessType}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
                    <i className="bi bi-calendar-check" /> Priority bookings
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
                    <i className="bi bi-graph-up-arrow" /> Featured analytics
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {spotlightPark.slug && (
                    <Link
                      href={`/parks/${spotlightPark.slug}`}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                    >
                      View park profile
                      <i className="bi bi-arrow-right" />
                    </Link>
                  )}
                  {spotlightPark.website && (
                    <a
                      href={spotlightPark.website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-sm font-semibold text-white hover:border-white"
                    >
                      Visit website
                      <i className="bi bi-box-arrow-up-right" />
                    </a>
                  )}
                </div>
              </div>
            </article>

            <div className="grid gap-4 sm:grid-cols-2">
              {valueProps.map((prop) => (
                <div key={prop.title} className="rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-sm backdrop-blur">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 text-purple-500">
                    <i className={`bi ${prop.icon}`} />
                  </div>
                  <h4 className="text-base font-semibold text-slate-900">{prop.title}</h4>
                  <p className="mt-2 text-sm text-slate-600">{prop.copy}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredParks.map((park) => (
            <Link
              key={park.id}
              href={park.slug ? `/parks/${park.slug}` : '#'}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-52 overflow-hidden">
                {park.photos && park.photos.length > 0 ? (
                  <Image
                    src={
                      park.photos[0].url ||
                      'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={`${park.name} - ${park.businessType} in ${park.city}, ${park.state} | Featured Indoor Dog Park`}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-blue-200" />
                )}
                <div className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-amber-500 shadow">
                  <i className="bi bi-star-fill" /> PREMIUM
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-3 p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-purple-500">{park.businessType}</p>
                  <h3 className="mt-2 text-xl font-bold text-slate-900 group-hover:text-purple-600">{park.name}</h3>
                  <p className="text-sm text-slate-500">{park.city}, {park.state}</p>
                </div>
                <p className="text-sm text-slate-600 line-clamp-3">{truncateCopy(park.description, 160)}</p>

                {park.amenities && (
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(park.amenities)
                      .filter(([, value]) => value === true)
                      .slice(0, 3)
                      .map(([key]) => (
                        <span key={key} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      ))}
                  </div>
                )}

                <div className="mt-auto border-t border-slate-100 pt-4 text-sm text-slate-500">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1 text-emerald-600">
                      <i className="bi bi-badge-ad" /> Priority placement active
                    </span>
                    {park.phone && (
                      <span className="inline-flex items-center gap-1">
                        <i className="bi bi-telephone" /> {park.phone}
                      </span>
                    )}
                  </div>
                  <span className="mt-2 inline-flex items-center text-purple-600">
                    View premium profile
                    <i className="bi bi-arrow-right ml-2 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-purple-200 bg-white/70 p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-purple-500">Need more reach?</p>
          <p className="text-lg text-slate-600">
            Upgrade your park to premium to unlock homepage placement, city spotlights, and quarterly performance notes.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/list-your-park"
              className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-purple-700"
            >
              Claim a premium slot
              <i className="bi bi-arrow-right" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
            >
              Chat with our team
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

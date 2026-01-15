'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import FavoriteButton from '@/components/FavoriteButton';
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
      <section className="py-20 bg-slate-50" style={{ minHeight: '600px' }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between animate-pulse">
            <div className="max-w-3xl space-y-4">
              <div className="h-4 w-32 rounded-full bg-slate-200" />
              <div className="h-10 w-full rounded-lg bg-slate-200" />
              <div className="h-6 w-2/3 rounded-lg bg-slate-200" />
            </div>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="h-80 rounded-3xl bg-slate-200" />
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 rounded-2xl bg-slate-100" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!featuredParks || featuredParks.length === 0) {
    return null;
  }

  const spotlightPark = featuredParks[0];
  const otherFeatured = featuredParks.slice(1, 4);

  return (
    <section className="py-20 bg-white" aria-labelledby="premium-featured-heading">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between mb-16">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-purple-600">Premium partner network</p>
            <h2 id="premium-featured-heading" className="mt-3 text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
              The term &quot;Indoor Dog Park&quot; can refer to two different types of businesses:
            </h2>
            <p className="mt-4 text-base md:text-lg lg:text-xl text-slate-600 leading-relaxed">
              These partners invest $9.99/mo for concierge visibility across the directory. They appear on every
              relevant page, get upgraded photo treatments, and receive quarterly performance updates.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/list-your-park"
              className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-purple-200 transition hover:bg-purple-700 hover:-translate-y-1"
            >
              <i className="bi bi-lightning-charge-fill" /> List your park for $9.99/mo
            </Link>
            <Link
              href="/list-your-park"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              See how placements work <i className="bi bi-arrow-up-right" />
            </Link>
          </div>
        </div>

        {spotlightPark && (
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <article className="relative overflow-hidden rounded-[2rem] bg-slate-900 text-white shadow-2xl border border-slate-800 group">
              {spotlightPark.photos && spotlightPark.photos.length > 0 ? (
                <Image
                  src={spotlightPark.photos[0].url}
                  alt={`${spotlightPark.name} - ${spotlightPark.businessType} in ${spotlightPark.city}, ${spotlightPark.state} | Featured Premium Listing`}
                  fill
                  className="object-cover opacity-50 transition duration-700 group-hover:scale-105 group-hover:opacity-60"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  unoptimized={true}
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-slate-900 to-slate-800 opacity-70" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

              <div className="relative z-10 flex h-full flex-col gap-6 p-8 md:p-12">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md">
                    <i className="bi bi-lightning-charge-fill text-amber-400" /> Spotlight
                  </span>
                  <span className="text-slate-300 text-sm font-medium">Verified Partner</span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight">{spotlightPark.name}</h3>
                  <div className="flex items-center gap-2 mt-4 text-slate-300 font-semibold text-lg">
                    <i className="bi bi-geo-alt-fill text-purple-400" />
                    <span>{spotlightPark.city}, {spotlightPark.state}</span>
                  </div>
                </div>

                <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed">
                  {truncateCopy(spotlightPark.description, 260)}
                </p>

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

                <div className="flex flex-wrap gap-4 mt-6">
                  {spotlightPark.slug && (
                    <Link
                      href={`/parks/${spotlightPark.slug}`}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-100 shadow-lg"
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
                      className="inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-3 text-sm font-bold text-white hover:border-white transition"
                    >
                      Visit website
                      <i className="bi bi-box-arrow-up-right" />
                    </a>
                  )}
                </div>
              </div>
            </article>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {valueProps.map((prop) => (
                <div key={prop.title} className="group rounded-3xl border border-slate-100 bg-white p-6 transition hover:border-purple-200 hover:shadow-xl shadow-sm">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 transition group-hover:bg-purple-600 group-hover:text-white">
                    <i className={`bi ${prop.icon} text-lg`} />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{prop.title}</h4>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{prop.copy}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {otherFeatured.length > 0 && (
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {otherFeatured.map((park) => (
              <div
                key={park.id}
                className="group relative flex flex-col overflow-hidden rounded-[2rem] bg-white border border-slate-200 shadow-sm transition-all hover:shadow-2xl hover:border-purple-200 hover:-translate-y-2"
              >
                <div className="relative h-64 overflow-hidden">
                  {park.photos && park.photos.length > 0 ? (
                    <Image
                      src={park.photos[0].url}
                      alt={`${park.name} - ${park.businessType} in ${park.city}, ${park.state} | Featured Indoor Dog Park`}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      unoptimized={true}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-blue-200" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute left-6 top-6">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-white shadow-lg">
                      <i className="bi bi-star-fill" /> Premium
                    </span>
                  </div>
                </div>

                <div className="flex flex-col flex-1 p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl lg:text-2xl font-black text-slate-900 mb-2 leading-tight group-hover:text-purple-600 transition-colors">
                        {park.name}
                      </h3>
                      <p className="text-sm font-bold text-purple-500 uppercase tracking-widest">
                        {park.businessType}
                      </p>
                    </div>
                    <FavoriteButton
                      parkId={park.id}
                      parkSlug={park.slug}
                      className="favorite-btn-minimal"
                    />
                  </div>
                  <p className="text-slate-600 leading-relaxed mb-6 italic">
                    &quot;{truncateCopy(park.description, 140)}&quot;
                  </p>
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-100">
                  <div className="flex items-center justify-between text-sm font-bold">
                    <span className="text-slate-400">LOCATION</span>
                    <span className="text-slate-900">{park.city}, {park.state}</span>
                  </div>
                  <Link
                    href={`/parks/${park.slug || park.id}`}
                    className="flex items-center justify-center w-full gap-2 rounded-xl bg-slate-900 px-6 py-4 text-sm font-bold text-white transition hover:bg-purple-600"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section >
  );
}

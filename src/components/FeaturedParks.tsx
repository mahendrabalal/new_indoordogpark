'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
      <section className="py-16 bg-white" style={{ minHeight: '600px' }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-6 mb-8 animate-pulse">
            <div className="h-4 w-32 rounded-full bg-slate-100" />
            <div className="h-10 w-2/3 rounded-xl bg-slate-100" />
            <div className="h-5 w-1/2 rounded-lg bg-slate-50" />
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="h-[400px] rounded-[2rem] bg-slate-100" />
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 rounded-2xl bg-slate-50 border border-slate-100" />
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
    <section className="featured-parks-premium-new py-16 bg-white overflow-hidden" aria-labelledby="premium-featured-heading">
      <div className="container mx-auto px-4 relative">
        {/* Abstract Background Elements */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-purple-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between mb-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-purple-600 rounded-full" />
              <p className="text-[12px] font-black uppercase tracking-[0.3em] text-purple-600">Premium Partner Network</p>
            </div>
            <h2 id="premium-featured-heading" className="text-2xl md:text-3xl lg:text-4xl font-[900] text-slate-900 leading-[1.2] tracking-tight">
              Elevating the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 italic font-serif px-1">Indoor Dog Park</span> Industry.
            </h2>
            <p className="mt-4 text-base md:text-lg text-slate-500 max-w-2xl leading-relaxed font-medium">
              Join an elite network of climate-controlled facilities with concierge visibility and quarterly performance insights.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 self-start lg:self-end">
            <Link
              href="/list-your-park"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-purple-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-purple-200 transition-all hover:bg-purple-700 hover:-translate-y-1 active:scale-95"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <i className="bi bi-lightning-charge-fill" /> List park $9.99/mo
            </Link>
            <Link
              href="/list-your-park"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-100 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition-all hover:border-purple-100 hover:bg-purple-50 hover:text-purple-700 active:scale-95"
            >
              Visibility <i className="bi bi-arrow-up-right" />
            </Link>
          </div>
        </div>

        {spotlightPark && (
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-stretch">
            {/* Spotlight Hero Card */}
            <article className="spotlight-card relative overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.2)] border border-white/10 group h-full min-h-[420px] flex flex-col">
              {spotlightPark.slug && (
                <Link href={`/parks/${spotlightPark.slug}`} className="absolute inset-0 z-10">
                  <span className="sr-only">View {spotlightPark.name} details</span>
                </Link>
              )}
              {spotlightPark.photos && spotlightPark.photos.length > 0 ? (
                <>
                  <Image
                    src={spotlightPark.photos[0].url}
                    alt={`${spotlightPark.name} spotlight`}
                    fill
                    className="object-cover opacity-60 transition duration-1000 group-hover:scale-105 group-hover:opacity-40"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    unoptimized={true}
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-slate-950 to-indigo-950" />
              )}

              <div className="relative z-10 p-8 md:p-10 flex flex-col justify-end flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-950 shadow-lg">
                    <i className="bi bi-stars" /> Spotlight
                  </div>
                  <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest border-l border-white/20 pl-3">Premium Partner</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight mb-2">{spotlightPark.name}</h3>
                    <div className="flex items-center gap-2 text-white/80 font-bold text-base">
                      <i className="bi bi-geo-alt-fill text-purple-400" />
                      <span>{spotlightPark.city}, {spotlightPark.state}</span>
                    </div>
                  </div>

                  <p className="text-base text-white/70 max-w-xl leading-relaxed font-medium">
                    {truncateCopy(spotlightPark.description, 200)}
                  </p>

                  <div className="flex flex-wrap gap-3 pt-3">
                    {spotlightPark.slug && (
                      <Link
                        href={`/parks/${spotlightPark.slug}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-black text-slate-950 transition-all hover:bg-slate-100 active:scale-95 shadow-lg relative z-20"
                      >
                        Profile <i className="bi bi-arrow-right" />
                      </Link>
                    )}
                    {spotlightPark.website && (
                      <a
                        href={spotlightPark.website}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/20 active:scale-95 relative z-20"
                      >
                        Website <i className="bi bi-box-arrow-up-right" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>

            {/* Premium Feature Grid */}
            <div className="grid gap-4 flex-1">
              {valueProps.map((prop, idx) => (
                <div
                  key={prop.title}
                  className={`glass-feature-card group relative p-5 rounded-[1.5rem] bg-white border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-purple-100 overflow-hidden ${idx % 2 === 0 ? 'bg-gradient-to-br from-white to-slate-50' : 'bg-white'}`}
                >
                  <div className="relative z-10 flex gap-4 items-start">
                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 transition-all duration-300 group-hover:bg-purple-600 group-hover:text-white group-hover:rotate-3">
                      <i className={`bi ${prop.icon} text-xl`} />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900 leading-tight group-hover:text-purple-700 transition-colors">{prop.title}</h4>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed mt-1">{prop.copy}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {otherFeatured.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between gap-4 mb-8">
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Expansion Partners</h3>
              <Link href="/list-your-park" className="text-sm text-purple-600 font-bold hover:text-purple-700 transition-colors flex items-center gap-1">
                View all <i className="bi bi-chevron-right" />
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {otherFeatured.map((park) => (
                <div
                  key={park.id}
                  className="group relative flex flex-col overflow-hidden rounded-[1.5rem] bg-white border border-slate-100 transition-all duration-300 hover:shadow-xl hover:border-purple-100 hover:-translate-y-1"
                >
                  <Link href={`/parks/${park.slug || park.id}`} className="absolute inset-0 z-10">
                    <span className="sr-only">View {park.name} details</span>
                  </Link>
                  <div className="relative h-48 overflow-hidden">
                    {park.photos && park.photos.length > 0 ? (
                      <Image
                        src={park.photos[0].url}
                        alt={park.name}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized={true}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-50" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    <div className="absolute left-5 bottom-5 text-white">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-purple-300 mb-1">{park.businessType}</p>
                      <h4 className="text-lg font-black leading-tight tracking-tight">
                        {park.name}
                      </h4>
                    </div>
                  </div>

                  <div className="flex flex-col flex-1 p-6 space-y-4">
                    <p className="text-slate-500 font-medium leading-relaxed italic text-sm">
                      &quot;{truncateCopy(park.description, 100)}&quot;
                    </p>

                    <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <i className="bi bi-geo-alt-fill text-purple-500 text-xs" />
                        <span className="text-xs font-bold text-slate-800">{park.city}, {park.state}</span>
                      </div>
                      <Link
                        href={`/parks/${park.slug || park.id}`}
                        className="flex items-center gap-1 text-xs font-black text-slate-900 transition-colors hover:text-purple-600 relative z-20"
                      >
                        Details <i className="bi bi-arrow-right" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section >
  );
}

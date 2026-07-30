'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getParkUrl } from '@/lib/routing';

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
      <section className="featured-parks-premium-new py-24 bg-slate-50 relative overflow-hidden" aria-labelledby="premium-featured-heading-loading">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        <div className="absolute -top-40 -right-40 w-[800px] h-[800px] bg-indigo-50 rounded-full blur-[100px] opacity-70 pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center justify-center gap-2 mb-4 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm opacity-50">
              <i className="bi bi-star-fill text-amber-400 text-xs" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700">Premium Partner Network</span>
            </div>
            <h2 id="premium-featured-heading-loading" className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] opacity-50">
              Elevating the <span className="font-serif italic text-slate-600 font-normal pr-2">Standard</span> of Play.
            </h2>
            <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed opacity-50">
              Join an elite network of climate-controlled facilities with concierge visibility, prioritized placements, and performance insights.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 opacity-50">
              <div className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 text-sm font-bold text-white">
                List your park — $9.99/mo
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-8 py-4 text-sm font-bold text-slate-700">
                Learn about visibility
              </div>
            </div>
          </div>
          {/* Omit skeleton grid to prevent massive layout collapse if 0 parks */}
        </div>
      </section>
    );
  }

  return (
    <section className="featured-parks-premium-new py-24 bg-slate-50 relative overflow-hidden" aria-labelledby="premium-featured-heading">
      {/* Subtle Background Pattern / Gradient */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="absolute -top-40 -right-40 w-[800px] h-[800px] bg-indigo-50 rounded-full blur-[100px] opacity-70 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center justify-center gap-2 mb-4 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm">
            <i className="bi bi-star-fill text-amber-400 text-xs" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700">Premium Partner Network</span>
          </div>
          <h2 id="premium-featured-heading" className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Elevating the <span className="font-serif italic text-slate-600 font-normal pr-2">Standard</span> of Play.
          </h2>
          <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Join an elite network of climate-controlled facilities with concierge visibility, prioritized placements, and performance insights.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/list-your-park"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-indigo-700 shadow-[0_10px_20px_-10px_rgba(79,70,229,0.5)] hover:-translate-y-1"
            >
              List your park — $9.99/mo
            </Link>
            <Link
              href="/partners"
              className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-8 py-4 text-sm font-bold text-slate-700 transition-all hover:border-slate-400 hover:text-slate-900 hover:-translate-y-1"
            >
              Learn about visibility
            </Link>
          </div>
        </div>

        {/* Premium Parks Grid (4 Columns) */}
        {featuredParks && featuredParks.length > 0 && (
          <div className="mb-16">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {featuredParks.slice(0, 4).map((park) => (
                <div
                  key={park.id}
                  className="group relative flex flex-col overflow-hidden rounded-[2rem] bg-white border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] hover:-translate-y-1 h-full"
                >
                  <Link href={getParkUrl(park)} className="absolute inset-0 z-10">
                    <span className="sr-only">View {park.name} details</span>
                  </Link>
                  <div className="relative h-56 overflow-hidden bg-slate-100">
                    {park.photos && park.photos.length > 0 ? (
                      <Image
                        src={park.photos[0].url}
                        alt={park.name}
                        fill
                        className="object-cover transition duration-1000 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        unoptimized={true}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <i className="bi bi-image text-slate-300 text-3xl" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 z-20">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-slate-900 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        Premium
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col flex-1 p-6">
                    <div className="mb-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-1.5">{park.businessType}</p>
                      <h3 className="text-xl font-black leading-tight tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {park.name}
                      </h3>
                    </div>

                    <p className="text-slate-600 font-medium leading-relaxed text-sm line-clamp-3 mb-6">
                      {park.description}
                    </p>

                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <i className="bi bi-geo-alt-fill text-indigo-500 text-xs" />
                        <span className="text-xs font-bold text-slate-700">{park.city}, {park.state}</span>
                      </div>
                      <Link
                        href={getParkUrl(park)}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 text-slate-600 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600 relative z-20"
                        aria-label={`View details for ${park.name}`}
                      >
                        <i className="bi bi-arrow-right text-sm" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

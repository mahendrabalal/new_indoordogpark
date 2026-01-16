'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import FavoriteButton from '@/components/FavoriteButton';
import type { ParkSubmission } from '@/types/park-submission';

function truncateCopy(text?: string, limit = 180) {
    if (!text) return '';
    if (text.length <= limit) return text;
    return `${text.slice(0, limit).trim()}…`;
}

function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${diffDays >= 14 ? 's' : ''} ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${diffDays >= 60 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 365)} year${diffDays >= 730 ? 's' : ''} ago`;
}

export default function RecentlyAddedParks() {
    const [recentParks, setRecentParks] = useState<ParkSubmission[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRecentParks = async () => {
            try {
                const response = await fetch('/api/parks/recent', { cache: 'no-store' });
                if (response.ok) {
                    const data = await response.json();
                    setRecentParks(data.parks || []);
                }
            } catch (error) {
                console.error('Failed to fetch recent parks:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecentParks();
    }, []);

    if (isLoading) {
        return (
            <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
                <div className="container mx-auto px-4">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 w-64 rounded-lg bg-slate-200" />
                        <div className="h-4 w-96 rounded-lg bg-slate-100" />
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-8">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-64 rounded-2xl bg-slate-100" />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (!recentParks || recentParks.length === 0) {
        return null;
    }

    return (
        <section className="py-16 bg-gradient-to-b from-slate-50 to-white" aria-labelledby="recent-parks-heading">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-700">
                                <i className="bi bi-lightning-charge-fill" /> New
                            </span>
                        </div>
                        <h2 id="recent-parks-heading" className="text-2xl md:text-3xl font-extrabold text-slate-900">
                            Recently Added Indoor Dog Parks
                        </h2>
                        <p className="mt-2 text-slate-600 max-w-xl">
                            Fresh listings from dog park owners across the country. Be among the first to discover these new spots!
                        </p>
                    </div>
                    <Link
                        href="/list-your-park"
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                    >
                        <i className="bi bi-plus-circle" /> Add your park
                    </Link>
                </div>

                {/* Parks Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {recentParks.slice(0, 8).map((park) => (
                        <article
                            key={park.id}
                            className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm transition-all hover:shadow-xl hover:border-emerald-200 hover:-translate-y-1"
                        >
                            {/* Image */}
                            <div className="relative h-40 overflow-hidden bg-gradient-to-br from-emerald-100 to-blue-100">
                                {park.photos && park.photos.length > 0 ? (
                                    <Image
                                        src={park.photos[0].url}
                                        alt={`${park.name} - ${park.businessType} in ${park.city}, ${park.state}`}
                                        fill
                                        className="object-cover transition duration-500 group-hover:scale-110"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                                        unoptimized={true}
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <i className="bi bi-building text-4xl text-emerald-300" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                {/* New Badge */}
                                <div className="absolute left-3 top-3">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">
                                        <i className="bi bi-clock-history" /> {formatTimeAgo(park.approvedAt || park.createdAt)}
                                    </span>
                                </div>

                                {/* Listing Type Badge */}
                                {park.listingType === 'featured' && (
                                    <div className="absolute right-3 top-3">
                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">
                                            <i className="bi bi-star-fill" /> Premium
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex flex-col flex-1 p-5">
                                <div className="flex justify-between items-start gap-2 mb-2">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-bold text-slate-900 truncate group-hover:text-emerald-600 transition-colors">
                                            {park.name}
                                        </h3>
                                        <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide mt-0.5">
                                            {park.businessType}
                                        </p>
                                    </div>
                                    <FavoriteButton
                                        parkId={park.id}
                                        parkSlug={park.slug}
                                        className="favorite-btn-minimal"
                                    />
                                </div>

                                <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-3">
                                    {truncateCopy(park.description, 100)}
                                </p>

                                <div className="mt-auto pt-3 border-t border-slate-100">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="flex items-center gap-1 text-slate-500">
                                            <i className="bi bi-geo-alt" />
                                            {park.city}, {park.state}
                                        </span>
                                        <Link
                                            href={`/parks/${park.slug || park.id}`}
                                            className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                                        >
                                            View details →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

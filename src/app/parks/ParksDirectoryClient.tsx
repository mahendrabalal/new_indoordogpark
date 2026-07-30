'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { DogPark } from '@/types/dog-park';
import { getParkUrl } from '@/lib/routing';
import OptimizedImage from '@/components/OptimizedImage';
import { normalizeState, getStateName } from '@/lib/state';

/* ─────────────────── Constants ─────────────────── */

const BUSINESS_TYPES = [
  { value: 'all', label: 'All Parks' },
  { value: 'Indoor Dog Park', label: 'Indoor Dog Parks' },
  { value: 'Dog Park', label: 'Dog Parks' },
  { value: 'Dog-Friendly Establishment', label: 'Dog-Friendly Spots' },
  { value: 'General Play / Daycare Parks', label: 'Daycare & Play' },
  { value: 'Agility & Training Parks', label: 'Agility & Training' },
];

const SORT_OPTIONS = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'name', label: 'A–Z' },
  { value: 'name-desc', label: 'Z–A' },
  { value: 'reviews', label: 'Most Reviewed' },
];

const PARKS_PER_PAGE = 24;

// Constants


/* ─────────────────── Props ─────────────────── */

interface ParksDirectoryClientProps {
  initialParks: DogPark[];
  stats: {
    totalParks: number;
    uniqueStates: number;
    uniqueCities: number;
    avgRating: string;
  };
}

/* ─────────────────── Component ─────────────────── */

export default function ParksDirectoryClient({ initialParks, stats }: ParksDirectoryClientProps) {
  /* ── State ── */
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  /* ── Derive unique states that have parks ── */
  const statesWithParks = useMemo(() => {
    const stateSet = new Set(initialParks.map((p) => p.state).filter(Boolean));
    const uniqueAbbrs = Array.from(stateSet).map(s => normalizeState(s)).filter(Boolean);
    const abbrSet = new Set(uniqueAbbrs);
    
    return Array.from(abbrSet).map(abbr => {
      const rawName = getStateName(abbr) || abbr;
      const label = rawName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      return { value: abbr, label };
    }).sort((a, b) => a.label.localeCompare(b.label));
  }, [initialParks]);

  /* ── Filter + Sort ── */
  const filteredParks = useMemo(() => {
    let parks = [...initialParks];

    // Search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      parks = parks.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q) ||
          (getStateName(p.state) || '').toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Type filter
    if (selectedType !== 'all') {
      parks = parks.filter((p) => p.businessType === selectedType);
    }

    // State filter
    if (selectedState !== 'all') {
      parks = parks.filter((p) => normalizeState(p.state) === selectedState);
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        parks.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name':
        parks.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        parks.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'reviews':
        parks.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
    }

    return parks;
  }, [initialParks, searchTerm, selectedType, selectedState, sortBy]);

  /* ── Pagination ── */
  const totalPages = Math.ceil(filteredParks.length / PARKS_PER_PAGE);
  const paginatedParks = filteredParks.slice(
    (currentPage - 1) * PARKS_PER_PAGE,
    currentPage * PARKS_PER_PAGE
  );

  /* ── Handlers ── */
  const handleFilterChange = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
      handleFilterChange();
    },
    [handleFilterChange]
  );

  const handleTypeChange = useCallback(
    (value: string) => {
      setSelectedType(value);
      handleFilterChange();
    },
    [handleFilterChange]
  );

  const handleStateChange = useCallback(
    (value: string) => {
      setSelectedState(value);
      handleFilterChange();
    },
    [handleFilterChange]
  );

  const handleSortChange = useCallback(
    (value: string) => {
      setSortBy(value);
      handleFilterChange();
    },
    [handleFilterChange]
  );

  const clearAllFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedState('all');
    setSortBy('rating');
    setCurrentPage(1);
  }, []);

  const goToPage = useCallback(
    (page: number) => {
      setCurrentPage(page);
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    []
  );

  const hasActiveFilters = searchTerm || selectedType !== 'all' || selectedState !== 'all';

  /* ── Render ── */
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header variant="light" />

      <main className="flex-1">
        {/* ━━━ Hero ━━━ */}
        <section className="relative bg-slate-900 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
          <div className="absolute -top-40 -right-40 w-[700px] h-[700px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-sm">
                <i className="bi bi-geo-alt-fill text-indigo-400 text-xs" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-300">
                  National Directory
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-5">
                Every Dog Park.{' '}
                <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  One Directory.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
                Search {stats.totalParks.toLocaleString()} verified listings across{' '}
                {stats.uniqueStates} states. Indoor, outdoor, off-leash, dog-friendly bars &mdash; find the
                right space for every dog.
              </p>

              {/* ── Hero Search Bar ── */}
              <div className="max-w-xl mx-auto">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl opacity-30 group-hover:opacity-50 blur transition duration-500" />
                  <div className="relative flex items-center bg-white rounded-xl shadow-2xl">
                    <i className="bi bi-search text-slate-400 ml-5 text-lg" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      placeholder="Search by name, city, or state…"
                      className="flex-1 px-4 py-4 bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none text-base"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => handleSearchChange('')}
                        className="mr-3 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                        aria-label="Clear search"
                      >
                        <i className="bi bi-x-lg text-sm" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Stats Row ── */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { value: stats.totalParks.toLocaleString(), label: 'Verified Parks' },
                { value: stats.uniqueCities.toLocaleString(), label: 'Cities Covered' },
                { value: stats.uniqueStates.toString(), label: 'States' },
                { value: `${stats.avgRating}★`, label: 'Avg Rating' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center py-4 px-3 rounded-xl bg-white/[0.04] border border-white/[0.06]"
                >
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━ Filters Bar ━━━ */}
        <section className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-[70px] z-[999] shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Desktop Filters */}
            <div className="hidden md:flex items-center gap-4 py-4">
              <div className="relative">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 absolute -top-2 left-3 bg-white px-1">Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors cursor-pointer min-w-[160px]"
                >
                  {BUSINESS_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <i className="bi bi-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
              </div>

              <div className="relative">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 absolute -top-2 left-3 bg-white px-1">State</label>
                <select
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors cursor-pointer min-w-[160px]"
                >
                  <option value="all">All States</option>
                  {statesWithParks.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <i className="bi bi-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
              </div>

              <div className="relative">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 absolute -top-2 left-3 bg-white px-1">Sort</label>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors cursor-pointer min-w-[150px]"
                >
                  {SORT_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <i className="bi bi-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
              </div>

              <div className="flex-1" />

              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
                >
                  <i className="bi bi-x-circle" /> Clear filters
                </button>
              )}

              <span className="text-sm text-slate-500 font-medium">
                {filteredParks.length.toLocaleString()} {filteredParks.length === 1 ? 'park' : 'parks'}
              </span>
            </div>

            {/* Mobile Filters Toggle */}
            <div className="md:hidden flex items-center justify-between py-3">
              <span className="text-sm text-slate-600 font-medium">
                {filteredParks.length.toLocaleString()} {filteredParks.length === 1 ? 'park' : 'parks'}
              </span>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-sm font-semibold text-slate-700"
              >
                <i className="bi bi-sliders" />
                Filters
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                )}
              </button>
            </div>

            {/* Mobile Filters Drawer */}
            {showFilters && (
              <div className="md:hidden pb-4 space-y-3">
                <select
                  value={selectedType}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700"
                >
                  {BUSINESS_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700"
                >
                  <option value="all">All States</option>
                  {statesWithParks.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700"
                >
                  {SORT_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="w-full text-sm font-semibold text-indigo-600 py-2"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ━━━ Results Grid ━━━ */}
        <section ref={resultsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" style={{ scrollMarginTop: '140px' }}>
          {paginatedParks.length > 0 ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paginatedParks.map((park) => (
                  <ParkDirectoryCard key={park.id} park={park} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                  >
                    <i className="bi bi-chevron-left mr-1" /> Previous
                  </button>

                  {(() => {
                    const pages: (number | string)[] = [];
                    if (totalPages <= 7) {
                      for (let i = 1; i <= totalPages; i++) pages.push(i);
                    } else {
                      pages.push(1);
                      if (currentPage > 3) pages.push('…');
                      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                        pages.push(i);
                      }
                      if (currentPage < totalPages - 2) pages.push('…');
                      pages.push(totalPages);
                    }

                    return pages.map((page, idx) =>
                      typeof page === 'string' ? (
                        <span key={`ellipsis-${idx}`} className="px-2 text-slate-400">
                          {page}
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`w-10 h-10 rounded-lg text-sm font-semibold transition-colors ${
                            page === currentPage
                              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    );
                  })()}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                  >
                    Next <i className="bi bi-chevron-right ml-1" />
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="text-center py-20">
              <div className="mx-auto w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                <i className="bi bi-search text-slate-400 text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No parks found</h3>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">
                Try adjusting your filters or search term. You can also browse by state or city.
              </p>
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
              >
                <i className="bi bi-arrow-counterclockwise" /> Reset filters
              </button>
            </div>
          )}
        </section>

        {/* ━━━ Browse by State ━━━ */}
        <section className="bg-white border-t border-slate-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900">Browse by State</h2>
              <p className="mt-2 text-slate-500">Jump to a specific state to see all its listings.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {statesWithParks.map((s) => {
                const count = initialParks.filter((p) => normalizeState(p.state) === s.value).length;
                const slug = s.label.toLowerCase().replace(/\s+/g, '-');
                return (
                  <Link
                    key={s.value}
                    href={`/states/${slug}`}
                    className="group flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50 transition-all"
                  >
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-700 truncate">
                      {s.label}
                    </span>
                    <span className="text-xs font-bold text-slate-400 group-hover:text-indigo-500 ml-2 shrink-0">
                      {count}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ━━━ CTA ━━━ */}
        <section className="bg-slate-900 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Own a dog park? Get listed.
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
              Join {stats.totalParks.toLocaleString()}+ parks in the most comprehensive indoor dog park directory. Free and premium listings available.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/list-your-park"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/30"
              >
                <i className="bi bi-plus-circle" /> List Your Park Free
              </Link>
              <Link
                href="/partners"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-colors"
              >
                Learn About Premium
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/* ─────────────────── Park Card ─────────────────── */

function ParkDirectoryCard({ park }: { park: DogPark }) {
  const mainPhoto = park.photos?.[0]?.url || park.photo;
  const showImage = park.listingType === 'featured' && mainPhoto;

  return (
    <Link
      href={getParkUrl(park)}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-indigo-300 transition-all duration-300 h-full"
    >
      {/* Image Block */}
      {showImage && (
        <div className="relative h-44 shrink-0 bg-slate-100 overflow-hidden border-b border-slate-100">
          <OptimizedImage
            src={mainPhoto!}
            alt={park.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {/* Overlaid Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pr-3">
            {park.listingType === 'featured' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                Premium
              </span>
            )}
            {park.indoorOutdoor && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-black uppercase tracking-widest text-slate-700 shadow-sm">
                {park.indoorOutdoor}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Badges for no-image cards */}
        {!showImage && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {park.listingType === 'featured' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-indigo-100 bg-indigo-50 text-[10px] font-black uppercase tracking-widest text-indigo-700">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                Premium
              </span>
            )}
            {park.indoorOutdoor && (
              <span className="inline-flex items-center px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-600">
                {park.indoorOutdoor}
              </span>
            )}
          </div>
        )}

        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
            {park.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0 px-2 py-1 rounded-lg bg-amber-50 border border-amber-100/50">
            <i className="bi bi-star-fill text-amber-500 text-[10px]" />
            <span className="text-xs font-bold text-amber-700">{park.rating?.toFixed(1) || '—'}</span>
          </div>
        </div>

        <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-3">
          {park.businessType}
        </p>

        <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed flex-1">
          {park.description
            ? park.description.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').slice(0, 120) + (park.description.length > 120 ? '…' : '')
            : `${park.name} in ${park.city}, ${park.state}.`}
        </p>

        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 truncate pr-2">
            <i className="bi bi-geo-alt-fill text-slate-400 text-xs shrink-0" />
            <span className="text-xs font-medium text-slate-600 truncate">
              {park.city}, {park.state}
            </span>
          </div>
          {park.pricing?.priceRange && (
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100 uppercase tracking-widest shrink-0">
              {park.pricing.priceRange}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

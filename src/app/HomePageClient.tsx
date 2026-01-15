'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { DogPark } from '@/types/dog-park';
import { fetchParks, PaginationResponse } from '@/lib/api';
import { getFeaturedParks } from '@/lib/cityData';
import { useSearch } from '@/hooks/useSearch';
import { useAutocomplete, AutocompleteSuggestion } from '@/hooks/useAutocomplete';
import { useCloseOnScroll } from '@/hooks/useCloseOnScroll';
import { useMapListSwipeGestures } from '@/hooks/useSwipeGestures';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CitiesSection from '@/components/CitiesSection';
import ParkCard from '@/components/ParkCard';
import FeaturedParks from '@/components/FeaturedParks';
import SearchAutocomplete from '@/components/SearchAutocomplete';
import SeoContentSection from '@/components/SeoContentSection';

// Dynamically import Map component
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <div style={{ height: '100%', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading map...</div>
});

interface HomePageClientProps {
  initialParks: DogPark[];
  initialPagination: PaginationResponse['pagination'];
  initialShowSearchLayout?: boolean;
}

export default function HomePageClient({
  initialParks,
  initialPagination,
  initialShowSearchLayout = false,
}: HomePageClientProps) {
  const normalizedPagination = initialPagination ?? {
    page: 1,
    limit: 20,
    totalParks: initialParks.length,
    totalPages: 1,
    hasMore: false,
  };

  const [allParks, setAllParks] = useState<DogPark[]>(initialParks);
  const [loading, setLoading] = useState(initialParks.length === 0);
  const [hasMore, setHasMore] = useState(normalizedPagination.hasMore);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const autocompleteDropdownRef = useRef<HTMLDivElement>(null);
  const inlineFiltersRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Use custom search hook with manual trigger (SERVER-SIDE SEARCH)
  const {
    searchTerm,
    activeSearchTerm,
    filters,
    results: filteredParks,
    isSearching,
    isActive: hasActiveSearch,
    searchMeta,
    pagination: searchPagination,
    updateSearchTerm,
    triggerSearch,
    updateFilters,
    clearSearch,
  } = useSearch(allParks, { enableUrlState: true, debounceDelay: 300, initialLimit: 50 });

  // Use autocomplete hook
  const autocomplete = useAutocomplete({ debounceDelay: 150, minChars: 2 });

  const [showSearchLayout, setShowSearchLayout] = useState(initialShowSearchLayout);
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');

  // Add swipe gestures for mobile map/list toggle
  const swipeRef = useMapListSwipeGestures(
    mobileView === 'map',
    () => setMobileView(prev => prev === 'list' ? 'map' : 'list'),
    showSearchLayout // Only enable swipe gestures when in search layout
  );

  const hasFilterSelections = Boolean(
    (filters.type && filters.type !== 'all') ||
    filters.minRating ||
    filters.priceRange ||
    filters.city ||
    filters.listingType ||
    (filters.amenities && filters.amenities.length > 0)
  );

  const handleClearFiltersOnly = useCallback(() => {
    // Best practice: "Clear" in the filters bar should reset FILTERS only,
    // not the active search term (otherwise it feels like navigation/home reset).
    updateFilters({
      type: '',
      minRating: undefined,
      priceRange: undefined,
      city: undefined,
      amenities: undefined,
      sortBy: undefined,
      listingType: undefined,
    });
  }, [updateFilters]);

  useEffect(() => {
    // If initialShowSearchLayout was explicitly set to true, respect it
    // Otherwise, use hasActiveSearch to determine layout
    if (initialShowSearchLayout) {
      setShowSearchLayout(true);
    } else {
      setShowSearchLayout(hasActiveSearch);
    }
  }, [hasActiveSearch, initialShowSearchLayout]);

  // Client fallback if server-rendered data was unavailable
  useEffect(() => {
    if (initialParks.length > 0) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const loadInitialParks = async () => {
      try {
        const response = await fetchParks(1, 20);
        if (!isMounted) return;
        setAllParks(response.data);
        setHasMore(response.pagination.hasMore);
      } catch (error) {
        console.error('Error loading parks:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadInitialParks();

    return () => {
      isMounted = false;
    };
  }, [initialParks.length]);

  // Sync autocomplete query with search term
  useEffect(() => {
    autocomplete.updateQuery(searchTerm);
  }, [searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close autocomplete when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
        autocomplete.close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [autocomplete]);

  // Close autocomplete when scrolling (industry best practice implementation)
  // Uses a reusable hook with performance optimizations:
  // - requestAnimationFrame for smooth performance
  // - Throttling to reduce overhead
  // - Proper cleanup and ref management
  useCloseOnScroll({
    isOpen: autocomplete.isOpen,
    onClose: autocomplete.close,
    excludeElement: autocompleteDropdownRef.current,
    throttleMs: 50, // Reduced throttle for more responsive closing (50ms is still performant)
  });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search on "/" key
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }

      // Clear search on Escape key
      if (e.key === 'Escape' && hasActiveSearch) {
        clearSearch();
        autocomplete.clear();
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasActiveSearch, clearSearch, autocomplete]);

  // Desktop UX: Allow mouse wheel to scroll the horizontal filter row.
  // (Trackpads already support horizontal scrolling; mouse wheels typically don't.)
  useEffect(() => {
    const el = inlineFiltersRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      // Only hijack wheel when this element is actually horizontally scrollable.
      const canScrollHorizontally = el.scrollWidth > el.clientWidth;
      if (!canScrollHorizontally) return;

      // If the user is already performing horizontal scrolling (trackpad), don't interfere.
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      // Convert vertical wheel motion into horizontal scrolling.
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel as EventListener);
  }, []);

  // Track scroll position to enable/disable nav buttons
  useEffect(() => {
    const el = inlineFiltersRef.current;
    if (!el) return;

    const updateScrollState = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setCanScrollLeft(scrollLeft > 2);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
    };

    updateScrollState();
    el.addEventListener('scroll', updateScrollState);
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, []);

  const scrollFiltersBy = (delta: number) => {
    const el = inlineFiltersRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    autocomplete.close();
    triggerSearch(); // Explicitly trigger search
  };

  // Handle search input change
  const handleSearchInputChange = (value: string) => {
    updateSearchTerm(value);
    // Don't trigger search, just update the input
  };

  // Handle autocomplete suggestion selection
  const handleAutocompleteSuggestionClick = (suggestion: AutocompleteSuggestion) => {
    const selectedValue = autocomplete.handleSuggestionClick(suggestion);
    updateSearchTerm(selectedValue);
    triggerSearch(selectedValue); // Trigger search with selected value
  };

  // Handle autocomplete keyboard navigation
  const handleAutocompleteKeyDown = (e: React.KeyboardEvent) => {
    const selectedValue = autocomplete.handleKeyDown(e);
    if (selectedValue) {
      // User selected a suggestion with Enter
      updateSearchTerm(selectedValue);
      triggerSearch(selectedValue);
    }
  };

  const handleClearSearch = useCallback(() => {
    updateSearchTerm('');
    autocomplete.clear();
    searchInputRef.current?.focus();
  }, [updateSearchTerm, autocomplete]);

  if (loading) {
    return (
      <div className="loading">
        <i className="bi bi-hourglass-split"></i> Loading dog parks...
      </div>
    );
  }

  return (
    <>
      {/* Conditional Header - Compact when displaying search layout */}
      {!showSearchLayout && <Header />}

      <main id="main-content">
        {showSearchLayout && (
          <header className="search-results-header-bar">
            <div className="search-results-header-content">
              <a href="/" className="search-logo" aria-label="IndoorDogPark home">
                <Image
                  src="/images/logo/logo.png"
                  alt="Indoor Dog Park logo"
                  width={140}
                  height={40}
                  priority
                  fetchPriority="high"
                  style={{ objectFit: 'contain', height: 'auto' }}
                  unoptimized
                />
              </a>

              <form onSubmit={handleSearch} className="search-form-compact" role="search">
                <div className="search-input-wrapper-compact" ref={searchWrapperRef}>
                  <i className="bi bi-search search-icon-compact"></i>
                  <input
                    ref={searchInputRef}
                    type="text"
                    className="search-input-compact"
                    placeholder="Search dog parks..."
                    value={searchTerm}
                    onChange={(e) => handleSearchInputChange(e.target.value)}
                    onKeyDown={handleAutocompleteKeyDown}
                    onFocus={() => autocomplete.open()}
                    aria-label="Search dog parks"
                    autoComplete="off"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      className="search-clear-compact"
                      onClick={handleClearSearch}
                      aria-label="Clear search"
                    >
                      <i className="bi bi-x-circle-fill"></i>
                    </button>
                  )}
                  <SearchAutocomplete
                    ref={autocompleteDropdownRef}
                    suggestions={autocomplete.suggestions}
                    isOpen={autocomplete.isOpen}
                    isLoading={autocomplete.isLoading}
                    selectedIndex={autocomplete.selectedIndex}
                    query={autocomplete.query}
                    onSuggestionClick={handleAutocompleteSuggestionClick}
                    onClose={autocomplete.close}
                  />
                </div>
              </form>

              <div className="search-header-actions">
                <Link href="/blog" className="header-link-compact">Blog</Link>
                <Link href="/contact" className="header-link-compact">Contact</Link>
                <Link href="/list-your-park" className="header-btn-compact">List your park</Link>
              </div>
            </div>
          </header>
        )}

        {/* Hero Section - Only show when search layout is hidden */}
        {!showSearchLayout && (
          <section className="hero-section-new">
            <div className="hero-section-overlay" aria-hidden="true"></div>
            <div className="hero-inner">
              <div className="hero-content">
                <div className="hero-badge">
                  <i className="bi bi-stars" aria-hidden="true"></i>
                  Find Indoor Parks for Dogs Near Me
                </div>
                <h1 className="hero-title-new">
                  Find <span className="hero-title-highlight">Indoor Dog Parks</span> Near Me
                </h1>
                <p className="hero-subtitle-new">
                  Search 500+ climate-controlled indoor parks for dogs across the US. Find indoor dog parks with bars, training facilities, and more.
                </p>

                <div className="search-container-new">
                  <form onSubmit={handleSearch} className="search-form" role="search">
                    <div className="search-input-wrapper" ref={searchWrapperRef} style={{ position: 'relative' }}>
                      <input
                        ref={searchInputRef}
                        type="text"
                        className="search-input-new"
                        placeholder="Search indoor parks for dogs by city, neighborhood, or zip code"
                        value={searchTerm}
                        onChange={(e) => handleSearchInputChange(e.target.value)}
                        onKeyDown={handleAutocompleteKeyDown}
                        onFocus={() => autocomplete.open()}
                        aria-label="Search dog parks"
                        aria-describedby="search-hint"
                        autoComplete="off"
                      />
                      {searchTerm && (
                        <button
                          type="button"
                          className="search-input-clear"
                          onClick={handleClearSearch}
                          aria-label="Clear search"
                        >
                          <i className="bi bi-x-circle"></i>
                        </button>
                      )}
                      <SearchAutocomplete
                        ref={autocompleteDropdownRef}
                        suggestions={autocomplete.suggestions}
                        isOpen={autocomplete.isOpen}
                        isLoading={autocomplete.isLoading}
                        selectedIndex={autocomplete.selectedIndex}
                        query={autocomplete.query}
                        onSuggestionClick={handleAutocompleteSuggestionClick}
                        onClose={autocomplete.close}
                      />
                    </div>
                    <button type="submit" className="search-btn-new" disabled={isSearching}>
                      {isSearching ? 'Searching...' : 'Search'}
                    </button>
                  </form>
                  <span id="search-hint" className="sr-only">
                    Press / to focus search, Escape to clear
                  </span>
                </div>

                {/* Popular Locations & Features Combined */}
                <div className="hero-quick-links">
                  <span className="hero-quick-label">Popular:</span>
                  <a href="/cities/austin" className="hero-quick-link">Austin</a>
                  <a href="/cities/phoenix" className="hero-quick-link">Phoenix</a>
                  <a href="/cities/new-york" className="hero-quick-link">New York</a>
                  <a href="/cities/houston" className="hero-quick-link">Houston</a>
                  <a href="/cities/seattle" className="hero-quick-link">Seattle</a>
                  <span className="hero-quick-divider">•</span>
                  <a href="/parks-with-bars" className="hero-quick-link">Parks with Bars</a>
                  <a href="/training-facilities" className="hero-quick-link">Training Facilities</a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Featured Parks Section - User Submitted (only show when not searching) */}
        {/* Always render container to reserve space and prevent layout shift */}
        {!showSearchLayout && (
          <div style={{ minHeight: '800px' }}>
            <FeaturedParks />
          </div>
        )}

        {/* Featured Parks Section (only show when not searching) */}
        {!showSearchLayout && allParks.length > 0 && (
          <section className="featured-parks-section">
            <div className="featured-parks-container">
              <h2 className="featured-parks-heading">Featured Dog Parks</h2>
              <p className="featured-parks-subtitle">
                Discover our top-rated dog parks across California
              </p>
              <div className="parks-grid-new">
                {getFeaturedParks(allParks, 16).map((park) => (
                  <ParkCard
                    key={park.id}
                    park={park}
                  />
                ))}
              </div>
              {!hasMore && allParks.length > 0 && (
                <div className="view-all-parks-cta">
                  <p>You&rsquo;ve reached the end! Explore dog parks by city or use search above.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Search Results Section - Split View with Map */}
        {showSearchLayout && (
          <section
            ref={swipeRef}
            className={`search-results-split-view ${mobileView === 'map' ? 'mobile-view-map' : 'mobile-view-list'} swipe-hint`}
            role="region"
            aria-live="polite"
            aria-label="Search results"
          >
            {/* Main h1 for search results page - only rendered when showSearchLayout is true */}
            <h1 className="sr-only">
              {activeSearchTerm
                ? `Search results for "${activeSearchTerm}"`
                : 'Search Results - Indoor Dog Parks'}
            </h1>

            {/* Mobile Map/List Toggle Button */}
            <button
              className="mobile-toggle-btn"
              onClick={() => setMobileView(prev => prev === 'list' ? 'map' : 'list')}
              aria-label={mobileView === 'list' ? "Switch to map view" : "Switch to list view"}
            >
              {mobileView === 'list' ? (
                <>Map <i className="bi bi-map-fill"></i></>
              ) : (
                <>List <i className="bi bi-list-ul"></i></>
              )}
            </button>

            {/* Left Side - Park Listings */}
            <div className="search-results-listings">
              {/* Compact Inline Filters and Results Header */}
              <div className="search-results-toolbar">
                <div className="search-results-info">
                  {isSearching ? (
                    <span className="results-count">Searching...</span>
                  ) : (
                    <span className="results-count">
                      <strong>{searchPagination?.totalResults || filteredParks.length}</strong> {(searchPagination?.totalResults || filteredParks.length) === 1 ? 'park' : 'parks'} found
                      {searchMeta && searchMeta.totalParks > 0 && (
                        <span className="results-meta">
                          {/* Industry best practice: Clarify that search includes ALL parks (static + featured/premium) */}
                          (from {searchMeta.totalParks} total parks
                          {searchMeta.featuredParksCount !== undefined && searchMeta.featuredParksCount > 0 && (
                            <>, including {searchMeta.featuredParksCount} featured</>
                          )}
                          )
                        </span>
                      )}
                    </span>
                  )}
                </div>

                {/* Inline Filters */}
                <div className="inline-filters-wrapper">
                  <button
                    type="button"
                    className={`inline-filters-nav inline-filters-nav-left ${canScrollLeft ? 'visible' : ''}`}
                    onClick={() => scrollFiltersBy(-220)}
                    aria-label="Scroll filters left"
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                  <div className="inline-filters" ref={inlineFiltersRef}>
                    <select
                      className="filter-select"
                      value={filters.listingType || ''}
                      onChange={(e) =>
                        updateFilters({
                          listingType: e.target.value
                            ? (e.target.value as 'featured' | 'free')
                            : undefined,
                        })
                      }
                    >
                      <option value="">All Listings</option>
                      <option value="featured">Premium only</option>
                      <option value="free">Free listings</option>
                    </select>

                    <select
                      className="filter-select"
                      value={filters.type}
                      onChange={(e) => updateFilters({ ...filters, type: e.target.value })}
                    >
                      <option value="">All Types</option>
                      <option value="General Play / Daycare Parks">General Play / Daycare</option>
                      <option value="Agility & Training Parks">Agility & Training</option>
                      <option value="Themed & Enrichment Parks">Themed & Enrichment</option>
                      <option value="Specialty / Social Parks">Specialty / Social</option>
                    </select>

                    <select
                      className="filter-select"
                      value={filters.minRating || ''}
                      onChange={(e) => updateFilters({ ...filters, minRating: e.target.value ? Number(e.target.value) : undefined })}
                    >
                      <option value="">Any Rating</option>
                      <option value="4.5">4.5+ Stars</option>
                      <option value="4.0">4.0+ Stars</option>
                      <option value="3.5">3.5+ Stars</option>
                      <option value="3.0">3.0+ Stars</option>
                    </select>

                    <select
                      className="filter-select"
                      value={filters.priceRange || ''}
                      onChange={(e) => updateFilters({ ...filters, priceRange: e.target.value || undefined })}
                    >
                      <option value="">Any Price</option>
                      <option value="free">Free</option>
                      <option value="$">$ - Budget</option>
                      <option value="$$">$$ - Moderate</option>
                      <option value="$$$">$$$ - Premium</option>
                    </select>

                    <select
                      className="filter-select"
                      value={filters.sortBy || 'relevance'}
                      onChange={(e) => updateFilters({ ...filters, sortBy: e.target.value as 'relevance' | 'rating' | 'reviews' | 'name' })}
                    >
                      <option value="relevance">Best Match</option>
                      <option value="rating">Highest Rated</option>
                      <option value="reviews">Most Reviews</option>
                      <option value="name">Name (A-Z)</option>
                    </select>

                    {hasFilterSelections && (
                      <button
                        type="button"
                        className="clear-filters-btn"
                        onClick={handleClearFiltersOnly}
                        title="Clear filters"
                      >
                        <i className="bi bi-x-circle"></i> Clear
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    className={`inline-filters-nav inline-filters-nav-right ${canScrollRight ? 'visible' : ''}`}
                    onClick={() => scrollFiltersBy(220)}
                    aria-label="Scroll filters right"
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </div>
              </div>

              <div className="search-results-list">
                {isSearching ? (
                  <div className="search-loading-state">
                    <div className="search-loading-spinner"></div>
                    <p>Searching dog parks...</p>
                  </div>
                ) : filteredParks.length === 0 ? (
                  <div className="no-results">
                    <i className="bi bi-search" style={{ fontSize: '3rem', color: '#ccc', marginBottom: '20px' }}></i>
                    <h3>No parks found</h3>
                    <p>No results match your search {activeSearchTerm && `for "${activeSearchTerm}"`}</p>
                    <div style={{ marginTop: '30px' }}>
                      <h4 style={{ fontSize: '1.1rem', marginBottom: '15px', color: '#555' }}>Try these suggestions:</h4>
                      <ul style={{ listStyle: 'none', padding: 0, color: '#666', lineHeight: '1.8' }}>
                        <li>• Check your spelling</li>
                        <li>• Use more general keywords</li>
                        <li>• Try searching by city name (e.g., &quot;San Francisco&quot;, &quot;Los Angeles&quot;)</li>
                        <li>• Clear filters to see more results</li>
                      </ul>
                      <button
                        onClick={clearSearch}
                        className="clear-search-btn"
                      >
                        Clear Search & Filters
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="parks-grid-search">
                    {filteredParks.map((park) => (
                      <ParkCard
                        key={park.id}
                        park={park}
                        searchTerm={activeSearchTerm}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Map */}
            <div className="search-results-map">
              <Map parks={filteredParks.filter(p => p.latitude && p.longitude)} />
            </div>
          </section>
        )}

        {/* Informational Content Section (AdSense Compliance) */}
        {!showSearchLayout && (
          <SeoContentSection
            eyebrow="Canine Wellness & Socialization"
            title="Why Indoor Dog Parks are the Future of Canine Socialization"
            intro={[
              'Indoor dog parks provide a safe, climate-controlled environment for dogs to play and socialize year-round. Whether it\'s to escape the summer heat, avoid winter\'s chill, or stay dry during rainy seasons, these facilities offer a consistent outlet for your dog\'s energy.',
              'By choosing an indoor environment, you are prioritizing your dog\'s health, safety, and social development in a monitored setting.'
            ]}
            sections={[
              {
                heading: 'The Benefits of Climate-Controlled Play',
                paragraphs: [
                  'Consistency is key for a well-behaved dog. Indoor parks allow you to maintain your dog\'s exercise schedule regardless of the weather outside, which is essential for preventing destructive behaviors at home.',
                  'Beyond comfort, climate-controlled spaces reduce the risk of heat stroke during summer months and protect sensitive paws from icy sidewalks or scalding pavement.'
                ],
                listItems: [
                  'Year-round exercise consistency',
                  'Protection from extreme temperatures',
                  'Reduced exposure to outdoor allergens',
                  'Safer environment for brachycephalic (flat-faced) breeds'
                ]
              },
              {
                heading: 'Prioritizing Safety and Health',
                paragraphs: [
                  'Unlike many public outdoor parks, most indoor facilities require proof of vaccinations, providing a significantly healthier environment for your pet.',
                  'Controlled entry and professional oversight by trained staff often lead to safer social interactions, as play is monitored to prevent overstimulation or aggressive behavior.'
                ],
                listItems: [
                  'Vaccination verification requirements',
                  'Professional on-site supervision',
                  'Separated play areas for different sizes',
                  'Sanitized and maintained flooring'
                ]
              }
            ]}
            faqs={[
              {
                question: 'Are indoor dog parks good for shy or small dogs?',
                answer: 'Absolutely! Many indoor facilities offer dedicated areas specifically for small, senior, or timid dogs. This allows them to socialize at their own pace without being overwhelmed by larger, high-energy dogs.'
              },
              {
                question: 'What should I bring for my first visit?',
                answer: 'For your first visit, you should bring your dog\'s current vaccination records (Rabies, Distemper, and Bordetella are standard). Most parks provide water, waste bags, and seating, but it\'s always good to check individual park rules on our directory links.'
              },
              {
                question: 'Is there always staff on site?',
                answer: 'While policies vary, most premium indoor dog parks have "Dog Proctors" or staff members who monitor the play areas to ensure all dogs are playing safely and politely.'
              }
            ]}
            links={[
              {
                href: '/how-it-works',
                title: 'Learn Our Standards',
                description: 'Find out how we verify and rank the dog parks in our directory.'
              },
              {
                href: '/blog',
                title: 'Canine Care Blog',
                description: 'Read more expert tips on dog training and indoor play etiquette.'
              },
              {
                href: '/contact',
                title: 'Suggest a Park',
                description: 'Help us grow our community by sharing your favorite indoor dog spot.'
              }
            ]}
            className="border-t border-gray-100 mt-12"
          />
        )}

        {/* Cities Section (only show when not searching) */}
        {!showSearchLayout && <CitiesSection />}
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
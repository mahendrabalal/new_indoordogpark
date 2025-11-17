'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { DogPark } from '@/types/dog-park';
import { fetchParks, PaginationResponse } from '@/lib/api';
import { getFeaturedCities, getFeaturedParks } from '@/lib/cityData';
import { useSearch } from '@/hooks/useSearch';
import { useAutocomplete, AutocompleteSuggestion } from '@/hooks/useAutocomplete';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CitiesSection from '@/components/CitiesSection';
import ParkCard from '@/components/ParkCard';
import CityCard from '@/components/CityCard';
import ParkCardSkeleton from '@/components/ParkCardSkeleton';
import FeaturedParks from '@/components/FeaturedParks';
import SearchAutocomplete from '@/components/SearchAutocomplete';

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
  const [currentPage, setCurrentPage] = useState(normalizedPagination.page || 1);
  const [hasMore, setHasMore] = useState(normalizedPagination.hasMore);
  const [loadingMore, setLoadingMore] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

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

  const hasFilterSelections = Boolean(
    (filters.type && filters.type !== 'all') ||
      filters.minRating ||
      filters.priceRange ||
      filters.city ||
      filters.listingType ||
      (filters.amenities && filters.amenities.length > 0)
  );

  useEffect(() => {
    setShowSearchLayout(hasActiveSearch);
  }, [hasActiveSearch]);

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
        setCurrentPage(1);
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

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const response = await fetchParks(nextPage, 20);
      setAllParks(prev => [...prev, ...response.data]);
      setCurrentPage(nextPage);
      setHasMore(response.pagination.hasMore);
    } catch (error) {
      console.error('Error loading more parks:', error);
    } finally {
      setLoadingMore(false);
    }
  };

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
      
      {showSearchLayout && (
        <header className="search-results-header-bar">
          <div className="search-results-header-content">
            <a href="/" className="search-logo" aria-label="IndoorDogPark home">
              <Image 
                src="/images/logo/logo.png" 
                alt="Indoor Dog Park logo" 
                width={170} 
                height={48} 
                style={{ objectFit: 'contain' }}
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
              <a href="/blog" className="header-link-compact">Blog</a>
              <a href="/contact" className="header-link-compact">Contact</a>
              <a href="/list-your-park" className="header-btn-compact">List your park</a>
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
                Find Indoor Dog Parks Near You
              </div>
              <h1 className="hero-title-new">
                Find <span className="hero-title-highlight">Indoor Dog Parks</span> Near You
              </h1>
              <p className="hero-subtitle-new">
                Search 500+ climate-controlled indoor dog parks across the US. Find parks with bars, training facilities, and more.
              </p>

              <div className="search-container-new">
                <form onSubmit={handleSearch} className="search-form" role="search">
                  <div className="search-input-wrapper" ref={searchWrapperRef} style={{ position: 'relative' }}>
                    <input
                      ref={searchInputRef}
                      type="text"
                      className="search-input-new"
                      placeholder="Search indoor dog parks by city, neighborhood, or zip code"
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
                <a href="/?type=bar" className="hero-quick-link">Parks with Bars</a>
                <a href="/?type=training" className="hero-quick-link">Training Facilities</a>
              </div>

              <p className="hero-guarantee">
                <i className="bi bi-check-circle-fill"></i> Free to search • 
                <i className="bi bi-shield-check"></i> Verified listings • 
                <i className="bi bi-star-fill"></i> Real reviews
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Featured Parks Section - User Submitted (only show when not searching) */}
      {!showSearchLayout && <FeaturedParks />}

      {/* Featured Cities Section (only show when not searching) */}
      {!showSearchLayout && allParks.length > 0 && (
        <section className="cities-cards-section">
          <h2 className="cities-cards-heading">Explore by City</h2>
          <p className="cities-cards-subtitle">
            Discover dog parks in California&rsquo;s most popular cities
          </p>
          <div className="cities-cards-grid">
            {getFeaturedCities(allParks, 12).map((city) => (
              <CityCard key={city.slug} city={city} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Parks Section (only show when not searching) */}
      {!showSearchLayout && (allParks.length > 0 || loadingMore) && (
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
              {loadingMore && Array(4).fill(0).map((_, i) => (
                <ParkCardSkeleton key={`skeleton-${i}`} />
              ))}
            </div>
            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  style={{
                    background: '#00bfff',
                    color: 'white',
                    border: 'none',
                    padding: '12px 32px',
                    borderRadius: '5px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: loadingMore ? 'wait' : 'pointer',
                    opacity: loadingMore ? 0.7 : 1
                  }}
                  aria-live="polite"
                >
                  {loadingMore ? 'Loading more parks...' : 'Load More Parks'}
                </button>
              </div>
            )}
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
        <section className="search-results-split-view" role="region" aria-live="polite" aria-label="Search results">
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
                      <span style={{ color: '#9ca3af', fontSize: '0.85rem', marginLeft: '8px' }}>
                        (from {searchMeta.totalParks} total)
                      </span>
                    )}
                  </span>
                )}
              </div>

              {/* Inline Filters */}
              <div className="inline-filters">
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

                {(hasFilterSelections || !!searchTerm) && (
                  <button 
                    className="clear-filters-btn"
                    onClick={clearSearch}
                    title="Clear all filters"
                  >
                    <i className="bi bi-x-circle"></i> Clear
                  </button>
                )}
              </div>
            </div>

            <div className="search-results-list">
              {isSearching ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <div className="search-loading-spinner" style={{ margin: '0 auto 20px' }}></div>
                  <p style={{ color: '#666', fontSize: '1.1rem' }}>Searching dog parks...</p>
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
                <div className="parks-list-vertical">
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

      {/* Cities Section (only show when not searching) */}
      {!showSearchLayout && <CitiesSection />}

      {/* Footer */}
      <Footer />
    </>
  );
}
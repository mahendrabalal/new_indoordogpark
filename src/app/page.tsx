'use client';

import { useState, useEffect } from 'react';
import { DogPark } from '@/types/dog-park';
import { fetchParks, filterParks } from '@/lib/api';
import { getFeaturedCities, getFeaturedParks } from '@/lib/cityData';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CitiesSection from '@/components/CitiesSection';
import ParkCard from '@/components/ParkCard';
import CityCard from '@/components/CityCard';
import ParkCardSkeleton from '@/components/ParkCardSkeleton';
import FeaturedParks from '@/components/FeaturedParks';

export default function Home() {
  const [allParks, setAllParks] = useState<DogPark[]>([]);
  const [displayedParks, setDisplayedParks] = useState<DogPark[]>([]);
  const [filteredParks, setFilteredParks] = useState<DogPark[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Initial load - fetch first page
  useEffect(() => {
    const loadInitialParks = async () => {
      try {
        const response = await fetchParks(1, 20);
        setAllParks(response.data);
        setDisplayedParks(response.data);
        setFilteredParks(response.data);
        setCurrentPage(1);
        setHasMore(response.pagination.hasMore);
      } catch (error) {
        console.error('Error loading parks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialParks();
  }, []);

  // Handle search filtering
  useEffect(() => {
    const filtered = filterParks(displayedParks, searchTerm, 'all');
    setFilteredParks(filtered);
  }, [displayedParks, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the useEffect above
  };

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const response = await fetchParks(nextPage, 20);
      setAllParks(prev => [...prev, ...response.data]);
      setDisplayedParks(prev => [...prev, ...response.data]);
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
      <Header />

      {/* Hero Section */}
      <section className="hero-section-new">
        <h1 className="hero-title-new">
          The largest USA platform for{' '}
          <span className="hero-title-highlight">dog parks</span>
        </h1>
        <p className="hero-subtitle-new">
          Discover the best dog parks across California for your furry friends
        </p>

        <div className="search-container-new">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              className="search-input-new"
              placeholder="Search by city, neighborhood or zip code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-btn-new">
              Search
            </button>
          </form>
        </div>

        <p className="hero-guarantee">
          <i className="bi bi-heart"></i> Find the perfect spot for your furry friend to play and socialize
        </p>
      </section>

      {/* Featured Parks Section - User Submitted */}
      <FeaturedParks />

      {/* Featured Cities Section */}
      {allParks.length > 0 && (
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

      {/* Featured Parks Section */}
      {(allParks.length > 0 || loadingMore) && searchTerm === '' && (
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

      {/* Search Results Section */}
      {searchTerm !== '' && (
        <section className="search-results-section">
          <div className="featured-parks-container">
            {filteredParks.length === 0 ? (
              <div className="no-results">
                <i className="bi bi-search"></i>
                <h3>No parks found</h3>
                <p>Try adjusting your search for &ldquo;{searchTerm}&rdquo;</p>
              </div>
            ) : (
              <>
                <h2 style={{ marginBottom: '30px', fontSize: '1.8rem', fontWeight: 600, color: '#2c3e50' }}>
                  Search Results for &ldquo;{searchTerm}&rdquo;
                </h2>
                <div className="parks-grid-new">
                  {filteredParks.map((park) => (
                    <ParkCard
                      key={park.id}
                      park={park}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* Cities Section */}
      <CitiesSection />

      {/* Footer */}
      <Footer />
    </>
  );
}
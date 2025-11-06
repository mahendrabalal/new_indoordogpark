'use client';

import { useState, useEffect } from 'react';
import { DogPark } from '@/types/dog-park';
import { fetchParks, filterParks } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CitiesSection from '@/components/CitiesSection';
import ParkCard from '@/components/ParkCard';

export default function Home() {
  const [allParks, setAllParks] = useState<DogPark[]>([]);
  const [filteredParks, setFilteredParks] = useState<DogPark[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadParks = async () => {
      try {
        const parks = await fetchParks();
        setAllParks(parks);
        setFilteredParks(parks);
      } catch (error) {
        console.error('Error loading parks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadParks();
  }, []);

  useEffect(() => {
    const filtered = filterParks(allParks, searchTerm, 'all');
    setFilteredParks(filtered);
  }, [allParks, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the useEffect above
  };

  const handleParkClick = (park: DogPark) => {
    // For now, just log - could open modal or navigate to detail page
    console.log('Park clicked:', park);
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
          The largest global platform for{' '}
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
              placeholder="Search by university, city or neighbourhood..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-btn-new">
              Search
            </button>
          </form>
        </div>

        <p className="hero-guarantee">
          <i className="bi bi-award"></i> Best price guaranteed. If you find it cheaper elsewhere, we'll refund the difference
        </p>
      </section>

      {/* Parks Grid Section */}
      <section className="parks-section">
        {filteredParks.length === 0 ? (
          <div className="no-results">
            <i className="bi bi-search"></i>
            <h3>No parks found</h3>
            <p>Try adjusting your search</p>
          </div>
        ) : (
          <div className="parks-grid-new">
            {filteredParks.map((park) => (
              <ParkCard
                key={park.id}
                park={park}
                onViewDetails={handleParkClick}
              />
            ))}
          </div>
        )}
      </section>

      {/* Cities Section */}
      <CitiesSection />

      {/* Footer */}
      <Footer />
    </>
  );
}

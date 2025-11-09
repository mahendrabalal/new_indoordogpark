'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { DogPark } from '@/types/dog-park';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Map from '@/components/Map';
import ParkCard from '@/components/ParkCard';
import TableOfContents from '@/components/TableOfContents';
import ParkTypeGuide from '@/components/ParkTypeGuide';
import FAQSection from '@/components/FAQSection';
import CityStats from '@/components/CityStats';
import { notFound } from 'next/navigation';
import { CityData } from '@/lib/cityData';

interface CityPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Client-side data loading functions
async function getParks(): Promise<DogPark[]> {
  try {
    const response = await fetch('/api/parks');
    if (!response.ok) throw new Error('Failed to fetch parks');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching parks data:', error);
    return [];
  }
}

function getCityBySlug(parks: DogPark[], slug: string) {
  // Group parks by city and find the matching city
  const cities = parks.reduce((acc, park) => {
    const cityKey = park.city?.toLowerCase().replace(/\s+/g, '-');
    if (cityKey && !acc[cityKey]) {
      acc[cityKey] = {
        name: park.city,
        slug: cityKey,
        state: park.state || 'CA',
        avgRating: 0,
        totalReviews: 0,
        parkCount: 0, // Initialize with 0, will be calculated later
        featuredImage: park.photo
      };
    }
    return acc;
  }, {} as Record<string, CityData>);

  
  return cities[slug] || null;
}

function getParksByCity(parks: DogPark[], cityName: string): DogPark[] {
  return parks.filter(park => park.city === cityName);
}

function getParksByType(parks: DogPark[]): Record<string, DogPark[]> {
  return parks.reduce((acc, park) => {
    const type = park.businessType || 'Unknown';
    if (!acc[type]) acc[type] = [];
    acc[type].push(park);
    return acc;
  }, {} as Record<string, DogPark[]>);
}

function getCityStatistics(cityParks: DogPark[]) {
  const totalParks = cityParks.length;
  const totalReviews = cityParks.reduce((sum, park) => sum + (park.userRatingsTotal || 0), 0);
  const avgRating = totalParks > 0 ? cityParks.reduce((sum, park) => sum + park.rating, 0) / totalParks : 0;

  return {
    totalParks,
    totalReviews,
    avgRating
  };
}

export default function CityPage(props: CityPageProps) {
  const [params, setParams] = useState<{ slug: string } | null>(null);
  const [city, setCity] = useState<CityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cityParks, setCityParks] = useState<DogPark[]>([]);
  const [parksByType, setParksByType] = useState<Record<string, DogPark[]>>({});
  const [stats, setStats] = useState<{ totalParks: number; totalReviews: number; avgRating: number }>({ totalParks: 0, totalReviews: 0, avgRating: 0 });

  useEffect(() => {
    const loadParams = async () => {
      try {
        const resolvedParams = await props.params;
        setParams(resolvedParams);
      } catch (err) {
        console.error('Error loading params:', err);
        setError('Failed to load page parameters');
        setLoading(false);
      }
    };

    loadParams();
  }, [props.params]);

  useEffect(() => {
    if (!params) return;

    const loadCityData = async () => {
      try {
        const parks = await getParks();
        const foundCity = getCityBySlug(parks, params.slug);

        if (!foundCity) {
          setError('City not found');
          setLoading(false);
          return;
        }

        // Calculate city statistics
        const cityParksData = getParksByCity(parks, foundCity.name);
        const parksByTypeData = getParksByType(cityParksData);
        const cityStats = getCityStatistics(cityParksData);

        // Update city with calculated stats
        foundCity.avgRating = cityStats.avgRating;
        foundCity.totalReviews = cityStats.totalReviews;

        setCity(foundCity);
        setCityParks(cityParksData);
        setParksByType(parksByTypeData);
        setStats(cityStats);
        setLoading(false);
      } catch (err) {
        console.error('Error loading city data:', err);
        setError('Failed to load city data');
        setLoading(false);
      }
    };

    loadCityData();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading city information...</div>
      </div>
    );
  }

  if (error || !city) {
    return notFound();
  }

  const featuredImage = city.featuredImage || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';

  const parkCategories = Object.entries(parksByType);

  // Table of contents items
  const tocItems = [
    { id: 'enhanced-hero', title: 'City Overview', level: 1 },
    { id: 'city-statistics', title: 'Statistics & Insights', level: 1 },
    { id: 'park-types-guide', title: 'Understanding Park Types', level: 1 },
    { id: 'city-map-section', title: 'Interactive Map', level: 1 },
    { id: 'park-listings', title: 'All Dog Parks', level: 1 },
    { id: 'planning-guide', title: 'Planning Your Visit', level: 1 },
    { id: 'neighborhood-guide', title: 'Neighborhood Guide', level: 1 },
    { id: 'faq-section', title: 'Frequently Asked Questions', level: 1 }
  ];

  return (
    <>
      <Header />

      {/* Table of Contents */}
      <TableOfContents items={tocItems} />

      <main>
        {/* Mobile TOC Button */}
        <div className="mobile-toc-button">
          <button
            onClick={() => {
              const toc = document.querySelector('.table-of-contents');
              if (toc) {
                toc.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="mobile-toc-trigger"
          >
            <i className="bi bi-list-ul"></i>
            <span>Contents</span>
          </button>
        </div>

        {/* Enhanced Hero Section */}
        <section id="enhanced-hero" className="enhanced-city-hero">
        <div className="hero-background">
          <Image
            src={featuredImage}
            alt={`${city.name}, ${city.state} - Dog Parks`}
            width={1400}
            height={600}
            className="hero-image"
            priority
          />
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-content">
          {/* Breadcrumbs */}
          <div className="hero-breadcrumbs">
            <Link href="/">Home</Link>
            <i className="bi bi-chevron-right"></i>
            <span>California Dog Parks</span>
            <i className="bi bi-chevron-right"></i>
            <span>{city.name}</span>
          </div>

          <div className="hero-text">
            <h1 className="hero-title">Complete Guide to Dog Parks in {city.name}, {city.state}</h1>
            <p className="hero-subtitle">
              Discover {stats.totalParks} amazing dog parks and dog-friendly spaces with insider tips,
              real-time data, and comprehensive guides for the perfect outing with your furry friend.
            </p>

            <div className="hero-stats">
              <div className="hero-stat">
                <i className="bi bi-geo-alt-fill"></i>
                <div>
                  <span className="stat-number">{stats.totalParks}</span>
                  <span className="stat-label">Dog Parks</span>
                </div>
              </div>
              <div className="hero-stat">
                <i className="bi bi-star-fill"></i>
                <div>
                  <span className="stat-number">{city.avgRating.toFixed(1)}</span>
                  <span className="stat-label">Avg Rating</span>
                </div>
              </div>
              <div className="hero-stat">
                <i className="bi bi-chat-dots-fill"></i>
                <div>
                  <span className="stat-number">{city.totalReviews.toLocaleString()}</span>
                  <span className="stat-label">Reviews</span>
                </div>
              </div>
              <div className="hero-stat">
                <i className="bi bi-types"></i>
                <div>
                  <span className="stat-number">{parkCategories.length}</span>
                  <span className="stat-label">Park Types</span>
                </div>
              </div>
            </div>

            <div className="hero-actions">
              <button
                onClick={() => document.getElementById('park-listings')?.scrollIntoView({ behavior: 'smooth' })}
                className="hero-cta primary"
              >
                <i className="bi bi-list-ul"></i>
                Browse All Parks
              </button>
              <button
                onClick={() => document.getElementById('city-statistics')?.scrollIntoView({ behavior: 'smooth' })}
                className="hero-cta secondary"
              >
                <i className="bi bi-graph-up"></i>
                View Statistics
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Statistics Section */}
      <CityStats parks={cityParks} cityName={city.name} />

      {/* Park Types Guide */}
      <ParkTypeGuide parksByType={parksByType} cityName={city.name} />

      {/* Interactive Map Section */}
      <section id="city-map-section" className="city-map-section">
        <div className="section-header">
          <span className="section-eyebrow">Interactive Map</span>
          <h2>Explore Dog Parks in {city.name}</h2>
          <p className="section-description">
            Navigate our interactive map to discover dog parks near you. Filter by amenities,
            check ratings, and plan your route for the perfect dog park adventure.
          </p>
        </div>

        <div className="map-container">
          <div className="map-wrapper">
            <Map parks={cityParks} />
          </div>
          <div className="map-sidebar">
            <div className="map-info-card">
              <h3>Map Features</h3>
              <ul>
                <li><i className="bi bi-check-circle-fill text-green-500"></i> Click markers for park details</li>
                <li><i className="bi bi-check-circle-fill text-green-500"></i> Filter by park type and amenities</li>
                <li><i className="bi bi-check-circle-fill text-green-500"></i> Check real-time availability</li>
                <li><i className="bi bi-check-circle-fill text-green-500"></i> Get directions to any park</li>
              </ul>
            </div>

            <div className="quick-filters">
              <h4>Quick Filters</h4>
              <div className="filter-pills">
                {parkCategories.map(([type, parks]) => (
                  <button key={type} className="filter-pill">
                    <span className="pill-count">{parks.length}</span>
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive City Overview */}
      <section id="planning-guide" className="planning-guide-section">
        <div className="section-header">
          <span className="section-eyebrow">Planning Resources</span>
          <h2>Your Complete Visit Planning Guide</h2>
          <p className="section-description">
            Everything you need to know for safe and enjoyable visits to {city.name}&rsquo;s dog parks.
          </p>
        </div>

        <div className="planning-grid">
          <div className="planning-card">
            <div className="planning-icon">
              <i className="bi bi-calendar-check"></i>
            </div>
            <h3>Best Times to Visit</h3>
            <p>Early mornings (6-9 AM) offer the best balance of socialization and manageable crowds.
            Weekday afternoons are quieter, perfect for dogs who prefer calm environments.</p>
            <div className="time-tips">
              <span className="time-tip">🟢 Quiet: 10 AM - 3 PM (Weekdays)</span>
              <span className="time-tip">🟡 Moderate: 4 PM - 7 PM (Weekdays)</span>
              <span className="time-tip">🔴 Busy: 6 AM - 9 AM, Weekends</span>
            </div>
          </div>

          <div className="planning-card">
            <div className="planning-icon">
              <i className="bi bi-backpack"></i>
            </div>
            <h3>What to Bring</h3>
            <ul>
              <li>Leash (for entering/exiting)</li>
              <li>Water and portable bowl</li>
              <li>Poop bags (always bring extra!)</li>
              <li>Toys (check park rules first)</li>
              <li>Treats for training and rewards</li>
              <li>First-aid supplies</li>
            </ul>
          </div>

          <div className="planning-card">
            <div className="planning-icon">
              <i className="bi bi-shield-check"></i>
            </div>
            <h3>Safety Guidelines</h3>
            <ul>
              <li>Keep your dog&rsquo;s vaccinations current</li>
              <li>Supervise your dog at all times</li>
              <li>Remove aggressive dogs immediately</li>
              <li>Clean up after your dog</li>
              <li>Follow all posted rules and regulations</li>
              <li>Respect other dogs and owners</li>
            </ul>
          </div>

          <div className="planning-card">
            <div className="planning-icon">
              <i className="bi bi-info-circle"></i>
            </div>
            <h3>Local Regulations</h3>
            <p>Most {city.name} dog parks require:</p>
            <ul>
              <li>Current dog license</li>
              <li>Proof of vaccinations</li>
              <li>Dogs under voice control</li>
              <li>Maximum 3 dogs per person</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Enhanced Park Listings */}
      <section id="park-listings" className="enhanced-park-listings">
        <div className="section-header">
          <span className="section-eyebrow">Directory</span>
          <h2>All Dog Parks in {city.name}</h2>
          <p className="section-description">
            Complete directory of all {stats.totalParks} dog parks and dog-friendly establishments in {city.name}.
          </p>
        </div>

        {parkCategories.map(([type, parks]) => (
          <div key={type} className="park-category-section" id={`${type.toLowerCase().replace(/\s+/g, '-')}-parks`}>
            <div className="category-header">
              <div>
                <h3>{type}s in {city.name}</h3>
                <p>
                  {parks.length} {type.toLowerCase()}(s) with an average rating of{' '}
                  {(parks.reduce((sum, p) => sum + p.rating, 0) / parks.length).toFixed(1)} stars
                </p>
              </div>
              <span className="category-count">{parks.length} locations</span>
            </div>

            <div className="parks-enhanced-grid">
              {parks.map((park) => (
                <ParkCard
                  key={park.id}
                  park={park}
                />
              ))}
            </div>

            {parks.length === 0 && (
              <div className="no-parks-message">
                <i className="bi bi-inbox"></i>
                <p>No {type.toLowerCase()}s found in {city.name}</p>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* FAQ Section */}
      <FAQSection cityName={city.name} parkCount={stats.totalParks} />

      {/* Related Resources */}
      <section className="related-resources">
        <div className="section-header">
          <span className="section-eyebrow">Additional Resources</span>
          <h2>Explore More Dog Parks</h2>
          <p className="section-description">
            Discover dog parks in nearby cities and explore specialized guides for different needs.
          </p>
        </div>

        <div className="resources-grid">
          <Link href="/" className="resource-card">
            <div className="resource-icon">
              <i className="bi bi-house-door"></i>
            </div>
            <h3>Back to Home</h3>
            <p>Explore all California dog parks</p>
            <i className="bi bi-arrow-right"></i>
          </Link>

          <Link href="/?search=" className="resource-card">
            <div className="resource-icon">
              <i className="bi bi-search"></i>
            </div>
            <h3>Advanced Search</h3>
            <p>Find parks by specific amenities</p>
            <i className="bi bi-arrow-right"></i>
          </Link>

          <Link href="/contact" className="resource-card">
            <div className="resource-icon">
              <i className="bi bi-envelope"></i>
            </div>
            <h3>Contact Us</h3>
            <p>Share your experiences or ask questions</p>
            <i className="bi bi-arrow-right"></i>
          </Link>

          <Link href="/signup" className="resource-card">
            <div className="resource-icon">
              <i className="bi bi-person-plus"></i>
            </div>
            <h3>Join Community</h3>
            <p>Connect with local dog owners</p>
            <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </section>
      </main>

      <Footer />

      <style jsx global>{`
        /* Enhanced Hero Styles */
        .enhanced-city-hero {
          position: relative;
          height: 60vh;
          min-height: 400px;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
        }

        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg,
            rgba(124, 58, 237, 0.8) 0%,
            rgba(168, 85, 247, 0.6) 50%,
            rgba(0, 0, 0, 0.7) 100%
          );
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          color: white;
        }

        .hero-breadcrumbs {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
          font-size: 13px;
        }

        .hero-breadcrumbs a {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .hero-breadcrumbs a:hover {
          color: white;
        }

        .hero-breadcrumbs i {
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
        }

        .hero-title {
          font-size: clamp(32px, 4.5vw, 48px);
          font-weight: 700;
          line-height: 1.1;
          margin: 0 0 12px;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .hero-subtitle {
          font-size: clamp(16px, 2vw, 20px);
          line-height: 1.4;
          margin: 0 0 24px;
          color: rgba(255, 255, 255, 0.9);
          max-width: 700px;
        }

        .hero-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 20px;
          margin-bottom: 28px;
          max-width: 550px;
        }

        .hero-stat {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .hero-stat i {
          font-size: 20px;
          color: rgba(255, 255, 255, 0.9);
        }

        .stat-number {
          display: block;
          font-size: 24px;
          font-weight: 700;
          line-height: 1;
        }

        .stat-label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }

        .hero-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .hero-cta.primary {
          background: white;
          color: #7c3aed;
        }

        .hero-cta.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .hero-cta.secondary {
          background: transparent;
          color: white;
          border: 2px solid white;
        }

        .hero-cta.secondary:hover {
          background: white;
          color: #7c3aed;
        }

        /* City Map Section */
        .city-map-section {
          padding: 50px 20px;
          background: white;
        }

        .map-container {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 24px;
        }

        .map-wrapper {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
          height: 420px;
        }

        .map-sidebar {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .map-info-card {
          background: #f9fafb;
          padding: 18px;
          border-radius: 10px;
        }

        .map-info-card h3 {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 12px;
        }

        .map-info-card ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 8px;
        }

        .map-info-card li {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #4b5563;
        }

        .quick-filters h4 {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 8px;
        }

        .filter-pills {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .filter-pill {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 13px;
          color: #374151;
          font-weight: 500;
        }

        .filter-pill:hover {
          border-color: #7c3aed;
          color: #7c3aed;
        }

        .pill-count {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 24px;
          height: 24px;
          background: #f3f4f6;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
        }

        .filter-pill:hover .pill-count {
          background: #ede9fe;
          color: #7c3aed;
        }

        /* Planning Guide Section */
        .planning-guide-section {
          padding: 50px 20px;
          background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
        }

        .planning-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .planning-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease;
        }

        .planning-card:hover {
          transform: translateY(-5px);
        }

        .planning-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 20px;
          margin-bottom: 12px;
        }

        .planning-card h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 8px;
        }

        .planning-card p {
          color: #6b7280;
          line-height: 1.5;
          margin: 0 0 12px;
          font-size: 14px;
        }

        .planning-card ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 6px;
        }

        .planning-card li {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          color: #4b5563;
          line-height: 1.4;
          font-size: 13px;
        }

        .planning-card li::before {
          content: "✓";
          color: #10b981;
          font-weight: 600;
          flex-shrink: 0;
        }

        .time-tips {
          display: grid;
          gap: 8px;
        }

        .time-tip {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          padding: 8px 12px;
          background: #f9fafb;
          border-radius: 6px;
        }

        /* Enhanced Park Listings */
        .enhanced-park-listings {
          padding: 50px 20px;
          background: white;
        }

        .park-category-section {
          max-width: 1400px;
          margin: 0 auto 40px;
        }

        .category-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f3f4f6;
        }

        .category-header h3 {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 6px;
        }

        .category-header p {
          color: #6b7280;
          margin: 0;
          font-size: 14px;
        }

        .category-count {
          padding: 6px 12px;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: white;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 600;
        }

        .parks-enhanced-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .no-parks-message {
          text-align: center;
          padding: 40px 20px;
          color: #6b7280;
        }

        .no-parks-message i {
          font-size: 36px;
          color: #d1d5db;
          margin-bottom: 12px;
        }

        /* Related Resources Section */
        .related-resources {
          padding: 50px 20px;
          background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
        }

        .resources-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .resource-card {
          display: flex;
          flex-direction: column;
          background: white;
          border-radius: 12px;
          padding: 22px;
          text-decoration: none;
          color: inherit;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .resource-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .resource-icon {
          width: 42px;
          height: 42px;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 18px;
          margin-bottom: 12px;
        }

        .resource-card h3 {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 6px;
        }

        .resource-card p {
          color: #6b7280;
          line-height: 1.4;
          margin: 0 0 12px;
          flex: 1;
          font-size: 14px;
        }

        .resource-card i:last-child {
          color: #7c3aed;
          font-size: 18px;
          align-self: flex-end;
        }

        /* Main content spacing for TOC */
        main {
          padding-left: 320px; /* Account for TOC width + gap */
          transition: padding-left 0.3s ease;
        }

        /* Mobile TOC Button */
        .mobile-toc-button {
          display: none;
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 50;
        }

        .mobile-toc-trigger {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: white;
          border: none;
          border-radius: 20px;
          box-shadow: 0 3px 15px rgba(124, 58, 237, 0.3);
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .mobile-toc-trigger:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 30px rgba(124, 58, 237, 0.4);
        }

        /* Responsive Design - Improved Breakpoints */
        @media (max-width: 1200px) {
          main {
            padding-left: 300px; /* Slightly reduce padding for medium screens */
          }
        }

        @media (max-width: 1024px) {
          main {
            padding-left: 20px; /* Reset padding on smaller screens */
          }

          .mobile-toc-button {
            display: block;
          }
        }

        @media (max-width: 768px) {
          .map-container {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .map-wrapper {
            height: 350px;
          }

          .hero-stats {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }

          .hero-actions {
            flex-direction: column;
            gap: 8px;
          }

          .hero-cta {
            width: 100%;
            justify-content: center;
          }

          .category-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .parks-enhanced-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
      `}</style>
    </>
  );
}

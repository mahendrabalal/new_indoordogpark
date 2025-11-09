'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { DogPark } from '@/types/dog-park';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ParkMap from '@/components/ParkMap';
import { generateParkSchema } from '@/lib/metadata';
import FavoriteButton from '@/components/FavoriteButton';
import ReviewSection from '@/components/ReviewSection';

export default function ParkDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [park, setPark] = useState<DogPark | null>(null);
  const [nearbyParks, setNearbyParks] = useState<DogPark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadParkData = async () => {
      try {
        // First, try to find the park in the API (which includes both static and user-submitted parks)
        const apiResponse = await fetch('/api/parks?page=1&limit=1000');
        if (apiResponse.ok) {
          const apiData = await apiResponse.json();
          const apiParks: DogPark[] = apiData.data || [];

          // Find the park by slug or ID in the merged data
          const foundPark = apiParks.find(p => p.slug === slug || p.id === slug);

          if (foundPark) {
            setPark(foundPark);

            // Find nearby parks in the same city from the API data
            const nearby = apiParks
              .filter(p => p.id !== foundPark.id && p.city === foundPark.city)
              .slice(0, 4);
            setNearbyParks(nearby);
            setLoading(false);
            return;
          }
        }

        // Fallback: Check static dataset only
        const staticResponse = await fetch('/data/california.json');
        if (staticResponse.ok) {
          const staticParks: DogPark[] = await staticResponse.json();

          const foundPark = staticParks.find(p => p.slug === slug || p.id === slug);
          setPark(foundPark || null);

          if (foundPark) {
            const nearby = staticParks
              .filter(p => p.id !== foundPark.id && p.city === foundPark.city)
              .slice(0, 4);
            setNearbyParks(nearby);
          }
        }
      } catch (error) {
        console.error('Error loading park:', error);
      } finally {
        setLoading(false);
      }
    };

    loadParkData();
  }, [slug]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="loading">
          <i className="bi bi-hourglass-split"></i> Loading park details...
        </div>
      </>
    );
  }

  if (!park) {
    return (
      <>
        <Header />
        <div className="park-not-found">
          <h1>Park Not Found</h1>
          <p>Sorry, we couldn&rsquo;t find the park you&rsquo;re looking for.</p>
          <Link href="/" className="btn-primary">Back to Home</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      {/* SEO Schema Markup */}
      <Script
        id="park-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateParkSchema(park)),
        }}
      />

      <Header />

      <main className="park-detail-page">
        {/* Hero Section with Image */}
        <section className="park-hero">
          <div className="park-hero-image">
            <Image
              src={park.photo || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5'}
              alt={`${park.name} in ${park.city}, California`}
              width={1400}
              height={500}
              className="hero-image"
              priority
            />
          </div>
          <div className="park-hero-content">
            <div className="container">
              <div className="breadcrumbs">
                <Link href="/">Home</Link>
                <i className="bi bi-chevron-right"></i>
                <Link href={`/cities/${park.city.toLowerCase().replace(/\s+/g, '-')}`}>
                  {park.city}
                </Link>
                <i className="bi bi-chevron-right"></i>
                <span>{park.name}</span>
              </div>
              <h1 className="park-title">{park.name}</h1>
              <p className="park-subtitle">{park.businessType} in {park.city}, California</p>

              {/* Source Badges */}
              {park.listingType === 'featured' && (
                <div className="park-badges">
                  <span className="featured-badge-large">
                    <i className="bi bi-star-fill"></i> FEATURED LISTING
                  </span>
                </div>
              )}
              {park.source === 'user_submitted' && (
                <div className="park-badges">
                  <span className="community-badge">
                    <i className="bi bi-people-fill"></i> COMMUNITY ADDED
                  </span>
                </div>
              )}

              <div className="park-quick-info">
                <span className="rating">
                  <i className="bi bi-star-fill"></i> {park.rating} ({park.reviewCount} reviews)
                </span>
                <span className="location">
                  <i className="bi bi-geo-alt-fill"></i> {park.city}, CA
                </span>
                <FavoriteButton
                  parkId={park.id}
                  parkSlug={park.slug}
                  className="favorite-btn-quick-info"
                />
                {park.phone && (
                  <span className="phone">
                    <i className="bi bi-telephone-fill"></i> {park.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="container park-detail-container">
          <div className="park-content-grid">
            {/* Main Content */}
            <div className="park-main-content">
              {/* Description */}
              <section className="content-section">
                <h2>About {park.name}</h2>
                <p className="park-description">{park.description}</p>
              </section>

              {/* Amenities & Features */}
              {park.amenities && (
                <section className="content-section amenities-section">
                  <h2>Amenities & Features</h2>
                  <div className="amenities-grid">
                    {Object.entries(park.amenities).map(([key, value]) => {
                      if (value === true) {
                        return (
                          <div key={key} className="amenity-item">
                            <i className="bi bi-check-circle-fill"></i>
                            <span>{formatAmenityName(key)}</span>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </section>
              )}

              {/* Photo Gallery */}
              {park.photos && park.photos.length > 0 && (
                <section className="content-section photo-gallery-section">
                  <h2>Photo Gallery</h2>
                  <div className="photo-gallery">
                    {park.photos.slice(0, 6).map((photo, index) => (
                      <div key={index} className="gallery-item">
                        <Image
                          src={photo.url}
                          alt={photo.caption || `${park.name} photo ${index + 1}`}
                          width={300}
                          height={200}
                          className="gallery-image"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Driving Directions */}
              <section className="content-section directions-section">
                <h2>How to Get Here</h2>
                <p className="directions-intro">
                  {park.name} is conveniently located at {park.full_address}.
                </p>
                <div className="directions-list">
                  <div className="direction-item">
                    <strong>From Downtown {park.city}:</strong>
                    <p>Head to {park.street} and look for our park near major landmarks in the area.</p>
                  </div>
                  <div className="direction-item">
                    <strong>Parking:</strong>
                    <p>Free parking is typically available near the park. Check local signage for specific parking regulations.</p>
                  </div>
                </div>
              </section>

              {/* FAQ Section */}
              <section className="content-section faq-section">
                <h2>Frequently Asked Questions</h2>
                <div className="faq-list">
                  <div className="faq-item">
                    <h3>What are the hours for {park.name}?</h3>
                    <p>
                      {park.hours24x7
                        ? 'This park is open 24 hours a day, 7 days a week.'
                        : park.openingHours
                          ? Object.entries(park.openingHours).map(([day, hours]) => (
                              <span key={day}>{day}: {hours}<br /></span>
                            ))
                          : 'Please contact the park directly for current hours of operation.'}
                    </p>
                  </div>
                  <div className="faq-item">
                    <h3>Is there an entrance fee?</h3>
                    <p>
                      {park.pricing?.isFree
                        ? 'No, this park is free to visit!'
                        : park.pricing?.dropInFee
                          ? `There is a drop-in fee of $${park.pricing.dropInFee}.`
                          : 'Please check with the park for current pricing information.'}
                    </p>
                  </div>
                  <div className="faq-item">
                    <h3>What amenities are available at {park.name}?</h3>
                    <p>
                      This {park.businessType.toLowerCase()} offers {
                        park.amenities
                          ? Object.entries(park.amenities)
                              .filter(([, value]) => value === true)
                              .map(([key]) => formatAmenityName(key).toLowerCase())
                              .join(', ')
                          : 'various amenities for your furry friends'
                      }.
                    </p>
                  </div>
                  <div className="faq-item">
                    <h3>Are there dog parks near {park.city} similar to {park.name}?</h3>
                    <p>
                      Yes! We have {nearbyParks.length} other dog parks in {park.city}.
                      Check out our recommendations below for more great options in the area.
                    </p>
                  </div>
                </div>
              </section>

              {/* Reviews Section */}
              <ReviewSection parkId={park.id} />
            </div>

            {/* Sidebar */}
            <aside className="park-sidebar">
              {/* NAP Card */}
              <div className="sidebar-card nap-card">
                <h3>Visit Information</h3>
                <div className="nap-info">
                  <div className="nap-item">
                    <i className="bi bi-geo-alt-fill"></i>
                    <div>
                      <strong>Address</strong>
                      <p>{park.full_address}</p>
                    </div>
                  </div>
                  {park.phone && (
                    <div className="nap-item">
                      <i className="bi bi-telephone-fill"></i>
                      <div>
                        <strong>Phone</strong>
                        <p><a href={`tel:${park.phone}`}>{park.phone}</a></p>
                      </div>
                    </div>
                  )}
                  {park.website && (
                    <div className="nap-item">
                      <i className="bi bi-globe"></i>
                      <div>
                        <strong>Website</strong>
                        <p>
                          <a href={park.website} target="_blank" rel="noopener noreferrer">
                            Visit Website
                          </a>
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hours */}
                {park.openingHours && (
                  <div className="hours-section">
                    <strong>Hours of Operation</strong>
                    <ul className="hours-list">
                      {Object.entries(park.openingHours).map(([day, hours]) => (
                        <li key={day}>
                          <span className="day">{day}</span>
                          <span className="hours">{hours}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {park.hours24x7 && (
                  <div className="hours-section">
                    <strong>Hours of Operation</strong>
                    <p className="hours-24-7">Open 24/7</p>
                  </div>
                )}

                {/* CTAs */}
                <div className="sidebar-ctas">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(park.full_address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cta-button cta-primary"
                  >
                    <i className="bi bi-map"></i> Get Directions
                  </a>
                  {park.phone && (
                    <a href={`tel:${park.phone}`} className="cta-button cta-secondary">
                      <i className="bi bi-telephone"></i> Call Now
                    </a>
                  )}
                  {park.website && (
                    <a
                      href={park.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cta-button cta-secondary"
                    >
                      <i className="bi bi-box-arrow-up-right"></i> Visit Website
                    </a>
                  )}
                </div>
              </div>

              {/* Map Card */}
              {park.latitude && park.longitude && (
                <div className="sidebar-card map-card">
                  <h3>Location Map</h3>
                  <ParkMap park={park} />
                </div>
              )}
            </aside>
          </div>

          {/* Nearby Parks */}
          {nearbyParks.length > 0 && (
            <section className="nearby-parks-section">
              <h2>Other Dog Parks in {park.city}</h2>
              <p className="nearby-intro">
                Explore more dog-friendly locations near {park.name}
              </p>
              <div className="nearby-parks-grid">
                {nearbyParks.map(nearbyPark => (
                  <Link
                    key={nearbyPark.id}
                    href={`/parks/${nearbyPark.slug || nearbyPark.id}`}
                    className="nearby-park-card"
                  >
                    <div className="nearby-park-image">
                      <Image
                        src={nearbyPark.photo || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5'}
                        alt={nearbyPark.name}
                        width={300}
                        height={200}
                      />
                    </div>
                    <div className="nearby-park-info">
                      <h3>{nearbyPark.name}</h3>
                      <p className="nearby-park-type">{nearbyPark.businessType}</p>
                      <div className="nearby-park-meta">
                        <span className="rating">
                          <i className="bi bi-star-fill"></i> {nearbyPark.rating}
                        </span>
                        <span className="distance">{nearbyPark.city}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

// Helper function to format amenity names
function formatAmenityName(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

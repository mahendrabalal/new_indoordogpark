import dynamicImport from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FavoriteButton from '@/components/FavoriteButton';
import ReviewSection from '@/components/ReviewSection';
import { getAllStaticParks, getParkBySlug } from '@/lib/parks-data';
import { generateFAQSchema, generateParkMetadata, generateParkSchema, generateReviewSchemas } from '@/lib/metadata';
import { getParkReviews } from '@/lib/reviews-data';

const ParkMap = dynamicImport(() => import('@/components/ParkMap'), {
  ssr: false,
});

type ParkPageProps = {
  params: {
    slug: string;
  };
};

function getStateName(abbr: string | undefined): string {
  if (!abbr) return 'California';
  const stateMap: Record<string, string> = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
    'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
    'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
    'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
    'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
    'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
    'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
    'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
    'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
    'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
    'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
    'WI': 'Wisconsin', 'WY': 'Wyoming'
  };
  // If it's already a full name (longer than 2 chars), return as-is
  if (abbr.length > 2) return abbr;
  return stateMap[abbr.toUpperCase()] || abbr;
}

function getStateAbbr(state: string | undefined): string {
  if (!state) return 'CA';
  // If it's already an abbreviation (2 chars), return as-is
  if (state.length === 2) return state.toUpperCase();
  // Otherwise convert full name to abbreviation
  const abbrMap: Record<string, string> = {
    'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
    'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE',
    'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID',
    'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS',
    'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
    'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
    'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV',
    'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
    'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK',
    'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
    'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT',
    'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV',
    'Wisconsin': 'WI', 'Wyoming': 'WY'
  };
  return abbrMap[state] || state.substring(0, 2).toUpperCase();
}

export const dynamic = 'force-dynamic'; // Reviews are dynamic, so pages must be dynamic too

export async function generateStaticParams() {
  const parks = await getAllStaticParks();
  return parks.map((park) => ({
    slug: park.slug || park.id,
  }));
}

export async function generateMetadata({ params }: ParkPageProps): Promise<Metadata> {
  const park = await getParkBySlug(params.slug);
  if (!park) {
    return {};
  }
  return generateParkMetadata(park);
}

export default async function ParkDetailPage({ params }: ParkPageProps) {
  const park = await getParkBySlug(params.slug);

  if (!park) {
    notFound();
  }

  const allParks = await getAllStaticParks();
  const nearbyParks = allParks
    .filter((p) => p.id !== park.id && p.city === park.city)
    .slice(0, 4);

  // Fetch approved reviews for structured data
  const reviews = await getParkReviews(park.id);
  const reviewSchemas = generateReviewSchemas(reviews, park);

  const parkSchema = generateParkSchema(park);
  const stateName = getStateName(park.state);
  const descriptionText =
    park.description?.trim() ||
    `Learn more about ${park.name}, a ${park.businessType.toLowerCase()} located in ${park.city}, ${stateName}.`;
  const descriptionParagraphs = descriptionText.split(/\n\s*\n/).filter(Boolean);
  const faqItems =
    park.faqs && park.faqs.length > 0
      ? park.faqs
      : [
          {
            question: `What are the hours for ${park.name}?`,
            answer:
              'Please contact the park directly for current hours of operation. Our team keeps the hours updated on Google Maps and social channels.',
          },
          {
            question: 'Is there an entrance fee?',
            answer: 'Please check with the park for current pricing information.',
          },
          {
            question: 'What amenities are available?',
            answer: 'This dog park offers various amenities for your furry friends.',
          },
          {
            question: 'Are there similar dog parks nearby?',
            answer: `Yes! We have ${nearbyParks.length} other dog parks in ${park.city}. Explore the local recommendations below.`,
          },
        ];
  const faqSchema = park.faqs && park.faqs.length > 0 ? generateFAQSchema(park.faqs) : null;

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(parkSchema) }}
      />
      {/* Add Review schemas with proper itemReviewed fields */}
      {reviewSchemas.map((reviewSchema, index) => (
        <script
          key={`review-${index}`}
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
        />
      ))}
      {faqSchema && (
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <Header />

      <main className="park-detail-page">
        <section className="park-hero">
          <div className="park-hero-image">
            <Image
              src={park.photo || park.photos?.[0]?.url || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5'}
              alt={`${park.name} in ${park.city}, ${stateName}`}
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
              <p className="park-subtitle">
                {park.businessType} in {park.city}, {stateName}
              </p>

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
                  <i className="bi bi-geo-alt-fill"></i> {park.city}, {getStateAbbr(park.state)}
                </span>
                <FavoriteButton 
                  parkId={park.id} 
                  parkSlug={park.slug} 
                  className="favorite-btn-quick-info"
                  aria-label={`Toggle favorite for ${park.name}`}
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
            <div className="park-main-content">
              <section className="content-section">
                <h2>About {park.name}</h2>
                <div className="park-description">
                  {descriptionParagraphs.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </section>

              {park.amenities && (
                <section className="content-section amenities-section">
                  <h2>Amenities & Features</h2>
                  <div className="amenities-grid">
                    {Object.entries(park.amenities)
                      .filter(([, value]) => value === true)
                      .map(([key]) => (
                        <div key={key} className="amenity-item">
                          <i className="bi bi-check-circle-fill"></i>
                          <span>{formatAmenityName(key)}</span>
                        </div>
                      ))}
                  </div>
                </section>
              )}

              {park.photos && park.photos.length > 0 && (
                <section className="content-section photo-gallery-section">
                  <h2>Photo Gallery</h2>
                  <div className="photo-gallery">
                    {park.photos.slice(0, 6).map((photo, index) => (
                      <div key={photo.url ?? index} className="gallery-item">
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

              <section className="content-section directions-section">
                <h2>How to Get Here</h2>
                <p className="directions-intro">
                  {park.name} is conveniently located at {park.full_address}.
                </p>
                <div className="directions-list">
                  <div className="direction-item">
                    <strong>From Downtown {park.city}:</strong>
                    <p>Head to {park.street} and look for this park near key neighborhood landmarks.</p>
                  </div>
                  <div className="direction-item">
                    <strong>Parking:</strong>
                    <p>Free parking is typically available near the park. Check local signage for specific regulations.</p>
                  </div>
                </div>
              </section>

              <section className="content-section faq-section">
                <h2>Frequently Asked Questions</h2>
                <div className="faq-list">
                  {faqItems.map((faq) => (
                    <div key={faq.question} className="faq-item">
                      <h3>{faq.question}</h3>
                      <p>{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>

              <ReviewSection parkId={park.id} />
            </div>

            <aside className="park-sidebar">
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
                        <p>
                          <a href={`tel:${park.phone}`}>{park.phone}</a>
                        </p>
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
                    <a href={park.website} target="_blank" rel="noopener noreferrer" className="cta-button cta-secondary">
                      <i className="bi bi-box-arrow-up-right"></i> Visit Website
                    </a>
                  )}
                </div>
              </div>

              {park.latitude && park.longitude && (
                <div className="sidebar-card map-card">
                  <h3>Location Map</h3>
                  <ParkMap park={park} />
                </div>
              )}
            </aside>
          </div>

          {nearbyParks.length > 0 && (
            <section className="nearby-parks-section">
              <h2>Other Dog Parks in {park.city}</h2>
              <p className="nearby-intro">Explore more dog-friendly locations near {park.name}.</p>
              <div className="nearby-parks-grid">
                {nearbyParks.map((nearbyPark) => (
                  <Link key={nearbyPark.id} href={`/parks/${nearbyPark.slug || nearbyPark.id}`} className="nearby-park-card">
                    <div className="nearby-park-image">
                      <Image
                        src={nearbyPark.photo || nearbyPark.photos?.[0]?.url || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5'}
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

function formatAmenityName(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

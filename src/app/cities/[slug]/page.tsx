'use client';

import Head from 'next/head';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DogPark } from '@/types/dog-park';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Map from '@/components/Map';
import ParkCard from '@/components/ParkCard';
import TableOfContents from '@/components/TableOfContents';
import ParkTypeGuide from '@/components/ParkTypeGuide';
import FAQSection from '@/components/FAQSection';
import CityStats from '@/components/CityStats';
import { CityData } from '@/lib/cityData';

interface CityPageProps {
  params: Promise<{
    slug: string;
  }>;
}

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
  const cities = parks.reduce((acc, park) => {
    const cityKey = park.city?.toLowerCase().replace(/\s+/g, '-');
    if (cityKey && !acc[cityKey]) {
      acc[cityKey] = {
        name: park.city,
        slug: cityKey,
        state: park.state || 'CA',
        avgRating: 0,
        totalReviews: 0,
        parkCount: 0,
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

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}

function getCollectionDescription(type: string, cityName: string) {
  switch (type) {
    case 'Dog Park':
      return `Open-air off-leash spaces across ${cityName} with plenty of room to sprint, sniff, and socialize.`;
    case 'Indoor Dog Park':
      return `Climate-controlled play zones that keep pups moving year-round—perfect for rainy days or hot afternoons.`;
    case 'Dog-Friendly Establishment':
      return `Coffee shops, breweries, and community hubs that welcome well-mannered pups alongside their people.`;
    default:
      return `Community-loved spaces designed for safe play and connection throughout ${cityName}.`;
  }
}

export default function CityPage(props: CityPageProps) {
  const [params, setParams] = useState<{ slug: string } | null>(null);
  const [city, setCity] = useState<CityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cityParks, setCityParks] = useState<DogPark[]>([]);
  const [parksByType, setParksByType] = useState<Record<string, DogPark[]>>({});
  const [stats, setStats] = useState<{ totalParks: number; totalReviews: number; avgRating: number }>({
    totalParks: 0,
    totalReviews: 0,
    avgRating: 0
  });

  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolved = await props.params;
        setParams(resolved);
      } catch (err) {
        console.error('Error loading params:', err);
        setError('Failed to load page parameters');
        setLoading(false);
      }
    };

    resolveParams();
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

        const cityParksData = getParksByCity(parks, foundCity.name);
        const parksByTypeData = getParksByType(cityParksData);
        const cityStats = getCityStatistics(cityParksData);

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white">
        <p className="text-lg font-semibold text-slate-600">Loading city insights…</p>
      </div>
    );
  }

  if (error || !city) {
    return notFound();
  }

  const featuredImage =
    city.featuredImage ||
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';

  const parkCategories = Object.entries(parksByType);

  const topCategory = parkCategories.length
    ? parkCategories.reduce((largest, current) => (current[1].length > largest[1].length ? current : largest))
    : null;

  const featuredParks = [...cityParks]
    .filter((park) => typeof park.rating === 'number')
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3);

  const indoorCount = parksByType['Indoor Dog Park']?.length || 0;
  const indoorShare = stats.totalParks > 0 ? Math.round((indoorCount / stats.totalParks) * 100) : 0;

  const heroChips = [
    { label: 'Verified parks', value: formatNumber(stats.totalParks) },
    { label: 'Avg rating', value: `${city.avgRating.toFixed(1)} / 5` },
    { label: 'Park types', value: parkCategories.length.toString() },
    { label: 'Local reviews', value: formatNumber(stats.totalReviews) }
  ];

  const citySlug = params?.slug ?? '';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://indoordogpark.com';
  const canonicalUrl = `${siteUrl}/cities/${citySlug}`;
  const cityTitle = `Complete Dog Park Guide: ${city.name}, ${city.state}`;
  const pageDescription = `Discover ${stats.totalParks} dog parks, indoor runs, and pet-friendly hangouts in ${city.name}. Compare ratings, amenities, and plan visits with live filters and interactive maps.`;

  const structuredPlaces = cityParks.slice(0, 10).map((park) => {
    const place: Record<string, unknown> = {
      '@type': 'Place',
      name: park.name,
      address: park.full_address || park.address,
      url: park.website,
      telephone: park.phone
    };

    if (park.rating) {
      place.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: park.rating,
        reviewCount: park.userRatingsTotal || park.reviewCount || 0
      };
    }

    if (park.latitude && park.longitude) {
      place.geo = {
        '@type': 'GeoCoordinates',
        latitude: park.latitude,
        longitude: park.longitude
      };
    }

    return place;
  });

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'City',
    name: `${city.name}, ${city.state}`,
    description: pageDescription,
    url: canonicalUrl,
    image: featuredImage,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: city.avgRating.toFixed(1),
      reviewCount: stats.totalReviews
    },
    containsPlace: structuredPlaces
  };

  const tocItems = [
    { id: 'city-hero', title: 'City Overview', level: 1 },
    { id: 'city-insights', title: 'Insights & Scores', level: 1 },
    { id: 'park-collections', title: 'Park Collections', level: 1 },
    { id: 'park-types-guide', title: 'Park Type Guide', level: 1 },
    { id: 'map-and-neighborhoods', title: 'Map & Neighborhoods', level: 1 },
    { id: 'planning-essentials', title: 'Planning Essentials', level: 1 },
    { id: 'park-directory', title: 'Full Directory', level: 1 },
    { id: 'faq-section', title: 'FAQs', level: 1 },
    { id: 'related-resources', title: 'More Resources', level: 1 }
  ];

  return (
    <>
      <Head>
        <title>{cityTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={cityTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={featuredImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <Header />
      <TableOfContents items={tocItems} />

      <main className="city-page-layout">
        <div className="mobile-toc-button">
          <button
            onClick={() => {
              const toc = document.querySelector('.table-of-contents');
              toc?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="mobile-toc-trigger"
          >
            <i className="bi bi-list-ul" />
            <span>Contents</span>
          </button>
        </div>

        <section id="city-hero" className="city-hero-section">
          <div className="section-shell city-hero-shell">
            <div className="city-hero-copy">
              <div className="hero-breadcrumbs">
                <Link href="/">Home</Link>
                <i className="bi bi-chevron-right" />
                <span>California Dog Parks</span>
                <i className="bi bi-chevron-right" />
                <strong>{city.name}</strong>
              </div>
              <p className="hero-eyebrow">City spotlight</p>
              <h1>Complete dog park playbook for {city.name}, {city.state}</h1>
              <p className="hero-description">
                Navigate {stats.totalParks} curated dog parks, {parkCategories.length} experience types, and {formatNumber(stats.totalReviews)} local reviews.
                Build the perfect outing with design-forward data, insider planning tips, and an interactive map built for modern pet parents.
              </p>
              <div className="hero-chip-row">
                {heroChips.map((chip) => (
                  <div key={chip.label} className="hero-chip">
                    <span className="chip-value">{chip.value}</span>
                    <span className="chip-label">{chip.label}</span>
                  </div>
                ))}
              </div>
              <div className="hero-metrics">
                <div className="hero-metric">
                  <span className="metric-label">City score</span>
                  <span className="metric-value">{city.avgRating.toFixed(1)}</span>
                  <span className="metric-caption">From {formatNumber(stats.totalReviews)} reviews</span>
                </div>
                <div className="hero-metric">
                  <span className="metric-label">Indoor coverage</span>
                  <span className="metric-value">{indoorShare}%</span>
                  <span className="metric-caption">{indoorCount} climate-controlled spots</span>
                </div>
                <div className="hero-metric">
                  <span className="metric-label">Top park type</span>
                  <span className="metric-value">{topCategory?.[0] || 'Dog Park'}</span>
                  <span className="metric-caption">
                    {topCategory ? `${topCategory[1].length} listings` : 'Updated weekly'}
                  </span>
                </div>
              </div>
              <div className="hero-cta-row">
                <button
                  className="hero-cta primary"
                  onClick={() => document.getElementById('park-directory')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <i className="bi bi-list-check" />
                  Browse directory
                </button>
                <button
                  className="hero-cta ghost"
                  onClick={() => document.getElementById('map-and-neighborhoods')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <i className="bi bi-geo-alt" />
                  Open map
                </button>
                <Link href="/list-property" className="hero-cta text-link">
                  <i className="bi bi-plus-circle" />
                  Submit a park
                </Link>
              </div>
              <div className="hero-footnotes">
                <span>
                  <i className="bi bi-shield-check" /> Data refreshed weekly
                </span>
                <span>
                  <i className="bi bi-wifi" /> Live availability coming soon
                </span>
              </div>
            </div>

            <div className="city-hero-visual">
              <div className="hero-image-card">
                <Image
                  src={featuredImage}
                  alt={`${city.name} dog park landscape`}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 540px"
                />
                <div className="hero-image-gradient" />
                <div className="hero-image-pill">
                  <i className="bi bi-sun" />
                  Adventure-ready all year
                </div>
                {featuredParks[0] && (
                  <div className="hero-featured-card">
                    <p>Top-rated this week</p>
                    <h4>{featuredParks[0].name}</h4>
                    <span>
                      <i className="bi bi-star-fill" /> {featuredParks[0].rating.toFixed(1)} · {featuredParks[0].city}
                    </span>
                    <button
                      onClick={() =>
                        document
                          .getElementById(`${(featuredParks[0].businessType || 'dog-park').toLowerCase().replace(/\s+/g, '-')}-parks`)
                          ?.scrollIntoView({ behavior: 'smooth' })
                      }
                    >
                      View details
                    </button>
                  </div>
                )}
                <div className="hero-meta-card">
                  <span className="meta-label">Coverage snapshot</span>
                  <p className="meta-value">{stats.totalParks} parks mapped</p>
                  <span className="meta-caption">Across {parkCategories.length} park types</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="city-insights" className="city-insights-section">
          <div className="section-shell">
            <div className="section-heading">
              <span className="section-eyebrow">Data-backed overview</span>
              <h2>How {city.name} stacks up for dog families</h2>
              <p>
                Ratings, review volume, and inventory health updated directly from our verified directory so you can plan with confidence.
              </p>
            </div>

            <div className="insights-grid">
            <article className="insight-card accent">
              <span className="insight-tag">Experience score</span>
              <h3>{city.avgRating.toFixed(1)}</h3>
              <p>Average rating across every verified listing in {city.name}. Reflects cleanliness, amenities, and community feedback.</p>
              <div className="insight-footer">
                <i className="bi bi-arrow-up-right" />
                Trending up vs. statewide average
              </div>
            </article>

            <article className="insight-card">
              <span className="insight-tag">Review depth</span>
              <h3>{formatNumber(stats.totalReviews)}</h3>
              <p>Community reviews informing our quality score. Tap any park card below to see highlights.</p>
            </article>

            <article className="insight-card">
              <span className="insight-tag">Top category</span>
              <h3>{topCategory?.[0] || 'Dog Park'}</h3>
              <p>{topCategory ? `${topCategory[1].length} listings currently live in this category.` : 'Fresh listings added weekly.'}</p>
            </article>

            <article className="insight-card">
              <span className="insight-tag">Indoor availability</span>
              <h3>{indoorCount ? `${indoorShare}%` : '—'}</h3>
              <p>
                {indoorCount
                  ? `${indoorCount} indoor parks with climate control for weather-proof play sessions.`
                  : 'Indoor options are being scouted—submit a favorite and we will feature it.'}
              </p>
            </article>
          </div>

            <div className="city-stats-wrapper">
              <CityStats parks={cityParks} cityName={city.name} />
            </div>
          </div>
        </section>

        <section id="park-collections" className="park-collections-section">
          <div className="section-shell">
            <div className="section-heading">
              <span className="section-eyebrow">Curated collections</span>
              <h2>Choose the vibe that fits your next outing</h2>
              <p>Segmented park groupings built from live data so you can jump straight to the experiences that matter most.</p>
            </div>

            <div className="collection-grid">
              {parkCategories.length === 0 && (
                <div className="collection-empty">
                  <i className="bi bi-inbox" />
                  <p>We haven&rsquo;t catalogued parks in this city yet. Check back soon!</p>
                </div>
              )}

              {parkCategories.map(([type, parks]) => {
                const typeSlug = `${type.toLowerCase().replace(/\s+/g, '-')}-parks`;
                return (
                  <article key={type} className="collection-card">
                    <div className="collection-card-head">
                      <span className="collection-pill">{parks.length} spots</span>
                      <h3>{type}</h3>
                    </div>
                    <p>{getCollectionDescription(type, city.name)}</p>
                    <div className="collection-card-footer">
                      <span>
                        <i className="bi bi-star-fill" />{' '}
                        {(parks.reduce((sum, park) => sum + park.rating, 0) / parks.length).toFixed(1)} avg rating
                      </span>
                      <button onClick={() => document.getElementById(typeSlug)?.scrollIntoView({ behavior: 'smooth' })}>
                        Jump to list
                        <i className="bi bi-arrow-right" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="park-type-guide-wrapper">
              <ParkTypeGuide parksByType={parksByType} cityName={city.name} />
            </div>
          </div>
        </section>

        <section id="map-and-neighborhoods" className="map-experience-section">
          <div className="section-shell">
            <div className="section-heading">
              <span className="section-eyebrow">Interactive planning</span>
              <h2>See everything laid out on the map</h2>
              <p>Use the live map to lock in nearby options, preview ratings, and save time hopping between neighborhoods.</p>
            </div>

            <div className="map-grid">
              <div className="map-panel">
                <Map parks={cityParks} />
              </div>
              <div className="map-sidebar">
                <div className="map-sidebar-card">
                  <h3>Quick filters</h3>
                  <div className="map-chip-grid">
                    {parkCategories.map(([type, parks]) => (
                      <button key={type} onClick={() => document.getElementById(`${type.toLowerCase().replace(/\s+/g, '-')}-parks`)?.scrollIntoView({ behavior: 'smooth' })}>
                        <span>{type}</span>
                        <small>{parks.length}</small>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="map-sidebar-card">
                  <h3>Highest-rated nearby</h3>
                  <div className="mini-park-list">
                    {featuredParks.map((park) => (
                      <div key={park.id} className="mini-park-card">
                        <div>
                          <p>{park.name}</p>
                          <span>{park.businessType}</span>
                        </div>
                        <strong>{park.rating.toFixed(1)}</strong>
                      </div>
                    ))}
                    {featuredParks.length === 0 && <p className="text-muted">We&rsquo;ll highlight local favorites once data is available.</p>}
                  </div>
                </div>

                <div className="map-sidebar-card muted">
                  <p>Tip: tap any map marker to open directions, amenities, and current open hours.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="planning-essentials" className="planning-essentials-section">
          <div className="section-shell">
            <div className="section-heading">
              <span className="section-eyebrow">Visit toolkit</span>
              <h2>Plan the perfect dog outing in {city.name}</h2>
              <p>Borrow best practices from local trainers, rangers, and experienced pet parents.</p>
            </div>

            <div className="planning-grid">
              <article className="planning-card">
                <div className="planning-icon">
                  <i className="bi bi-clock-history" />
                </div>
                <h3>Peak & quiet windows</h3>
                <ul>
                  <li>6–9 AM: high energy social hour</li>
                  <li>10 AM–3 PM weekdays: calm training-friendly window</li>
                  <li>After 4 PM: sunset crowd + cooler temps</li>
                </ul>
              </article>

              <article className="planning-card">
                <div className="planning-icon">
                  <i className="bi bi-backpack" />
                </div>
                <h3>Essentials checklist</h3>
                <ul>
                  <li>Leash + harness for entry/exit control</li>
                  <li>Collapsible water bowl and fresh water</li>
                  <li>Plenty of waste bags and high-value treats</li>
                </ul>
              </article>

              <article className="planning-card">
                <div className="planning-icon">
                  <i className="bi bi-shield-check" />
                </div>
                <h3>Local regulations</h3>
                <ul>
                  <li>Keep proof of vaccinations or city license handy</li>
                  <li>Voice control required in most off-leash zones</li>
                  <li>Limit three dogs per handler in public parks</li>
                </ul>
              </article>

              <article className="planning-card">
                <div className="planning-icon">
                  <i className="bi bi-heart" />
                </div>
                <h3>Community etiquette</h3>
                <ul>
                  <li>Scan the park before entering and remove prong collars</li>
                  <li>Monitor play styles and intervene early</li>
                  <li>Share shaded space and refill water when you&rsquo;re done</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section id="park-directory" className="park-directory-section">
          <div className="section-shell">
            <div className="section-heading">
              <span className="section-eyebrow">City directory</span>
              <h2>All dog parks in {city.name}</h2>
              <p>Filter-ready cards with ratings, amenities, and quick actions. Use the chips to jump between sections.</p>
            </div>

            <div className="category-chip-row">
              {parkCategories.map(([type]) => {
                const slug = `${type.toLowerCase().replace(/\s+/g, '-')}-parks`;
                return (
                  <button key={type} onClick={() => document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth' })}>
                    {type}
                  </button>
                );
              })}
            </div>

            {parkCategories.map(([type, parks]) => {
              const slug = `${type.toLowerCase().replace(/\s+/g, '-')}-parks`;
              return (
                <div key={type} id={slug} className="directory-category">
                  <div className="directory-header">
                    <div>
                      <h3>{type}s in {city.name}</h3>
                      <p>
                        {parks.length} locations ·{' '}
                        {(parks.reduce((sum, park) => sum + park.rating, 0) / parks.length).toFixed(1)} average rating
                      </p>
                    </div>
                    <span className="directory-count">{parks.length}</span>
                  </div>
                  <div className="directory-grid">
                    {parks.map((park) => (
                      <ParkCard key={park.id} park={park} />
                    ))}
                  </div>
                  {parks.length === 0 && (
                    <div className="directory-empty">
                      <i className="bi bi-chat-square" />
                      <p>No listings yet—submit a favorite to help other pet parents.</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section id="faq-section" className="city-faq-section">
          <div className="section-shell">
            <FAQSection cityName={city.name} parkCount={stats.totalParks} />
          </div>
        </section>

        <section id="related-resources" className="related-resources-section">
          <div className="section-shell">
            <div className="section-heading">
              <span className="section-eyebrow">Keep exploring</span>
              <h2>More ways to plan</h2>
              <p>Browse statewide guides, submit a listing, or connect with our team.</p>
            </div>

            <div className="resources-grid">
              <Link href="/" className="resource-card">
                <div className="resource-icon">
                  <i className="bi bi-globe" />
                </div>
                <h3>California overview</h3>
                <p>See every city we cover plus statewide insights.</p>
                <i className="bi bi-arrow-up-right" />
              </Link>

              <Link href="/contact" className="resource-card">
                <div className="resource-icon">
                  <i className="bi bi-chat-dots" />
                </div>
                <h3>Ask the team</h3>
                <p>Need custom data or media assets? We&rsquo;re here.</p>
                <i className="bi bi-arrow-up-right" />
              </Link>

              <Link href="/list-property" className="resource-card">
                <div className="resource-icon">
                  <i className="bi bi-megaphone" />
                </div>
                <h3>Feature your park</h3>
                <p>Upgrade to a featured listing and reach active pet parents.</p>
                <i className="bi bi-arrow-up-right" />
              </Link>

              <Link href="/blog" className="resource-card">
                <div className="resource-icon">
                  <i className="bi bi-journal-text" />
                </div>
                <h3>Latest guides</h3>
                <p>Training tips, travel itineraries, and product spotlights.</p>
                <i className="bi bi-arrow-up-right" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx global>{`
        .city-page-layout {
          padding: 32px 32px 96px 360px;
          background: linear-gradient(180deg, #faf7ff 0%, #ffffff 40%, #f6f7fb 100%);
        }

        @media (max-width: 1200px) {
          .city-page-layout {
            padding-left: 320px;
          }
        }

        @media (max-width: 1024px) {
          .city-page-layout {
            padding: 80px 24px 80px;
          }
        }

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
          gap: 8px;
          padding: 10px 16px;
          border-radius: 999px;
          border: none;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: white;
          font-weight: 600;
          box-shadow: 0 10px 30px rgba(124, 58, 237, 0.2);
        }

        @media (max-width: 1024px) {
          .mobile-toc-button {
            display: block;
          }
        }

        .section-shell {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        .city-hero-section {
          position: relative;
          padding: 24px 0 72px;
        }

        .city-hero-shell {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
          gap: 48px;
        }

        @media (max-width: 900px) {
          .city-hero-shell {
            grid-template-columns: 1fr;
          }
        }

        .hero-breadcrumbs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 12px;
        }

        .hero-breadcrumbs a {
          color: inherit;
          text-decoration: none;
        }

        .hero-eyebrow {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #a855f7;
          margin-bottom: 12px;
          font-weight: 700;
        }

        .city-hero-copy h1 {
          font-size: clamp(32px, 4vw, 56px);
          line-height: 1.1;
          color: #0f172a;
          margin-bottom: 16px;
        }

        .hero-description {
          font-size: 18px;
          color: #475569;
          line-height: 1.6;
          margin-bottom: 28px;
        }

        .hero-chip-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 12px;
          margin-bottom: 32px;
        }

        .hero-chip {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 12px 16px;
          box-shadow: 0 15px 40px rgba(15, 23, 42, 0.05);
        }

        .chip-value {
          display: block;
          font-size: 20px;
          font-weight: 700;
          color: #111827;
        }

        .chip-label {
          font-size: 12px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .hero-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          margin-bottom: 28px;
        }

        .hero-metric {
          background: #111827;
          color: white;
          border-radius: 16px;
          padding: 18px;
          position: relative;
          overflow: hidden;
        }

        .hero-metric::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top right, rgba(255, 255, 255, 0.3), transparent);
          opacity: 0.4;
        }

        .hero-metric span {
          position: relative;
          z-index: 1;
        }

        .metric-label {
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #cbd5f5;
        }

        .metric-value {
          display: block;
          font-size: 34px;
          font-weight: 700;
          margin: 6px 0 4px;
        }

        .metric-caption {
          font-size: 12px;
          color: #cbd5f5;
        }

        .hero-cta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 16px;
        }

        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: none;
          border-radius: 999px;
          padding: 12px 22px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .hero-cta.primary {
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: white;
          box-shadow: 0 15px 30px rgba(124, 58, 237, 0.2);
        }

        .hero-cta.ghost {
          background: white;
          color: #111827;
          border: 1px solid #e2e8f0;
        }

        .hero-cta.text-link {
          background: transparent;
          color: #7c3aed;
          padding-left: 0;
        }

        .hero-footnotes {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          font-size: 13px;
          color: #475569;
        }

        .hero-footnotes i {
          color: #7c3aed;
          margin-right: 6px;
        }

        .city-hero-visual {
          position: relative;
        }

        .hero-image-card {
          position: relative;
          min-height: 480px;
          border-radius: 32px;
          overflow: hidden;
          box-shadow: 0 30px 80px rgba(15, 23, 42, 0.2);
        }

        .hero-image-card img {
          object-fit: cover;
        }

        .hero-image-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.05), rgba(15, 23, 42, 0.8));
        }

        .hero-image-pill {
          position: absolute;
          top: 20px;
          left: 20px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.9);
          color: #111827;
          border-radius: 999px;
          padding: 8px 14px;
          font-weight: 600;
        }

        .hero-featured-card {
          position: absolute;
          bottom: 24px;
          left: 24px;
          right: 24px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 18px;
          backdrop-filter: blur(12px);
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.2);
        }

        .hero-featured-card p {
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 11px;
          color: #a855f7;
          margin-bottom: 4px;
        }

        .hero-featured-card h4 {
          margin: 0;
          font-size: 20px;
          color: #111827;
        }

        .hero-featured-card span {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          color: #475569;
        }

        .hero-featured-card button {
          margin-top: 12px;
          border: none;
          background: #111827;
          color: white;
          border-radius: 999px;
          padding: 8px 14px;
          font-size: 13px;
          cursor: pointer;
        }

        .hero-meta-card {
          position: absolute;
          top: 20px;
          right: -20px;
          background: white;
          border-radius: 18px;
          padding: 16px 20px;
          width: 220px;
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.15);
        }

        .meta-label {
          text-transform: uppercase;
          font-size: 10px;
          letter-spacing: 0.2em;
          color: #94a3b8;
        }

        .meta-value {
          font-size: 18px;
          font-weight: 700;
          margin: 6px 0;
        }

        .meta-caption {
          font-size: 12px;
          color: #64748b;
        }

        .section-heading {
          max-width: 720px;
          margin: 0 auto 40px;
          text-align: center;
        }

        .section-eyebrow {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 6px 16px;
          border-radius: 999px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          background: rgba(124, 58, 237, 0.1);
          color: #7c3aed;
          margin-bottom: 12px;
          font-weight: 700;
        }

        .section-heading h2 {
          font-size: clamp(28px, 3vw, 40px);
          color: #0f172a;
          margin-bottom: 12px;
        }

        .section-heading p {
          color: #475569;
          font-size: 18px;
          line-height: 1.6;
        }

        .city-insights-section,
        .park-collections-section,
        .map-experience-section,
        .planning-essentials-section,
        .park-directory-section,
        .city-faq-section,
        .related-resources-section {
          padding: 64px 0;
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .insight-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 20px 45px rgba(15, 23, 42, 0.05);
        }

        .insight-card.accent {
          background: linear-gradient(135deg, #111827, #312e81);
          color: white;
          border: none;
        }

        .insight-tag {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #a855f7;
        }

        .insight-card.accent .insight-tag {
          color: rgba(255, 255, 255, 0.7);
        }

        .insight-card h3 {
          font-size: 32px;
          margin: 12px 0;
        }

        .insight-card p {
          font-size: 15px;
          color: inherit;
        }

        .insight-card:not(.accent) p {
          color: #475569;
        }

        .insight-footer {
          margin-top: 16px;
          font-size: 13px;
          display: inline-flex;
          gap: 6px;
          align-items: center;
          color: rgba(255, 255, 255, 0.8);
        }

        .park-collections-section {
          background: #f7f0ff;
        }

        .collection-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
          margin-bottom: 48px;
        }

        .collection-card {
          background: white;
          border-radius: 24px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          border: 1px solid rgba(124, 58, 237, 0.12);
          box-shadow: 0 20px 45px rgba(124, 58, 237, 0.08);
        }

        .collection-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #7c3aed;
        }

        .collection-card h3 {
          margin: 0;
          font-size: 24px;
        }

        .collection-card p {
          color: #475569;
          flex: 1;
        }

        .collection-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
        }

        .collection-card-footer button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: none;
          background: transparent;
          color: #7c3aed;
          font-weight: 600;
          cursor: pointer;
        }

        .map-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 320px;
          gap: 24px;
        }

        @media (max-width: 960px) {
          .map-grid {
            grid-template-columns: 1fr;
          }
        }

        .map-panel {
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 35px 60px rgba(15, 23, 42, 0.15);
          min-height: 420px;
        }

        .map-sidebar {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .map-sidebar-card {
          background: white;
          border-radius: 20px;
          padding: 20px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 20px 45px rgba(15, 23, 42, 0.05);
        }

        .map-sidebar-card.muted {
          background: #0f172a;
          color: #cbd5f5;
        }

        .map-sidebar-card h3 {
          margin-top: 0;
          margin-bottom: 12px;
        }

        .map-chip-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 10px;
        }

        .map-chip-grid button {
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          border-radius: 12px;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
        }

        .mini-park-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .mini-park-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          border-radius: 12px;
          background: #f8fafc;
        }

        .mini-park-card p {
          margin: 0;
          font-weight: 600;
        }

        .mini-park-card span {
          font-size: 12px;
          color: #64748b;
        }

        .planning-essentials-section {
          background: #fff;
        }

        .planning-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }

        .planning-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 20px 45px rgba(15, 23, 42, 0.05);
        }

        .planning-icon {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          background: rgba(124, 58, 237, 0.1);
          color: #7c3aed;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          margin-bottom: 12px;
        }

        .planning-card h3 {
          margin-top: 0;
        }

        .planning-card ul {
          padding-left: 18px;
          color: #475569;
          line-height: 1.6;
        }

        .park-directory-section {
          background: #f8f8ff;
        }

        .category-chip-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
          margin-bottom: 32px;
        }

        .category-chip-row button {
          border: 1px solid #d1d5db;
          background: white;
          border-radius: 999px;
          padding: 8px 18px;
          font-weight: 600;
          cursor: pointer;
          color: #475569;
        }

        .directory-category {
          background: white;
          border-radius: 28px;
          padding: 32px;
          margin-bottom: 40px;
          box-shadow: 0 30px 60px rgba(15, 23, 42, 0.08);
        }

        @media (max-width: 640px) {
          .directory-category {
            padding: 20px;
          }
        }

        .directory-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 20px;
          margin-bottom: 24px;
        }

        .directory-count {
          background: #111827;
          color: white;
          border-radius: 999px;
          padding: 6px 14px;
          font-weight: 700;
        }

        .directory-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .directory-empty {
          text-align: center;
          color: #94a3b8;
          padding: 40px 0;
        }

        .city-faq-section {
          background: white;
        }

        .related-resources-section {
          background: #0f172a;
          color: white;
        }

        .resources-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
        }

        .resource-card {
          background: rgba(255, 255, 255, 0.08);
          padding: 24px;
          border-radius: 20px;
          text-decoration: none;
          color: inherit;
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: transform 0.2s ease, border 0.2s ease;
        }

        .resource-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .resource-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        @media (max-width: 768px) {
          .city-page-layout {
            padding-top: 80px;
          }

          .hero-metrics {
            grid-template-columns: 1fr;
          }

          .hero-chip-row {
            grid-template-columns: 1fr 1fr;
          }

          .directory-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}


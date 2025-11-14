import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ParkCard from '@/components/ParkCard';
import TableOfContents from '@/components/TableOfContents';
import ParkTypeGuide from '@/components/ParkTypeGuide';
import FAQSection from '@/components/FAQSection';
import CityStats from '@/components/CityStats';
import ScrollToButton from '@/components/ScrollToButton';
import { createMetaDescription, SITE_URL } from '@/lib/metadata';
import { getAllCitySlugs, getCityContentBySlug } from '@/lib/parks-data';
import CityPageStyles from './CityPageStyles';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <div style={{ minHeight: 320, background: '#f3f4f6' }} />,
});

interface CityPageProps {
  params: {
    slug: string;
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

export async function generateStaticParams() {
  const slugs = await getAllCitySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const cityContent = await getCityContentBySlug(params.slug);
  if (!cityContent) {
    return {};
  }

  const { city, stats } = cityContent;
  const cityTitle = `Complete Dog Park Guide: ${city.name}, ${city.state}`;
  const pageDescription = createMetaDescription(
    `Discover ${stats.totalParks} dog parks, indoor runs, and pet-friendly hangouts in ${city.name}. Compare ratings, amenities, and plan visits with interactive maps.`
  );
  const canonicalUrl = `${SITE_URL}/cities/${params.slug}`;
  const featuredImage =
    city.featuredImage ||
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';

  return {
    title: cityTitle,
    description: pageDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: cityTitle,
      description: pageDescription,
      url: canonicalUrl,
      type: 'article',
      images: [
        {
          url: featuredImage,
          width: 1200,
          height: 630,
          alt: `${city.name} dog parks`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: cityTitle,
      description: pageDescription,
      images: [featuredImage],
    },
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const cityContent = await getCityContentBySlug(params.slug);

  if (!cityContent) {
    notFound();
  }

  const { city, cityParks, parksByType, stats } = cityContent;

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
    { label: 'Avg rating', value: `${stats.avgRating.toFixed(1)} / 5` },
    { label: 'Park types', value: parkCategories.length.toString() },
    { label: 'Local reviews', value: formatNumber(stats.totalReviews) },
  ];

  const canonicalUrl = `${SITE_URL}/cities/${params.slug}`;
  const pageDescription = `Discover ${stats.totalParks} dog parks, indoor runs, and pet-friendly hangouts in ${city.name}. Compare ratings, amenities, and plan visits with live filters and interactive maps.`;

  const structuredPlaces = cityParks.slice(0, 10).map((park) => {
    const place: Record<string, unknown> = {
      '@type': 'Place',
      name: park.name,
      address: park.full_address || park.address,
      url: park.website,
      telephone: park.phone,
    };

    if (park.rating) {
      place.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: park.rating,
        reviewCount: park.userRatingsTotal || park.reviewCount || 0,
      };
    }

    if (park.latitude && park.longitude) {
      place.geo = {
        '@type': 'GeoCoordinates',
        latitude: park.latitude,
        longitude: park.longitude,
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
      ratingValue: stats.avgRating.toFixed(1),
      reviewCount: stats.totalReviews,
    },
    containsPlace: structuredPlaces,
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
    { id: 'related-resources', title: 'More Resources', level: 1 },
  ];

  return (
    <>
        <script
          type="application/ld+json"
        suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      <Header />
      <TableOfContents items={tocItems} />

      <main className="city-page-layout">
        <div className="mobile-toc-button">
          <ScrollToButton className="mobile-toc-trigger" targetSelector=".table-of-contents">
            <i className="bi bi-list-ul" />
            <span>Contents</span>
          </ScrollToButton>
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
                <ScrollToButton className="hero-cta primary" targetId="park-directory">
                  <i className="bi bi-list-check" />
                  Browse directory
                </ScrollToButton>
                <ScrollToButton className="hero-cta ghost" targetId="map-and-neighborhoods">
                  <i className="bi bi-geo-alt" />
                  Open map
                </ScrollToButton>
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
                    <ScrollToButton
                      targetId={`${(featuredParks[0].businessType || 'dog-park').toLowerCase().replace(/\s+/g, '-')}-parks`}
                    >
                      View details
                    </ScrollToButton>
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
                      <ScrollToButton targetId={typeSlug}>
                        Jump to list
                        <i className="bi bi-arrow-right" />
                      </ScrollToButton>
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
                    {parkCategories.map(([type, parks]) => {
                      const targetId = `${type.toLowerCase().replace(/\s+/g, '-')}-parks`;
                      return (
                        <ScrollToButton key={type} targetId={targetId}>
                          <span>{type}</span>
                          <small>{parks.length}</small>
                        </ScrollToButton>
                      );
                    })}
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
                  <ScrollToButton key={type} targetId={slug}>
                    {type}
                  </ScrollToButton>
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
      <CityPageStyles />
    </>
  );
}


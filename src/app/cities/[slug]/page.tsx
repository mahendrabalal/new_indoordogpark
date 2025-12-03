import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ParkCard from '@/components/ParkCard';
import TableOfContents from '@/components/TableOfContents';
import ParkTypeGuide from '@/components/ParkTypeGuide';
import FAQSection from '@/components/FAQSection';
import CityStats from '@/components/CityStats';
import ScrollToButton from '@/components/ScrollToButton';
import { createMetaDescription, generateBreadcrumbSchema, SITE_URL } from '@/lib/metadata';
import { getAllCitySlugs, getCityContentBySlug } from '@/lib/parks-data';
import { buildDefaultFAQs } from '@/lib/faq-data';
import CityPageStyles from './CityPageStyles';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { CityInsightCard, PlanningCard, SupportCTA } from '@/types/city-content';
import { FAQItem } from '@/types/faq';
import CityPremiumSpotlight from '@/components/CityPremiumSpotlight';
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
    case 'General Play / Daycare Parks':
      return `Everyday play zones and daycare-style spaces in ${cityName} for safe, supervised romps and social time.`;
    case 'Agility & Training Parks':
      return `Structured environments in ${cityName} built for skills, confidence-building, and focused training sessions.`;
    case 'Themed & Enrichment Parks':
      return `Immersive, enrichment-forward parks in ${cityName} with sensory zones, themed layouts, and novel play elements.`;
    case 'Specialty / Social Parks':
      return `Boutique, community-forward hangouts in ${cityName}—perfect for meetups, events, and special-occasion play dates.`;
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
  // Use canonical slug (city.slug) not params.slug for SEO
  const canonicalSlug = city.slug;
  const cityTitle = `Complete Dog Park Guide: ${city.name}, ${city.state}`;
  const pageDescription = createMetaDescription(
    `Discover ${stats.totalParks} dog parks, indoor runs, and pet-friendly hangouts in ${city.name}. Compare ratings, amenities, and plan visits with interactive maps.`
  );
  const canonicalUrl = `/cities/${canonicalSlug}`;
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

  // Redirect to canonical slug if the current slug doesn't match
  // e.g., /cities/portland -> /cities/portland-or (301 permanent redirect for SEO)
  if (cityContent.city.slug !== params.slug) {
    permanentRedirect(`/cities/${cityContent.city.slug}`);
  }

  const { city, cityParks, parksByType, stats, customContent, nearbyCities } = cityContent;

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
  const showThinContentPrompt = stats.totalParks < 2;
  const heroChips = [
    { label: 'Verified parks', value: formatNumber(stats.totalParks) },
    { label: 'Avg rating', value: `${stats.avgRating.toFixed(1)} / 5` },
    { label: 'Park types', value: parkCategories.length.toString() },
    { label: 'Local reviews', value: formatNumber(stats.totalReviews) },
  ];

  const heroEyebrow = customContent?.heroEyebrow || 'City spotlight';
  const heroHeading =
    customContent?.heroHeading || `Complete dog park playbook for ${city.name}, ${city.state}`;
  const heroDescriptionCopy =
    customContent?.heroDescription ||
    `Navigate ${stats.totalParks} curated dog parks, ${parkCategories.length} experience types, and ${formatNumber(
      stats.totalReviews,
    )} local reviews. Build the perfect outing with insider planning tips and an interactive map built for modern pet parents.`;
  const heroFootnotes = customContent?.heroFootnotes || [
    'Data refreshed weekly',
    'Live availability coming soon',
  ];
  const heroChipData = customContent?.heroChips || heroChips;
  const heroImageAlt = customContent?.heroImageAlt || `${city.name} dog park landscape`;

  // Use canonical slug for all URLs
  const canonicalSlug = city.slug;
  const canonicalUrl = `/cities/${canonicalSlug}`;
  const pageDescription =
    customContent?.heroDescription ||
    `Discover ${stats.totalParks} dog parks, indoor runs, and pet-friendly hangouts in ${city.name}. Compare ratings, amenities, and plan visits with live filters and interactive maps.`;

  const structuredPlaces = cityParks.slice(0, 10).map((park) => {
    const place: Record<string, unknown> = {
      '@type': 'LocalBusiness',
      name: park.name,
      address: park.full_address || park.address,
      url: park.website,
      telephone: park.phone,
      image: park.photo || (park.photos && park.photos.length > 0 ? park.photos[0].url : undefined),
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
    containsPlace: structuredPlaces,
  };

  const itemListStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: cityParks.map((park, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}/parks/${park.slug || park.id}`,
      name: park.name,
      description: park.description,
    })),
  };

  const defaultFaqs = buildDefaultFAQs(city.name, stats.totalParks);
  const faqItems: FAQItem[] =
    customContent?.faqs && customContent.faqs.length > 0 ? customContent.faqs : defaultFaqs;

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  // Generate breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: city.state === 'CA' ? 'California Dog Parks' : 'Dog Parks Directory', url: '/' },
    { name: city.name },
  ]);

  const defaultInsightCards: CityInsightCard[] = [
    {
      tag: 'Experience score',
      title: city.avgRating.toFixed(1),
      copy: `Average rating across every verified listing in ${city.name}. Reflects cleanliness, amenities, and community feedback.`,
      accent: true,
    },
    {
      tag: 'Review depth',
      title: formatNumber(stats.totalReviews),
      copy: 'Community reviews informing our quality score. Tap any park card below to see highlights.',
    },
    {
      tag: 'Top category',
      title: topCategory?.[0] || 'Dog Park',
      copy: topCategory
        ? `${topCategory[1].length} listings currently live in this category.`
        : 'Fresh listings added weekly.',
    },
    {
      tag: 'Indoor availability',
      title: indoorCount ? `${indoorShare}%` : '—',
      copy: indoorCount
        ? `${indoorCount} indoor parks with climate control for weather-proof play sessions.`
        : 'Indoor options are being scouted—submit a favorite and we will feature it.',
    },
  ];

  const insightCards = customContent?.insightCards || defaultInsightCards;

  const defaultPlanningCards: PlanningCard[] = [
    {
      icon: 'bi-clock-history',
      title: 'Peak & quiet windows',
      items: ['6–9 AM: high energy social hour', '10 AM–3 PM weekdays: calm training-friendly window', 'After 4 PM: sunset crowd + cooler temps'],
    },
    {
      icon: 'bi-backpack',
      title: 'Essentials checklist',
      items: [
        'Leash + harness for entry/exit control',
        'Collapsible water bowl and fresh water',
        'Plenty of waste bags and high-value treats',
      ],
    },
    {
      icon: 'bi-shield-check',
      title: 'Local regulations',
      items: [
        'Keep proof of vaccinations or city license handy',
        'Voice control required in most off-leash zones',
        'Limit three dogs per handler in public parks',
      ],
    },
    {
      icon: 'bi-heart',
      title: 'Community etiquette',
      items: [
        'Scan the park before entering and remove prong collars',
        'Monitor play styles and intervene early',
        "Share shaded space and refill water when you're done",
      ],
    },
  ];

  const planningCards = customContent?.planningCards || defaultPlanningCards;

  const defaultOwnerCta: SupportCTA = {
    kicker: 'Partner with us',
    title: `Feature your ${city.name} dog park`,
    description:
      'Upgrade to a featured listing, share live availability, or pitch a new indoor concept. Our team drives qualified local pet parents every week.',
    primary: { label: 'List a property', href: '/list-your-park' },
    secondary: { label: 'Contact the team', href: '/contact' },
  };

  const ownerCta = customContent?.ownerCta || defaultOwnerCta;

  const tocItems = [
    { id: 'city-hero', title: 'City Overview', level: 1 },
    { id: 'city-insights', title: 'Insights & Scores', level: 1 },
    { id: 'park-collections', title: 'Park Collections', level: 1 },
    { id: 'park-types-guide', title: 'Park Type Guide', level: 1 },
    { id: 'map-and-neighborhoods', title: 'Map & Neighborhoods', level: 1 },
    { id: 'planning-essentials', title: 'Planning Essentials', level: 1 },
    { id: 'park-directory', title: 'Full Directory', level: 1 },
    { id: 'owner-cta', title: 'Owner & Franchise', level: 1 },
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
        <script
          type="application/ld+json"
        suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListStructuredData) }}
        />
        <script
          type="application/ld+json"
        suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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
                <span>{city.state === 'CA' ? 'California Dog Parks' : 'Dog Parks Directory'}</span>
                <i className="bi bi-chevron-right" />
                <strong>{city.name}</strong>
              </div>
              <p className="hero-eyebrow">{heroEyebrow}</p>
              <h1>{heroHeading}</h1>
              <p className="hero-description">{heroDescriptionCopy}</p>
              <div className="hero-chip-row">
                {heroChipData.map((chip) => (
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
                <Link href="/list-your-park" className="hero-cta text-link">
                  <i className="bi bi-plus-circle" />
                  Submit a park
                </Link>
              </div>
              <div className="hero-footnotes">
                {heroFootnotes.map((note) => (
                  <span key={note}>
                    <i className="bi bi-sparkles" /> {note}
                  </span>
                ))}
              </div>
            </div>

            <div className="city-hero-visual">
              <div className="hero-image-card">
                <Image
                  src={featuredImage}
                  alt={heroImageAlt}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 540px"
                />
                <div className="hero-image-gradient" />
              </div>
            </div>
          </div>
        </section>

        <CityPremiumSpotlight city={city.name} state={city.state} />

        <section id="city-insights" className="city-insights-section">
          <div className="section-shell">
            <div className="section-heading">
              <span className="section-eyebrow">Data-backed overview</span>
              <h2>How {city.name} stacks up for dog families</h2>
              <p>
                {customContent?.insightIntro ||
                  'Ratings, review volume, and inventory health updated directly from our verified directory so you can plan with confidence.'}
              </p>
            </div>

            <div className="insights-grid">
            {insightCards.map((card) => (
              <article key={card.title} className={`insight-card ${card.accent ? 'accent' : ''}`}>
                <span className="insight-tag">{card.tag}</span>
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
              </article>
            ))}
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
                  <p>
                    {customContent?.mapSidebarNote ||
                      'Tip: tap any map marker to open directions, amenities, and current open hours.'}
                  </p>
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
              {planningCards.map((card) => (
                <article key={card.title} className="planning-card">
                  <div className="planning-icon">
                    <i className={`bi ${card.icon}`} />
                  </div>
                  <h3>{card.title}</h3>
                  <ul>
                    {card.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="owner-cta" className="owner-cta-section">
          <div className="section-shell">
            {ownerCta.kicker && <span className="section-eyebrow">{ownerCta.kicker}</span>}
            <h2>{ownerCta.title}</h2>
            <p>{ownerCta.description}</p>
            <div className="hero-cta-row" style={{ marginTop: 24 }}>
              <Link href={ownerCta.primary.href} className="hero-cta primary">
                {ownerCta.primary.label}
              </Link>
              {ownerCta.secondary && (
                <Link href={ownerCta.secondary.href} className="hero-cta ghost">
                  {ownerCta.secondary.label}
                </Link>
              )}
            </div>
            {ownerCta.footnote && (
              <p className="hero-description" style={{ marginTop: 16 }}>
                {ownerCta.footnote}
              </p>
            )}
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

            {showThinContentPrompt && (
              <div className="thin-content-box" style={{ marginTop: '2rem', padding: '2rem', background: '#f8fafc', borderRadius: '12px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Know a great dog park in {city.name}?</h3>
                <p style={{ color: '#64748b', marginBottom: '1.5rem', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
                  We are actively scouting for more indoor and dog-friendly parks in {city.name}. 
                  If you know a hidden gem, help the community by adding it to our directory.
                </p>
                <Link href="/list-your-park" className="hero-cta primary" style={{ display: 'inline-flex' }}>
                  Submit a Park
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Nearby Cities Section */}
        {nearbyCities && nearbyCities.length > 0 && (
          <section id="nearby-cities" className="nearby-cities-section">
            <div className="section-shell">
              <div className="section-heading">
                <span className="section-eyebrow">Explore the region</span>
                <h2>Dog parks near {city.name}</h2>
                <p>Worth the drive? Check out top-rated indoor parks in neighboring cities.</p>
              </div>
              
              <div className="nearby-cities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
                {nearbyCities.map((nearby) => (
                  <Link key={nearby.slug} href={`/cities/${nearby.slug}`} className="nearby-city-card" style={{ display: 'block', textDecoration: 'none', borderRadius: '12px', overflow: 'hidden', background: 'white', border: '1px solid #e2e8f0', transition: 'transform 0.2s' }}>
                    <div className="nearby-city-image" style={{ position: 'relative', height: '180px', backgroundColor: '#f1f5f9' }}>
                      {nearby.featuredImage ? (
                        <Image 
                          src={nearby.featuredImage} 
                          alt={`Dog parks in ${nearby.name}, ${nearby.state}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 300px"
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="city-card-placeholder" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                          <i className="bi bi-image" style={{ fontSize: '2rem' }} />
                        </div>
                      )}
                    </div>
                    <div className="nearby-city-content" style={{ padding: '1rem' }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#0f172a' }}>{nearby.name}</h3>
                      <p style={{ fontSize: '0.875rem', color: '#64748b' }}>{nearby.parkCount} parks · {nearby.avgRating.toFixed(1)} avg rating</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

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

              <Link href="/list-your-park" className="resource-card">
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


import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CityCard from '@/components/CityCard';
import StatePageStyles from './StatePageStyles';
import { SITE_URL, createMetaDescription, createSEOTitle, generateBreadcrumbSchema } from '@/lib/metadata';
import { getStateContentBySlug } from '@/lib/state-page-data';

type StatePageProps = {
  params: {
    slug: string;
  };
};

export const revalidate = 60 * 60; // hourly

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}

export async function generateStaticParams() {
  const { getAllStateSlugs } = await import('@/lib/state-page-data');
  const slugs = await getAllStateSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: StatePageProps): Promise<Metadata> {
  const stateContent = await getStateContentBySlug(params.slug);
  if (!stateContent) return {};

  // Canonicalize /states/az -> /states/arizona, etc.
  if (stateContent.state.slug !== params.slug) {
    // NOTE: Next metadata runs before render; canonical in alternates is enough.
  }

  const { state, stats, indexable } = stateContent;

  const fullTitle = `Dog Parks in ${state.name} | Cities, Top Picks & Maps`;
  const title = createSEOTitle(fullTitle, 60);
  const description = createMetaDescription(
    indexable
      ? `Explore ${formatNumber(stats.totalParks)} verified dog-friendly spots across ${state.name}. Browse top cities, compare ratings, and plan your next visit.`
      : `We’re building out our verified directory for ${state.name}. Browse nearby cities or submit a park to help us review more dog-friendly spots.`,
  );

  const canonicalPath = `/states/${state.slug}`;
  const canonical = `${SITE_URL}${canonicalPath}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    robots: {
      index: indexable,
      follow: true,
      googleBot: {
        index: indexable,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      url: canonical,
      title,
      description,
      siteName: 'Indoor Dog Park',
      images: [
        {
          url: state.featuredImage,
          width: 1200,
          height: 630,
          alt: `${state.name} dog parks`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [state.featuredImage],
    },
  };
}

export default async function StatePage({ params }: StatePageProps) {
  const stateContent = await getStateContentBySlug(params.slug);
  if (!stateContent) {
    notFound();
  }

  const { state, stats, cities, indexable, canonicalSlug, exampleParks } = stateContent;

  // 301 to canonical slug if needed (e.g. /states/az -> /states/arizona)
  if (canonicalSlug !== params.slug) {
    permanentRedirect(`/states/${canonicalSlug}`);
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'States', url: '/states' },
    { name: state.name, url: `/states/${state.slug}` },
  ]);

  // Use a stable set of example parks for the visual card.
  const featuredPark = exampleParks[0];
  const heroImage = state.featuredImage;

  const heroChips = [
    { label: 'Total listings', value: indexable ? formatNumber(stats.totalParks) : '—' },
    { label: 'Cities covered', value: indexable ? formatNumber(stats.totalCities) : '—' },
    { label: 'Avg rating', value: indexable ? `${stats.avgRating.toFixed(1)} / 5` : '—' },
    { label: 'Local reviews', value: indexable ? formatNumber(stats.totalReviews) : '—' },
  ];

  const featureCards = [
    {
      icon: 'bi-bar-chart',
      title: 'Data-backed browsing',
      copy: 'Compare cities by listings, rating, and review depth so you can plan with confidence.',
    },
    {
      icon: 'bi-geo-alt',
      title: 'City-first navigation',
      copy: 'Jump into the best-covered cities first, then drill down to individual parks and facilities.',
    },
    {
      icon: 'bi-funnel',
      title: 'Filter-friendly',
      copy: 'Use park types (indoor, outdoor, dog-friendly businesses) to match the vibe and weather.',
    },
    {
      icon: 'bi-patch-check',
      title: 'Verified directory',
      copy: 'We refresh listings and quality signals regularly, and review new submissions as they come in.',
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Header variant="light" />
      <StatePageStyles />

      <main className="state-page-layout">
        <section className="state-hero-section">
          <div className="section-shell state-hero-shell">
            <div className="state-hero-copy">
              <nav className="hero-breadcrumbs" aria-label="Breadcrumb">
                <Link href="/">Home</Link>
                <span>›</span>
                <Link href="/states">States</Link>
                <span>›</span>
                <span>{state.name}</span>
              </nav>

              <div className="hero-eyebrow">State spotlight</div>
              <h1>Dog Parks in {state.name}</h1>
              <p className="hero-description">
                {indexable
                  ? `Explore ${formatNumber(stats.totalParks)} verified dog-friendly spots across ${state.name}. Browse the best-covered cities, compare ratings, and plan your next visit.`
                  : `We’re building out our verified directory for ${state.name}. Browse nearby cities now, or submit a park to help us review and publish more dog-friendly spots.`}
              </p>

              <div className="hero-chip-row">
                {heroChips.map((chip) => (
                  <div key={chip.label} className="hero-chip">
                    <span className="chip-value">{chip.value}</span>
                    <span className="chip-label">{chip.label}</span>
                  </div>
                ))}
              </div>

              <div className="hero-cta-row">
                <Link href="/cities" className="hero-cta primary">
                  <i className="bi bi-map"></i>
                  Browse cities
                </Link>
                <Link href="/list-your-park" className="hero-cta ghost">
                  <i className="bi bi-plus-circle"></i>
                  Submit a park
                </Link>
              </div>

              <div className="hero-footnotes">
                <span>
                  <i className="bi bi-arrow-repeat"></i> Data refreshed weekly
                </span>
                <span>
                  <i className="bi bi-broadcast"></i> Live availability coming soon
                </span>
              </div>
            </div>

            <div className="state-hero-visual">
              <div className="hero-image-card">
                <Image
                  src={heroImage}
                  alt={`${state.name} dog park landscape`}
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 40vw"
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
                <div className="hero-image-gradient" />
                <div className="hero-image-pill">
                  <i className="bi bi-pin-map"></i>
                  {state.name} directory
                </div>

                {featuredPark && (
                  <div className="hero-featured-card">
                    <p>Example listing</p>
                    <h4>{featuredPark.name}</h4>
                    <span>
                      <i className="bi bi-geo-alt"></i>
                      {featuredPark.city}, {featuredPark.state}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="state-section">
          <div className="section-shell">
            <div className="section-heading">
              <div className="section-eyebrow">Overview</div>
              <h2>Built to help dog families plan faster</h2>
              <p>
                State pages are designed as hubs: start with the strongest cities, then drill down into individual
                listings. This helps search engines and humans find the right neighborhood quickly.
              </p>
            </div>

            <div className="feature-grid">
              {featureCards.map((card) => (
                <div key={card.title} className="feature-card">
                  <div className="feature-icon">
                    <i className={`bi ${card.icon}`}></i>
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="state-section alt">
          <div className="section-shell">
            <div className="section-heading">
              <div className="section-eyebrow">Top cities</div>
              <h2>Browse cities in {state.name}</h2>
              <p>
                Start with the cities that have the best coverage and review depth. Tap a card to see filters, map, and
                full directory details.
              </p>
            </div>

            {cities.length > 0 ? (
              <div className="cities-grid">
                {cities.slice(0, 12).map((city) => (
                  <CityCard key={`${city.slug}`} city={city} />
                ))}
              </div>
            ) : (
              <div className="cta-band">
                <div>
                  <h3>We’re still building coverage for {state.name}</h3>
                  <p>Submit a listing to help us verify more dog-friendly spots across this state.</p>
                </div>
                <Link href="/list-your-park" className="hero-cta primary">
                  <i className="bi bi-plus-circle"></i>
                  Submit a park
                </Link>
              </div>
            )}
          </div>
        </section>

        <section className="state-section">
          <div className="section-shell">
            <div className="section-heading">
              <div className="section-eyebrow">FAQs</div>
              <h2>Common questions about dog parks in {state.name}</h2>
              <p>
                We index state pages only when they meet coverage thresholds. If you’re not seeing many listings yet,
                check back soon or submit a spot you love.
              </p>
            </div>

            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="bi bi-question-circle"></i>
                </div>
                <h3>Why is this page “coming soon”?</h3>
                <p>
                  If a state doesn’t meet our minimum coverage threshold yet, we keep the page available for users but
                  set it to “noindex” until we have enough verified listings.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="bi bi-shield-check"></i>
                </div>
                <h3>How do listings get verified?</h3>
                <p>
                  We combine structured data sources with manual review and community submissions. You can help by
                  submitting a park and adding missing details.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="bi bi-clock-history"></i>
                </div>
                <h3>How often do you refresh data?</h3>
                <p>We refresh city-level stats weekly and continuously review new submissions.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="bi bi-send"></i>
                </div>
                <h3>Can I submit a dog-friendly business?</h3>
                <p>Yes—dog-friendly cafés, patios, daycares, grooming, and training facilities are all welcome.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="state-section alt">
          <div className="section-shell">
            <div className="cta-band">
              <div>
                <h3>Help us expand {state.name} coverage</h3>
                <p>Submit your favorite spot and we’ll review it for inclusion in the directory.</p>
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/list-your-park" className="hero-cta primary">
                  <i className="bi bi-plus-circle"></i>
                  List your park
                </Link>
                <Link href="/cities" className="hero-cta ghost">
                  <i className="bi bi-compass"></i>
                  Explore cities
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}



import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CityCard from '@/components/CityCard';
import FAQSection from '@/components/FAQSection';
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

  const { state, stats, indexable, customContent } = stateContent;

  const fullTitle = customContent?.heroHeading || `Dog Parks in ${state.name} | Cities, Top Picks & Maps`;
  const title = createSEOTitle(fullTitle, 60);
  const description = createMetaDescription(
    customContent?.heroDescription ||
    (indexable
      ? `Explore ${formatNumber(stats.totalParks)} verified dog-friendly spots across ${state.name}. Browse top cities, compare ratings, and plan your next visit.`
      : `We’re building out our verified directory for ${state.name}. Browse nearby cities or submit a park to help us review more dog-friendly spots.`),
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
          alt: customContent?.heroImageAlt || `${state.name} dog parks`,
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

  const { state, stats, cities, indexable, canonicalSlug, customContent } = stateContent;

  // 301 to canonical slug if needed (e.g. /states/az -> /states/arizona)
  if (canonicalSlug !== params.slug) {
    permanentRedirect(`/states/${canonicalSlug}`);
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'States', url: '/states' },
    { name: state.name, url: `/states/${state.slug}` },
  ]);

  const heroImage = state.featuredImage;

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

              <div className="hero-eyebrow">{customContent?.heroEyebrow || 'State spotlight'}</div>
              <h1>{customContent?.heroHeading || `Dog Parks in ${state.name}`}</h1>
              <div className="hero-description">
                {(() => {
                  const description = customContent?.heroDescription ||
                    (indexable
                      ? `Explore ${formatNumber(stats.totalParks)} verified dog-friendly spots across ${state.name}. Browse the best-covered cities, compare ratings, and plan your next visit.\n\nOur directory includes detailed information on each location, including user reviews, photos, amenities, and real-time availability where available.`
                      : `We're building out our verified directory for ${state.name}. Browse nearby cities now, or submit a park to help us review and publish more dog-friendly spots.\n\nHelp us grow by contributing your favorite local spots and sharing your experiences with the community.`);
                  const paragraphs = description.split('\n\n').filter(Boolean);
                  return paragraphs.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ));
                })()}
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
                {(customContent?.heroFootnotes || [
                  'Data refreshed weekly',
                  'Live availability coming soon',
                ]).map((note) => (
                  <span key={note}>
                    <i className="bi bi-arrow-repeat"></i> {note}
                  </span>
                ))}
              </div>
            </div>

            <div className="state-hero-visual">
              <div className="hero-image-card">
                <Image
                  src={heroImage}
                  alt={customContent?.heroImageAlt || `${state.name} dog park landscape`}
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 40vw"
                  style={{ objectFit: 'cover' }}
                  unoptimized={heroImage.startsWith('/images/')}
                />
                <div className="hero-image-gradient" />
              </div>
            </div>
          </div>
        </section>

        {(customContent?.insightCards || customContent?.planningCards) && (
          <section className="state-section">
            <div className="section-shell">
              <div className="feature-grid">
                {customContent?.insightCards?.map((card) => (
                  <div key={card.title} className={`feature-card ${card.accent ? 'accent' : ''}`}>
                    <div className="feature-icon">
                      <i className="bi bi-info-circle"></i>
                    </div>
                    <div className="insight-tag">{card.tag}</div>
                    <h3>{card.title}</h3>
                    <p dangerouslySetInnerHTML={{ __html: card.copy }} />
                  </div>
                ))}
                {customContent?.planningCards?.map((card) => (
                  <div key={card.title} className="feature-card">
                    <div className="feature-icon">
                      <i className={`bi ${card.icon}`}></i>
                    </div>
                    <h3>{card.title}</h3>
                    <ul className="planning-card-list">
                      {card.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="state-section">
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

        <FAQSection
          cityName={state.name}
          parkCount={stats.totalParks}
          faqs={customContent?.faqs || []}
        />

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



import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ParkDirectoryGrid from '@/components/ParkDirectoryGrid';
import TableOfContents from '@/components/TableOfContents';
import FAQSection from '@/components/FAQSection';

import ScrollToButton from '@/components/ScrollToButton';
import NewsletterForm from '@/components/NewsletterForm';
import CityBestForBadges from '@/components/CityBestForBadges';
import CityPricingSummary from '@/components/CityPricingSummary';
import { getWeatherContext } from '@/lib/weather-context';
import { createMetaDescription, createSEOTitle, generateBreadcrumbSchema, SITE_URL } from '@/lib/metadata';
import { getStateName } from '@/lib/state';
import { getCityContentBySlug } from '@/lib/parks-data';
import { getParkUrl } from '@/lib/routing';
import { buildDefaultFAQs } from '@/lib/faq-data';
import CityPageStyles from './CityPageStyles';
import CityMapClient from '@/components/CityMapClient';
import Image from 'next/image';
import Link from 'next/link';
import type { Amenities, DogPark } from '@/types/dog-park';
import { PlanningCard, SupportCTA } from '@/types/city-content';
import { FAQItem } from '@/types/faq';
import CityPremiumSpotlight from '@/components/CityPremiumSpotlight';
import NearbyCitiesGrid from '@/components/NearbyCitiesGrid';


interface CityPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Render on-demand but cache at the edge (ISR) to prevent massive Vercel compute bills
export const revalidate = 3600; // Cache for 1 hour

/** Index city pages once we have at least three verified listings (directory has real value). Cities with fewer than three listings stay noindex — including synthetic "coming soon" fallbacks. Three listings ensures the page has enough substantive content for AdSense compliance. */
function shouldIndexCity(totalParks: number) {
  return totalParks >= 3;
}

function formatAmenityName(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

function getTopAmenities(parks: DogPark[], limit = 6) {
  const counts = new Map<string, number>();
  const parksWithAmenities = parks.filter((p) => p.amenities && Object.keys(p.amenities).length > 0);
  if (parksWithAmenities.length === 0) return [];

  for (const park of parksWithAmenities) {
    const amenities = park.amenities as Amenities | undefined;
    if (!amenities) continue;
    for (const [key, value] of Object.entries(amenities)) {
      if (value === true) {
        counts.set(key, (counts.get(key) || 0) + 1);
      }
    }
  }

  const denominator = parksWithAmenities.length;
  return Array.from(counts.entries())
    .map(([key, count]) => ({
      key,
      label: formatAmenityName(key),
      count,
      share: Math.round((count / denominator) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

function getLocalBusinessSchemaType(businessType: string): 'SportsActivityLocation' | 'LocalBusiness' {
  if (businessType === 'Dog Park' || businessType === 'Indoor Dog Park') return 'SportsActivityLocation';
  return 'LocalBusiness';
}

function getCityH1(cityName: string, state: string, indoorCount: number) {
  const fullState = getStateName(state) || state;
  if (indoorCount > 0) {
    return indoorCount === 1
      ? `Indoor Dog Park in ${cityName}, ${fullState}`
      : `Indoor Dog Parks in ${cityName}, ${fullState}`;
  }
  return `Dog Parks in ${cityName}, ${fullState}`;
}

function buildUniqueHeroDescription(params: {
  cityName: string;
  state: string;
  totalParks: number;
  totalReviews: number;
  indoorCount: number;
  topRatedPark?: { name: string; rating: number };
  topAmenities: Array<{ label: string; share: number }>;
  slug: string;
}) {
  const { cityName, state, totalParks, indoorCount, slug } = params;

  const weatherContext = getWeatherContext(slug);

  const inventoryLine =
    totalParks > 0
      ? indoorCount > 0
        ? `${weatherContext}. Discover ${totalParks} dog-friendly spot${totalParks === 1 ? '' : 's'} and canine park${totalParks === 1 ? '' : 's'} in ${cityName}, ${state}, including ${indoorCount} indoor option${indoorCount === 1 ? '' : 's'}.`
        : `${weatherContext}. Discover ${totalParks} dog-friendly spot${totalParks === 1 ? '' : 's'} and canine park${totalParks === 1 ? '' : 's'} in ${cityName}, ${state}.`
      : `${weatherContext}. We are actively expanding our directory of dog-friendly spots and canine parks in ${cityName}, ${state}. Explore local rules, tips, and nearby options while we verify new listings.`;

  return inventoryLine;
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const cityContent = await getCityContentBySlug(slug);
  if (!cityContent) {
    return {};
  }

  const { city, stats } = cityContent;
  const parksByType = cityContent.parksByType;
  const indoorCount = parksByType['Indoor Dog Park']?.length || 0;
  const shouldIndex = shouldIndexCity(stats.totalParks);
  // Use canonical slug (city.slug) not params.slug for SEO
  const canonicalSlug = city.slug;
  // Use an absolute title here to avoid the root `template` appending another suffix.
  // This keeps the final rendered <title> closer to the intended 55–65 char range.
  const fullState = getStateName(city.state) || city.state;
  const cityTitle = createSEOTitle(
    indoorCount > 0
      ? `Indoor Dog Parks in ${city.name}, ${fullState} | Map & Reviews`
      : `Dog Parks in ${city.name}, ${fullState} | Map & Reviews`
  );
  const pageDescription = createMetaDescription(
    stats.totalParks > 0
      ? indoorCount > 0
        ? `Explore ${stats.totalParks} dog-friendly spots in ${city.name} including ${indoorCount} indoor options. Compare ratings, amenities, hours, and map locations.`
        : `Explore ${stats.totalParks} dog parks and dog-friendly spots in ${city.name}. Compare ratings, amenities, hours, and map locations.`
      : `Discover dog-friendly play areas and parks in ${city.name}, ${fullState}. Check community listings, safety rules, and neighboring facilities.`,
  );
  const canonicalUrl = `/cities/${canonicalSlug}`;
  const absoluteCanonicalUrl = `${SITE_URL}${canonicalUrl}`;
  const featuredImage =
    city.featuredImage ||
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';

  return {
    title: { absolute: cityTitle },
    description: pageDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: shouldIndex,
      follow: true,
      googleBot: {
        index: shouldIndex,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: cityTitle,
      description: pageDescription,
      url: absoluteCanonicalUrl,
      type: 'website',
      siteName: 'Indoor Dog Park',
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
  const { slug } = await params;
  const cityContent = await getCityContentBySlug(slug);

  if (!cityContent) {
    notFound();
  }

  // Redirect to canonical slug if the current slug doesn't match
  // e.g., /cities/portland -> /cities/portland-or (301 permanent redirect for SEO)
  if (cityContent.city.slug !== slug) {
    permanentRedirect(`/cities/${cityContent.city.slug}`);
  }

  const { city, cityParks, parksByType, stats, customContent, nearbyCities } = cityContent;

  const featuredImage = city.featuredImage;

  const parkCategories = Object.entries(parksByType);

  const featuredParks = [...cityParks]
    .filter((park) => typeof park.rating === 'number')
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3);

  const indoorCount = parksByType['Indoor Dog Park']?.length || 0;

  const showThinContentPrompt = stats.totalParks < 2;
  const topAmenities = getTopAmenities(cityParks, 6);
  const topRatedPark =
    cityParks
      .filter((park) => typeof park.rating === 'number' && park.rating > 0)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))[0] || undefined;


  const heroEyebrow = customContent?.heroEyebrow || 'City spotlight';
  const heroHeading =
    customContent?.heroHeading || getCityH1(city.name, city.state, indoorCount);
  const heroDescriptionCopy =
    customContent?.heroDescription ||
    buildUniqueHeroDescription({
      cityName: city.name,
      state: city.state,
      totalParks: stats.totalParks,
      totalReviews: stats.totalReviews,
      indoorCount,
      topRatedPark: topRatedPark ? { name: topRatedPark.name, rating: topRatedPark.rating } : undefined,
      topAmenities,
      slug: city.slug,
    });
  // Only show footnotes when there is custom content — generic footnotes signal
  // machine-generated pages to search engines and harm AdSense compliance.
  const heroFootnotes = customContent?.heroFootnotes || [];

  const heroImageAlt = customContent?.heroImageAlt || `${city.name} dog park landscape`;

  // Use canonical slug for all URLs
  const canonicalSlug = city.slug;
  const canonicalUrl = `/cities/${canonicalSlug}`;
  const absoluteCanonicalUrl = `${SITE_URL}${canonicalUrl}`;
  const pageDescription =
    customContent?.heroDescription ||
    buildUniqueHeroDescription({
      cityName: city.name,
      state: city.state,
      totalParks: stats.totalParks,
      totalReviews: stats.totalReviews,
      indoorCount,
      topRatedPark: topRatedPark ? { name: topRatedPark.name, rating: topRatedPark.rating } : undefined,
      topAmenities,
      slug: city.slug,
    });

  const structuredPlaces = cityParks.slice(0, 10).map((park) => {
    const schemaType = getLocalBusinessSchemaType(park.businessType);
    const parkUrl = `${SITE_URL}${getParkUrl(park)}`;
    const place: Record<string, unknown> = {
      '@type': schemaType,
      '@id': parkUrl,
      name: park.name,
      url: parkUrl,
      ...(park.website ? { sameAs: [park.website] } : {}),
      address: {
        '@type': 'PostalAddress',
        streetAddress: park.street || undefined,
        addressLocality: park.city || undefined,
        addressRegion: park.state || undefined,
        postalCode: park.zipCode || undefined,
        addressCountry: 'US',
      },
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

  // ItemList schema for carousel - using proper item structure
  // Limit to top parks to avoid schema bloat and ensure quality
  const topParks = cityParks
    .filter((park) => park.rating && park.rating >= 3.5)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 10);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${absoluteCanonicalUrl}#webpage`,
    name: getCityH1(city.name, city.state, indoorCount),
    description: pageDescription,
    url: absoluteCanonicalUrl,
    image: featuredImage,
    datePublished: '2024-01-01T00:00:00.000Z', // Baseline content date
    dateModified: new Date().toISOString(), // Always fresh due to ISG/ISR
    publisher: {
      '@type': 'Organization',
      name: 'Indoor Dog Park',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logo/logo-512.png`,
      },
    },
    about: {
      '@type': 'City',
      name: `${city.name}, ${city.state}`,
    },
    ...(topParks.length > 0
      ? {
        mainEntity: {
          '@id': `${absoluteCanonicalUrl}#itemlist`, // Matches the ItemList ID below
        },
      }
      : {}),
    containsPlace: structuredPlaces,
  };

  const fullState = getStateName(city.state) || city.state;
  const itemListStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${absoluteCanonicalUrl}#itemlist`,
    name: indoorCount > 0 ? `Indoor Dog Parks in ${city.name}` : `Dog Parks in ${city.name}`,
    description: `Top-rated dog parks and facilities in ${city.name}, ${fullState}`,
    numberOfItems: topParks.length,
    itemListElement: topParks.map((park, index) => {
      const parkUrl = `${SITE_URL}${getParkUrl(park)}`;
      const shortDescription = park.description
        ? park.description.slice(0, 200).replace(/\s+\S*$/, '') + '...'
        : `${park.businessType} in ${park.city}`;

      return {
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'SportsActivityLocation', // Matches park detail page schema for consistency
          '@id': parkUrl,
          name: park.name,
          url: parkUrl,
          description: shortDescription,
          address: {
            '@type': 'PostalAddress',
            addressLocality: park.city,
            addressRegion: park.state,
            addressCountry: 'US',
          },
          ...((park.photo || park.photos?.[0]?.url) && {
            image: park.photo || park.photos?.[0]?.url,
          }),
        },
      };
    }),
  };

  const defaultFaqs = buildDefaultFAQs(city.name, stats.totalParks);
  const faqItemsBase: FAQItem[] =
    customContent?.faqs && customContent.faqs.length > 0 ? customContent.faqs : defaultFaqs;

  // Make the "indoor options" FAQ accurate (don’t claim indoor options if none exist)
  const faqItems: FAQItem[] = faqItemsBase.map((faq) => {
    const normalizedQuestion = faq.question.toLowerCase();
    const isIndoorQuestion =
      normalizedQuestion.includes('indoor dog park options') ||
      normalizedQuestion.includes('walk my dog indoors') ||
      normalizedQuestion.includes('indoors in');

    if (!isIndoorQuestion) return faq;

    if (indoorCount > 0) {
      return {
        ...faq,
        answer: `Yes. Our directory currently lists ${indoorCount} indoor dog park${indoorCount === 1 ? '' : 's'} in ${city.name}. Use the “Indoor Dog Park” filter on this page to jump straight to climate-controlled options.`,
      };
    }

    return {
      ...faq,
      answer: `Not yet in our verified directory for ${city.name}. If you know a great indoor option, you can submit it and we’ll review it for inclusion.`,
    };
  });

  // Helper function to clean FAQ answers for schema
  const cleanFAQAnswer = (answer: string): string => {
    // Remove HTML tags if present
    let cleaned = answer.replace(/<[^>]*>/g, '');
    // Decode HTML entities
    cleaned = cleaned
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    // Normalize whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    // Ensure answer is within Google's recommended length (max 5000 chars, but keep it reasonable)
    if (cleaned.length > 5000) {
      cleaned = cleaned.slice(0, 5000).replace(/\s+\S*$/, '') + '...';
    }
    return cleaned;
  };

  // Filter and validate FAQ items
  const validFAQs = faqItems
    .filter((faq) => {
      // Ensure question and answer exist and are valid
      const hasQuestion = faq.question && faq.question.trim().length > 0;
      const hasAnswer = faq.answer && faq.answer.trim().length > 0;
      // Answers should be at least 10 characters
      const validAnswerLength = faq.answer && faq.answer.trim().length >= 10;
      return hasQuestion && hasAnswer && validAnswerLength;
    })
    .slice(0, 10); // Limit to top 10 FAQs for performance

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: validFAQs.map((faq) => ({
      '@type': 'Question',
      name: faq.question.trim(),
      acceptedAnswer: {
        '@type': 'Answer',
        text: cleanFAQAnswer(faq.answer),
      },
    })),
  };

  // Generate breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Dog Parks Directory', url: '/' },
    { name: city.name },
  ]);



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
        'Collapsible water bowl (even if they have water fountains)',
        'Plenty of waste bags and high-value treats',
      ],
    },
    {
      icon: 'bi-shield-check',
      title: 'Local regulations',
      items: [
        'Keep proof of vaccinations or city license handy',
        'Voice control required in any off-leash dog park',
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

  // Only show planning cards when they are custom-authored for this city.
  // The default planning cards are identical across every city page, which Google
  // detects as duplicate/low-value content and uses as grounds for AdSense rejection.
  const planningCards = customContent?.planningCards || null;

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
    { id: 'park-collections', title: 'Park Collections', level: 1 },
    { id: 'map-and-neighborhoods', title: 'Map & Neighborhoods', level: 1 },
    { id: 'park-directory', title: 'Full Directory', level: 1 },
    { id: 'faq-section', title: 'FAQs', level: 1 },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {topParks.length > 0 && (
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListStructuredData) }}
        />
      )}
      {validFAQs.length > 0 && (
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        />
      )}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Header variant="light" />
      <TableOfContents items={tocItems} />

      <main className="city-page-layout">
        <div className="mobile-toc-button">
          <ScrollToButton className="mobile-toc-trigger" targetSelector=".table-of-contents">
            <i className="bi bi-list-ul" />
            <span>Contents</span>
          </ScrollToButton>
        </div>

        <section id="city-hero" className={`city-hero-section ${!featuredImage ? 'no-image' : ''}`}>
          <div className="section-shell city-hero-shell">
            <div className="city-hero-copy">
              <div className="hero-breadcrumbs">
                <Link href="/">Home</Link>
                <i className="bi bi-chevron-right" />
                <span>Dog Parks Directory</span>
                <i className="bi bi-chevron-right" />
                <strong>{city.name}</strong>
              </div>
              <p className="hero-eyebrow">{heroEyebrow}</p>
              <h1>{heroHeading}</h1>




              {(() => {
                const parseInline = (text: string) => {
                  return text.split(/(\[.*?\]\(.*?\))|(\*\*.*?\*\*)/g).map((part, i) => {
                    if (!part) return null;
                    
                    const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
                    if (linkMatch) {
                      const [, linkText, rawHref] = linkMatch;
                      let href = rawHref;
                      const isInternalDomain = href.includes('indoordogpark.org');
                      if (isInternalDomain) {
                        try {
                          const urlObj = new URL(href);
                          href = urlObj.pathname + urlObj.search + urlObj.hash;
                        } catch {
                          // fallback to rawHref
                        }
                      }
                      const isExternal = href.startsWith('http') && !isInternalDomain;
                      return (
                        <Link
                          key={i}
                          href={href}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noopener noreferrer" : undefined}
                          className="rich-link"
                        >
                          {linkText}
                        </Link>
                      );
                    }
                    
                    const boldMatch = part.match(/\*\*(.*?)\*\*/);
                    if (boldMatch) {
                      return <strong key={i}>{boldMatch[1]}</strong>;
                    }
                    
                    return part;
                  });
                };

                return (
                  <>
                    {heroDescriptionCopy
                      .split(/\n\s*\n/)
                      .map((p) => p.trim())
                      .filter(Boolean)
                      .map((para, pIdx) => (
                        <p key={pIdx} className="hero-description">
                          {parseInline(para)}
                        </p>
                      ))}

                    {customContent?.longDescription && customContent.longDescription.length > 0 && (
                      <div className="city-rich-description">
                        {customContent.longDescription.map((para, idx) => {
                          if (para.startsWith('### ')) {
                            return <h3 key={idx} className="rich-description-h3">{parseInline(para.slice(4))}</h3>;
                          }
                          if (para.startsWith('## ')) {
                            return <h2 key={idx} className="rich-description-h2">{parseInline(para.slice(3))}</h2>;
                          }
                          if (para.startsWith('> ')) {
                            return <blockquote key={idx} className="rich-description-blockquote">{parseInline(para.slice(2))}</blockquote>;
                          }
                          if (para.trim().startsWith('- ') || para.trim().startsWith('* ')) {
                            const listItems = para.split('\n').filter(line => line.trim().startsWith('- ') || line.trim().startsWith('* '));
                            return (
                              <ul key={idx} className="rich-description-list">
                                {listItems.map((item, i) => (
                                  <li key={i}>{parseInline(item.replace(/^[-*]\s/, ''))}</li>
                                ))}
                              </ul>
                            );
                          }

                          return (
                            <p key={idx} className="rich-description-paragraph">
                              {parseInline(para)}
                            </p>
                          );
                        })}
                      </div>
                    )}
                  </>
                );
              })()}

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

            {featuredImage && (
              <div className="city-hero-visual">
                <div className="hero-image-card">
                  <Image
                    src={featuredImage}
                    alt={heroImageAlt}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 540px"
                    unoptimized={featuredImage.startsWith('/images/')}
                  />
                  <div className="hero-image-gradient" />
                </div>
              </div>
            )}

          </div>
        </section>



        <CityPremiumSpotlight city={city.name} state={city.state} />



        {customContent?.neighborhoods && customContent.neighborhoods.length > 0 && (
          <section id="park-collections" className="park-collections-section">
            <div className="section-shell">
              <div className="section-heading">
                <span className="section-eyebrow">Local Districts</span>
                <h2>Where to play in {city.name}</h2>
                <p>The best dog-friendly spots and parks, organized by neighborhood.</p>
              </div>
              <div className="collection-grid" style={{ marginTop: 40 }}>
                {customContent.neighborhoods.map((n) => (
                  <article key={n.slug} className="collection-card" style={{ border: '1px solid #f1f5f9', background: '#f8fafc' }}>
                    <div className="collection-card-head">
                      <span className="collection-pill">{cityParks.filter(p => (p.address?.toLowerCase().includes(n.name.toLowerCase()) || p.street?.toLowerCase().includes(n.name.toLowerCase()))).length} spots found</span>
                      <h3>{n.name}</h3>
                    </div>
                    <p>{n.description}</p>
                    <div className="collection-card-footer">
                      <ScrollToButton className="hero-cta text-link" targetId="park-directory">
                        Browse directory
                        <i className="bi bi-arrow-right" />
                      </ScrollToButton>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        <section id="map-and-neighborhoods" className="map-experience-section">
          <div className="section-shell">
            <div className="section-heading">
              <span className="section-eyebrow">Interactive planning</span>
              <h2>See everything laid out on the map</h2>
              <p>Use the live map to lock in nearby options, preview ratings, and save time hopping between neighborhoods.</p>
            </div>

            <div className="map-grid">
              <div className="map-panel">
                {cityParks.length > 0 ? (
                  <>
                    <CityMapClient parks={cityParks} />
                  </>
                ) : (
                  <div className="map-empty-state" style={{ minHeight: 320, background: '#f8fafc', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 999, background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6d28d9' }}>
                        <i className="bi bi-geo-alt" />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>Map coming soon for {city.name}</p>
                        <p style={{ margin: 0, color: '#64748b' }}>We’ll light up this map once we verify listings and coordinates.</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      <Link href="/list-your-park" className="hero-cta primary" style={{ display: 'inline-flex' }}>
                        <i className="bi bi-plus-circle" />
                        Submit a park
                      </Link>
                      <Link href="/contact" className="hero-cta ghost" style={{ display: 'inline-flex' }}>
                        Contact us
                      </Link>
                    </div>
                  </div>
                )}
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



        <section id="newsletter-optin" className="newsletter-optin-section" style={{ padding: '60px 0' }}>
          <div className="section-shell">
            <div style={{ 
              position: 'relative',
              padding: '64px 48px', 
              background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', 
              borderRadius: '32px', 
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.5)', 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '48px', 
              alignItems: 'center',
              overflow: 'hidden'
            }}>
              {/* Decorative background elements for depth */}
              <div style={{ position: 'absolute', top: '-30%', left: '-10%', width: '60%', height: '160%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '70%', height: '150%', background: 'radial-gradient(circle, rgba(255,87,34,0.15) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }} />
              
              <div style={{ flex: '1 1 300px', position: 'relative', zIndex: 10 }}>
                <span style={{ display: 'inline-block', padding: '6px 14px', background: 'rgba(255,87,34,0.1)', border: '1px solid rgba(255,87,34,0.2)', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 700, color: '#FF5722', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Stay Updated</span>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', margin: '0', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                  Join the {city.name} pack
                </h2>
                <p style={{ color: '#94a3b8', marginTop: '16px', lineHeight: 1.6, fontSize: '1.125rem', maxWidth: '480px' }}>
                  Get the latest {city.name} dog park news, local events, and exclusive updates delivered straight to your inbox. Join thousands of other local pet parents.
                </p>
              </div>
              <div style={{ flex: '1 1 380px', minWidth: '300px', position: 'relative', zIndex: 10 }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)' }}>
                  <NewsletterForm type="consumer" source={`city_pillar_${city.slug}`} variant="dark" />
                </div>
              </div>
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

            <CityBestForBadges cityName={city.name} topAmenities={topAmenities} />
            <CityPricingSummary cityName={city.name} />

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
                      <h3>
                        {type}
                        {type.endsWith('s') ? '' : 's'} in {city.name}
                      </h3>
                      <p>
                        {parks.length} locations ·{' '}
                        {parks.length
                          ? (parks.reduce((sum, park) => sum + (park.rating || 0), 0) / parks.length).toFixed(1)
                          : '—'}{' '}
                        average rating
                      </p>
                    </div>
                    <span className="directory-count">{parks.length}</span>
                  </div>
                  <ParkDirectoryGrid parks={parks} />
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
        {
          nearbyCities && nearbyCities.length > 0 && (
            <section id="nearby-cities" className="nearby-cities-section">
              <div className="section-shell">
                <div className="section-heading">
                  <span className="section-eyebrow">Explore the region</span>
                  <h2>Cities near {city.name}</h2>
                  <p>Worth the drive? Check out top-rated indoor parks in neighboring cities.</p>
                </div>

                <NearbyCitiesGrid cities={nearbyCities} />
              </div>
            </section>
          )
        }

        <section id="faq-section" className="city-faq-section">
          <div className="section-shell">
            <FAQSection
              cityName={city.name}
              parkCount={stats.totalParks}
              faqs={faqItems}
              supportCard={customContent?.faqSupportCard}
            />
          </div>
        </section>


      </main >

      <Footer />
      <CityPageStyles />
    </>
  );
}

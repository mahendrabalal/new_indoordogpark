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
import { createMetaDescription, createSEOTitle, generateBreadcrumbSchema, SITE_URL } from '@/lib/metadata';
import { getAllCitySlugs, getCityContentBySlug } from '@/lib/parks-data';
import { buildDefaultFAQs } from '@/lib/faq-data';
import CityPageStyles from './CityPageStyles';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import type { Amenities, DogPark } from '@/types/dog-park';
import { CityInsightCard, PlanningCard, SupportCTA } from '@/types/city-content';
import { FAQItem } from '@/types/faq';
import CityPremiumSpotlight from '@/components/CityPremiumSpotlight';
const CityMap = dynamic(() => import('@/components/Map'), {
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
    case 'Indoor Dog Park':
      return `Weather-proof, climate-controlled play spaces in ${cityName}—ideal for hot days, storms, or winter sessions.`;
    case 'Dog Park':
      return `Traditional outdoor off‑leash areas and fenced runs across ${cityName}, optimized for everyday exercise.`;
    case 'Dog-Friendly Establishment':
      return `Pet-welcoming hangouts in ${cityName} (cafés, patios, bars) where dogs can tag along while you relax.`;
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

const MIN_CITY_LISTINGS_FOR_INDEXING = 3;

function shouldIndexCity(totalParks: number, totalReviews: number) {
  // Avoid thin-city indexation, but allow “single great listing” cities with strong review depth.
  return totalParks >= MIN_CITY_LISTINGS_FOR_INDEXING || totalReviews >= 200;
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
  if (indoorCount > 0) {
    return indoorCount === 1
      ? `Indoor Dog Park in ${cityName}, ${state}`
      : `Indoor Dog Parks in ${cityName}, ${state}`;
  }
  return `Dog Parks in ${cityName}, ${state}`;
}

function buildUniqueHeroDescription(params: {
  cityName: string;
  state: string;
  totalParks: number;
  totalReviews: number;
  indoorCount: number;
  topRatedPark?: { name: string; rating: number };
  topAmenities: Array<{ label: string; share: number }>;
}) {
  const { cityName, state, totalParks, totalReviews, indoorCount, topRatedPark, topAmenities } = params;

  const inventoryLine =
    indoorCount > 0
      ? `Explore ${totalParks} verified dog-friendly spot${totalParks === 1 ? '' : 's'} in ${cityName}, ${state}, including ${indoorCount} indoor option${indoorCount === 1 ? '' : 's'}.`
      : `Explore ${totalParks} verified dog-friendly spot${totalParks === 1 ? '' : 's'} in ${cityName}, ${state}.`;

  const reviewLine = totalReviews > 0 ? `Powered by ${formatNumber(totalReviews)} local reviews.` : '';

  const amenityLine =
    topAmenities.length > 0
      ? `Common highlights: ${topAmenities
          .slice(0, 3)
          .map((a) => `${a.label} (${a.share}%)`)
          .join(', ')}.`
      : '';

  const topLine =
    topRatedPark && topRatedPark.rating > 0
      ? `Top-rated pick: ${topRatedPark.name} (${topRatedPark.rating.toFixed(1)}★).`
      : '';

  return [inventoryLine, reviewLine, amenityLine, topLine].filter(Boolean).join(' ');
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
  const parksByType = cityContent.parksByType;
  const indoorCount = parksByType['Indoor Dog Park']?.length || 0;
  const shouldIndex = shouldIndexCity(stats.totalParks, stats.totalReviews);
  // Use canonical slug (city.slug) not params.slug for SEO
  const canonicalSlug = city.slug;
  // Use an absolute title here to avoid the root `template` appending another suffix.
  // This keeps the final rendered <title> closer to the intended 55–65 char range.
  const cityTitle = createSEOTitle(
    indoorCount > 0
      ? `Indoor Dog Parks in ${city.name}, ${city.state} | Map & Reviews | Indoor Dog Park`
      : `Dog Parks in ${city.name}, ${city.state} | Map & Reviews | Indoor Dog Park`,
  );
  const pageDescription = createMetaDescription(
    indoorCount > 0
      ? `Explore ${stats.totalParks} dog-friendly spots in ${city.name} including ${indoorCount} indoor options. Compare ratings, amenities, hours, and map locations.`
      : `Explore ${stats.totalParks} dog parks and dog-friendly spots in ${city.name}. Compare ratings, amenities, hours, and map locations.`,
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
  const cityContent = await getCityContentBySlug(params.slug);

  if (!cityContent) {
    // Check if this is a state name mistakenly used as a city
    const stateNames = ['california', 'ca', 'new-york', 'ny', 'washington', 'wa', 'florida', 'fl', 'texas', 'tx'];
    const normalizedSlug = params.slug.toLowerCase().replace(/[^a-z]/g, '');

    if (stateNames.some(state => normalizedSlug.includes(state) || state.includes(normalizedSlug))) {
      // Redirect to home page with a helpful message for state names
      permanentRedirect('/');
    }

    notFound();
  }

  // Redirect to canonical slug if the current slug doesn't match
  // e.g., /cities/portland -> /cities/portland-or (301 permanent redirect for SEO)
  if (cityContent.city.slug !== params.slug) {
    permanentRedirect(`/cities/${cityContent.city.slug}`);
  }

  const { city, cityParks, parksByType, stats, customContent, nearbyCities } = cityContent;
  if (stats.totalParks < 1) {
    notFound();
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
  const showThinContentPrompt = stats.totalParks < 2;
  const shouldIndex = shouldIndexCity(stats.totalParks, stats.totalReviews);
  const topAmenities = getTopAmenities(cityParks, 6);
  const topRatedPark =
    cityParks
      .filter((park) => typeof park.rating === 'number' && park.rating > 0)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))[0] || undefined;
  const mostReviewedParks = [...cityParks]
    .filter((park) => typeof park.reviewCount === 'number')
    .sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
    .slice(0, 3);
  const heroChips = [
    { label: 'Verified parks', value: formatNumber(stats.totalParks) },
    { label: 'Avg rating', value: `${stats.avgRating.toFixed(1)} / 5` },
    { label: 'Park types', value: parkCategories.length.toString() },
    { label: 'Local reviews', value: formatNumber(stats.totalReviews) },
  ];

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
    });
  const heroFootnotes = customContent?.heroFootnotes || [
    'Data refreshed weekly',
    'Live availability coming soon',
  ];
  const heroChipData = customContent?.heroChips || heroChips;
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
    });

  const structuredPlaces = cityParks.slice(0, 10).map((park) => {
    const schemaType = getLocalBusinessSchemaType(park.businessType);
    const parkUrl = `${SITE_URL}/parks/${park.slug || park.id}`;
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
    about: {
      '@type': 'City',
      name: `${city.name}, ${city.state}`,
    },
    ...(topParks.length > 0
      ? {
          mainEntity: {
            '@id': `${absoluteCanonicalUrl}#itemlist`,
          },
        }
      : {}),
    containsPlace: structuredPlaces,
  };

  const itemListStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${absoluteCanonicalUrl}#itemlist`,
    name: `Dog Parks in ${city.name}`,
    description: `Top-rated dog parks and facilities in ${city.name}, ${city.state}`,
    numberOfItems: topParks.length,
    itemListElement: topParks.map((park, index) => {
      const parkUrl = `${SITE_URL}/parks/${park.slug || park.id}`;
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
    { id: 'city-highlights', title: 'Local Highlights', level: 1 },
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

        <section id="city-highlights" className="city-insights-section">
          <div className="section-shell">
            <div className="section-heading">
              <span className="section-eyebrow">Local highlights</span>
              <h2>What stands out in {city.name}</h2>
              <p>
                {shouldIndex
                  ? 'Based on the listings on this page—no filler, no guesswork.'
                  : 'This is a preview page while we collect more verified listings.'}
              </p>
            </div>

            <div className="insights-grid">
              <article className="insight-card accent">
                <span className="insight-tag">Inventory</span>
                <h3>{formatNumber(stats.totalParks)}</h3>
                <p>Total verified listings currently live for {city.name}.</p>
              </article>
              <article className="insight-card">
                <span className="insight-tag">Indoor coverage</span>
                <h3>{indoorCount > 0 ? `${indoorShare}%` : '—'}</h3>
                <p>{indoorCount > 0 ? `${indoorCount} indoor option${indoorCount === 1 ? '' : 's'} available.` : 'No indoor listings yet in our directory.'}</p>
              </article>
              <article className="insight-card">
                <span className="insight-tag">Most reviewed</span>
                <h3>{mostReviewedParks[0]?.reviewCount ? formatNumber(mostReviewedParks[0].reviewCount) : '—'}</h3>
                <p>
                  {mostReviewedParks.length > 0
                    ? `${mostReviewedParks[0].name} leads on review volume.`
                    : 'We’ll highlight review leaders once listings are available.'}
                </p>
              </article>
              <article className="insight-card">
                <span className="insight-tag">Top amenities</span>
                <h3>{topAmenities.length > 0 ? topAmenities[0].label : '—'}</h3>
                <p>
                  {topAmenities.length > 0
                    ? `${topAmenities[0].share}% of listed parks mention it.`
                    : 'Amenity details are still being filled in across listings.'}
                </p>
              </article>
            </div>

            {topAmenities.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Most common amenities</h3>
                <div className="category-chip-row" style={{ marginTop: 12 }}>
                  {topAmenities.map((amenity) => (
                    <span key={amenity.key} className="hero-chip">
                      <span className="chip-value">{amenity.share}%</span>
                      <span className="chip-label">{amenity.label}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
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
                const avgRating = parks.length
                  ? (parks.reduce((sum, park) => sum + (park.rating || 0), 0) / parks.length).toFixed(1)
                  : '—';
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
                        {avgRating} avg rating
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
                <CityMap parks={cityParks} />
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
            <FAQSection
              cityName={city.name}
              parkCount={stats.totalParks}
              faqs={faqItems}
              supportCard={customContent?.faqSupportCard}
            />
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


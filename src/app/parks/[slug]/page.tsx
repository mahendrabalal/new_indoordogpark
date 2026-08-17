import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReviewSection from '@/components/ReviewSection';

import ParkStatusBadge from '@/components/ParkStatusBadge';
import ParkMapClient from '@/components/ParkMapClient';
import BadgeEmbedButton from '@/components/BadgeEmbedButton';
import { extractLocationFromSlug, getAllStaticParks, getCitySlugByName, getParkBySlug } from '@/lib/parks-data';
import { generateBreadcrumbSchema, generateParkMetadata, generateParkSchema, generateReviewSchemas, generateWebPageSchema } from '@/lib/metadata';
import { buildParkFAQs } from '@/lib/park-faq-data';
import { getParkReviews } from '@/lib/reviews-data';
import { getRelatedBlogPosts } from '@/lib/related-content';
import { isDogTrainingFacility, isDogFriendlyEstablishment, getParkUrl } from '@/lib/routing';
import { getNearbyCities } from '@/lib/cityData';
import NearbyCitiesWidget from '@/components/NearbyCitiesWidget';
import ParkPhotoGallery from '@/components/ParkPhotoGallery';


type ParkPageProps = {
  params: Promise<{
    slug: string;
  }>;
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

// Cache at the edge for 24 hours to prevent Vercel compute bills
export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  const parks = await getAllStaticParks();
  return parks.map((park) => ({
    slug: park.slug || park.id,
  }));
}

export async function generateMetadata({ params }: ParkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const park = await getParkBySlug(slug);
  if (!park) {
    return {};
  }
  return generateParkMetadata(park);
}

export default async function ParkDetailPage({ params }: ParkPageProps) {
  const { slug } = await params;
  const park = await getParkBySlug(slug);

  if (!park) {
    // Park not found - try smart redirect before 404
    const location = extractLocationFromSlug(slug);
    if (location) {
      const citySlug = await getCitySlugByName(location.city, location.state);
      if (citySlug) {
        // Redirect to city page with a query param to show a message if desired later
        permanentRedirect(`/cities/${citySlug}?ref=missing-park`);
      }
    }

    // Final fallback: return 404
    notFound();
  }

  // If this is a dog training facility, redirect to the new semantic route
  if (isDogTrainingFacility(park)) {
    permanentRedirect(`/dog-training/${park.slug || park.id}`);
  }

  // If this is a dog friendly establishment, redirect to the new semantic route
  if (isDogFriendlyEstablishment(park)) {
    permanentRedirect(`/dog-friendly/${park.slug || park.id}`);
  }

  // Redirect to canonical slug if different (301 permanent redirect for SEO)
  const canonicalSlug = park.slug || park.id;
  if (canonicalSlug !== slug) {
    permanentRedirect(`/parks/${canonicalSlug}`);
  }

  const allParks = await getAllStaticParks();
  let nearbyParks = allParks
    .filter((p) => p.id !== park.id && p.city === park.city)
    .slice(0, 4);

  let nearbyScope = park.city;
  if (nearbyParks.length < 4) {
    const stateParks = allParks
      .filter((p) => p.id !== park.id && p.state === park.state && !nearbyParks.find(np => np.id === p.id))
      .slice(0, 4 - nearbyParks.length);
    nearbyParks = [...nearbyParks, ...stateParks];
    if (stateParks.length > 0) {
      nearbyScope = getStateName(park.state);
    }
  }

  const nearbyCities = getNearbyCities(allParks, park.city, park.state);

  // Fetch approved reviews for structured data
  const reviews = await getParkReviews(park.id);
  const reviewSchemas = generateReviewSchemas(reviews, park);

  // Fetch related blog posts
  const relatedBlogPosts = await getRelatedBlogPosts(park, 4);

  const parkSchema = generateParkSchema(park);
  const webPageSchema = generateWebPageSchema(park);
  const stateName = getStateName(park.state);

  // Generate breadcrumb schema
  const citySlug = (await getCitySlugByName(park.city, park.state)) || park.city.toLowerCase().replace(/\s+/g, '-');
  const stateSlug = stateName ? stateName.toLowerCase().replace(/\s+/g, '-') : '';
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    ...(stateName ? [{ name: stateName, url: `/states/${stateSlug}` }] : []),
    { name: park.city, url: `/cities/${citySlug}` },
    { name: park.name },
  ]);

  let fallbackDescription = `${park.name} is a ${park.businessType.toLowerCase()} located in ${park.city}, ${stateName}.`;
  
  const features = [];
  if (park.indoorOutdoor === 'indoor') features.push('indoor play areas');
  if (park.indoorOutdoor === 'outdoor') features.push('outdoor play areas');
  if (park.indoorOutdoor === 'both') features.push('both indoor and outdoor play areas');
  
  if (park.amenities) {
    const amenitiesList = Object.entries(park.amenities)
      .filter(([, value]) => value === true)
      .map(([key]) => formatAmenityName(key).toLowerCase());
    
    if (amenitiesList.length > 0) {
      features.push(`amenities such as ${amenitiesList.slice(0, 3).join(', ')}`);
    }
  }

  if (features.length > 0) {
    fallbackDescription += ` It features ${features.join(' and ')}.`;
  }

  if (park.rating && park.rating > 0) {
    fallbackDescription += ` The facility has a ${park.rating}-star rating from ${park.reviewCount} reviews.`;
  }

  const descriptionText =
    park.description?.trim() || fallbackDescription;
  const descriptionParagraphs = descriptionText.split(/\n\s*\n/).filter(Boolean);
  const openingHourEntries = Object.entries(park.openingHours ?? {}).filter(
    ([, hours]) => typeof hours === 'string' && hours.trim().length > 0,
  );
  
  const todayDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todaysHours = openingHourEntries.find(([day]) => day === todayDay)?.[1];

  // Use custom FAQs if available, otherwise build comprehensive default FAQs
  const faqItems = park.faqs && park.faqs.length > 0 ? park.faqs : buildParkFAQs(park);

  // Helper function to clean FAQ answers for schema (similar to city pages)
  const cleanFAQAnswer = (answer: string): string => {
    let cleaned = answer.replace(/<[^>]*>/g, '');
    cleaned = cleaned
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    if (cleaned.length > 5000) {
      cleaned = cleaned.slice(0, 5000).replace(/\s+\S*$/, '') + '...';
    }
    return cleaned;
  };

  // Filter and validate FAQ items for schema
  const validFAQs = faqItems
    .filter((faq) => {
      const hasQuestion = faq.question && faq.question.trim().length > 0;
      const hasAnswer = faq.answer && faq.answer.trim().length > 0;
      const validAnswerLength = faq.answer && faq.answer.trim().length >= 10;
      return hasQuestion && hasAnswer && validAnswerLength;
    })
    .slice(0, 10); // Limit to top 10 FAQs for performance

  const faqSchema = validFAQs.length > 0 ? {
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
  } : null;

  return (
    <>


      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(parkSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      {/* BreadcrumbList schema for SEO */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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
      {faqSchema && validFAQs.length > 0 && (
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <Header />

      <main className="park-detail-premium">
        <section className="park-hero-premium">
          <div className="container">
            <div className="premium-hero-content">
              <div className="breadcrumbs-white">
                <Link href="/">Home</Link>
                <i className="bi bi-chevron-right"></i>
                {stateName && (
                  <>
                    <Link href={`/states/${stateSlug}`}>
                      {stateName}
                    </Link>
                    <i className="bi bi-chevron-right"></i>
                  </>
                )}
                <Link href={`/cities/${citySlug}`}>
                  {park.city}
                </Link>
                <i className="bi bi-chevron-right"></i>
                <span>{park.name}</span>
              </div>

              <div className="premium-badge-row">
                {park.listingType === 'featured' && (
                  <span className="premium-badge badge-verified">
                    <i className="bi bi-patch-check-fill"></i> VERIFIED LISTING
                  </span>
                )}
                <ParkStatusBadge park={park} showNextChange={false} className="premium-badge" />
                {park.businessType && (
                  <span className="premium-badge badge-type bg-blue-100 text-blue-800 border-blue-200">
                    <i className="bi bi-tag-fill"></i> {park.businessType}
                  </span>
                )}
              </div>

              <h1 className="premium-title">{park.name}</h1>

              <div className="premium-meta">
                <span className="location-inline">
                  <i className="bi bi-geo-alt-fill"></i> {park.city}, {getStateAbbr(park.state)}
                </span>
                <span className="rating-inline">
                  <i className="bi bi-star-fill text-yellow-400"></i>
                  <i className="bi bi-star-fill text-yellow-400"></i>
                  <i className="bi bi-star-fill text-yellow-400"></i>
                  <i className="bi bi-star-fill text-yellow-400"></i>
                  <i className="bi bi-star-fill text-yellow-400"></i>
                  <span className="ml-2 font-bold">{park.rating}</span>
                  <span className="ml-1 text-sm opacity-80">({park.reviewCount} Google reviews)</span>
                </span>
                {todaysHours && (
                  <span className="hours-inline inline-flex items-center gap-1">
                    <i className="bi bi-clock-fill"></i> Today: {todaysHours}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>



        <div className="container park-detail-container">
          <ParkPhotoGallery
            photos={park.photos}
            primaryPhoto={park.photo}
            parkName={park.name}
            parkCity={park.city}
            parkState={park.state}
            listingSlug={canonicalSlug}
          />

          <div className="premium-content-grid">
            <div className="premium-main-column">
              <section className="premium-content-section">
                <h2 className="premium-section-title">About {park.name}</h2>
                <div className="park-description text-gray-700 leading-relaxed space-y-4">
                  {descriptionParagraphs.map((paragraph, idx) => (
                    <p key={idx}>{renderMarkdownText(paragraph)}</p>
                  ))}
                </div>
              </section>

              {park.pricing && (park.pricing.isFree || park.pricing.hourlyRate || park.pricing.dailyRate || park.pricing.monthlyRate || park.pricing.dropInFee || park.pricing.priceRange || park.pricing.pricingDetails || park.pricing.pricingUrl || park.pricing.pricingType) && (
                <section className="premium-content-section pricing-section">
                  <h2 className="premium-section-title">Pricing Information</h2>
                  <div className="pricing-info">
                    {park.pricing.isFree ? (
                      <div className="pricing-type-badge free-pricing mb-6">
                        <i className="bi bi-check-circle-fill"></i>
                        <span>Free to Use</span>
                      </div>
                    ) : (
                      <>
                        {park.pricing.pricingType && (
                          <div className="pricing-type-badge mb-6">
                            <i className="bi bi-currency-dollar"></i>
                            <span>{formatPricingType(park.pricing.pricingType)}</span>
                          </div>
                        )}
                        <div className="pricing-details grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {park.pricing.hourlyRate && (
                            <div className="pricing-item">
                              <strong>Hourly Rate:</strong>
                              <span>${park.pricing.hourlyRate}/hour</span>
                            </div>
                          )}
                          {park.pricing.dailyRate && (
                            <div className="pricing-item">
                              <strong>Daily Rate:</strong>
                              <span>${park.pricing.dailyRate}/day</span>
                            </div>
                          )}
                          {park.pricing.monthlyRate && (
                            <div className="pricing-item">
                              <strong>Monthly Membership:</strong>
                              <span>${park.pricing.monthlyRate}/month</span>
                            </div>
                          )}
                          {park.pricing.dropInFee && (
                            <div className="pricing-item">
                              <strong>Drop-in Fee:</strong>
                              <span>${park.pricing.dropInFee}</span>
                            </div>
                          )}
                          {park.pricing.priceRange && (
                            <div className="pricing-item">
                              <strong>Price Range:</strong>
                              <span>{park.pricing.priceRange}</span>
                            </div>
                          )}
                        </div>
                        {park.pricing.pricingDetails && (
                          <div className="pricing-details-text mt-4 space-y-4">
                            {park.pricing.pricingDetails.split(/\n\s*\n/).map((paragraph, idx) => (
                              <p key={idx}>{renderMarkdownText(paragraph)}</p>
                            ))}
                          </div>
                        )}
                        {park.pricing.pricingUrl && (
                          <div className="pricing-link mt-4">
                            <a href={park.pricing.pricingUrl} target="_blank" rel="noopener noreferrer" className="pricing-cta-link text-blue-600 hover:underline">
                              <i className="bi bi-box-arrow-up-right"></i> View Full Pricing Details
                            </a>
                          </div>
                        )}
                      </>
                    )}
                    <p className="pricing-disclaimer mt-6 text-sm italic text-gray-500">
                      <i className="bi bi-info-circle"></i> Pricing may vary. Please contact {park.name} directly for the most current rates and membership information.
                    </p>
                  </div>
                </section>
              )}

              {park.amenities && Object.entries(park.amenities).filter(([, value]) => value === true).length > 0 && (
                <section className="premium-content-section">
                  <h2 className="premium-section-title">Amenities & Features</h2>
                  {(() => {
                    const activeAmenities = Object.entries(park.amenities!)
                      .filter(([, value]) => value === true)
                      .map(([key]) => key);

                    const categories: Record<string, { icon: string; keys: string[] }> = {
                      'For the Dogs': {
                        icon: 'bi-hearts',
                        keys: ['smallDogArea', 'largeDogArea', 'agilityCourse', 'swimming', 'socializing'],
                      },
                      'Facilities': {
                        icon: 'bi-building',
                        keys: ['parking', 'restrooms', 'handicapAccess', 'lighting', 'fencing', 'shade', 'seating', 'climateControl', 'misters'],
                      },
                      'Services': {
                        icon: 'bi-stars',
                        keys: ['dogWashStation', 'grooming', 'daycare', 'training', 'waterFountains', 'cafe', 'bar', 'wifi', 'foodAllowed'],
                      },
                    };

                    const grouped = Object.entries(categories)
                      .map(([label, { icon, keys }]) => ({
                        label,
                        icon,
                        items: activeAmenities.filter((k) => keys.includes(k)),
                      }))
                      .filter((g) => g.items.length > 0);

                    // If amenities don't fit any category, show them flat
                    const categorizedKeys = Object.values(categories).flatMap((c) => c.keys);
                    const uncategorized = activeAmenities.filter((k) => !categorizedKeys.includes(k));

                    const AMENITY_LINKS: Record<string, string> = {
                      agilityCourse: '/indoor-agility-courses',
                      bar: '/parks-with-bars',
                      smallDogArea: '/small-dog-areas',
                      training: '/dog-training',
                      daycare: '/dog-friendly', // or similar
                    };

                    return (
                      <div className="amenities-grouped">
                        {grouped.map((group) => (
                          <div key={group.label} className="amenity-group">
                            <h3 className="amenity-group-title">
                              <i className={`bi ${group.icon}`}></i> {group.label}
                            </h3>
                            <div className="amenities-grid-premium">
                              {group.items.map((key) => {
                                const href = AMENITY_LINKS[key];
                                if (href) {
                                  return (
                                    <Link href={href} key={key} className="amenity-item-premium hover:text-emerald-700 transition-colors group">
                                      <i className="bi bi-check-circle-fill group-hover:scale-110 transition-transform"></i>
                                      <span className="underline decoration-emerald-200 underline-offset-4">{formatAmenityName(key)}</span>
                                    </Link>
                                  );
                                }
                                return (
                                  <div key={key} className="amenity-item-premium">
                                    <i className="bi bi-check-circle-fill"></i>
                                    <span>{formatAmenityName(key)}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                        {uncategorized.length > 0 && (
                          <div className="amenity-group">
                            <h3 className="amenity-group-title">
                              <i className="bi bi-plus-circle"></i> Other
                            </h3>
                            <div className="amenities-grid-premium">
                              {uncategorized.map((key) => {
                                const href = AMENITY_LINKS[key];
                                if (href) {
                                  return (
                                    <Link href={href} key={key} className="amenity-item-premium hover:text-emerald-700 transition-colors group">
                                      <i className="bi bi-check-circle-fill group-hover:scale-110 transition-transform"></i>
                                      <span className="underline decoration-emerald-200 underline-offset-4">{formatAmenityName(key)}</span>
                                    </Link>
                                  );
                                }
                                return (
                                  <div key={key} className="amenity-item-premium">
                                    <i className="bi bi-check-circle-fill"></i>
                                    <span>{formatAmenityName(key)}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </section>
              )}

              {(park.indoorOutdoor || park.sizeCategory || park.surfaceType || (park.petFriendlyFeatures && park.petFriendlyFeatures.length > 0)) && (
                <section className="premium-content-section park-characteristics-section">
                  <h2 className="premium-section-title">Park Characteristics</h2>
                  <div className="park-characteristics grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {park.indoorOutdoor && (
                      <div className="characteristic-item flex items-center gap-4">
                        <i className="bi bi-houses-fill text-xl text-orange-600"></i>
                        <div>
                          <strong className="block text-xs uppercase text-gray-500">Type</strong>
                          <span className="font-bold">{formatIndoorOutdoor(park.indoorOutdoor)}</span>
                        </div>
                      </div>
                    )}
                    {park.sizeCategory && (
                      <div className="characteristic-item flex items-center gap-4">
                        <i className="bi bi-arrows-fullscreen text-xl text-orange-600"></i>
                        <div>
                          <strong className="block text-xs uppercase text-gray-500">Size</strong>
                          <span className="font-bold">{formatSizeCategory(park.sizeCategory)}</span>
                        </div>
                      </div>
                    )}
                    {park.surfaceType && (
                      <div className="characteristic-item flex items-center gap-4">
                        <i className="bi bi-grid-3x3-gap-fill text-xl text-orange-600"></i>
                        <div>
                          <strong className="block text-xs uppercase text-gray-500">Surface</strong>
                          <span className="font-bold">{park.surfaceType}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {park.rules && (
                <section className="premium-content-section park-rules-section">
                  <h2 className="premium-section-title">Rules & Requirements</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                    {park.rules.vaccinationsRequired !== undefined && (
                      <div className="characteristic-item flex items-center gap-3">
                        <i className={`bi ${park.rules.vaccinationsRequired ? 'bi-shield-check text-green-600' : 'bi-shield-dash text-gray-500'} text-2xl`}></i>
                        <div>
                          <strong className="block text-gray-900">Vaccinations</strong>
                          <span className="text-sm text-gray-600">{park.rules.vaccinationsRequired ? 'Required (Proof Needed)' : 'Not Strictly Required'}</span>
                        </div>
                      </div>
                    )}
                    {park.rules.spayNeuterRequired !== undefined && (
                      <div className="characteristic-item flex items-center gap-3">
                        <i className={`bi ${park.rules.spayNeuterRequired ? 'bi-check-circle-fill text-green-600' : 'bi-x-circle text-gray-500'} text-2xl`}></i>
                        <div>
                          <strong className="block text-gray-900">Spay/Neuter</strong>
                          <span className="text-sm text-gray-600">{park.rules.spayNeuterRequired ? 'Required' : 'Not Required'}</span>
                        </div>
                      </div>
                    )}
                    {park.rules.temperamentTestRequired !== undefined && (
                      <div className="characteristic-item flex items-center gap-3">
                        <i className={`bi ${park.rules.temperamentTestRequired ? 'bi-clipboard-check-fill text-green-600' : 'bi-clipboard text-gray-500'} text-2xl`}></i>
                        <div>
                          <strong className="block text-gray-900">Temperament Test</strong>
                          <span className="text-sm text-gray-600">{park.rules.temperamentTestRequired ? 'Required Before Entry' : 'No Evaluation Required'}</span>
                        </div>
                      </div>
                    )}
                    {park.rules.privateBookingAvailable !== undefined && (
                      <div className="characteristic-item flex items-center gap-3">
                        <i className={`bi ${park.rules.privateBookingAvailable ? 'bi-calendar-check-fill text-purple-600' : 'bi-calendar-minus text-gray-500'} text-2xl`}></i>
                        <div>
                          <strong className="block text-gray-900">Private Booking</strong>
                          <span className="text-sm text-gray-600">{park.rules.privateBookingAvailable ? 'Available (Solo Time)' : 'Group Play Only'}</span>
                        </div>
                      </div>
                    )}
                    {park.rules.staffSupervised !== undefined && (
                      <div className="characteristic-item flex items-center gap-3">
                        <i className={`bi ${park.rules.staffSupervised ? 'bi-person-badge-fill text-blue-600' : 'bi-person-bounding-box text-orange-500'} text-2xl`}></i>
                        <div>
                          <strong className="block text-gray-900">Supervision</strong>
                          <span className="text-sm text-gray-600">{park.rules.staffSupervised ? 'Staff Monitored (Park Rangers)' : 'Owner Supervised Only'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}


              <section className="premium-content-section directions-section">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="premium-section-title mb-0">Location Map</h2>
                  {park.latitude && park.longitude && (
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(park.full_address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 font-normal hover:underline"
                    >
                      Open Maps <i className="bi bi-box-arrow-up-right"></i>
                    </a>
                  )}
                </div>
                {park.latitude && park.longitude && (
                  <div className="rounded-lg overflow-hidden border border-gray-100 h-[350px]">
                    <ParkMapClient park={park} />
                  </div>
                )}
                <p className="directions-intro">
                  {park.name} is conveniently located at {park.full_address}.
                </p>
              </section>

              <section className="premium-content-section faq-section">
                <h2 className="premium-section-title">Frequently Asked Questions</h2>
                <div className="faq-list">
                  {faqItems.map((faq) => (
                    <details key={faq.question} className="group premium-faq-item border-b border-gray-200 last:border-0">
                      <summary className="flex items-center justify-between gap-4 py-2 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                        <h4 className="text-sm font-semibold text-slate-900">{faq.question}</h4>
                        <span className="relative flex h-6 w-6 flex-shrink-0 items-center justify-center text-slate-900">
                          <i className="bi bi-plus-lg absolute transition-opacity duration-200 group-open:opacity-0"></i>
                          <i className="bi bi-dash-lg absolute opacity-0 transition-opacity duration-200 group-open:opacity-100"></i>
                        </span>
                      </summary>
                      <div className="pb-2 pr-8 text-slate-600 text-sm leading-relaxed">
                        <p>{faq.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </section>

              <ReviewSection parkId={park.id} />

              {/* Related Blog Posts Section */}
              {relatedBlogPosts.length > 0 && (
                <section className="content-section related-blog-section">
                  <h2>Related Articles</h2>
                  <p className="section-intro">
                    Discover helpful guides and articles about dog parks in {park.city} and {park.businessType.toLowerCase()}s.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                    {relatedBlogPosts.slice(0, 2).map((post) => {
                      const featuredImage =
                        post.featuredImage?.media_details?.sizes?.large?.source_url ||
                        post.featuredImage?.media_details?.sizes?.medium?.source_url ||
                        post.featuredImage?.source_url;

                      return (
                        <Link
                          key={post.id}
                          href={`/blog/${post.slug}`}
                          className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-orange-300 transition-all flex flex-col"
                        >
                          {featuredImage && (
                            <div className="relative w-full aspect-[4/3] overflow-hidden">
                              <Image
                                src={featuredImage}
                                alt={post.featuredImage?.alt_text || post.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                unoptimized={true}
                              />
                            </div>
                          )}
                          <div className="p-5 flex-1">
                            <h3 className="text-base font-semibold text-gray-900 line-clamp-2 hover:text-orange-600 leading-tight">
                              {post.title}
                            </h3>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  <div className="mt-6 text-center">
                    <Link href="/blog" prefetch={false} className="text-orange-600 hover:text-orange-700 font-medium">
                      View All Articles →
                    </Link>
                  </div>
                </section>
              )}
            </div>

            <aside className="premium-sidebar-column">
              {openingHourEntries.length > 0 && (
                <div className="sidebar-card-premium">
                  <h3>Business Hours</h3>
                  <ul className="hours-list-premium">
                    {openingHourEntries.map(([day, hours]) => {
                      const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === day;
                      return (
                        <li key={day} className={isToday ? 'today' : ''}>
                          <span className="day">{day}</span>
                          <span className="time">{hours}</span>
                        </li>
                      );
                    })}
                  </ul>
                  {park.hoursNote && (
                    <p className="mt-4 text-xs italic text-gray-500">
                      <i className="bi bi-info-circle"></i> {park.hoursNote}
                    </p>
                  )}
                </div>
              )}

              <div className="sidebar-card-premium">
                <h3>Contact Provider</h3>
                <div className="contact-info-premium">
                  <div className="contact-item-premium">
                    <div className="contact-icon-premium">
                      <i className="bi bi-geo-alt-fill"></i>
                    </div>
                    <div className="contact-text-premium">
                      <strong>Office Address</strong>
                      <p>{park.full_address}</p>
                    </div>
                  </div>
                  {park.phone && (
                    <div className="contact-item-premium">
                      <div className="contact-icon-premium">
                        <i className="bi bi-telephone-fill"></i>
                      </div>
                      <div className="contact-text-premium">
                        <strong>Call Now</strong>
                        <p><a href={`tel:${park.phone}`}>{park.phone}</a></p>
                      </div>
                    </div>
                  )}
                  {park.website && (
                    <div className="contact-item-premium">
                      <div className="contact-icon-premium">
                        <i className="bi bi-globe"></i>
                      </div>
                      <div className="contact-text-premium">
                        <strong>Visit Website</strong>
                        <p>
                          <a href={park.website} target="_blank" rel="noopener noreferrer">
                            {park.website.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                          </a>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Claim Listing Card (Only for static parks) */}
              {park.source === 'static' && (
                <div className="sidebar-card-premium bg-gradient-to-br from-indigo-50 to-purple-50 border-purple-100">
                  <h3 className="text-purple-900">Is this your business?</h3>
                  <p className="text-sm text-purple-700 mb-4">Claim this listing to update your info, add photos, and get the Verified badge.</p>
                  <Link href={`/list-your-park?claim=${park.id}`} className="btn-primary w-full py-3 rounded-lg font-bold text-center block">
                    Claim This Listing
                  </Link>
                </div>
              )}

              {/* Combined Business Owner Card */}
              <div className="sidebar-card-premium bg-amber-50 border-amber-100">
                <h3 className="text-amber-900 flex items-center gap-2">
                  <i className="bi bi-award-fill text-amber-500"></i> Get Featured for Free
                </h3>
                <p className="text-sm text-gray-600 mb-3">Add our badge to your website and we will upgrade your park to a <strong>Featured Listing</strong>—giving you 3x more views from local dog owners.</p>
                <BadgeEmbedButton parkSlug={park.slug || park.id} parkName={park.name} />
              </div>
            </aside>
          </div>

          {nearbyParks.length > 0 && (
            <section className="nearby-parks-section mt-8 pt-6 border-t border-gray-100">
              <div className="nearby-parks-header flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Similar Dog Parks in {nearbyScope}</h2>
                  <p className="text-gray-600 mt-2">Explore more dog-friendly locations near {park.name}.</p>
                </div>
                <Link href={`/states/${getStateAbbr(park.state).toLowerCase()}`} className="text-orange-600 font-bold hover:underline whitespace-nowrap">
                  View all parks in {getStateAbbr(park.state)} →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {nearbyParks.map((nearbyPark) => (
                  <Link key={nearbyPark.id} href={getParkUrl(nearbyPark)} className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors uppercase text-sm tracking-tight">{nearbyPark.name}</h3>
                      <span className="flex items-center gap-1 text-sm font-bold text-gray-700">
                        <i className="bi bi-star-fill text-yellow-500"></i> {nearbyPark.rating}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">{nearbyPark.businessType}</p>
                    <p className="text-sm text-gray-500">{nearbyPark.city}, {nearbyPark.state}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {nearbyCities && nearbyCities.length > 0 && (
            <NearbyCitiesWidget currentCity={park.city} currentState={stateName} nearbyCities={nearbyCities} />
          )}
        </div>
      </main >

      <Footer />
    </>
  );
}

// Helper function to render simple markdown links [text](url)
function renderMarkdownText(text: string): React.ReactNode {
  // Regex to match markdown links: [text](url)
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;

  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // Add the link
    const [, linkText, linkUrl] = match;
    const isExternal = linkUrl.startsWith('http');

    parts.push(
      <a
        key={match.index}
        href={linkUrl}
        className="text-orange-600 hover:text-orange-700 hover:underline font-medium"
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
      >
        {linkText}
      </a>
    );

    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? <>{parts}</> : text;
}

function formatAmenityName(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

// Helper function to format pricing type for display
function formatPricingType(type?: string): string {
  if (!type) return 'Contact for Pricing';
  const typeMap: Record<string, string> = {
    'free': 'Free',
    'hourly': 'Hourly Rate',
    'daily': 'Daily Rate',
    'monthly': 'Monthly Membership',
    'membership': 'Membership Required',
    'per-visit': 'Per Visit',
    'mixed': 'Multiple Pricing Options'
  };
  return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
}

// Helper function to format indoor/outdoor for display
function formatIndoorOutdoor(type?: string): string {
  if (!type) return '';
  const typeMap: Record<string, string> = {
    'indoor': 'Indoor',
    'outdoor': 'Outdoor',
    'both': 'Indoor & Outdoor'
  };
  return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
}

// Helper function to format size category
function formatSizeCategory(size?: string): string {
  if (!size) return '';
  return size.charAt(0).toUpperCase() + size.slice(1);
}

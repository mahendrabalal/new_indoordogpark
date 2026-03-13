import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReviewSection from '@/components/ReviewSection';
import ParkDetailSchema from '@/components/ParkDetailSchema';
import ParkStatusBadge from '@/components/ParkStatusBadge';
import ParkMapClient from '@/components/ParkMapClient';
import { extractLocationFromSlug, getAllStaticParks, getCitySlugByName, getParkBySlug } from '@/lib/parks-data';
import { generateBreadcrumbSchema, generateParkMetadata, generateParkSchema, generateReviewSchemas, generateWebPageSchema } from '@/lib/metadata';
import { buildParkFAQs } from '@/lib/park-faq-data';
import { getParkReviews } from '@/lib/reviews-data';
import { getRelatedBlogPosts } from '@/lib/related-content';


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

// Reviews are dynamic, so pages must be dynamic too
export const dynamic = 'force-dynamic';

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

  // Redirect to canonical slug if different (301 permanent redirect for SEO)
  const canonicalSlug = park.slug || park.id;
  if (canonicalSlug !== slug) {
    permanentRedirect(`/parks/${canonicalSlug}`);
  }

  const allParks = await getAllStaticParks();
  const nearbyParks = allParks
    .filter((p) => p.id !== park.id && p.city === park.city)
    .slice(0, 4);

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
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: park.city, url: `/cities/${citySlug}` },
    { name: park.name },
  ]);

  const descriptionText =
    park.description?.trim() ||
    `Learn more about ${park.name}, a ${park.businessType.toLowerCase()} located in ${park.city}, ${stateName}.`;
  const descriptionParagraphs = descriptionText.split(/\n\s*\n/).filter(Boolean);
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
      {/* LocalBusiness structured data for rich snippets */}
      <ParkDetailSchema park={park} url={`/parks/${park.slug || park.id}`} />

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
                <Link href={`/cities/${citySlug}`}>
                  {park.city}
                </Link>
                <i className="bi bi-chevron-right"></i>
                <span>{park.name}</span>
              </div>

              <div className="premium-badge-row">
                <span className="premium-badge badge-verified">
                  <i className="bi bi-patch-check-fill"></i> VERIFIED LISTING
                </span>
                <ParkStatusBadge park={park} showNextChange={false} className="premium-badge" />
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
                  <span className="ml-1 text-sm opacity-80">({park.reviewCount} reviews)</span>
                </span>
              </div>
            </div>
          </div>
        </section>



        <div className="container park-detail-container">
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

              {park.pricing && (
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
                          <div className="pricing-details-text mt-4">
                            <p>{park.pricing.pricingDetails}</p>
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

              {park.amenities && (
                <section className="premium-content-section">
                  <h2 className="premium-section-title">Amenities & Features</h2>
                  <div className="amenities-grid-premium">
                    {Object.entries(park.amenities)
                      .filter(([, value]) => value === true)
                      .map(([key]) => (
                        <div key={key} className="amenity-item-premium">
                          <i className="bi bi-check-circle-fill"></i>
                          <span>{formatAmenityName(key)}</span>
                        </div>
                      ))}
                  </div>
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


              <section className="premium-content-section directions-section">
                <div className="flex justify-between items-center mb-6">
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
                  <div className="mb-6 rounded-xl overflow-hidden shadow-inner border border-gray-100 h-[400px]">
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
                    <div key={faq.question} className="premium-faq-item">
                      <h4>{faq.question}</h4>
                      <p>{faq.answer}</p>
                    </div>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                    {relatedBlogPosts.map((post) => {
                      const featuredImage =
                        post.featuredImage?.media_details?.sizes?.large?.source_url ||
                        post.featuredImage?.media_details?.sizes?.medium?.source_url ||
                        post.featuredImage?.source_url;

                      return (
                        <Link
                          key={post.id}
                          href={`/blog/${post.slug}`}
                          className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-purple-300 transition-all flex flex-col"
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
                            <h3 className="text-base font-semibold text-gray-900 line-clamp-2 hover:text-purple-600 leading-tight">
                              {post.title}
                            </h3>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  <div className="mt-6 text-center">
                    <Link href="/blog" className="text-purple-600 hover:text-purple-700 font-medium">
                      View All Articles →
                    </Link>
                  </div>
                </section>
              )}
            </div>

            <aside className="premium-sidebar-column">
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

              {park.openingHours && (
                <div className="sidebar-card-premium">
                  <h3>Business Hours</h3>
                  <ul className="hours-list-premium">
                    {Object.entries(park.openingHours)
                      .filter(([, hours]) => hours && typeof hours === 'string')
                      .map(([day, hours]) => {
                        const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === day;
                        return (
                          <li key={day} className={isToday ? 'today' : ''}>
                            <span className="day">{day}</span>
                            <span className="time">{hours as string}</span>
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
                <h3>Need a Quote?</h3>
                <p className="text-sm text-gray-600 mb-6">Compare prices and get the best deal for your pet&apos;s needs.</p>
                <div className="sidebar-ctas">
                  <button className="btn-primary w-full py-3 rounded-lg font-bold">Get Free Estimate</button>
                </div>
              </div>

              {/* City Link Card */}
              <div className="sidebar-card-premium">
                <h3>Explore {park.city}</h3>
                <p className="text-sm text-gray-600 mb-4">Discover more dog parks and resources in {park.city}.</p>
                <Link href={`/cities/${citySlug}`} className="btn-primary-outline w-full py-3 rounded-lg font-bold text-center block">
                  View All Parks in {park.city}
                </Link>
              </div>
            </aside>
          </div>

          {nearbyParks.length > 0 && (
            <section className="nearby-parks-section mt-12 pt-12 border-t border-gray-100">
              <div className="nearby-parks-header flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Other Dog Parks in {park.city}</h2>
                  <p className="text-gray-600 mt-2">Explore more dog-friendly locations near {park.name}.</p>
                </div>
                <Link href={`/cities/${citySlug}`} className="text-orange-600 font-bold hover:underline">
                  View all parks in {park.city} →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {nearbyParks.map((nearbyPark) => (
                  <Link key={nearbyPark.id} href={`/parks/${nearbyPark.slug || nearbyPark.id}`} className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all group">
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

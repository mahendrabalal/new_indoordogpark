import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReviewSection from '@/components/ReviewSection';
import '@/app/parks/park-detail.css';
import '@/app/parks/premium-park.css';

import ParkPhotoGallery from '@/components/ParkPhotoGallery';
import ParkDetailHero from '@/components/ParkDetailHero';
import ParkQuickHighlights from '@/components/ParkQuickHighlights';
import ParkLocationCard from '@/components/ParkLocationCard';
import { extractLocationFromSlug, getAllStaticParks, getCitySlugByName, getParkBySlug } from '@/lib/parks-data';
import { generateBreadcrumbSchema, generateParkMetadata, generateParkSchema, generateReviewSchemas, generateWebPageSchema } from '@/lib/metadata';
import { buildParkFAQs } from '@/lib/park-faq-data';
import { getParkReviews } from '@/lib/reviews-data';
import { getRelatedBlogPosts } from '@/lib/related-content';
import { isDogTrainingFacility, isDogFriendlyEstablishment, getParkUrl } from '@/lib/routing';
import { generateParkDescriptionParagraphs, formatBusinessTypeName } from '@/lib/park-description';

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
  if (abbr.length > 2) return abbr;
  return stateMap[abbr.toUpperCase()] || abbr;
}

export const revalidate = 2592000;
export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
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
    const location = extractLocationFromSlug(slug);
    if (location) {
      const citySlug = await getCitySlugByName(location.city, location.state);
      if (citySlug) {
        permanentRedirect(`/cities/${citySlug}?ref=missing-park`);
      }
    }
    notFound();
  }

  // Redirect to semantic routes if applicable
  if (isDogTrainingFacility(park)) {
    permanentRedirect(`/dog-training/${park.slug || park.id}`);
  }

  if (isDogFriendlyEstablishment(park)) {
    permanentRedirect(`/dog-friendly/${park.slug || park.id}`);
  }

  const canonicalSlug = park.slug || park.id;
  if (canonicalSlug !== slug) {
    permanentRedirect(`/parks/${canonicalSlug}`);
  }

  const allParks = await getAllStaticParks();
  let nearbyParks = allParks
    .filter((p) => p.id !== park.id && p.city === park.city)
    .slice(0, 4);

  if (nearbyParks.length < 4) {
    const stateParks = allParks
      .filter((p) => p.id !== park.id && p.state === park.state && !nearbyParks.find(np => np.id === p.id))
      .slice(0, 4 - nearbyParks.length);
    nearbyParks = [...nearbyParks, ...stateParks];
  }

  const reviews = await getParkReviews(park.id);
  const reviewSchemas = generateReviewSchemas(reviews, park);
  const relatedBlogPosts = await getRelatedBlogPosts(park, 4);

  const parkSchema = generateParkSchema(park);
  const webPageSchema = generateWebPageSchema(park);
  const stateName = getStateName(park.state);
  const stateSlug = stateName ? stateName.toLowerCase().replace(/\s+/g, '-') : 'california';

  const citySlug = (await getCitySlugByName(park.city, park.state)) || park.city.toLowerCase().replace(/\s+/g, '-');
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    ...(stateName ? [{ name: stateName, url: `/states/${stateSlug}` }] : []),
    { name: park.city, url: `/cities/${citySlug}` },
    { name: park.name },
  ]);

  const descriptionParagraphs = generateParkDescriptionParagraphs(park);
  const openingHourEntries = Object.entries(park.openingHours ?? {}).filter(
    ([, hours]) => typeof hours === 'string' && hours.trim().length > 0,
  );
  
  const faqItems = park.faqs && park.faqs.length > 0 ? park.faqs : buildParkFAQs(park);

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

  const validFAQs = faqItems
    .filter((faq) => {
      const hasQuestion = faq.question && faq.question.trim().length > 0;
      const hasAnswer = faq.answer && faq.answer.trim().length > 0;
      const validAnswerLength = faq.answer && faq.answer.trim().length >= 10;
      return hasQuestion && hasAnswer && validAnswerLength;
    })
    .slice(0, 10);

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

  const businessTypeDisplay = formatBusinessTypeName(park.businessType);

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
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
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
        <ParkDetailHero
          park={park}
          citySlug={citySlug}
          stateSlug={stateSlug}
          stateName={stateName}
          categoryTitle="Dog Parks"
          categoryHref="/parks"
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl park-detail-container pt-6 sm:pt-8">
          <ParkPhotoGallery
            photos={park.photos}
            primaryPhoto={park.photo}
            parkName={park.name}
            parkCity={park.city}
            parkState={park.state}
            listingSlug={canonicalSlug}
          />

          <ParkQuickHighlights park={park} />

          <div className="premium-content-grid">
            <div className="premium-main-column">
              <section className="premium-content-section">
                <h2 className="premium-section-title">
                  <span>About {park.name}</span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-100">
                    {businessTypeDisplay}
                  </span>
                </h2>
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
                      <div className="pricing-type-badge free-pricing mb-4">
                        <i className="bi bi-check-circle-fill"></i>
                        <span>Free Public Access</span>
                      </div>
                    ) : (
                      <>
                        {park.pricing.pricingType && (
                          <div className="pricing-type-badge mb-4">
                            <i className="bi bi-currency-dollar"></i>
                            <span>{formatPricingType(park.pricing.pricingType)}</span>
                          </div>
                        )}
                        <div className="pricing-details grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
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
                          <div className="pricing-details-text mt-3 space-y-2 text-sm text-gray-700">
                            {park.pricing.pricingDetails.split(/\n\s*\n/).map((p, idx) => (
                              <p key={idx}>{renderMarkdownText(p)}</p>
                            ))}
                          </div>
                        )}
                        {park.pricing.pricingUrl && (
                          <div className="pricing-link mt-4">
                            <a href={park.pricing.pricingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-orange-600 hover:text-orange-700 font-semibold hover:underline">
                              <i className="bi bi-box-arrow-up-right"></i> View Full Pricing Details
                            </a>
                          </div>
                        )}
                      </>
                    )}
                    <p className="pricing-disclaimer mt-4 text-xs italic text-gray-500 flex items-center gap-1.5">
                      <i className="bi bi-info-circle"></i> Pricing and admission policies may vary. Please contact {park.name} directly for current rates and entry requirements.
                    </p>
                  </div>
                </section>
              )}

              {park.amenities && Object.entries(park.amenities).filter(([, value]) => value === true).length > 0 && (
                <section className="premium-content-section">
                  <h2 className="premium-section-title">Amenities & Features</h2>
                  <div className="amenities-grid-premium">
                    {Object.entries(park.amenities)
                      .filter(([, value]) => value === true)
                      .map(([key]) => (
                        <div key={key} className="amenity-item-premium">
                          <i className="bi bi-check-circle-fill text-emerald-500"></i>
                          <span>{formatAmenityName(key)}</span>
                        </div>
                      ))}
                  </div>
                </section>
              )}

              {(park.indoorOutdoor || park.sizeCategory || park.surfaceType) && (
                <section className="premium-content-section park-characteristics-section">
                  <h2 className="premium-section-title">Park Environment</h2>
                  <div className="park-characteristics grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {park.indoorOutdoor && (
                      <div className="characteristic-item flex items-center gap-3 bg-white p-3.5 rounded-xl border border-gray-100 shadow-xs">
                        <i className="bi bi-houses-fill text-xl text-orange-500"></i>
                        <div>
                          <strong className="block text-[11px] uppercase text-gray-400">Environment</strong>
                          <span className="font-bold text-sm text-gray-900">{formatIndoorOutdoor(park.indoorOutdoor)}</span>
                        </div>
                      </div>
                    )}
                    {park.sizeCategory && (
                      <div className="characteristic-item flex items-center gap-3 bg-white p-3.5 rounded-xl border border-gray-100 shadow-xs">
                        <i className="bi bi-arrows-fullscreen text-xl text-orange-500"></i>
                        <div>
                          <strong className="block text-[11px] uppercase text-gray-400">Scale</strong>
                          <span className="font-bold text-sm text-gray-900">{formatSizeCategory(park.sizeCategory)}</span>
                        </div>
                      </div>
                    )}
                    {park.surfaceType && (
                      <div className="characteristic-item flex items-center gap-3 bg-white p-3.5 rounded-xl border border-gray-100 shadow-xs">
                        <i className="bi bi-grid-3x3-gap-fill text-xl text-orange-500"></i>
                        <div>
                          <strong className="block text-[11px] uppercase text-gray-400">Surface</strong>
                          <span className="font-bold text-sm text-gray-900">{park.surfaceType}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {park.rules && (
                <section className="premium-content-section park-rules-section">
                  <h2 className="premium-section-title">Rules & Requirements</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/80 p-5 rounded-2xl border border-slate-100">
                    {park.rules.vaccinationsRequired !== undefined && (
                      <div className="flex items-center gap-3">
                        <i className={`bi ${park.rules.vaccinationsRequired ? 'bi-shield-check text-emerald-600' : 'bi-shield-dash text-gray-400'} text-2xl`}></i>
                        <div>
                          <strong className="block text-sm text-gray-900 font-bold">Vaccinations</strong>
                          <span className="text-xs text-gray-600">{park.rules.vaccinationsRequired ? 'Required (Proof Needed)' : 'Recommended'}</span>
                        </div>
                      </div>
                    )}
                    {park.rules.spayNeuterRequired !== undefined && (
                      <div className="flex items-center gap-3">
                        <i className={`bi ${park.rules.spayNeuterRequired ? 'bi-check-circle-fill text-emerald-600' : 'bi-x-circle text-gray-400'} text-2xl`}></i>
                        <div>
                          <strong className="block text-sm text-gray-900 font-bold">Spay/Neuter Policy</strong>
                          <span className="text-xs text-gray-600">{park.rules.spayNeuterRequired ? 'Required for Group Play' : 'Not Strictly Required'}</span>
                        </div>
                      </div>
                    )}
                    {park.rules.temperamentTestRequired !== undefined && (
                      <div className="flex items-center gap-3">
                        <i className={`bi ${park.rules.temperamentTestRequired ? 'bi-clipboard-check-fill text-emerald-600' : 'bi-clipboard text-gray-400'} text-2xl`}></i>
                        <div>
                          <strong className="block text-sm text-gray-900 font-bold">Temperament Assessment</strong>
                          <span className="text-xs text-gray-600">{park.rules.temperamentTestRequired ? 'Required Prior to Admission' : 'Evaluation on First Visit'}</span>
                        </div>
                      </div>
                    )}
                    {park.rules.privateBookingAvailable !== undefined && (
                      <div className="flex items-center gap-3">
                        <i className={`bi ${park.rules.privateBookingAvailable ? 'bi-calendar-check-fill text-indigo-600' : 'bi-calendar-minus text-gray-400'} text-2xl`}></i>
                        <div>
                          <strong className="block text-sm text-gray-900 font-bold">Private Booking</strong>
                          <span className="text-xs text-gray-600">{park.rules.privateBookingAvailable ? 'Private Sessions Available' : 'Group Play Only'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              <ParkLocationCard park={park} />

              <section className="premium-content-section faq-section">
                <h2 className="premium-section-title">Frequently Asked Questions</h2>
                <div className="faq-list divide-y divide-gray-100">
                  {faqItems.map((faq) => (
                    <details key={faq.question} className="group py-4 first:pt-0 last:pb-0">
                      <summary className="flex items-center justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                          {faq.question}
                        </h3>
                        <span className="relative flex h-6 w-6 flex-shrink-0 items-center justify-center text-slate-500 group-open:text-orange-600">
                          <i className="bi bi-plus-lg absolute transition-transform duration-200 group-open:rotate-45"></i>
                        </span>
                      </summary>
                      <div className="mt-3 text-sm text-slate-600 leading-relaxed pr-6">
                        <p>{faq.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </section>

              <ReviewSection parkId={park.id} />

              {relatedBlogPosts.length > 0 && (
                <section className="content-section related-blog-section pt-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Related Articles</h2>
                  <p className="text-sm text-gray-600 mb-5">
                    Helpful guides, dog park etiquette, and pet care resources in {park.city}.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {relatedBlogPosts.map((post) => {
                      const featuredImage =
                        post.featuredImage?.media_details?.sizes?.large?.source_url ||
                        post.featuredImage?.media_details?.sizes?.medium?.source_url ||
                        post.featuredImage?.source_url;

                      return (
                        <Link
                          key={post.id}
                          href={`/blog/${post.slug}`}
                          className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-orange-300 transition-all flex flex-col group"
                        >
                          {featuredImage && (
                            <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100">
                              <Image
                                src={featuredImage}
                                alt={post.featuredImage?.alt_text || post.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                unoptimized={true}
                              />
                            </div>
                          )}
                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-orange-600 leading-snug">
                              {post.title}
                            </h3>
                            <span className="text-[11px] font-semibold text-orange-600 mt-2 flex items-center gap-1">
                              Read Guide →
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>

            <aside className="premium-sidebar-column">
              <div className="sidebar-card-premium">
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">Contact Provider</h3>
                <div className="contact-info-premium space-y-4">
                  <div className="contact-item-premium flex items-start gap-3">
                    <div className="contact-icon-premium w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0">
                      <i className="bi bi-geo-alt-fill"></i>
                    </div>
                    <div className="contact-text-premium flex-1">
                      <strong className="block text-[11px] uppercase tracking-wider text-gray-400">Office Address</strong>
                      <p className="text-sm font-semibold text-gray-800 leading-snug mt-0.5">{park.full_address}</p>
                    </div>
                  </div>

                  {park.phone && (
                    <div className="contact-item-premium flex items-start gap-3">
                      <div className="contact-icon-premium w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <i className="bi bi-telephone-fill"></i>
                      </div>
                      <div className="contact-text-premium flex-1">
                        <strong className="block text-[11px] uppercase tracking-wider text-gray-400">Call Now</strong>
                        <p className="text-sm font-semibold text-gray-800 mt-0.5">
                          <a href={`tel:${park.phone}`} className="text-blue-600 hover:underline">
                            {park.phone}
                          </a>
                        </p>
                      </div>
                    </div>
                  )}

                  {park.website && (
                    <div className="contact-item-premium flex items-start gap-3">
                      <div className="contact-icon-premium w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                        <i className="bi bi-globe"></i>
                      </div>
                      <div className="contact-text-premium flex-1">
                        <strong className="block text-[11px] uppercase tracking-wider text-gray-400">Official Website</strong>
                        <p className="text-sm font-semibold mt-0.5">
                          <a
                            href={park.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-600 hover:underline flex items-center gap-1"
                          >
                            <span>{park.website.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}</span>
                            <i className="bi bi-box-arrow-up-right text-xs"></i>
                          </a>
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col gap-2.5">
                  {park.phone ? (
                    <a
                      href={`tel:${park.phone}`}
                      className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-center text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
                    >
                      <i className="bi bi-telephone-fill"></i> Call {park.name}
                    </a>
                  ) : null}

                  {park.website ? (
                    <a
                      href={park.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl text-center text-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <i className="bi bi-globe"></i> Visit Official Site
                    </a>
                  ) : null}
                </div>
              </div>

              {openingHourEntries.length > 0 && (
                <div className="sidebar-card-premium">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 pb-3 border-b border-gray-100 flex items-center justify-between">
                    <span>Business Hours</span>
                    <i className="bi bi-clock text-gray-400 text-base"></i>
                  </h3>
                  <ul className="hours-list-premium divide-y divide-gray-50">
                    {openingHourEntries.map(([day, hours]) => {
                      const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === day;
                      return (
                        <li key={day} className={`flex justify-between items-center py-2 text-xs ${isToday ? 'font-bold text-orange-600 bg-orange-50/60 px-2 rounded-lg' : 'text-gray-600'}`}>
                          <span className="day">{day}</span>
                          <span className="time font-medium">{hours}</span>
                        </li>
                      );
                    })}
                  </ul>
                  {park.hoursNote && (
                    <p className="mt-3 text-xs italic text-gray-500">
                      <i className="bi bi-info-circle"></i> {park.hoursNote}
                    </p>
                  )}
                </div>
              )}

              {park.source === 'static' && (
                <div className="sidebar-card-premium bg-gradient-to-br from-indigo-50/70 to-purple-50/70 border-indigo-100">
                  <div className="flex items-center gap-2 mb-1.5">
                    <i className="bi bi-patch-check-fill text-indigo-600 text-base"></i>
                    <h3 className="text-base font-bold text-indigo-950 m-0">Business Owner?</h3>
                  </div>
                  <p className="text-xs text-indigo-800/80 mb-4 leading-relaxed">
                    Claim your free verified profile to update hours, post photos, and connect with local pet parents.
                  </p>
                  <Link
                    href={`/list-your-park?claim=${encodeURIComponent(park.id)}`}
                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl text-center block shadow-xs transition-colors"
                  >
                    Claim This Listing (Free)
                  </Link>
                </div>
              )}

              <div className="sidebar-card-premium">
                <h3 className="text-base font-bold text-gray-900 mb-2">Explore {park.city}</h3>
                <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                  Discover more dog parks and pet recreation spots in {park.city}.
                </p>
                <Link
                  href={`/cities/${citySlug}`}
                  className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 text-orange-600 border border-orange-300 font-bold rounded-xl text-center text-xs block transition-all"
                >
                  View All Parks in {park.city} →
                </Link>
              </div>
            </aside>
          </div>

          {nearbyParks.length > 0 && (
            <section className="nearby-parks-section mt-12 pt-10 border-t border-gray-200">
              <div className="nearby-parks-header flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Other Dog Parks in {park.city}</h2>
                  <p className="text-sm text-gray-500 mt-1">Explore more dog-friendly locations near {park.name}.</p>
                </div>
                <Link href={`/cities/${citySlug}`} className="text-sm font-bold text-orange-600 hover:text-orange-700 hover:underline">
                  View all parks in {park.city} →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {nearbyParks.map((nearbyPark) => (
                  <Link
                    key={nearbyPark.id}
                    href={getParkUrl(nearbyPark)}
                    className="bg-white p-5 rounded-2xl border border-gray-200 hover:shadow-lg hover:border-orange-300 transition-all duration-200 group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors text-sm uppercase tracking-tight line-clamp-2">
                          {nearbyPark.name}
                        </h3>
                        {nearbyPark.rating ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md flex-shrink-0">
                            <i className="bi bi-star-fill text-amber-400"></i> {nearbyPark.rating.toFixed(1)}
                          </span>
                        ) : null}
                      </div>
                      <p className="text-[11px] font-bold text-orange-600 uppercase tracking-wider mb-2">
                        {formatBusinessTypeName(nearbyPark.businessType)}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 pt-3 border-t border-gray-50 flex items-center gap-1">
                      <i className="bi bi-geo-alt"></i>
                      {nearbyPark.city}, {nearbyPark.state}
                    </p>
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

function renderMarkdownText(text: string): React.ReactNode {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(renderBoldText(text.substring(lastIndex, match.index), parts.length));
    }

    const [, linkText, linkUrl] = match;
    const isExternal = linkUrl.startsWith('http');

    parts.push(
      <a
        key={`link-${match.index}`}
        href={linkUrl}
        className="text-orange-600 hover:text-orange-700 hover:underline font-medium"
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
      >
        {linkText}
      </a>
    );

    lastIndex = linkRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(renderBoldText(text.substring(lastIndex), parts.length));
  }

  return parts.length > 0 ? <>{parts}</> : renderBoldText(text, 0);
}

function renderBoldText(text: string, baseKey: number): React.ReactNode {
  const boldRegex = /\*\*([^*]+)\*\*/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(
      <strong key={`bold-${baseKey}-${match.index}`} className="font-bold text-gray-900">
        {match[1]}
      </strong>
    );
    lastIndex = boldRegex.lastIndex;
  }

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

function formatPricingType(type?: string): string {
  if (!type) return 'Contact for Pricing';
  const typeMap: Record<string, string> = {
    'free': 'Free Public Access',
    'hourly': 'Hourly Rate',
    'daily': 'Daily Pass',
    'monthly': 'Monthly Membership',
    'membership': 'Membership Required',
    'per-visit': 'Per Visit',
    'mixed': 'Flexible Options'
  };
  return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
}

function formatIndoorOutdoor(type?: string): string {
  if (!type) return '';
  const typeMap: Record<string, string> = {
    'indoor': 'Indoor (Climate Controlled)',
    'outdoor': 'Outdoor Yards',
    'both': 'Indoor & Outdoor Yards'
  };
  return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
}

function formatSizeCategory(size?: string): string {
  if (!size) return '';
  return size.charAt(0).toUpperCase() + size.slice(1);
}

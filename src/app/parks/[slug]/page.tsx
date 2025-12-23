import dynamicImport from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FavoriteButton from '@/components/FavoriteButton';
import ReviewSection from '@/components/ReviewSection';
import ParkImage from '@/components/ParkImage';
import ParkDetailSchema from '@/components/ParkDetailSchema';
import ParkStatusBadge from '@/components/ParkStatusBadge';
import { getAllStaticParks, getCitySlugByName, getParkBySlug } from '@/lib/parks-data';
import { generateBreadcrumbSchema, generateParkMetadata, generateParkSchema, generateReviewSchemas } from '@/lib/metadata';
import { buildParkFAQs } from '@/lib/park-faq-data';
import { getParkReviews } from '@/lib/reviews-data';
import { getRelatedBlogPosts } from '@/lib/related-content';

const ParkMap = dynamicImport(() => import('@/components/ParkMap'), {
  ssr: false,
});

type ParkPageProps = {
  params: {
    slug: string;
  };
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

// Helper function to get park image URL with validation and fallback
// Prefers local images over external URLs
function getParkImageUrl(park: { photo?: string; photos?: Array<{ url?: string }> }): string {
  // Default fallback image (Unsplash with proper parameters)
  const defaultImage = 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80';
  
  // Helper to check if URL is local
  const isLocalImage = (url: string): boolean => {
    return url.startsWith('/images/') || url.startsWith('./images/');
  };
  
  // Helper to check if URL is Supabase storage (should work reliably)
  const isSupabaseImage = (url: string): boolean => {
    return url.includes('supabase.co/storage/v1/object/public/');
  };
  
  // Helper to check if URL is external and might fail
  const isExternalUrl = (url: string): boolean => {
    return url.startsWith('http://') || url.startsWith('https://');
  };
  
  // Priority 1: Check single photo field (prefer local, then Supabase)
  if (typeof park.photo === 'string' && park.photo.trim() !== '') {
    const photoUrl = park.photo.trim();
    
    // Prefer local images
    if (isLocalImage(photoUrl)) {
      return photoUrl;
    }
    
    // Supabase storage URLs are reliable (featured parks)
    if (isSupabaseImage(photoUrl)) {
      return photoUrl;
    }
    
    // For other external URLs, validate format
    if (isExternalUrl(photoUrl)) {
      try {
        const url = new URL(photoUrl);
        if (url.protocol === 'http:' || url.protocol === 'https:') {
          return photoUrl;
        }
      } catch {
        // Invalid URL, continue to next check
      }
    }
  }
  
  // Priority 2: Check photos array (prefer local, then Supabase)
  if (park.photos && park.photos.length > 0) {
    // First, try to find a local image
    for (const photo of park.photos) {
      if (photo?.url && typeof photo.url === 'string') {
        const photoUrl = photo.url.trim();
        if (isLocalImage(photoUrl)) {
          return photoUrl;
        }
      }
    }
    
    // Then, try to find a Supabase image (featured parks)
    for (const photo of park.photos) {
      if (photo?.url && typeof photo.url === 'string') {
        const photoUrl = photo.url.trim();
        if (isSupabaseImage(photoUrl)) {
          return photoUrl;
        }
      }
    }
    
    // If no local or Supabase image found, use first external URL
    const firstPhoto = park.photos[0];
    if (firstPhoto?.url && typeof firstPhoto.url === 'string' && firstPhoto.url.trim() !== '') {
      const photoUrl = firstPhoto.url.trim();
      if (isExternalUrl(photoUrl)) {
        try {
          const url = new URL(photoUrl);
          if (url.protocol === 'http:' || url.protocol === 'https:') {
            return photoUrl;
          }
        } catch {
          // Invalid URL, continue to fallback
        }
      }
    }
  }
  
  // Return default fallback
  return defaultImage;
}

export const dynamic = 'force-dynamic'; // Reviews are dynamic, so pages must be dynamic too

export async function generateStaticParams() {
  const parks = await getAllStaticParks();
  return parks.map((park) => ({
    slug: park.slug || park.id,
  }));
}

export async function generateMetadata({ params }: ParkPageProps): Promise<Metadata> {
  const park = await getParkBySlug(params.slug);
  if (!park) {
    return {};
  }
  return generateParkMetadata(park);
}

export default async function ParkDetailPage({ params }: ParkPageProps) {
  const park = await getParkBySlug(params.slug);

  if (!park) {
    // Park not found - return 404
    notFound();
  }

  // Redirect to canonical slug if different (301 permanent redirect for SEO)
  const canonicalSlug = park.slug || park.id;
  if (canonicalSlug !== params.slug) {
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

      <main className="park-detail-page">
        <section className="park-hero">
          <div className="park-hero-image">
            <ParkImage
              src={getParkImageUrl(park)}
              alt={`${park.name} in ${park.city}, ${stateName}`}
              width={1400}
              height={500}
              className="hero-image"
              priority
            />
          </div>
          <div className="park-hero-content">
            <div className="container">
              <div className="breadcrumbs">
                <Link href="/">Home</Link>
                <i className="bi bi-chevron-right"></i>
                <Link href={`/cities/${citySlug}`}>
                  {park.city}
                </Link>
                <i className="bi bi-chevron-right"></i>
                <span>{park.name}</span>
              </div>
              <h1 className="park-title">{park.name}</h1>
              <p className="park-subtitle">
                {park.businessType} in {park.city}, {stateName}
              </p>

              <div className="park-badges">
                {park.listingType === 'featured' && (
                  <span className="featured-badge-large">
                    <i className="bi bi-star-fill"></i> FEATURED LISTING
                  </span>
                )}
                {park.source === 'user_submitted' && (
                  <span className="community-badge">
                    <i className="bi bi-people-fill"></i> COMMUNITY ADDED
                  </span>
                )}
                {park.indoorOutdoor && (
                  <span className="indoor-outdoor-badge">
                    <i className={park.indoorOutdoor === 'indoor' ? 'bi bi-house-door-fill' : park.indoorOutdoor === 'outdoor' ? 'bi bi-tree-fill' : 'bi bi-houses-fill'}></i> {formatIndoorOutdoor(park.indoorOutdoor)}
                  </span>
                )}
                {park.pricing?.isFree && (
                  <span className="free-badge">
                    <i className="bi bi-check-circle-fill"></i> FREE
                  </span>
                )}
              </div>

              <div className="park-quick-info">
                <span className="rating">
                  <i className="bi bi-star-fill"></i> {park.rating} ({park.reviewCount} reviews)
                </span>
                <span className="location">
                  <i className="bi bi-geo-alt-fill"></i> {park.city}, {getStateAbbr(park.state)}
                </span>
                <div className="park-status-inline">
                  <ParkStatusBadge park={park} showNextChange={false} />
                </div>
                <FavoriteButton 
                  parkId={park.id} 
                  parkSlug={park.slug} 
                  className="favorite-btn-quick-info"
                  aria-label={`Toggle favorite for ${park.name}`}
                />
                {park.phone && (
                  <span className="phone">
                    <i className="bi bi-telephone-fill"></i> {park.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="container park-detail-container">
          <div className="park-content-grid">
            <div className="park-main-content">
              <section className="content-section">
                <h2>About {park.name}</h2>
                <div className="park-description">
                  {descriptionParagraphs.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </section>

              {park.pricing && (
                <section className="content-section pricing-section">
                  <h2>Pricing Information</h2>
                  <div className="pricing-info">
                    {park.pricing.isFree ? (
                      <div className="pricing-type-badge free-pricing">
                        <i className="bi bi-check-circle-fill"></i>
                        <span>Free to Use</span>
                      </div>
                    ) : (
                      <>
                        {park.pricing.pricingType && (
                          <div className="pricing-type-badge">
                            <i className="bi bi-currency-dollar"></i>
                            <span>{formatPricingType(park.pricing.pricingType)}</span>
                          </div>
                        )}
                        <div className="pricing-details">
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
                          {park.pricing.pricingDetails && (
                            <div className="pricing-details-text">
                              <p>{park.pricing.pricingDetails}</p>
                            </div>
                          )}
                          {park.pricing.pricingUrl && (
                            <div className="pricing-link">
                              <a href={park.pricing.pricingUrl} target="_blank" rel="noopener noreferrer" className="pricing-cta-link">
                                <i className="bi bi-box-arrow-up-right"></i> View Full Pricing Details
                              </a>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                    <p className="pricing-disclaimer">
                      <i className="bi bi-info-circle"></i> Pricing may vary. Please contact {park.name} directly for the most current rates and membership information.
                    </p>
                  </div>
                </section>
              )}

              {park.amenities && (
                <section className="content-section amenities-section">
                  <h2>Amenities & Features</h2>
                  <div className="amenities-grid">
                    {Object.entries(park.amenities)
                      .filter(([, value]) => value === true)
                      .map(([key]) => (
                        <div key={key} className="amenity-item">
                          <i className="bi bi-check-circle-fill"></i>
                          <span>{formatAmenityName(key)}</span>
                        </div>
                      ))}
                  </div>
                </section>
              )}

              {(park.indoorOutdoor || park.sizeCategory || park.surfaceType || (park.petFriendlyFeatures && park.petFriendlyFeatures.length > 0)) && (
                <section className="content-section park-characteristics-section">
                  <h2>Park Characteristics</h2>
                  <div className="park-characteristics">
                    {park.indoorOutdoor && (
                      <div className="characteristic-item">
                        <i className="bi bi-houses-fill"></i>
                        <div>
                          <strong>Type:</strong>
                          <span>{formatIndoorOutdoor(park.indoorOutdoor)}</span>
                        </div>
                      </div>
                    )}
                    {park.sizeCategory && (
                      <div className="characteristic-item">
                        <i className="bi bi-arrows-fullscreen"></i>
                        <div>
                          <strong>Size:</strong>
                          <span>{formatSizeCategory(park.sizeCategory)}</span>
                        </div>
                      </div>
                    )}
                    {park.surfaceType && (
                      <div className="characteristic-item">
                        <i className="bi bi-grid-3x3-gap-fill"></i>
                        <div>
                          <strong>Surface:</strong>
                          <span>{park.surfaceType}</span>
                        </div>
                      </div>
                    )}
                    {park.petFriendlyFeatures && park.petFriendlyFeatures.length > 0 && (
                      <div className="characteristic-item full-width">
                        <i className="bi bi-heart-fill"></i>
                        <div>
                          <strong>Pet-Friendly Features:</strong>
                          <div className="pet-friendly-features-list">
                            {park.petFriendlyFeatures.map((feature, idx) => (
                              <span key={idx} className="feature-tag">{feature}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {park.photos && park.photos.length > 0 && (
                <section className="content-section photo-gallery-section">
                  <h2>Photo Gallery</h2>
                  <div className="photo-gallery">
                    {park.photos.slice(0, 6).map((photo, index) => {
                      const photoUrl = photo.url || getParkImageUrl({});
                      return (
                        <div key={photo.url ?? index} className="gallery-item">
                          <ParkImage
                            src={photoUrl}
                            alt={photo.caption || `${park.name} photo ${index + 1}`}
                            width={300}
                            height={200}
                            className="gallery-image"
                          />
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              <section className="content-section directions-section">
                <h2>How to Get Here</h2>
                <p className="directions-intro">
                  {park.name} is conveniently located at {park.full_address}.
                </p>
                <div className="directions-list">
                  <div className="direction-item">
                    <strong>From Downtown {park.city}:</strong>
                    <p>Head to {park.street} and look for this park near key neighborhood landmarks.</p>
                  </div>
                  <div className="direction-item">
                    <strong>Parking:</strong>
                    <p>Free parking is typically available near the park. Check local signage for specific regulations.</p>
                  </div>
                </div>
              </section>

              <section className="content-section faq-section">
                <h2>Frequently Asked Questions</h2>
                <div className="faq-list">
                  {faqItems.map((faq) => (
                    <div key={faq.question} className="faq-item">
                      <h3>{faq.question}</h3>
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

            <aside className="park-sidebar">
              <div className="sidebar-card nap-card">
                <h3>Visit Information</h3>
                <div className="nap-info">
                  <div className="nap-item">
                    <i className="bi bi-geo-alt-fill"></i>
                    <div>
                      <strong>Address</strong>
                      <p>{park.full_address}</p>
                    </div>
                  </div>
                  {park.phone && (
                    <div className="nap-item">
                      <i className="bi bi-telephone-fill"></i>
                      <div>
                        <strong>Phone</strong>
                        <p>
                          <a href={`tel:${park.phone}`}>{park.phone}</a>
                        </p>
                      </div>
                    </div>
                  )}
                  {park.website && (
                    <div className="nap-item">
                      <i className="bi bi-globe"></i>
                      <div>
                        <strong>Website</strong>
                        <p>
                          <a href={park.website} target="_blank" rel="noopener noreferrer">
                            Visit Website
                          </a>
                        </p>
                      </div>
                    </div>
                  )}
                  {park.email && (
                    <div className="nap-item">
                      <i className="bi bi-envelope-fill"></i>
                      <div>
                        <strong>Email</strong>
                        <p>
                          <a href={`mailto:${park.email}`}>{park.email}</a>
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {park.socialMedia && (park.socialMedia.facebook || park.socialMedia.instagram || park.socialMedia.twitter || park.socialMedia.tiktok || park.socialMedia.youtube) && (
                  <div className="social-media-section">
                    <strong>Follow Us</strong>
                    <div className="social-media-links">
                      {park.socialMedia.facebook && (
                        <a href={park.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
                          <i className="bi bi-facebook"></i>
                        </a>
                      )}
                      {park.socialMedia.instagram && (
                        <a href={park.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                          <i className="bi bi-instagram"></i>
                        </a>
                      )}
                      {park.socialMedia.twitter && (
                        <a href={park.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Twitter">
                          <i className="bi bi-twitter"></i>
                        </a>
                      )}
                      {park.socialMedia.tiktok && (
                        <a href={park.socialMedia.tiktok} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="TikTok">
                          <i className="bi bi-tiktok"></i>
                        </a>
                      )}
                      {park.socialMedia.youtube && (
                        <a href={park.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="YouTube">
                          <i className="bi bi-youtube"></i>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {park.openingHours && (
                  <div className="hours-section">
                    <strong>Hours of Operation</strong>
                    <ParkStatusBadge park={park} showNextChange={true} />
                    <ul className="hours-list">
                      {Object.entries(park.openingHours)
                        .filter(([, hours]) => hours && typeof hours === 'string')
                        .map(([day, hours]) => (
                          <li key={day}>
                            <span className="day">{day}</span>
                            <span className="hours">{hours as string}</span>
                          </li>
                        ))}
                    </ul>
                    {park.hoursNote && (
                      <p className="hours-note">
                        <i className="bi bi-info-circle"></i> {park.hoursNote}
                      </p>
                    )}
                  </div>
                )}

                {park.hours24x7 && (
                  <div className="hours-section">
                    <strong>Hours of Operation</strong>
                    <ParkStatusBadge park={park} showNextChange={false} />
                    <p className="hours-24-7">Open 24/7</p>
                    {park.hoursNote && (
                      <p className="hours-note">
                        <i className="bi bi-info-circle"></i> {park.hoursNote}
                      </p>
                    )}
                  </div>
                )}

                <div className="sidebar-ctas">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(park.full_address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cta-button cta-primary"
                  >
                    <i className="bi bi-map"></i> Get Directions
                  </a>
                  {park.phone && (
                    <a href={`tel:${park.phone}`} className="cta-button cta-secondary">
                      <i className="bi bi-telephone"></i> Call Now
                    </a>
                  )}
                  {park.website && (
                    <a href={park.website} target="_blank" rel="noopener noreferrer" className="cta-button cta-secondary">
                      <i className="bi bi-box-arrow-up-right"></i> Visit Website
                    </a>
                  )}
                </div>
              </div>

              {park.latitude && park.longitude && (
                <div className="sidebar-card map-card">
                  <h3>Location Map</h3>
                  <ParkMap park={park} />
                </div>
              )}

              {/* City Link Card */}
              <div className="sidebar-card city-link-card">
                <h3>Explore {park.city}</h3>
                <p>Discover more dog parks and resources in {park.city}.</p>
                <Link href={`/cities/${citySlug}`} className="cta-button cta-primary">
                  <i className="bi bi-map"></i> View All Parks in {park.city}
                </Link>
              </div>
            </aside>
          </div>

          {nearbyParks.length > 0 && (
            <section className="nearby-parks-section">
              <div className="nearby-parks-header">
                <div>
                  <h2>Other Dog Parks in {park.city}</h2>
                  <p className="nearby-intro">Explore more dog-friendly locations near {park.name}.</p>
                </div>
                <Link href={`/cities/${citySlug}`} className="city-link-btn">
                  View all parks in {park.city} →
                </Link>
              </div>
              <div className="nearby-parks-grid">
                {nearbyParks.map((nearbyPark) => (
                  <Link key={nearbyPark.id} href={`/parks/${nearbyPark.slug || nearbyPark.id}`} className="nearby-park-card">
                    <div className="nearby-park-image">
                      <ParkImage
                        src={getParkImageUrl(nearbyPark)}
                        alt={`${nearbyPark.name} - ${nearbyPark.businessType} in ${nearbyPark.city}, ${nearbyPark.state}`}
                        width={300}
                        height={200}
                      />
                    </div>
                    <div className="nearby-park-info">
                      <h3>{nearbyPark.name}</h3>
                      <p className="nearby-park-type">{nearbyPark.businessType}</p>
                      <div className="nearby-park-meta">
                        <span className="rating">
                          <i className="bi bi-star-fill"></i> {nearbyPark.rating}
                        </span>
                        <span className="distance">{nearbyPark.city}</span>
                      </div>
                    </div>
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

import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import HomePageClient from '../HomePageClient';
import { getAllStaticParks } from '@/lib/parks-data';
import { generateCollectionPageSchema } from '@/lib/metadata';
import { DogPark } from '@/types/dog-park';
import { getCachedPosts } from '@/lib/sanity-api';
import { BlogPost } from '@/types/wordpress';
import SeoContentSection from '@/components/SeoContentSection';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indoordogpark.org';
const siteName = 'Indoor Dog Park';
const ogImageUrl = `${siteUrl.replace(/\/$/, '')}/images/hero/hero.webp`;

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Indoor Dog Parks with Bars | Dog-Friendly Bars & Play Spaces';
  const description =
    'Discover indoor dog parks with bars and restaurants. Find climate-controlled play spaces where you can enjoy drinks while your dog plays. Search by city or location.';
  const canonicalUrl = '/parks-with-bars';

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: 'indoor dog parks with bars, dog-friendly bars, dog parks with restaurants, indoor dog play spaces with food',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      url: `${siteUrl}${canonicalUrl}`,
      title,
      description,
      siteName,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: 'Indoor Dog Parks with Bars - Dog-Friendly Bars & Play Spaces',
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
      site: '@indoordogpark',
      creator: '@indoordogpark',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// Filter parks that have bars, restaurants, or food service
function filterParksWithBars(parks: DogPark[]): DogPark[] {
  const barKeywords = ['bar', 'restaurant', 'cafe', 'food', 'dining', 'pub', 'brewery', 'bistro', 'grill'];

  return parks.filter(park => {
    const nameLower = park.name.toLowerCase();
    const descriptionLower = (park.description || '').toLowerCase();
    const businessTypeLower = (park.businessType || '').toLowerCase();

    // Check if name, description, or business type contains bar-related keywords
    const hasBarKeyword = barKeywords.some(keyword =>
      nameLower.includes(keyword) ||
      descriptionLower.includes(keyword) ||
      businessTypeLower.includes(keyword)
    );

    return hasBarKeyword;
  });
}

export const revalidate = 60 * 60; // Refresh hourly

export default async function ParksWithBarsPage() {
  // Get all parks and filter for those with bars
  const allParks = await getAllStaticParks();
  const filteredParks = filterParksWithBars(allParks);

  // Take first 20 for initial display
  const initialParks = filteredParks.slice(0, 20);
  const collectionPageSchema = generateCollectionPageSchema(initialParks);

  // Get related blog posts about bars/restaurants
  let relatedBlogPosts: BlogPost[] = [];
  try {
    const blogData = await getCachedPosts({ page: 1, perPage: 6, search: 'bar restaurant food dining' });
    relatedBlogPosts = blogData.posts.slice(0, 3);
  } catch (error) {
    console.error('Error fetching related blog posts:', error);
  }

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      {/* Breadcrumb Navigation - HomePageClient will render Header */}
      <div className="container mx-auto px-4 py-4" style={{ position: 'absolute', top: '80px', left: 0, right: 0, zIndex: 10 }}>
        <nav className="breadcrumb-nav" aria-label="Breadcrumb">
          <ol className="breadcrumb-list" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem' }}>
            <li className="breadcrumb-item">
              <Link href="/" style={{ color: '#667eea', textDecoration: 'none' }}>Home</Link>
            </li>
            <li className="breadcrumb-separator" aria-hidden="true" style={{ color: '#9ca3af' }}>/</li>
            <li className="breadcrumb-item breadcrumb-current" aria-current="page" style={{ color: '#374151' }}>
              Parks with Bars
            </li>
          </ol>
        </nav>
      </div>

      <Suspense fallback={
        <div className="loading">
          <i className="bi bi-hourglass-split"></i> Loading dog parks...
        </div>
      }>
        <HomePageClient
          initialParks={initialParks}
          initialShowSearchLayout={true}
        />
      </Suspense>

      <SeoContentSection
        eyebrow="Dog-friendly nightlife"
        title="Indoor dog parks with bars: what to expect and how to choose"
        intro={[
          'Indoor dog parks with bars combine a climate-controlled play space for dogs with a bar, restaurant, or café area for people. These venues are popular when it is too hot, too cold, or too rainy for outdoor parks—and they can be a great option for social dogs and owners who want a relaxed place to hang out.',
          'Because food and drinks are involved, the best “parks with bars” tend to have clear safety rules, strong supervision, and thoughtful layouts that separate play zones from serving areas. Use the listings above to compare locations, then read the guide below for practical tips before you go.',
        ]}
        sections={[
          {
            heading: 'What makes a great park-with-bar venue',
            paragraphs: [
              'The best experiences come from venues that treat the dog park as the main attraction, not an afterthought. Look for clean flooring, ample room for dogs to move, and a clear plan for separating dogs by size or play style when needed.',
              'For humans, comfortable seating with good sight lines matters. Many venues also offer water stations, waste disposal, and staff who actively monitor play.',
            ],
            listItems: [
              'Clear rules posted at check-in (vaccines, age, temperament, supervision).',
              'Separate entry/exit and double-gated vestibules to prevent escapes.',
              'Visible staff oversight and an easy way to report issues.',
              'Good ventilation and routine cleaning throughout the day.',
              'Designated food/drink zones away from high-energy play.',
            ],
          },
          {
            heading: 'Etiquette and safety tips (especially around food and drinks)',
            paragraphs: [
              'Food and drinks can increase excitement. Plan for your dog’s success by arriving after a short walk, bringing high-value treats only if allowed, and avoiding peak hours if your dog is still learning polite greetings.',
              'If your venue serves alcohol, remember: dogs take cues from us. Staying attentive—rather than treating the park like a “hands-off” daycare—helps keep the space safe for everyone.',
            ],
            listItems: [
              'Watch body language: stiff posture, hard staring, or repeated mounting are signs to intervene.',
              'Avoid bringing toys if the venue discourages them (resource guarding).',
              'Keep drinks and food out of reach; ask staff about spill cleanup procedures.',
              'Know when to leave: overtired dogs can get snippy even if they started happy.',
            ],
          },
          {
            heading: 'How to use this page to find the right match',
            paragraphs: [
              'Start by searching your city, then refine by rating and price. Click a listing to open details, photos, and website links so you can confirm requirements and hours.',
              'If you are traveling, bookmark a few options. Policies vary, and some venues require registration, waivers, or proof of vaccinations before entry.',
            ],
            listItems: [
              'Use “Any Rating” to quickly narrow down to the most loved venues.',
              'Check the description for clues like “brewery,” “café,” or “restaurant.”',
              'Open the website to verify vaccination rules and whether reservations are needed.',
              'Use the map to pick spots close to your hotel, event, or neighborhood.',
            ],
          },
          {
            heading: 'For owners: add or update your venue',
            paragraphs: [
              'If you run an indoor dog park with a bar or food service, a complete listing helps customers understand your rules and reduces friction at check-in. Strong listings typically include accurate hours, pricing, photos of the play zones, and a short description of how you handle safety.',
              'You can submit your venue for free, or choose a featured placement for extra visibility.',
            ],
            listItems: [
              'Include vaccine requirements and any age restrictions.',
              'Mention play area separation (small/large, high/low energy).',
              'Add details about food/drink areas and leash policies.',
              'Upload multiple photos showing the space and seating layout.',
            ],
          },
        ]}
        faqs={[
          {
            question: 'Do indoor dog parks with bars usually require vaccinations?',
            answer:
              'Yes. Most venues require proof of core vaccines, and many also require bordetella and a current rabies vaccine. Always check the venue website for the exact list and acceptable documentation.',
          },
          {
            question: 'Are these venues safe for puppies?',
            answer:
              'It depends on the venue rules and your puppy’s age and vaccine status. Some locations have age minimums or puppy-specific play times. If your puppy is still learning social skills, choose off-peak hours and start with short visits.',
          },
          {
            question: 'How long should a first visit be?',
            answer:
              'For many dogs, 30–60 minutes is a great first session. Watch for signs of overstimulation and leave while your dog is still having a good time so the experience ends on a positive note.',
          },
          {
            question: 'Can I bring outside food or treats?',
            answer:
              'Policies vary. Some venues allow treats; others restrict them to prevent resource guarding. When in doubt, keep food and toys in your bag and follow staff guidance.',
          },
        ]}
        links={[
          {
            href: '/list-your-park',
            title: 'List your park',
            description: 'Own a dog-friendly venue? Submit a free listing or upgrade to featured placement.',
          },
          {
            href: '/training-facilities',
            title: 'Training facilities',
            description: 'Find indoor training centers and agility spaces for skill-building and enrichment.',
          },
          {
            href: '/contact',
            title: 'Contact',
            description: 'Found an incorrect listing or want to suggest a venue? Send us a message.',
          },
        ]}
        className="border-t border-gray-100"
      />

      {/* Related Resources Section */}
      <div className="bg-gray-50 py-12 mt-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Resources</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link href="/training-facilities" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Training Facilities</h3>
              <p className="text-gray-600">Find indoor dog training facilities and agility centers.</p>
            </Link>
            <Link href="/blog" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Blog & Guides</h3>
              <p className="text-gray-600">Read articles about dog parks, training, and pet care.</p>
            </Link>

          </div>

          {relatedBlogPosts.length > 0 && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBlogPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h4>
                    <p className="text-gray-600 text-sm line-clamp-2">{post.excerpt.replace(/<[^>]*>/g, '').substring(0, 100)}...</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

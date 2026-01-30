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
  const title = 'Dog Training Facilities | Indoor Training Centers Near Me';
  const description =
    'Find indoor dog training facilities and agility centers. Discover professional training spaces with climate-controlled environments for year-round training.';
  const canonicalUrl = '/training-facilities';

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: 'dog training facilities, indoor dog training, agility centers, dog training classes, professional dog training',
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
          alt: 'Dog Training Facilities - Indoor Training Centers',
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

// Filter parks that offer training services
function filterTrainingFacilities(parks: DogPark[]): DogPark[] {
  const trainingKeywords = ['training', 'agility', 'obedience', 'class', 'instructor', 'trainer'];

  return parks.filter(park => {
    // Check if park has training amenity
    const hasTrainingAmenity = park.amenities?.training === true;

    // Check if business type is training-related
    const isTrainingBusinessType = park.businessType === 'Agility & Training Parks';

    // Check name, description for training keywords
    const nameLower = park.name.toLowerCase();
    const descriptionLower = (park.description || '').toLowerCase();
    const businessTypeLower = (park.businessType || '').toLowerCase();

    const hasTrainingKeyword = trainingKeywords.some(keyword =>
      nameLower.includes(keyword) ||
      descriptionLower.includes(keyword) ||
      businessTypeLower.includes(keyword)
    );

    return hasTrainingAmenity || isTrainingBusinessType || hasTrainingKeyword;
  });
}

export const revalidate = 60 * 60; // Refresh hourly

export default async function TrainingFacilitiesPage() {
  // Get all parks and filter for training facilities
  const allParks = await getAllStaticParks();
  const filteredParks = filterTrainingFacilities(allParks);

  // Take first 20 for initial display
  const initialParks = filteredParks.slice(0, 20);
  const collectionPageSchema = generateCollectionPageSchema(initialParks);

  // Get related blog posts about training
  let relatedBlogPosts: BlogPost[] = [];
  try {
    const blogData = await getCachedPosts({ page: 1, perPage: 6, search: 'training agility obedience' });
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
              Training Facilities
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
        eyebrow="Year-round skill building"
        title="Indoor dog training facilities: how to pick the right program"
        intro={[
          'Indoor dog training facilities and agility centers provide structured environments for learning, confidence-building, and enrichment. Many locations offer group classes, private lessons, puppy socialization, and agility or scent work—often in climate-controlled spaces that make training possible year-round.',
          'Use the listings above to find training centers near you, then review the guidance below so you can choose a program that matches your dog’s age, temperament, and goals.',
        ]}
        sections={[
          {
            heading: 'Common types of indoor training programs',
            paragraphs: [
              'Not every training facility offers the same approach. Some focus on foundational manners; others specialize in sports or behavior modification. Understanding the difference helps you choose the best fit and sets expectations before you enroll.',
            ],
            listItems: [
              'Puppy kindergarten and safe socialization classes.',
              'Basic manners (sit, stay, leash walking, recall foundations).',
              'Agility and sport foundations (tunnels, jumps, handling skills).',
              'Scent work and nose games for mental enrichment.',
              'Behavior consults for reactivity, fear, or separation-related issues.',
            ],
          },
          {
            heading: 'What to look for in a facility',
            paragraphs: [
              'A good facility will prioritize safety, cleanliness, and clear communication. You should feel comfortable asking about instructor certifications, training methods, class size, and what happens when dogs need extra space.',
              'If your dog is anxious or reactive, look for options like smaller classes, private lessons, or separate training areas.',
            ],
            listItems: [
              'Transparent training philosophy (reward-based methods are common and effective).',
              'Clean floors and good ventilation to reduce odor and illness risk.',
              'Appropriate class sizes and structured rotations to prevent chaos.',
              'Clear policies for vaccination requirements and illness symptoms.',
              'Options for private lessons or “quiet hours” when needed.',
            ],
          },
          {
            heading: 'How to prepare for your first class',
            paragraphs: [
              'A little preparation goes a long way. Before class, make sure your dog has had a bathroom break and a short decompression walk. Bring high-value rewards (if allowed) and a harness or collar that fits well.',
              'If you’re working on behavior challenges, share context with the instructor ahead of time so they can plan space and exercises appropriately.',
            ],
            listItems: [
              'Bring treats your dog loves and can eat quickly.',
              'Use a 4–6 foot leash (avoid retractable leashes for class).',
              'Arrive a few minutes early to settle in without rushing.',
              'Ask about homework between sessions—progress happens at home.',
            ],
          },
          {
            heading: 'Using this page to find a facility near you',
            paragraphs: [
              'Search by city and explore the map to compare locations. Filter by rating to quickly find trusted programs, and open each listing to review amenities, website details, and contact information.',
              'Because training schedules change often, it’s best to verify class times and registration steps on the facility’s website.',
            ],
            listItems: [
              'Check the listing description for keywords like “agility,” “obedience,” or “puppy.”',
              'Confirm whether classes are drop-in, session-based, or appointment-only.',
              'Look for clear guidance on vaccination requirements and age minimums.',
              'If you’re unsure, start with a private lesson or evaluation.',
            ],
          },
        ]}
        faqs={[
          {
            question: 'Do indoor training facilities require vaccines?',
            answer:
              'Most do. Requirements commonly include rabies and core vaccines, and many also require bordetella. Puppies may be allowed with age-appropriate vaccine series—check the facility’s policy before registering.',
          },
          {
            question: 'Is agility training only for high-energy dogs?',
            answer:
              'No. Agility can be adapted for many dogs and focuses on teamwork, confidence, and body awareness. A quality program will scale obstacles and exercises to your dog’s ability and comfort.',
          },
          {
            question: 'How do I choose between group classes and private lessons?',
            answer:
              'Group classes are great for foundational skills and controlled social learning. Private lessons can be better for specific goals, busy schedules, or behavior concerns like reactivity, fear, or distraction.',
          },
          {
            question: 'What if my dog struggles in class?',
            answer:
              'Tell the instructor right away. Good programs can create distance, adjust exercises, or recommend private sessions. Leaving early is also okay—ending on a calm note can help your dog build positive associations over time.',
          },
        ]}
        links={[
          {
            href: '/parks-with-bars',
            title: 'Parks with bars',
            description: 'Looking for social play and a place to relax? Explore dog parks with bars and cafés.',
          },

          {
            href: '/contact',
            title: 'Contact',
            description: 'Know a training facility we should add? Send details and we’ll review it.',
          },
        ]}
        className="border-t border-gray-100"
      />

      {/* Related Resources Section */}
      <div className="bg-gray-50 py-12 mt-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Resources</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link href="/parks-with-bars" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Parks with Bars</h3>
              <p className="text-gray-600">Find dog parks with bars and restaurants.</p>
            </Link>
            <Link href="/blog" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Blog & Guides</h3>
              <p className="text-gray-600">Read articles about dog training and pet care.</p>
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

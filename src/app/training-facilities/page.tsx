import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import HomePageClient from '../HomePageClient';
import { getAllStaticParks } from '@/lib/parks-data';
import { generateCollectionPageSchema } from '@/lib/metadata';
import { DogPark } from '@/types/dog-park';
import { getCachedPosts } from '@/lib/sanity-api';
import { BlogPost } from '@/types/wordpress';

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
          initialPagination={{
            page: 1,
            limit: 20,
            totalParks: filteredParks.length,
            totalPages: Math.ceil(filteredParks.length / 20),
            hasMore: filteredParks.length > 20,
          }}
          initialShowSearchLayout={true}
        />
      </Suspense>

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
            <Link href="/guides" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Training Guides</h3>
              <p className="text-gray-600">Comprehensive guides for dog training and behavior.</p>
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

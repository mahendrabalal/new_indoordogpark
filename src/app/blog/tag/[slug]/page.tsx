import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import Link from 'next/link';
import BlogCard from '@/components/blog/BlogCard';
import BlogPagination from '@/components/blog/BlogPagination';
import StructuredData from '@/components/blog/StructuredData';
import { WPTag, BlogPost, WPPaginationInfo } from '@/types/wordpress';
import { getCachedPosts, getCachedTags } from '@/lib/sanity-api';
import { SITE_URL } from '@/lib/metadata';

interface TagPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
    perPage?: string;
  }>;
}

// Normalize slug for matching (handles URL encoding, spaces, case, etc.)
function normalizeSlug(slug: string): string {
  return decodeURIComponent(slug)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')  // Replace spaces with hyphens
    .replace(/-+/g, '-')    // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

async function getTag(slug: string): Promise<WPTag | null> {
  try {
    const tags = await getCachedTags();

    // Normalize the requested slug
    const normalizedSlug = normalizeSlug(slug);

    // Try exact match first (with original slug)
    let tag = tags.find(tag => tag.slug === slug);

    // If not found, try normalized match
    if (!tag) {
      tag = tags.find(tag => {
        const tagSlug = normalizeSlug(tag.slug);
        return tagSlug === normalizedSlug;
      });
    }

    // If still not found, try matching by name (case-insensitive, normalized)
    if (!tag) {
      const normalizedName = normalizedSlug.replace(/-/g, ' ');
      tag = tags.find(tag => {
        const tagNameNormalized = tag.name.toLowerCase().trim().replace(/\s+/g, '-');
        return tagNameNormalized === normalizedSlug ||
          tag.name.toLowerCase().trim() === normalizedName;
      });
    }

    return tag || null;
  } catch (error) {
    console.error('Error fetching tag:', error);
    return null;
  }
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTag(slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indoordogpark.org';

  if (!tag) {
    return {
      title: 'Tag Not Found',
      description: 'The tag you are looking for could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${tag.name} Articles - Indoor Dog Park Blog`;
  const description = tag.description || `Read all articles tagged with ${tag.name}. Expert tips, guides, and stories about indoor dog parks.`;
  const canonicalUrl = `${siteUrl}/blog/tag/${tag.slug}`;
  const ogImage = `${siteUrl}/images/hero/hero.webp`;

  return {
    title,
    description,
    keywords: `${tag.name}, indoor dog parks, dog training, pet care, California dog parks`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
      siteName: 'Indoor Dog Park',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${tag.name} - Indoor Dog Park Blog`,
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
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

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const tag = await getTag(slug);

  if (!tag) {
    return notFound();
  }

  // Return 404 if tag exists but has no posts (prevents Soft 404 errors)
  if (!tag.count || tag.count === 0) {
    return notFound();
  }

  // Redirect to canonical slug if the requested slug doesn't match exactly
  // (handles URL encoding, spaces, case differences)
  if (tag.slug !== slug && normalizeSlug(tag.slug) === normalizeSlug(slug)) {
    const qs = new URLSearchParams();
    if (resolvedSearchParams.page && resolvedSearchParams.page !== '1') qs.set('page', resolvedSearchParams.page);
    if (resolvedSearchParams.perPage && resolvedSearchParams.perPage !== '12') qs.set('perPage', resolvedSearchParams.perPage);
    const suffix = qs.toString() ? `?${qs.toString()}` : '';
    permanentRedirect(`/blog/tag/${encodeURIComponent(tag.slug)}${suffix}`);
  }

  const page = parseInt(resolvedSearchParams.page || '1');
  const perPage = parseInt(resolvedSearchParams.perPage || '12');

  // Fetch posts server-side (best practice)
  const blogData = await getCachedPosts({
    page,
    perPage,
    tag: tag.slug,
  });

  const posts: BlogPost[] = blogData.posts || [];
  const pagination: WPPaginationInfo = {
    total: blogData.total || 0,
    totalPages: blogData.totalPages || 0,
    currentPage: page,
    perPage,
  };

  // Generate structured data for CollectionPage
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${tag.name} Articles`,
    description: tag.description || `Articles tagged with ${tag.name} about indoor dog parks, dog training, and pet care.`,
    url: `${SITE_URL}/blog/tag/${tag.slug}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: pagination.total,
      itemListElement: posts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'BlogPosting',
          headline: post.title,
          url: `${SITE_URL}/blog/${post.slug}`,
          datePublished: post.date,
        },
      })),
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Blog',
          item: `${SITE_URL}/blog`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: tag.name,
          item: `${SITE_URL}/blog/tag/${tag.slug}`,
        },
      ],
    },
  };

  const breadcrumbs = [
    { name: 'Blog', url: '/blog' },
    { name: tag.name, url: `/blog/tag/${tag.slug}` },
  ];

  return (
    <>
      <StructuredData type="BreadcrumbList" data={{}} breadcrumbs={breadcrumbs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData, null, 2) }}
      />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
          <div className="container mx-auto px-4 py-16">
            <nav aria-label="Breadcrumb" className="text-sm mb-4">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link href="/blog" className="hover:text-purple-200">Blog</Link>
                </li>
                <li aria-hidden="true" className="text-purple-300">/</li>
                <li className="text-purple-200" aria-current="page">
                  Tag: {tag.name}
                </li>
              </ol>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{tag.name} Articles</h1>
            {tag.description && (
              <p className="text-xl text-purple-100 max-w-2xl">{tag.description}</p>
            )}
            <div className="mt-6 text-purple-100">
              <span className="font-semibold">{tag.count}</span> articles tagged with &quot;{tag.name}&quot;
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600 mb-4">
                No articles have been tagged with &quot;{tag.name}&quot; yet.
              </p>
              <Link href="/blog" className="text-purple-600 hover:text-purple-700">
                ← Browse all articles
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <BlogPagination
                  pagination={pagination}
                  basePath={`/blog/tag/${encodeURIComponent(tag.slug)}`}
                  className="mt-8"
                />
              )}

              {/* Explore More Section */}
              <div className="mt-8 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Explore More</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    href="/"
                    className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-semibold text-gray-900 mb-2">Browse All Parks</h4>
                    <p className="text-sm text-gray-600">Discover dog parks across California</p>
                  </Link>
                  <Link
                    href="/blog"
                    className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-semibold text-gray-900 mb-2">All Blog Articles</h4>
                    <p className="text-sm text-gray-600">Read all our guides and articles</p>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
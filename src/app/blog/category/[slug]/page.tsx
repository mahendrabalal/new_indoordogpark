import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import Link from 'next/link';
import BlogCard from '@/components/blog/BlogCard';
import BlogPagination from '@/components/blog/BlogPagination';
import { WPCategory, BlogPost, WPPaginationInfo } from '@/types/wordpress';
import { getCachedPosts, getCachedCategories } from '@/lib/sanity-api';

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
    perPage?: string;
  };
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

async function getCategory(slug: string): Promise<WPCategory | null> {
  try {
    const categories = await getCachedCategories();

    // Normalize the requested slug
    const normalizedSlug = normalizeSlug(slug);

    // Try exact match first (with original slug)
    let category = categories.find(cat => cat.slug === slug);
    
    // If not found, try normalized match
    if (!category) {
      category = categories.find(cat => {
        const catSlug = normalizeSlug(cat.slug);
        return catSlug === normalizedSlug;
      });
    }

    // If still not found, try matching by name (case-insensitive, normalized)
    if (!category) {
      const normalizedName = normalizedSlug.replace(/-/g, ' ');
      category = categories.find(cat => {
        const catNameNormalized = cat.name.toLowerCase().trim().replace(/\s+/g, '-');
        return catNameNormalized === normalizedSlug || 
               cat.name.toLowerCase().trim() === normalizedName;
      });
    }

    return category || null;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategory(params.slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indoordogpark.org';

  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The category you are looking for could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${category.name} Articles - Indoor Dog Park Blog`;
  const description = category.description || `Read all articles in the ${category.name} category. Expert tips, guides, and stories about indoor dog parks.`;
  const canonicalUrl = `${siteUrl}/blog/category/${category.slug}`;
  const ogImage = `${siteUrl}/images/hero/hero.webp`;

  return {
    title,
    description,
    keywords: `${category.name}, indoor dog parks, dog training, pet care, California dog parks`,
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
          alt: `${category.name} - Indoor Dog Park Blog`,
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

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category = await getCategory(params.slug);

  if (!category) {
    return notFound();
  }

  // Return 404 if category exists but has no posts (prevents Soft 404 errors)
  if (!category.count || category.count === 0) {
    return notFound();
  }

  // Redirect to canonical slug if the requested slug doesn't match exactly
  // (handles URL encoding, spaces, case differences)
  if (category.slug !== params.slug && normalizeSlug(category.slug) === normalizeSlug(params.slug)) {
    const qs = new URLSearchParams();
    if (searchParams.page && searchParams.page !== '1') qs.set('page', searchParams.page);
    if (searchParams.perPage && searchParams.perPage !== '12') qs.set('perPage', searchParams.perPage);
    const suffix = qs.toString() ? `?${qs.toString()}` : '';
    permanentRedirect(`/blog/category/${encodeURIComponent(category.slug)}${suffix}`);
  }

  const page = parseInt(searchParams.page || '1');
  const perPage = parseInt(searchParams.perPage || '12');

  // Fetch posts server-side (best practice)
  const blogData = await getCachedPosts({
    page,
    perPage,
    category: category.slug,
  });

  const posts: BlogPost[] = blogData.posts || [];
  const pagination: WPPaginationInfo = {
    total: blogData.total || 0,
    totalPages: blogData.totalPages || 0,
    currentPage: page,
    perPage,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <nav className="text-sm mb-4">
            <Link href="/blog" className="hover:text-purple-200">Blog</Link>
            <span className="mx-2">/</span>
            <span>{category.name}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.name}</h1>
          {category.description && (
            <p className="text-xl text-purple-100 max-w-2xl">{category.description}</p>
          )}
          <div className="mt-6 text-purple-100">
            <span className="font-semibold">{category.count}</span> articles in this category
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600 mb-4">
              No articles have been published in the &quot;{category.name}&quot; category yet.
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
                basePath={`/blog/category/${encodeURIComponent(category.slug)}`}
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
  );
}
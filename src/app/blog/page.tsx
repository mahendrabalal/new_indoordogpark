import { Metadata } from 'next';
import { Suspense } from 'react';
import BlogCard from '@/components/blog/BlogCard';
import BlogPagination from '@/components/blog/BlogPagination';
import BlogSidebar from '@/components/blog/BlogSidebar';
// import { BlogPageSkeleton } from '@/components/blog/BlogSkeleton';
// import ErrorBoundary from '@/components/blog/ErrorBoundary';
import { SkipLinks, LiveRegion, ReadingProgress } from '@/components/blog/AccessibilityFeatures';
import { BlogPost, WPCategory, WPTag } from '@/types/wordpress';

// Define the BlogPage component props
interface BlogPageProps {
  searchParams: {
    page?: string;
    perPage?: string;
    search?: string;
    category?: string;
    tag?: string;
  };
}

// Blog page with search params
async function BlogPageContent({ searchParams }: BlogPageProps) {
  const page = parseInt(searchParams.page || '1');
  const perPage = parseInt(searchParams.perPage || '12');
  const searchTerm = searchParams.search;
  const categorySlug = searchParams.category;
  const tagSlug = searchParams.tag;

  // Fetch blog posts
  let blogData;
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/blog`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('perPage', perPage.toString());

    if (searchTerm) {
      url.searchParams.append('search', searchTerm);
    }
    if (categorySlug) {
      url.searchParams.append('category', categorySlug);
    }
    if (tagSlug) {
      url.searchParams.append('tag', tagSlug);
    }

    const response = await fetch(url.toString(), {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error('Failed to fetch blog posts');
    }

    blogData = await response.json();
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
            <p className="text-gray-600">Unable to load blog posts at this time.</p>
          </div>
        </div>
      </div>
    );
  }

  const posts: BlogPost[] = blogData.data || [];
  const pagination = blogData.pagination || { total: 0, totalPages: 0, currentPage: 1, perPage };

  // Fetch categories and tags for sidebar
  let categories: WPCategory[] = [];
  let tags: WPTag[] = [];

  try {
    const [categoriesResponse, tagsResponse] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/blog/categories`, {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/blog/tags`, {
        next: { revalidate: 3600 },
      }),
    ]);

    if (categoriesResponse.ok) {
      const categoriesData = await categoriesResponse.json();
      categories = categoriesData.data || [];
    }

    if (tagsResponse.ok) {
      const tagsData = await tagsResponse.json();
      tags = tagsData.data || [];
    }
  } catch (error) {
    console.error('Error fetching sidebar data:', error);
  }

  // Get recent posts for sidebar (using first 3 posts from current page)
  const recentPosts = posts.slice(0, 3).map(post => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    date: post.date,
  }));

  const getPageTitle = () => {
    if (searchTerm) return `Search Results for "${searchTerm}"`;
    if (categorySlug) {
      const category = categories.find(cat => cat.slug === categorySlug);
      return category ? `Category: ${category.name}` : 'Category';
    }
    if (tagSlug) {
      const tag = tags.find(t => t.slug === tagSlug);
      return tag ? `Tag: ${tag.name}` : 'Tag';
    }
    return 'Blog';
  };

  const getPageDescription = () => {
    if (searchTerm) return `Showing ${posts.length} results for "${searchTerm}"`;
    if (categorySlug || tagSlug) return `${pagination.total} articles found`;
    return 'Tips, guides, and stories about California dog parks';
  };

  return (
    <>
      <SkipLinks />
      <LiveRegion />
      <ReadingProgress />
      <div className="min-h-screen bg-gray-50" id="main-content" role="main">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {getPageTitle()}
            </h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              {getPageDescription()}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {posts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm
                    ? `No articles match "${searchTerm}". Try different keywords.`
                    : categorySlug || tagSlug
                    ? 'No articles found in this category/tag.'
                    : 'No articles have been published yet.'}
                </p>
                {(searchTerm || categorySlug || tagSlug) && (
                  <a href="/blog" className="inline-flex items-center text-purple-600 hover:text-purple-700">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to all articles
                  </a>
                )}
              </div>
            ) : (
              <>
                {/* Grid of Blog Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {posts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <BlogPagination
                    pagination={pagination}
                    basePath="/blog"
                    className="mt-8"
                  />
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg" />}>
              <BlogSidebar
                categories={categories}
                tags={tags}
                recentPosts={recentPosts}
              />
            </Suspense>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

// Loading component
function BlogLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="aspect-video bg-gray-200"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Blog Page component
export default function BlogPage(props: BlogPageProps) {
  return (
    <Suspense fallback={<BlogLoading />}>
      <BlogPageContent {...props} />
    </Suspense>
  );
}

// Generate metadata for the page
export async function generateMetadata({ searchParams }: BlogPageProps): Promise<Metadata> {
  const searchTerm = searchParams.search;
  const categorySlug = searchParams.category;
  const tagSlug = searchParams.tag;

  let title = 'Indoor Dog Park Blog - Tips & Guides';
  let description = 'Expert tips, guides, and stories about indoor dog parks, dog training, pet care, and creating the best indoor environment for your furry friends.';

  if (searchTerm) {
    title = `Search Results for "${searchTerm}" - Indoor Dog Park Blog`;
    description = `Search results for "${searchTerm}" in our indoor dog park blog.`;
  } else if (categorySlug) {
    title = `${categorySlug} Articles - Indoor Dog Park Blog`;
    description = `Articles about ${categorySlug} in indoor dog parks and facilities.`;
  } else if (tagSlug) {
    title = `${tagSlug} Articles - Indoor Dog Park Blog`;
    description = `Articles tagged with ${tagSlug} for indoor dog park enthusiasts.`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}
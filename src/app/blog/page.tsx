import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { formatDistanceToNow } from 'date-fns';
import BlogCard from '@/components/blog/BlogCard';
import BlogPagination from '@/components/blog/BlogPagination';
import BlogSidebar from '@/components/blog/BlogSidebar';
// import { BlogPageSkeleton } from '@/components/blog/BlogSkeleton';
// import ErrorBoundary from '@/components/blog/ErrorBoundary';
import { LiveRegion, ReadingProgress } from '@/components/blog/AccessibilityFeatures';
import { BlogPost, WPCategory, WPTag } from '@/types/wordpress';
import { getCachedPosts, getCachedCategories, getCachedTags } from '@/lib/sanity-api';

// Use ISR with on-demand revalidation (best practice)
// Pages are statically generated and cached for performance
// Revalidate via webhook when new posts are published in Sanity
export const revalidate = 300; // Fallback: revalidate every 5 minutes if webhook fails

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

const estimateReadingTime = (content: string) => {
  if (!content) return 4;
  const plainText = content.replace(/<[^>]*>/g, ' ');
  const words = plainText.split(/\s+/).filter(Boolean).length;
  return Math.max(3, Math.ceil(words / 200));
};

const getFeaturedImage = (post: BlogPost) =>
  post.featuredImage?.media_details?.sizes?.large?.source_url ||
  post.featuredImage?.media_details?.sizes?.medium?.source_url ||
  post.featuredImage?.source_url;

// Blog page with search params
async function BlogPageContent({ searchParams }: BlogPageProps) {
  const page = parseInt(searchParams.page || '1');
  const perPage = parseInt(searchParams.perPage || '12');
  const searchTerm = searchParams.search;
  const categorySlug = searchParams.category;
  const tagSlug = searchParams.tag;

  // Fetch blog posts from Sanity
  let blogData;
  try {
    blogData = await getCachedPosts({
      page,
      perPage,
      search: searchTerm,
      category: categorySlug,
      tag: tagSlug,
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">Blog</h1>
            <p className="text-gray-600">Unable to load blog posts at this time.</p>
          </div>
        </div>
      </div>
    );
  }

  const posts: BlogPost[] = blogData.posts || [];
  const pagination = { 
    total: blogData.total || 0, 
    totalPages: blogData.totalPages || 0, 
    currentPage: page, 
    perPage,
  };

  // Fetch categories and tags for sidebar from Sanity
  let categories: WPCategory[] = [];
  let tags: WPTag[] = [];

  try {
    [categories, tags] = await Promise.all([
      getCachedCategories(),
      getCachedTags(),
    ]);
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

  const hasPosts = posts.length > 0;
  const featuredPost = hasPosts ? posts[0] : null;
  const spotlightPosts = hasPosts ? posts.slice(1, 3) : [];
  const feedPosts = hasPosts ? posts.slice(3) : [];
  const trendingPosts = posts.slice(0, Math.min(posts.length, 5));
  const categoryChips = categories.slice(0, 7);
  const heroTags = tags.slice(0, 6);
  const uniqueAuthors = new Set(posts.map((post) => post.author?.name).filter(Boolean));
  const averageReadTime = posts.length
    ? Math.round(posts.reduce((total, post) => total + estimateReadingTime(post.content), 0) / posts.length)
    : 4;

  const heroStats = [
    { label: 'Stories published', value: pagination.total || posts.length },
    { label: 'Avg read time', value: `${Math.max(3, averageReadTime)} min` },
    { label: 'Expert contributors', value: uniqueAuthors.size || 1 },
  ];

  const buildFilterHref = (overrides: Partial<{ search?: string; category?: string; tag?: string }>) => {
    const params = new URLSearchParams();
    const merged = {
      search: searchTerm,
      category: categorySlug,
      tag: tagSlug,
      ...overrides,
    };

    Object.entries(merged).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    const query = params.toString();
    return query ? `/blog?${query}` : '/blog';
  };

  const activeFilters = Boolean(searchTerm || categorySlug || tagSlug);

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

  if (!hasPosts) {
    return (
      <>
        <LiveRegion />
        <ReadingProgress />
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white" id="main-content" role="main">
          <section className="border-b border-gray-100 bg-gradient-to-b from-purple-50 via-white to-white">
            <div className="container mx-auto px-4 py-16 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-purple-500">Indoor dog park intel</p>
              <h1 className="mt-4 text-4xl font-bold text-gray-900 md:text-5xl">{getPageTitle()}</h1>
              <p className="mt-3 text-lg text-gray-600">{getPageDescription()}</p>
            </div>
          </section>
          <section className="container mx-auto px-4 py-12 lg:py-16">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
              <div className="rounded-3xl border border-dashed border-purple-200 bg-white p-10 text-center shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-purple-600">No results</p>
                <h2 className="mt-4 text-2xl font-semibold text-gray-900">We couldn’t find articles that match.</h2>
                <p className="mt-3 text-gray-600">
                  Try adjusting your filters, searching a different topic, or resetting back to all stories.
                </p>
                <form action="/blog" method="GET" className="mt-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <label htmlFor="empty-state-search" className="sr-only">
                      Search blog
                    </label>
                    <input
                      id="empty-state-search"
                      type="search"
                      name="search"
                      defaultValue={searchTerm || ''}
                      placeholder="Search indoor dog park guides..."
                      className="w-full rounded-full border border-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:bg-purple-500"
                    >
                      Search
                    </button>
                  </div>
                </form>
                {activeFilters && (
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Link
                      href="/blog"
                      className="inline-flex items-center gap-2 rounded-full border border-purple-200 px-4 py-2 text-sm font-medium text-purple-700 transition hover:bg-purple-50"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M4 12h16M10 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Clear filters
                    </Link>
                  </div>
                )}
              </div>
              <div className="lg:sticky lg:top-24">
                <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-gray-100" />}>
                  <BlogSidebar
                    categories={categories}
                    tags={tags}
                    recentPosts={recentPosts}
                    defaultSearchValue={searchTerm || ''}
                    activeCategory={categorySlug}
                    activeTag={tagSlug}
                  />
                </Suspense>
              </div>
            </div>
          </section>
        </div>
      </>
    );
  }

  return (
    <>
      <LiveRegion />
      <ReadingProgress />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-white" id="main-content" role="main">
        {/* Hero */}
        <section className="border-b border-gray-100 bg-gradient-to-b from-purple-50 via-white to-white">
          <div className="container mx-auto px-4 py-12 lg:py-16">
            <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
              <div className="space-y-8">
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-purple-500">Indoor dog park intel</p>
                  <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl">{getPageTitle()}</h1>
                  <p className="text-lg text-gray-600 md:text-xl">{getPageDescription()}</p>
                </div>

                <form
                  action="/blog"
                  method="GET"
                  className="rounded-2xl border border-white/60 bg-white/90 p-4 shadow-lg shadow-purple-100"
                >
                  {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
                  {tagSlug && <input type="hidden" name="tag" value={tagSlug} />}
                  <label htmlFor="hero-search" className="sr-only">
                    Search blog
                  </label>
                  <div className="flex flex-col gap-3 md:flex-row">
                    <input
                      id="hero-search"
                      type="search"
                      name="search"
                      defaultValue={searchTerm || ''}
                      placeholder="Search articles, parks, or trends..."
                      className="w-full flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-500"
                    >
                      Search insights
                    </button>
                  </div>
                </form>

                {(categoryChips.length > 0 || heroTags.length > 0 || activeFilters) && (
                  <div className="flex flex-wrap gap-2">
                    {categoryChips.map((category) => {
                      const isActive = category.slug === categorySlug;
                      return (
                        <Link
                          key={category.id}
                          href={buildFilterHref({ category: category.slug })}
                          className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition ${
                            isActive
                              ? 'border-purple-600 bg-purple-600 text-white shadow-sm'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-purple-200 hover:text-purple-600'
                          }`}
                        >
                          {category.name}
                        </Link>
                      );
                    })}
                    {heroTags.map((tag) => {
                      const isActive = tag.slug === tagSlug;
                      return (
                        <Link
                          key={tag.id}
                          href={buildFilterHref({ tag: tag.slug })}
                          className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition ${
                            isActive
                              ? 'border-purple-600 bg-purple-600 text-white shadow-sm'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-purple-200 hover:text-purple-600'
                          }`}
                        >
                          #{tag.name}
                        </Link>
                      );
                    })}
                    {activeFilters && (
                      <Link
                        href="/blog"
                        className="inline-flex items-center rounded-full border border-gray-200 px-3 py-2 text-sm text-gray-500 transition hover:border-purple-200 hover:text-purple-600"
                      >
                        Reset filters
                      </Link>
                    )}
                  </div>
                )}

                <dl className="grid gap-4 sm:grid-cols-3">
                  {heroStats.map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-gray-200 bg-white/80 p-4 text-center shadow-sm">
                      <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">{stat.label}</dt>
                      <dd className="mt-2 text-2xl font-semibold text-gray-900">{stat.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {featuredPost && (
                <div className="space-y-4">
                  <article className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl">
                    {getFeaturedImage(featuredPost) && (
                      <div className="relative h-56 w-full overflow-hidden rounded-2xl">
                        <Image
                          src={getFeaturedImage(featuredPost)!}
                          alt={featuredPost.featuredImage?.alt_text || featuredPost.title}
                          fill
                          className="object-cover"
                          priority
                        />
                      </div>
                    )}
                    <div className="mt-6 space-y-4">
                      {featuredPost.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {featuredPost.categories.slice(0, 2).map((cat) => (
                            <Link
                              key={cat.id}
                              href={`/blog/category/${cat.slug}`}
                              className="text-xs font-semibold uppercase tracking-wide text-purple-600"
                            >
                              {cat.name}
                            </Link>
                          ))}
                        </div>
                      )}
                      <Link href={`/blog/${featuredPost.slug}`}>
                        <h2 className="text-2xl font-semibold leading-tight text-gray-900 md:text-3xl">
                          {featuredPost.title}
                        </h2>
                      </Link>
                      {featuredPost.excerpt && (
                        <div
                          className="prose prose-sm max-w-none text-gray-600 line-clamp-3"
                          dangerouslySetInnerHTML={{ __html: featuredPost.excerpt }}
                        />
                      )}
                      <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-3">
                          {featuredPost.author?.avatar_urls?.['48'] && (
                            <Image
                              src={featuredPost.author.avatar_urls['48']}
                              alt={featuredPost.author.name}
                              width={48}
                              height={48}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <p className="text-base font-semibold text-gray-900">{featuredPost.author?.name}</p>
                            <p>{formatDistanceToNow(new Date(featuredPost.date), { addSuffix: true })}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span>{estimateReadingTime(featuredPost.content)} min read</span>
                        </div>
                      </div>
                      <Link
                        href={`/blog/${featuredPost.slug}`}
                        className="inline-flex items-center gap-2 rounded-2xl bg-purple-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-purple-500"
                      >
                        Read article
                        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M4 8h8M8 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Link>
                    </div>
                  </article>

                  {spotlightPosts.length > 0 && (
                    <div className="rounded-3xl border border-dashed border-gray-200 bg-white/90 p-5 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">Up next</p>
                      <div className="mt-3 space-y-3">
                        {spotlightPosts.map((post) => (
                          <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            className="flex items-center justify-between gap-4 rounded-2xl px-3 py-2 transition hover:bg-gray-50"
                          >
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
                                {post.categories[0]?.name || 'Indoor dog park'}
                              </p>
                              <p className="mt-1 text-sm font-semibold text-gray-900 line-clamp-2">{post.title}</p>
                            </div>
                            <span className="text-xs text-gray-500">{estimateReadingTime(post.content)} min</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Main content */}
        <section className="container mx-auto px-4 py-12 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] xl:grid-cols-[minmax(0,2.25fr)_minmax(320px,0.75fr)]">
            <div className="space-y-10">
              {trendingPosts.length > 0 && (
                <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-purple-600">Trending now</p>
                      <h2 className="mt-2 text-2xl font-semibold text-gray-900">Insights editors are reading</h2>
                    </div>
                    <Link href="/blog" className="text-sm font-medium text-purple-600 hover:text-purple-500">
                      View all stories
                    </Link>
                  </div>
                  <div className="mt-6 divide-y divide-gray-100">
                    {trendingPosts.map((post, index) => (
                      <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="flex gap-4 py-4 transition hover:translate-x-1"
                      >
                        <span className="text-3xl font-semibold text-gray-200">{String(index + 1).padStart(2, '0')}</span>
                        <div className="flex-1">
                          <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
                            {post.categories[0]?.name || 'Indoor dog park'}
                          </p>
                          <p className="mt-1 text-base font-semibold text-gray-900 line-clamp-2">{post.title}</p>
                          <p className="mt-1 text-sm text-gray-500">
                            {formatDistanceToNow(new Date(post.date), { addSuffix: true })} ·{' '}
                            {estimateReadingTime(post.content)} min read
                          </p>
        </div>
                      </Link>
                    ))}
      </div>
                </div>
              )}

              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-purple-600">Latest analyses</p>
                    <h2 className="text-2xl font-semibold text-gray-900">Fresh stories from the field</h2>
                  </div>
                  <span className="text-sm text-gray-500">
                    Showing {feedPosts.length} of {pagination.total} articles
                  </span>
              </div>

                {feedPosts.length > 0 ? (
              <>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {feedPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
                {pagination.totalPages > 1 && (
                  <BlogPagination
                    pagination={pagination}
                    basePath="/blog"
                        className="mt-10"
                        query={{ search: searchTerm, category: categorySlug, tag: tagSlug }}
                  />
                )}
              </>
                ) : (
                  <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
                    <h3 className="text-lg font-semibold text-gray-900">You’re all caught up.</h3>
                    <p className="mt-2 text-gray-600">
                      Adjust your filters or search to surface more California dog park stories.
                    </p>
                    <div className="mt-4 flex flex-wrap justify-center gap-3">
                      {categorySlug && (
                        <Link
                          href={buildFilterHref({ category: undefined })}
                          className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
                        >
                          Clear category
                        </Link>
                      )}
                      {tagSlug && (
                        <Link
                          href={buildFilterHref({ tag: undefined })}
                          className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
                        >
                          Clear tag
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
          </div>

            <div className="lg:sticky lg:top-24">
              <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-gray-100" />}>
              <BlogSidebar
                categories={categories}
                tags={tags}
                recentPosts={recentPosts}
                  defaultSearchValue={searchTerm || ''}
                  activeCategory={categorySlug}
                  activeTag={tagSlug}
              />
            </Suspense>
          </div>
        </div>
        </section>
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
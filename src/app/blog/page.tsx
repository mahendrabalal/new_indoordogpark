import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { permanentRedirect } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogCard from '@/components/blog/BlogCard';
import BlogPagination from '@/components/blog/BlogPagination';
import BlogSidebar from '@/components/blog/BlogSidebar';
// import { BlogPageSkeleton } from '@/components/blog/BlogSkeleton';
// import ErrorBoundary from '@/components/blog/ErrorBoundary';
import { LiveRegion, ReadingProgress } from '@/components/blog/AccessibilityFeatures';
import LiveSearchInput from '@/components/blog/LiveSearchInput';
import type { BlogSearchSuggestion } from '@/components/blog/LiveSearchInput';
import StructuredData from '@/components/blog/StructuredData';
import NewsletterForm from '@/components/NewsletterForm';

import { BlogPost, WPCategory, WPTag } from '@/types/wordpress';
import { getCachedPosts, getCachedCategories, getCachedTags } from '@/lib/sanity-api';

// ISR: serve cached page, revalidate in the background every 1 hour.
// On-demand revalidation via Sanity webhook is the primary cache-busting mechanism;
// the 1-hour timer is a safety net if the webhook is missed.
export const revalidate = 3600;

// Define the BlogPage component props
interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
    perPage?: string;
    search?: string;
    category?: string;
    tag?: string;
  }>;
}

const getFeaturedImage = (post: BlogPost) =>
  post.featuredImage?.media_details?.sizes?.large?.source_url ||
  post.featuredImage?.media_details?.sizes?.medium?.source_url ||
  post.featuredImage?.source_url;

// Blog page with search params
async function BlogPageContent({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = Math.max(1, Number.parseInt(resolvedSearchParams.page || '1', 10) || 1);
  const perPage = Math.max(1, Number.parseInt(resolvedSearchParams.perPage || '12', 10) || 12);
  const searchTerm = resolvedSearchParams.search;
  const categorySlug = resolvedSearchParams.category;
  const tagSlug = resolvedSearchParams.tag;

  // Canonicalize legacy query-based category/tag filters to dedicated routes
  // (prevents duplicate content and matches sitemap URLs)
  if (categorySlug) {
    const encoded = encodeURIComponent(categorySlug);
    const qs = new URLSearchParams();
    if (page > 1) qs.set('page', String(page));
    if (perPage !== 12) qs.set('perPage', String(perPage));
    if (searchTerm) qs.set('search', searchTerm);
    const suffix = qs.toString() ? `?${qs.toString()}` : '';
    permanentRedirect(`/blog/category/${encoded}${suffix}`);
  }

  if (tagSlug) {
    const encoded = encodeURIComponent(tagSlug);
    const qs = new URLSearchParams();
    if (page > 1) qs.set('page', String(page));
    if (perPage !== 12) qs.set('perPage', String(perPage));
    if (searchTerm) qs.set('search', searchTerm);
    const suffix = qs.toString() ? `?${qs.toString()}` : '';
    permanentRedirect(`/blog/tag/${encoded}${suffix}`);
  }

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
  const categoryChips = categories.slice(0, 7);
  const searchSuggestions: BlogSearchSuggestion[] = [
    ...categories.map((category) => ({
      label: category.name,
      href: `/blog/category/${encodeURIComponent(category.slug)}`,
      type: 'Topic',
      description: category.description || `${category.count} articles`,
    })),
    ...tags.map((tag) => ({
      label: tag.name,
      href: `/blog/tag/${encodeURIComponent(tag.slug)}`,
      type: 'Tag',
      description: `${tag.count} articles`,
    })),
    ...posts.slice(0, 6).map((post) => ({
      label: post.title,
      href: `/blog/${post.slug}`,
      type: 'Article',
      description: post.excerpt.replace(/<[^>]+>/g, '').slice(0, 90),
    })),
  ];

  const buildFilterHref = (overrides: Partial<{ search?: string; category?: string; tag?: string }>) => {
    const merged = {
      search: searchTerm,
      category: categorySlug,
      tag: tagSlug,
      ...overrides,
    };

    if (!merged.search && merged.category && !merged.tag) {
      return `/blog/category/${encodeURIComponent(merged.category)}`;
    }

    if (!merged.search && merged.tag && !merged.category) {
      return `/blog/tag/${encodeURIComponent(merged.tag)}`;
    }

    const params = new URLSearchParams();

    // Remove empty values to clear filters
    Object.entries(merged).forEach(([key, value]) => {
      if (value && value !== '') {
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
    return 'Tips, guides, and stories about indoor dog parks';
  };

  const renderBrowseControls = (searchInputId: string) => (
    <section className="bg-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-5">
          <div className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <svg className="h-6 w-6 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <LiveSearchInput
              id={searchInputId}
              defaultValue={searchTerm || ''}
              placeholder="Search articles..."
              aria-label="Search articles"
              suggestions={searchSuggestions}
              className="block w-full rounded-full border border-gray-300 bg-gray-50 py-3 pl-12 pr-6 text-base text-gray-900 shadow-sm transition-colors focus:border-[#FF5722] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          <span className="text-sm font-medium text-gray-500 mr-1 shrink-0">Categories:</span>
          <Link
            href={buildFilterHref({ category: '', tag: '', search: '' })}
            prefetch={false}
            className={`shrink-0 inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition ${!categorySlug && !tagSlug && !searchTerm
              ? 'border-[#FF5722] bg-[#FF5722] text-white'
              : 'border-gray-200 bg-white text-gray-600 hover:border-[#FF5722] hover:text-[#FF5722]'
              }`}
          >
            All
          </Link>
          {categoryChips.map((category) => {
            const isActive = category.slug === categorySlug;
            return (
              <Link
                key={category.id}
                href={buildFilterHref({ category: category.slug, tag: '', search: '' })}
                prefetch={false}
                className={`shrink-0 inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition ${isActive
                  ? 'border-[#FF5722] bg-[#FF5722] text-white'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-[#FF5722] hover:text-[#FF5722]'
                  }`}
              >
                {category.name}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );

  if (!hasPosts) {
    return (
      <>
        <StructuredData type="Blog" data={posts} />
        <LiveRegion />
        <ReadingProgress />
        <Header variant="light" />
        <div className="min-h-screen bg-white" id="main-content" role="main">
          {renderBrowseControls('blog-search')}
          <section className="container mx-auto px-4 py-12 lg:py-16">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
              <div className="rounded-3xl border border-dashed border-purple-200 bg-white p-10 text-center shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-purple-600">No results</p>
                <h1 className="mt-4 text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
                <p className="mt-2 text-gray-500">{getPageDescription()}</p>
                <h2 className="mt-6 text-2xl font-semibold text-gray-900">We couldn’t find articles that match.</h2>
                <p className="mt-3 text-gray-600">
                  Try a shorter phrase, check the spelling, pick a category above, or reset back to all stories.
                </p>

                {activeFilters && (
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Link
                      href="/blog"
                      prefetch={false}
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
        <Footer />
      </>
    );
  }

  // Check if filters are active
  const hasActiveFilters = Boolean(categorySlug || tagSlug || searchTerm);
  const showEditorialHighlights = page === 1 && !hasActiveFilters;
  // Get top reads (3 most recent posts after featured)
  const topReads = showEditorialHighlights ? posts.slice(1, 4) : [];

  // Determine grid posts:
  // - Page 1 uses editorial highlights for the first four posts.
  // - Page 2+ and filtered views render only the paginated archive list.
  const gridPosts = showEditorialHighlights ? posts.slice(4) : posts;

  return (
    <>
      <StructuredData type="Blog" data={posts} />
      <LiveRegion />
      <ReadingProgress />
      <Header variant="light" />
      <div className="min-h-screen bg-white" id="main-content" role="main">




        {/* Browse by categories Section */}
        {renderBrowseControls('blog-search')}

        {/* The Latest and Top Reads Section */}
        {featuredPost && showEditorialHighlights && (
          <section className="border-b border-gray-200 bg-white py-12">
            <div className="container mx-auto px-4">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                {/* The Latest - Left Column */}
                <div>
                  <h1 className="mb-6 text-2xl font-bold text-gray-900">The Latest</h1>
                  <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                    <div className="relative h-64 w-full overflow-hidden bg-gray-100 md:h-80">
                      <Image
                        src={getFeaturedImage(featuredPost) || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                        alt={featuredPost.featuredImage?.alt_text || featuredPost.title}
                        fill
                        className="object-cover"
                        priority
                        fetchPriority="high"
                        decoding="async"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQADAD8Jz8YvqVX4J3hw+EPnJ54cr6C+h2R//9k="
                        unoptimized={!getFeaturedImage(featuredPost) || getFeaturedImage(featuredPost)?.startsWith('http')}
                      />
                    </div>
                    <div className="p-6">
                      <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
                        <time dateTime={featuredPost.date}>
                          {new Date(featuredPost.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </time>
                        <span>|</span>
                        <span>{featuredPost.author?.name || 'Author'}</span>
                      </div>
                      <Link href={`/blog/${featuredPost.slug}`}>
                        <h3 className="mb-3 text-2xl font-bold leading-tight text-gray-900 transition-colors hover:text-[#FF5722] md:text-3xl">
                          {featuredPost.title}
                        </h3>
                      </Link>
                      {featuredPost.excerpt && (
                        <div
                          className="prose prose-sm mb-4 line-clamp-3 max-w-none text-gray-600"
                          dangerouslySetInnerHTML={{ __html: featuredPost.excerpt }}
                        />
                      )}
                      <Link
                        href={`/blog/${featuredPost.slug}`}
                        className="inline-flex items-center text-sm font-semibold text-[#FF5722] transition-colors hover:text-[#E64A19]"
                      >
                        Read more
                        <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </article>
                </div>

                {/* Top Reads - Right Column */}
                {topReads.length > 0 && (
                  <div>
                    <h2 className="mb-6 text-2xl font-bold text-gray-900">Top Reads</h2>
                    <div className="space-y-6">
                      {topReads.map((post) => {
                        const postImage = getFeaturedImage(post);
                        return (
                          <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            className="group flex gap-4 rounded-lg transition-colors hover:bg-gray-50"
                          >
                            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                              <Image
                                src={postImage || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'}
                                alt={post.featuredImage?.alt_text || post.title}
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                                sizes="80px"
                                loading="lazy"
                                decoding="async"
                                placeholder="blur"
                                unoptimized={!postImage || postImage.startsWith('http')}
                                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQADAD8Jz8YvqVX4J3hw+EPnJ54cr6C+h2R//9k="
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-[#FF5722]">
                                {post.title}
                              </h3>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <time dateTime={post.date}>
                                  {new Date(post.date).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </time>
                                <span>|</span>
                                <span>{post.author?.name || 'Author'}</span>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Blog Post Grid */}
        <section className="bg-white py-12">
          <div className="container mx-auto px-4">
            {gridPosts.length > 0 ? (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {gridPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
                {pagination.totalPages > 1 && (
                  <div className="mt-12">
                    <BlogPagination
                      pagination={pagination}
                      basePath="/blog"
                      className="mt-10"
                      query={{ search: searchTerm, category: categorySlug, tag: tagSlug }}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                <h3 className="text-lg font-semibold text-gray-900">You&apos;re all caught up.</h3>
                <p className="mt-2 text-gray-600">
                  Adjust your filters or search to surface more indoor dog park stories.
                </p>
                {activeFilters && (
                  <Link
                    href="/blog"
                    prefetch={false}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Clear filters
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Subscription Section */}
        <section className="border-t border-gray-200 bg-[#FFF5F2] py-16 relative overflow-hidden">
          {/* Decorative curve on left */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-[#FFE5DD] rounded-r-full opacity-50"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-[1.2fr_1fr] md:items-center">
              {/* Left Card - Image Section */}
              <div className="relative hidden md:block">
                <div className="relative h-96 w-full overflow-hidden rounded-2xl bg-white border-2 border-[#FF5722]/20 shadow-lg">
                  <Image
                    src="/images/subscribe/playing_dog_family.jpeg"
                    alt="Join our community for dog park updates"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 0vw, 50vw"
                    unoptimized
                  />
                </div>
              </div>

              {/* Right Card - Subscription Form */}
              <div className="rounded-2xl bg-white p-8 shadow-xl border-2 border-[#FF5722]/20">
                {/* Logo/Header */}
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-[#FF5722]">
                    <i className="bi bi-check-lg text-sm text-white"></i>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 uppercase tracking-wide">INDOOR DOG PARK NEWS</span>
                </div>

                {/* Title */}
                <h2 className="mb-2 text-3xl font-bold text-gray-900">
                  Subscribe to our Newsletter!
                </h2>

                {/* Description */}
                <p className="mb-6 text-sm text-gray-600">
                  Get blog articles and offers via email.
                </p>

                {/* Form */}
                <NewsletterForm type="consumer" source="blog_page" />
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
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
  const resolvedSearchParams = await searchParams;
  const searchTerm = resolvedSearchParams.search;
  const categorySlug = resolvedSearchParams.category;
  const tagSlug = resolvedSearchParams.tag;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indoordogpark.org';

  let title = 'Indoor Dog Park Blog - Tips & Guides';
  let description = 'Expert tips, guides, and stories about indoor dog parks, dog training, pet care, and creating the best indoor environment for your furry friends.';
  const canonicalUrl = '/blog';
  const ogImage = `${siteUrl}/images/hero/hero.webp`;

  // Category and tag query params redirect to canonical routes, so they should be indexable
  // Only block search query params from indexing (they're truly filtered pages)
  const shouldBlockIndexing = Boolean(searchTerm);

  if (searchTerm) {
    title = `Search Results for "${searchTerm}" - Indoor Dog Park Blog`;
    description = `Search results for "${searchTerm}" in our indoor dog park blog. Find expert tips, guides, and stories about indoor dog parks.`;
  } else if (categorySlug) {
    title = `${categorySlug} Articles - Indoor Dog Park Blog`;
    description = `Read expert articles about ${categorySlug} in indoor dog parks and facilities. Tips, guides, and insights for dog owners.`;
  } else if (tagSlug) {
    title = `${tagSlug} Articles - Indoor Dog Park Blog`;
    description = `Discover articles tagged with ${tagSlug} for indoor dog park enthusiasts. Expert advice and helpful guides.`;
  }

  return {
    title,
    description,
    keywords: 'indoor dog parks, dog training, pet care, dog-friendly facilities, US dog parks, dog park guides, pet tips',
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
          alt: 'Indoor Dog Park Blog - Tips & Guides',
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
      // Only block search query params from indexing (they're filtered pages)
      // Category/tag query params redirect to canonical routes, so allow indexing
      index: !shouldBlockIndexing,
      follow: true,
      googleBot: {
        index: !shouldBlockIndexing,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

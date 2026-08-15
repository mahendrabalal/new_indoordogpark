import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BlogPost } from '@/types/wordpress';
import StructuredData from '@/components/blog/StructuredData';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogTableOfContents from '@/components/blog/BlogTableOfContents';
import BlogSubscribe from '@/components/blog/BlogSubscribe';
import BlogCard from '@/components/blog/BlogCard';
import { getCachedPosts, getCachedPostBySlug } from '@/lib/sanity-api';
import { extractHeadingsFromHtml, addIdsToHeadings } from '@/lib/extract-headings';

import { getRelatedParks, extractMentionedCities } from '@/lib/related-content';
import { getAllStaticParks, getCitySlugByName } from '@/lib/parks-data';
import ParkCard from '@/components/ParkCard';
import { SITE_URL } from '@/lib/metadata';

// ISR: cache rendered post pages, revalidate every 5 minutes as a safety net.
// On-demand revalidation via Sanity webhook is the primary cache-busting mechanism.
export const revalidate = 300;

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Estimate reading time
const estimateReadingTime = (content: string) => {
  if (!content) return 4;
  const plainText = content.replace(/<[^>]*>/g, ' ');
  const words = plainText.split(/\s+/).filter(Boolean).length;
  return Math.max(3, Math.ceil(words / 200));
};

// Blog post page component
async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  // Fetch the blog post from Sanity
  let post: BlogPost | null = null;
  try {
    post = await getCachedPostBySlug(slug);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return notFound();
  }

  if (!post) {
    return notFound();
  }

  // Get featured image with validation
  const rawFeaturedImage = post.featuredImage?.media_details?.sizes?.large?.source_url ||
    post.featuredImage?.media_details?.sizes?.medium?.source_url ||
    post.featuredImage?.source_url;

  // Validate that the image URL is a valid string and not empty
  const featuredImage = rawFeaturedImage &&
    typeof rawFeaturedImage === 'string' &&
    rawFeaturedImage.trim() !== '' &&
    rawFeaturedImage.startsWith('http')
    ? rawFeaturedImage
    : undefined;

  // Extract headings for table of contents
  const headings = extractHeadingsFromHtml(post.content);

  // Add IDs to headings in content
  const contentWithIds = addIdsToHeadings(post.content);

  // Get related posts (by category or tag)
  let relatedPosts: BlogPost[] = [];
  try {
    const categorySlug = post.categories[0]?.slug;
    if (categorySlug) {
      const relatedData = await getCachedPosts({
        category: categorySlug,
        perPage: 4
      });
      relatedPosts = relatedData.posts.filter(p => p.slug !== post.slug).slice(0, 3);
    }

    // If not enough related posts, get by tag
    if (relatedPosts.length < 3 && post.tags.length > 0) {
      const tagSlug = post.tags[0]?.slug;
      if (tagSlug) {
        const tagData = await getCachedPosts({
          tag: tagSlug,
          perPage: 4
        });
        const tagPosts = tagData.posts.filter(p => p.slug !== post.slug && !relatedPosts.find(rp => rp.slug === p.slug));
        relatedPosts = [...relatedPosts, ...tagPosts].slice(0, 3);
      }
    }

    // If still not enough, get latest posts
    if (relatedPosts.length < 3) {
      const latestData = await getCachedPosts({ perPage: 4 });
      const latestPosts = latestData.posts.filter(p => p.slug !== post.slug && !relatedPosts.find(rp => rp.slug === p.slug));
      relatedPosts = [...relatedPosts, ...latestPosts].slice(0, 3);
    }
  } catch (error) {
    console.error('Error fetching related posts:', error);
  }

  // Get related parks and mentioned cities
  const allParks = await getAllStaticParks();
  const relatedParks = await getRelatedParks(post, 6);
  const mentionedCityNames = extractMentionedCities(post, allParks);

  // Get correct city slugs for mentioned cities (respecting priority cities)
  const mentionedCitiesWithSlugs = await Promise.all(
    mentionedCityNames.map(async (cityName) => {
      // Find a park in this city to get the state
      const parkInCity = allParks.find((p) => p.city.toLowerCase() === cityName.toLowerCase());
      const state = parkInCity?.state;

      // Get the correct canonical slug (handles priority cities)
      const slug = await getCitySlugByName(cityName, state);

      return {
        name: cityName,
        slug: slug || cityName.toLowerCase().replace(/\s+/g, '-'), // Fallback to basic slug if not found
      };
    })
  );

  const readingTime = estimateReadingTime(post.content);
  const categoryName = post.categories[0]?.name || 'Blog';

  // Extract YouTube videos from content for structured data
  const extractYouTubeVideos = (content: string): Array<{ id: string; url: string; title?: string }> => {
    const videos: Array<{ id: string; url: string; title?: string }> = [];
    const iframeRegex = /<iframe[^>]*src=["']https?:\/\/www\.youtube\.com\/embed\/([^"?&]+)[^"']*["'][^>]*>/gi;
    let match;

    while ((match = iframeRegex.exec(content)) !== null) {
      const videoId = match[1];
      videos.push({
        id: videoId,
        url: `https://www.youtube.com/watch?v=${videoId}`,
      });
    }

    return videos;
  };

  const videos = extractYouTubeVideos(post.content);

  const reviewer = post.factCheckedBy || post.reviewedBy;
  const reviewerRole = post.factCheckedBy ? 'Fact-checked by' : 'Reviewed by';

  return (
    <>
      <StructuredData type="BlogPosting" data={post} />
      {/* Add Video structured data if videos are present */}
      {videos.length > 0 && videos.map((video, index) => (
        <script
          key={`video-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'VideoObject',
              name: post.title,
              description: post.excerpt.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim(),
              thumbnailUrl: post.featuredImage?.source_url || `${SITE_URL}/images/og-image.jpg`,
              thumbnail: {
                '@type': 'ImageObject',
                url: post.featuredImage?.source_url || `${SITE_URL}/images/og-image.jpg`,
                width: 1280,
                height: 720,
              },
              uploadDate: post.date,
              contentUrl: video.url,
              embedUrl: `https://www.youtube.com/embed/${video.id}`,
              duration: undefined, // Would need to fetch from YouTube API for exact duration
              interactionStatistic: {
                '@type': 'InteractionCounter',
                interactionType: 'https://schema.org/WatchAction',
              },
              publisher: {
                '@type': 'Organization',
                name: 'Indoor Dog Park',
                url: SITE_URL,
                logo: {
                  '@type': 'ImageObject',
                  url: `${SITE_URL}/images/logo/logo.png`,
                  width: 200,
                  height: 60,
                },
              },
              isPartOf: {
                '@type': 'BlogPosting',
                '@id': `${SITE_URL}/blog/${post.slug}`,
              },
              potentialAction: {
                '@type': 'WatchAction',
                target: video.url,
              },
              inLanguage: 'en-US',
              requiresSubscription: false,
              isAccessibleForFree: true,
              isFamilyFriendly: true,
            })
          }}
        />
      ))}
      <StructuredData
        type="BreadcrumbList"
        data={{}}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog' },
          { name: categoryName, url: `/blog/category/${post.categories[0]?.slug || ''}` },
          { name: post.title, url: `/blog/${post.slug}` }
        ]}
      />
      <Header variant="light" />
      <div className="min-h-screen bg-white">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-green-600 transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/blog" prefetch={false} className="hover:text-green-600 transition-colors">
                Blog
              </Link>
              {post.categories[0] && (
                <>
                  <span>/</span>
                  <Link
                    href={`/blog/category/${post.categories[0].slug}`}
                    className="hover:text-green-600 transition-colors"
                  >
                    {post.categories[0].name}
                  </Link>
                </>
              )}
              <span>/</span>
              <span className="text-gray-900">{post.title}</span>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 lg:gap-12">
            {/* Main Article Content */}
            <article className="max-w-4xl">
              {/* Article Header */}
              <header className="mb-8">
                {/* Title */}
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  {post.title}
                </h1>

                {/* Subtitle/Introduction */}
                {post.excerpt && (
                  <div
                    className="text-lg text-gray-600 leading-relaxed mb-6"
                    dangerouslySetInnerHTML={{ __html: post.excerpt }}
                  />
                )}

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm text-gray-600 mb-6">
                  <div className="flex flex-wrap items-center gap-4">
                    {post.author && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Written by</span>
                        <Link href={`/blog/author/${post.author.slug}`} className="flex items-center gap-2 hover:text-green-600 transition-colors group">
                          {post.author.avatar_urls && post.author.avatar_urls['96'] && (
                            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200 group-hover:ring-2 group-hover:ring-green-300 transition-all">
                              <Image
                                src={post.author.avatar_urls['96']}
                                alt={post.author.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <span className="font-medium text-gray-900 group-hover:text-green-600 transition-colors">{post.author.name}</span>
                        </Link>
                      </div>
                    )}
                    {reviewer && (
                      <>
                        <span className="text-gray-300">|</span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">{reviewerRole}</span>
                          <Link href={`/blog/author/${reviewer.slug}`} className="flex items-center gap-2 hover:text-green-600 transition-colors group">
                            {reviewer.avatar_urls && reviewer.avatar_urls['96'] && (
                              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200 group-hover:ring-2 group-hover:ring-green-300 transition-all">
                                <Image
                                  src={reviewer.avatar_urls['96']}
                                  alt={reviewer.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <span className="font-medium text-gray-900 group-hover:text-green-600 transition-colors">{reviewer.name}</span>
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 md:gap-4 text-gray-500 border-l border-gray-300 pl-3 md:pl-4">
                    {!post.hidePublishedDate && (
                      <>
                        <div className="flex items-center gap-1">
                          <time dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </time>
                          {post.lastUpdated && post.lastUpdated !== post.date && (
                            <span className="italic whitespace-nowrap">
                              (Updated: {new Date(post.lastUpdated).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })})
                            </span>
                          )}
                        </div>
                        <span className="text-gray-300">|</span>
                      </>
                    )}
                    <span>{readingTime} min read</span>
                  </div>
                </div>

                {/* Hero Image */}
                {featuredImage && (
                  <figure className="mb-8">
                    <div className="group relative w-full h-64 md:h-96 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={featuredImage}
                        alt={post.featuredImage?.alt_text || post.title}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 100vw, 896px"
                        unoptimized={true}
                        data-pin-nopin="true"
                      />
                      
                      {/* Hover Share Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-between p-4 z-10 pointer-events-none">
                        {/* Top Left: Pinterest Save */}
                        <div className="pointer-events-auto">
                          <a
                            href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent((process.env.NEXT_PUBLIC_BASE_URL || 'https://indoordogpark.com') + '/blog/' + post.slug)}&media=${encodeURIComponent(featuredImage)}&description=${encodeURIComponent(post.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 bg-[#E60023] hover:bg-[#ad081b] text-white px-3 py-1.5 rounded-full font-semibold text-sm transition-colors"
                            aria-label="Save to Pinterest"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345l-.288 1.148c-.05.204-.185.263-.385.163-1.442-.71-2.34-2.943-2.34-4.739 0-3.856 2.802-7.399 8.082-7.399 4.236 0 7.522 3.018 7.522 7.042 0 4.208-2.651 7.599-6.331 7.599-1.238 0-2.403-.642-2.801-1.4l-.764 2.911c-.276 1.047-1.024 2.355-1.528 3.155 1.196.368 2.455.567 3.768.567 6.621 0 11.988-5.367 11.988-11.987C24 5.367 18.638 0 12.017 0z"/>
                            </svg>
                            Save
                          </a>
                        </div>
                        
                        {/* Top Right: General Share Icons */}
                        <div className="flex flex-col gap-2 pointer-events-auto">
                          <a
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent((process.env.NEXT_PUBLIC_BASE_URL || 'https://indoordogpark.com') + '/blog/' + post.slug)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#2c2c2c] hover:bg-black text-white p-2 rounded-md transition-colors flex items-center justify-center shadow-sm"
                            aria-label="Share on LinkedIn"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                          </a>
                          <a
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent((process.env.NEXT_PUBLIC_BASE_URL || 'https://indoordogpark.com') + '/blog/' + post.slug)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#2c2c2c] hover:bg-black text-white p-2 rounded-md transition-colors flex items-center justify-center shadow-sm"
                            aria-label="Share on X (Twitter)"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                          </a>
                          <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent((process.env.NEXT_PUBLIC_BASE_URL || 'https://indoordogpark.com') + '/blog/' + post.slug)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#2c2c2c] hover:bg-black text-white p-2 rounded-md transition-colors flex items-center justify-center shadow-sm"
                            aria-label="Share on Facebook"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                          </a>
                          <a
                            href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent((process.env.NEXT_PUBLIC_BASE_URL || 'https://indoordogpark.com') + '/blog/' + post.slug)}`}
                            className="bg-[#2c2c2c] hover:bg-black text-white p-2 rounded-md transition-colors flex items-center justify-center shadow-sm"
                            aria-label="Share via Email"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                    {post.featuredImage?.caption?.rendered && (
                      <figcaption 
                        className="mt-3 text-sm text-gray-500 text-center italic [&>p]:m-0"
                        dangerouslySetInnerHTML={{ __html: post.featuredImage.caption.rendered }}
                      />
                    )}
                  </figure>
                )}
              </header>

              {/* Mobile Table of Contents */}
              <div className="block lg:hidden mb-8">
                {headings.length > 0 && (
                  <BlogTableOfContents items={headings} isMobile={true} />
                )}
              </div>

              {/* Article Content */}
              <div
                className="prose prose-lg max-w-none blog-content"
                dangerouslySetInnerHTML={{ __html: contentWithIds }}
              />
            </article>

            {/* Sidebar */}
            <aside className="hidden lg:block lg:sticky lg:top-24 h-fit">
              <div className="space-y-6">
                {/* Table of Contents */}
                {headings.length > 0 && (
                  <BlogTableOfContents items={headings} />
                )}

                {/* Follow Us Social Links */}
                {(process.env.NEXT_PUBLIC_SOCIAL_TWITTER || process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || process.env.NEXT_PUBLIC_SOCIAL_PINTEREST) && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
                    <p className="text-sm text-gray-600 mb-4">Stay updated with the latest indoor dog park news and tips!</p>
                    <div className="flex flex-wrap gap-3">
                      {process.env.NEXT_PUBLIC_SOCIAL_TWITTER && (
                        <a
                          href={process.env.NEXT_PUBLIC_SOCIAL_TWITTER}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium text-gray-700"
                          aria-label="Follow us on X (Twitter)"
                        >
                          <i className="bi bi-twitter"></i>
                          <span>X (Twitter)</span>
                        </a>
                      )}
                      {process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK && (
                        <a
                          href={process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium text-gray-700"
                          aria-label="Follow us on Facebook"
                        >
                          <i className="bi bi-facebook"></i>
                          <span>Facebook</span>
                        </a>
                      )}
                      {process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM && (
                        <a
                          href={process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium text-gray-700"
                          aria-label="Follow us on Instagram"
                        >
                          <i className="bi bi-instagram"></i>
                          <span>Instagram</span>
                        </a>
                      )}
                      {process.env.NEXT_PUBLIC_SOCIAL_PINTEREST && (
                        <a
                          href={process.env.NEXT_PUBLIC_SOCIAL_PINTEREST}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium text-gray-700"
                          aria-label="Follow us on Pinterest"
                        >
                          <i className="bi bi-pinterest"></i>
                          <span>Pinterest</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Subscribe Now */}
                <BlogSubscribe />
              </div>
            </aside>
          </div>

          {/* Author Info and Tags Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-start">
              {/* Author Info */}
              <div className="space-y-6">
                {post.author && (
                  <div className="flex gap-4">
                    <Link href={`/blog/author/${post.author.slug}`} className="flex-shrink-0">
                      {post.author.avatar_urls && post.author.avatar_urls['96'] && (
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 hover:ring-2 hover:ring-green-300 transition-all">
                          <Image
                            src={post.author.avatar_urls['96']}
                            alt={post.author.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </Link>
                    <div>
                      <Link href={`/blog/author/${post.author.slug}`} className="text-base font-bold text-gray-900 mb-1 hover:text-green-600 transition-colors block">About {post.author.name}</Link>
                      {post.author.description && (
                        <p className="text-sm text-gray-600 leading-relaxed">{post.author.description}</p>
                      )}
                      <Link href={`/blog/author/${post.author.slug}`} className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium mt-2 transition-colors">
                        View all articles →
                      </Link>
                    </div>
                  </div>
                )}
                
                {reviewer && (
                  <div className="flex gap-4 pt-6 border-t border-gray-100">
                    <Link href={`/blog/author/${reviewer.slug}`} className="flex-shrink-0">
                      {reviewer.avatar_urls && reviewer.avatar_urls['96'] && (
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 hover:ring-2 hover:ring-green-300 transition-all">
                          <Image
                            src={reviewer.avatar_urls['96']}
                            alt={reviewer.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </Link>
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{reviewerRole}</div>
                      <Link href={`/blog/author/${reviewer.slug}`} className="text-base font-bold text-gray-900 mb-1 hover:text-green-600 transition-colors block">{reviewer.name}</Link>
                      {reviewer.description && (
                        <p className="text-sm text-gray-600 leading-relaxed">{reviewer.description}</p>
                      )}
                      <Link href={`/blog/author/${reviewer.slug}`} className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium mt-2 transition-colors">
                        View profile →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Tags and Share */}
              <div className="flex flex-col items-start md:items-end gap-4 mt-4 md:mt-0 pt-4 md:pt-0 border-t border-gray-100 md:border-0">
                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/blog/tag/${tag.slug}`}
                        className="inline-flex items-center px-3 py-1 text-sm font-medium text-[#FF5722] bg-[#FFF5F2] rounded-full hover:bg-[#FFE5DD] transition-colors"
                      >
                        {tag.name}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Share Section */}
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm font-semibold text-gray-900 leading-none">Share</span>
                  <div className="flex items-center gap-3">
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent((process.env.NEXT_PUBLIC_BASE_URL || 'https://indoordogpark.com') + '/blog/' + post.slug)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center text-gray-600 hover:text-[#FF5722] transition-colors"
                      aria-label="Share on Twitter"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent((process.env.NEXT_PUBLIC_BASE_URL || 'https://indoordogpark.com') + '/blog/' + post.slug)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center text-gray-600 hover:text-[#FF5722] transition-colors"
                      aria-label="Share on Facebook"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                    <a
                      href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent((process.env.NEXT_PUBLIC_BASE_URL || 'https://indoordogpark.com') + '/blog/' + post.slug)}`}
                      className="flex items-center justify-center text-gray-600 hover:text-[#FF5722] transition-colors"
                      aria-label="Share via Email"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Blog Posts Section */}
        {relatedPosts.length > 0 && (
          <div className="bg-gray-50 py-12 mt-12">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Blog Post</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <BlogCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Related Parks Section */}
        {relatedParks.length > 0 && (
          <div className="bg-white py-12 mt-12 border-t border-gray-200">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Related Dog Parks</h2>
              <p className="text-gray-600 mb-8">
                Discover dog parks mentioned or related to this article.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedParks.map((park) => (
                  <ParkCard key={park.id} park={park} />
                ))}
              </div>
              <div className="mt-8 text-center">
                <Link
                  href="/"
                  className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium"
                >
                  Browse All Parks →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Mentioned Cities Section */}
        {mentionedCitiesWithSlugs.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 py-12 mt-12">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore These Cities</h2>
              <p className="text-gray-600 mb-6">
                This article mentions the following cities. Discover dog parks and resources in these locations.
              </p>
              <div className="flex flex-wrap gap-3">
                {mentionedCitiesWithSlugs.map((city) => {
                  // Capitalize first letter of each word for display
                  const displayName = city.name
                    .split(' ')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                  return (
                    <Link
                      key={city.name}
                      href={`/cities/${city.slug}`}
                      className="inline-flex items-center px-4 py-2 bg-white text-purple-700 rounded-lg hover:bg-purple-50 transition-colors font-medium shadow-sm"
                    >
                      <i className="bi bi-geo-alt mr-2"></i>
                      {displayName}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

// Generate metadata for the blog post
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    // Use the same data fetching method as the page component
    const post = await getCachedPostBySlug(slug);

    if (!post) {
      return {
        title: 'Post Not Found - California Dog Parks',
        description: 'The blog post you are looking for could not be found.',
      };
    }

    // Extract clean text from HTML for description
    const textContent = post.excerpt.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

    // Create SEO-optimized description (150-160 characters is optimal)
    let description = textContent;
    if (textContent.length > 160) {
      description = textContent.substring(0, 157) + '...';
    } else if (textContent.length < 120 && post.content) {
      // If excerpt is too short, use beginning of content
      const contentText = post.content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
      description = contentText.length > 160
        ? contentText.substring(0, 157) + '...'
        : contentText;
    }

    // Get featured image with validation
    const rawFeaturedImage = post.featuredImage?.media_details?.sizes?.large?.source_url ||
      post.featuredImage?.media_details?.sizes?.medium?.source_url ||
      post.featuredImage?.source_url;

    // Validate that the image URL is a valid string and not empty
    const featuredImage = rawFeaturedImage &&
      typeof rawFeaturedImage === 'string' &&
      rawFeaturedImage.trim() !== '' &&
      rawFeaturedImage.startsWith('http')
      ? rawFeaturedImage
      : undefined;

    // Create SEO-friendly title (60 characters max for optimal SEO)
    // Truncate at word boundary when possible to avoid cutting words
    let seoTitle = post.title;
    if (seoTitle.length > 60) {
      // Try to truncate at a word boundary (space) near 60 characters
      const truncated = seoTitle.substring(0, 60);
      const lastSpace = truncated.lastIndexOf(' ');
      // If we found a space after position 50, use it for cleaner truncation
      // This ensures we have room for "..." (3 chars) and stay <= 60 total
      if (lastSpace >= 50) {
        seoTitle = truncated.substring(0, lastSpace) + '...';
      } else {
        // Otherwise, truncate at 57 and add ellipsis (total exactly 60)
        seoTitle = truncated.substring(0, 57) + '...';
      }
      // Final safety check: ensure we never exceed 60 characters
      if (seoTitle.length > 60) {
        seoTitle = seoTitle.substring(0, 57) + '...';
      }
    }

    // Extract keywords from categories and tags
    const keywords = [
      ...post.categories.map(cat => cat.name),
      ...post.tags.map(tag => tag.name),
      'California dog parks',
      'indoor dog parks',
      'dog-friendly'
    ].join(', ');

    // Calculate reading time
    const readingTime = estimateReadingTime(post.content);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indoordogpark.org';

    return {
      title: seoTitle,
      description,
      keywords,
      authors: post.author ? [{ name: post.author.name }] : undefined,
      creator: post.author?.name,
      publisher: 'Indoor Dog Park',
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      other: {
        'article:published_time': post.date,
        'article:modified_time': post.modified,
        'article:author': post.author?.name || 'Indoor Dog Park Team',
        'article:section': post.categories[0]?.name || 'General',
        'article:tag': post.tags.map(tag => tag.name).join(', '),
        'article:reading_time': `${readingTime} minutes`,
      },
      openGraph: {
        title: seoTitle, // Use truncated title for OpenGraph too
        description,
        type: 'article',
        publishedTime: post.date,
        modifiedTime: post.modified,
        authors: post.author ? [post.author.name] : [],
        siteName: 'Indoor Dog Park',
        locale: 'en_US',
        url: `${siteUrl}/blog/${slug}`,
        images: featuredImage ? [
          {
            url: featuredImage,
            width: post.featuredImage?.media_details?.width || 1200,
            height: post.featuredImage?.media_details?.height || 630,
            alt: post.featuredImage?.alt_text || seoTitle,
          },
        ] : [
          {
            url: `${siteUrl}/images/hero/hero.webp`,
            width: 1200,
            height: 630,
            alt: seoTitle,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: seoTitle, // Use truncated title for Twitter too
        description,
        creator: post.author?.name ? `@${post.author.name.replace(/\s+/g, '')}` : '@indoordogpark',
        site: '@indoordogpark',
        images: featuredImage ? [featuredImage] : [`${siteUrl}/images/hero/hero.webp`],
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
      alternates: {
        canonical: `${siteUrl}/blog/${slug}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog Post - California Dog Parks',
      description: 'Read the latest articles about California dog parks.',
    };
  }
}

export default BlogPostPage;

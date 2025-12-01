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

// Use ISR with on-demand revalidation (best practice)
// Pages are statically generated and cached for performance
// Revalidate via webhook when posts are updated in Sanity
export const revalidate = 300; // Fallback: revalidate every 5 minutes if webhook fails

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Generate static params for ISR (optional - helps with known posts)
export async function generateStaticParams() {
  try {
    const response = await getCachedPosts({ perPage: 100 });
    const posts = response.posts || [];

    return posts.map((post: BlogPost) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
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
  const { slug } = params;

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

  const featuredImage = post.featuredImage?.media_details?.sizes?.large?.source_url ||
                       post.featuredImage?.media_details?.sizes?.medium?.source_url ||
                       post.featuredImage?.source_url;

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

  const readingTime = estimateReadingTime(post.content);
  const categoryName = post.categories[0]?.name || 'Blog';
  
  // Pass reading time to structured data component if needed

  return (
    <>
      <StructuredData type="BlogPosting" data={post} />
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
      <Header />
      <div className="min-h-screen bg-white">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-green-600 transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-green-600 transition-colors">
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
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                  {post.author && (
                    <span>By {post.author.name}</span>
                  )}
                  <span>|</span>
                  <time dateTime={post.date}>
                    Last updated: {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                  <span>|</span>
                  <span>{readingTime} minutes read</span>
                </div>

                {/* Hero Image */}
                {featuredImage && (
                  <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
                    <Image
                      src={featuredImage}
                      alt={post.featuredImage?.alt_text || post.title}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, 896px"
                    />
                  </div>
                )}
              </header>

              {/* Article Content */}
              <div 
                className="prose prose-lg max-w-none blog-content"
                dangerouslySetInnerHTML={{ __html: contentWithIds }} 
              />
            </article>

            {/* Sidebar */}
            <aside className="lg:sticky lg:top-24 h-fit">
              <div className="space-y-6">
                {/* Table of Contents */}
                {headings.length > 0 && (
                  <BlogTableOfContents items={headings} />
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
              <div>
                {post.author && (
                  <>
                    <p className="text-sm font-semibold text-gray-900 mb-2">Posted by {post.author.name}</p>
                    {post.author.description && (
                      <p className="text-sm text-gray-600">{post.author.description}</p>
                    )}
                  </>
                )}
              </div>

              {/* Tags and Share */}
              <div className="flex flex-col items-end gap-4">
                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-end">
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
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-gray-900">Share</span>
                  <div className="flex gap-3">
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent((process.env.NEXT_PUBLIC_BASE_URL || 'https://indoordogpark.com') + '/blog/' + post.slug)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-[#FF5722] transition-colors"
                      aria-label="Share on Twitter"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>
                    <a
                      href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent((process.env.NEXT_PUBLIC_BASE_URL || 'https://indoordogpark.com') + '/blog/' + post.slug)}`}
                      className="text-gray-600 hover:text-[#FF5722] transition-colors"
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
      </div>
      <Footer />
    </>
  );
}

// Generate metadata for the blog post
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = params;

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

    // Get featured image
    const featuredImage = post.featuredImage?.media_details?.sizes?.large?.source_url ||
                         post.featuredImage?.media_details?.sizes?.medium?.source_url ||
                         post.featuredImage?.source_url;

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
        canonical: `/blog/${slug}`,
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

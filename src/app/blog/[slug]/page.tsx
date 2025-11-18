import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BlogPost } from '@/types/wordpress';
import { ArrowLeftIcon, CalendarIcon, TagIcon } from '@heroicons/react/24/outline';
import StructuredData from '@/components/blog/StructuredData';
import { getCachedPosts, getCachedPostBySlug } from '@/lib/sanity-api';

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

  const authorImage = post.author?.avatar_urls?.['96'] || post.author?.avatar_urls?.['48'];

  return (
    <>
      <StructuredData type="BlogPosting" data={post} />
      <StructuredData
        type="BreadcrumbList"
        data={{}}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog' },
          { name: post.title, url: `/blog/${post.slug}` }
        ]}
      />
      <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <Link
            href="/blog"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Content */}
      <article className="blog-article-container">
        {/* Article Header */}
        <header className="mb-12">
          {/* Categories */}
          {post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/blog/category/${category.slug}`}
                  className="text-sm font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Featured Image - After Title */}
          {featuredImage && (
            <div className="blog-featured-image-wrapper">
              <div className="blog-featured-image-container">
                <Image
                  src={featuredImage}
                  alt={post.featuredImage?.alt_text || post.title}
                  fill
                  className="blog-featured-image"
                  priority
                  sizes="(max-width: 768px) 100vw, 720px"
                />
              </div>
              {post.featuredImage?.alt_text && (
                <div className="blog-featured-image-caption">
                  {post.featuredImage.alt_text}
                </div>
              )}
            </div>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
            {/* Author */}
            {post.author && (
              <div className="flex items-center space-x-3">
                {authorImage && (
                  <Image
                    src={authorImage}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <div>
                  <div className="font-medium text-gray-900">{post.author.name}</div>
                  <div className="text-sm text-gray-500">{post.author.description || 'Blog Author'}</div>
                </div>
              </div>
            )}

            {/* Date */}
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5" />
              <time dateTime={post.date} className="text-sm">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>

            {/* Reading time */}
            <div className="text-sm">
              {Math.ceil(post.content.length / 1000)} min read
            </div>
          </div>

          {/* Excerpt */}
          {post.excerpt && post.excerpt !== post.content && (
            <div className="text-xl text-gray-600 leading-relaxed mb-8">
              <div dangerouslySetInnerHTML={{ __html: post.excerpt }} />
            </div>
          )}
        </header>

        {/* Article Content */}
        <div className="blog-content">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TagIcon className="w-5 h-5 mr-2" />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/blog/tag/${tag.slug}`}
                  className="inline-flex items-center px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-full hover:bg-purple-100 hover:text-purple-700 transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Share Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this article</h3>
          <div className="flex flex-wrap gap-4">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(process.env.NEXT_PUBLIC_BASE_URL + '/blog/' + post.slug)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Share on Twitter
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(process.env.NEXT_PUBLIC_BASE_URL + '/blog/' + post.slug)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Share on Facebook
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(process.env.NEXT_PUBLIC_BASE_URL + '/blog/' + post.slug)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors"
            >
              Share on LinkedIn
            </a>
          </div>
        </div>
      </article>

      {/* Related Posts Section */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Related Articles</h2>

          {/* This would typically fetch related posts based on categories/tags */}
          <div className="text-center text-gray-600">
            <p>Related articles will be shown here once more content is available.</p>
            <Link
              href="/blog"
              className="inline-flex items-center mt-4 text-purple-600 hover:text-purple-700"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              View all articles
            </Link>
          </div>
        </div>
      </div>
    </div>
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

    // Create SEO-friendly title (50-60 characters is optimal)
    let seoTitle = post.title;
    if (seoTitle.length > 60) {
      seoTitle = seoTitle.substring(0, 57) + '...';
    }

    // Extract keywords from categories and tags
    const keywords = [
      ...post.categories.map(cat => cat.name),
      ...post.tags.map(tag => tag.name),
      'California dog parks',
      'indoor dog parks',
      'dog-friendly'
    ].join(', ');

    return {
      title: seoTitle,
      description,
      keywords,
      authors: post.author ? [{ name: post.author.name }] : undefined,
      creator: post.author?.name,
      publisher: 'California Dog Parks',
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      openGraph: {
        title: post.title,
        description,
        type: 'article',
        publishedTime: post.date,
        modifiedTime: post.modified,
        authors: post.author ? [post.author.name] : [],
        siteName: 'California Dog Parks',
        locale: 'en_US',
        images: featuredImage ? [
          {
            url: featuredImage,
            width: post.featuredImage?.media_details?.width || 1200,
            height: post.featuredImage?.media_details?.height || 630,
            alt: post.featuredImage?.alt_text || post.title,
          },
        ] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description,
        creator: post.author?.name ? `@${post.author.name.replace(/\s+/g, '')}` : undefined,
        images: featuredImage ? [featuredImage] : [],
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
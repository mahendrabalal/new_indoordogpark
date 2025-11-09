import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BlogPost } from '@/types/wordpress';
import { ArrowLeftIcon, CalendarIcon, TagIcon } from '@heroicons/react/24/outline';
import StructuredData from '@/components/blog/StructuredData';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Generate static params for ISR
export async function generateStaticParams() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/blog?perPage=100`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const posts = data.data || [];

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

  // Fetch the blog post
  let post: BlogPost | null = null;
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/blog/${slug}`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!response.ok) {
      if (response.status === 404) {
        return notFound();
      }
      throw new Error('Failed to fetch blog post');
    }

    const data = await response.json();
    post = data.data;
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

      {/* Hero Section with Featured Image */}
      {featuredImage && (
        <div className="relative aspect-video lg:aspect-[16/9] overflow-hidden">
          <Image
            src={featuredImage}
            alt={post.featuredImage?.alt_text || post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
      )}

      {/* Content */}
      <article className="container mx-auto px-4 py-16 max-w-4xl">
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
        <div className="max-w-none">
          <div
            className="prose prose-lg prose-purple max-w-none
                       prose-headings:font-bold prose-headings:text-gray-900
                       prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl
                       prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-lg
                       prose-p:mb-6 prose-p:mt-4
                       prose-h1:mt-12 prose-h1:mb-8 prose-h2:mt-10 prose-h2:mb-6 prose-h3:mt-8 prose-h3:mb-5
                       prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                       prose-strong:text-gray-900 prose-strong:font-semibold
                       prose-ul:text-gray-700 prose-ol:text-gray-700 prose-ul:my-6 prose-ol:my-6
                       prose-li:my-2 prose-li:text-base
                       prose-code:text-purple-600 prose-code:bg-purple-50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                       prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-6 prose-pre:rounded-lg prose-pre:my-8
                       prose-blockquote:border-l-4 prose-blockquote:border-purple-600 prose-blockquote:bg-purple-50 prose-blockquote:p-6 prose-blockquote:my-8 prose-blockquote:italic prose-blockquote:text-gray-700
                       prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8
                       prose-table:border-gray-200 prose-th:bg-gray-50 prose-th:border-gray-200 prose-table:my-6"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/blog/${slug}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return {
        title: 'Post Not Found - California Dog Parks',
        description: 'The blog post you are looking for could not be found.',
      };
    }

    const data = await response.json();
    const post: BlogPost = data.data;

    if (!post) {
      return {
        title: 'Post Not Found - California Dog Parks',
        description: 'The blog post you are looking for could not be found.',
      };
    }

    // Extract text from HTML for description
    const textContent = post.excerpt.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    const description = textContent.length > 160
      ? textContent.substring(0, 157) + '...'
      : textContent;

    const featuredImage = post.featuredImage?.source_url;

    return {
      title: `${post.title} - California Dog Parks Blog`,
      description,
      openGraph: {
        title: post.title,
        description,
        type: 'article',
        publishedTime: post.date,
        modifiedTime: post.modified,
        authors: post.author ? [post.author.name] : [],
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
        images: featuredImage ? [featuredImage] : [],
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
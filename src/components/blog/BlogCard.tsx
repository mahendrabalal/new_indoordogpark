import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types/wordpress';
import { formatDistanceToNow } from 'date-fns';

interface BlogCardProps {
  post: BlogPost;
  showExcerpt?: boolean;
  showAuthor?: boolean;
  showDate?: boolean;
  showCategory?: boolean;
  className?: string;
}

export default function BlogCard({
  post,
  showExcerpt = true,
  showAuthor = true,
  showDate = true,
  showCategory = true,
  className = '',
}: BlogCardProps) {
  const featuredImage =
    post.featuredImage?.media_details?.sizes?.large?.source_url ||
    post.featuredImage?.media_details?.sizes?.medium?.source_url ||
    post.featuredImage?.source_url;

  const plainTextContent = post.content.replace(/<[^>]*>/g, ' ');
  const wordCount = plainTextContent.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(3, Math.ceil(wordCount / 200));

  return (
    <div
      className={`group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${className}`}
    >
      {/* Featured Image */}
      {featuredImage && (
        <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/9] overflow-hidden">
          <Image
            src={featuredImage}
            alt={post.featuredImage?.alt_text || post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
      )}

      <div className="flex h-full flex-col p-6">
        {/* Category */}
        {showCategory && post.categories.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {post.categories.slice(0, 2).map((category) => (
              <Link
                key={category.id}
                href={`/blog/category/${category.slug}`}
                className="text-xs font-semibold uppercase tracking-wide text-purple-600"
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <Link href={`/blog/${post.slug}`} className="mb-3 block">
          <h3 className="line-clamp-2 text-xl font-semibold text-gray-900 transition-colors duration-200 group-hover:text-purple-600">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        {showExcerpt && post.excerpt && (
          <div
            className="prose prose-sm mb-5 line-clamp-3 max-w-none text-gray-600"
            dangerouslySetInnerHTML={{ __html: post.excerpt }}
          />
        )}

        <div className="mt-auto space-y-4">
          {/* Meta Information */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500">
            <div className="flex flex-wrap items-center gap-3">
              {/* Author */}
              {showAuthor && post.author && (
                <div className="flex items-center gap-2">
                  {post.author.avatar_urls?.['48'] && (
                    <Image
                      src={post.author.avatar_urls['48']}
                      alt={post.author.name}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  )}
                  <span className="font-medium text-gray-900">{post.author.name}</span>
                </div>
              )}

              {/* Date */}
              {showDate && (
                <time dateTime={post.date} className="text-gray-500">
                  {formatDistanceToNow(new Date(post.date), { addSuffix: true })}
                </time>
              )}
            </div>

            {/* Reading time estimate */}
            <div className="flex items-center gap-1 text-gray-500">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              <span>{readingTime} min read</span>
            </div>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <Link
                  key={tag.id}
                  href={`/blog/tag/${tag.slug}`}
                  className="text-xs font-medium text-gray-500 transition-colors hover:text-purple-600"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
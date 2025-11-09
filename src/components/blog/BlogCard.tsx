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
  const featuredImage = post.featuredImage?.media_details?.sizes?.large?.source_url ||
                       post.featuredImage?.media_details?.sizes?.medium?.source_url ||
                       post.featuredImage?.source_url;

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className}`}>
      {/* Featured Image */}
      {featuredImage && (
        <Link href={`/blog/${post.slug}`} className="block relative aspect-video overflow-hidden">
          <Image
            src={featuredImage}
            alt={post.featuredImage?.alt_text || post.title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
      )}

      <div className="p-6">
        {/* Category */}
        {showCategory && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.categories.slice(0, 2).map((category) => (
              <Link
                key={category.id}
                href={`/blog/category/${category.slug}`}
                className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded hover:bg-purple-200 transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <Link href={`/blog/${post.slug}`} className="block mb-2">
          <h3 className="text-xl font-bold text-gray-900 hover:text-purple-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        {showExcerpt && post.excerpt && (
          <div
            className="text-gray-600 mb-4 line-clamp-3 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: post.excerpt }}
          />
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-3">
            {/* Author */}
            {showAuthor && post.author && (
              <div className="flex items-center space-x-2">
                {post.author.avatar_urls?.['24'] && (
                  <Image
                    src={post.author.avatar_urls['24']}
                    alt={post.author.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
                <span className="font-medium">{post.author.name}</span>
              </div>
            )}

            {/* Date */}
            {showDate && (
              <time dateTime={post.date}>
                {formatDistanceToNow(new Date(post.date), { addSuffix: true })}
              </time>
            )}
          </div>

          {/* Reading time estimate */}
          <div className="text-gray-400">
            {Math.ceil(post.content.length / 1000)} min read
          </div>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag.id}
                href={`/blog/tag/${tag.slug}`}
                className="text-xs text-gray-500 hover:text-purple-600 transition-colors"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types/wordpress';

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
  showDate = true,
  className = '',
}: BlogCardProps) {
  const featuredImage =
    post.featuredImage?.media_details?.sizes?.large?.source_url ||
    post.featuredImage?.media_details?.sizes?.medium?.source_url ||
    post.featuredImage?.source_url;

  return (
    <div
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg ${className}`}
    >
      {/* Featured Image with Tags Overlay */}
      {featuredImage && (
        <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/9] overflow-hidden">
          <Image
            src={featuredImage}
            alt={post.featuredImage?.alt_text || post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={true}
          />
          {/* Tags Overlay */}
          {post.categories.length > 0 && (
            <div className="absolute left-3 top-3 flex flex-wrap gap-2">
              {post.categories.slice(0, 2).map((category) => (
                <span
                  key={category.id}
                  className="rounded-full bg-[#FF5722]/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm"
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}
        </Link>
      )}

      <div className="flex h-full flex-col p-6">
        {/* Title */}
        <Link href={`/blog/${post.slug}`} className="mb-3 block">
          <h3 className="line-clamp-2 text-xl font-bold text-gray-900 transition-colors duration-200 group-hover:text-[#FF5722]">
            {post.title}
          </h3>
        </Link>

        {/* Date */}
        {showDate && (
          <time dateTime={post.date} className="mb-3 block text-sm text-gray-500">
            {new Date(post.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </time>
        )}

        {/* Excerpt */}
        {showExcerpt && post.excerpt && (
          <div
            className="prose prose-sm mb-5 line-clamp-3 max-w-none text-gray-600"
            dangerouslySetInnerHTML={{ __html: post.excerpt }}
          />
        )}

        {/* Read More Link */}
        <Link
          href={`/blog/${post.slug}`}
          className="mt-auto inline-flex items-center text-sm font-semibold text-[#FF5722] transition-colors hover:text-[#E64A19]"
        >
          Read more
          <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
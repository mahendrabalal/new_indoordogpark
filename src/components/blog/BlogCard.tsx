'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types/wordpress';
import { useState } from 'react';

interface BlogCardProps {
  post: BlogPost;
  showExcerpt?: boolean;
  showAuthor?: boolean;
  showDate?: boolean;
  showCategory?: boolean;
  className?: string;
}

// Fallback image for blog posts
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

export default function BlogCard({
  post,
  showExcerpt = true,
  showDate = true,
  className = '',
}: BlogCardProps) {
  const [imageError, setImageError] = useState(false);
  
  const featuredImage =
    post.featuredImage?.media_details?.sizes?.large?.source_url ||
    post.featuredImage?.media_details?.sizes?.medium?.source_url ||
    post.featuredImage?.source_url;

  // Use fallback if image failed to load or is missing
  const imageSrc = imageError || !featuredImage ? FALLBACK_IMAGE : featuredImage;

  return (
    <div
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg ${className}`}
    >
      {/* Featured Image with Tags Overlay */}
      <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/9] overflow-hidden bg-gray-100">
        <Image
          src={imageSrc}
          alt={post.featuredImage?.alt_text || post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setImageError(true)}
          loading="lazy"
          decoding="async"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQADAD8Jz8YvqVX4J3hw+EPnJ54cr6C+h2R//9k="
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
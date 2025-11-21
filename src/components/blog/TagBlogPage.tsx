'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BlogCard from './BlogCard';
import BlogPagination from './BlogPagination';
import { BlogPost, WPTag, WPPaginationInfo } from '@/types/wordpress';

interface TagBlogPageProps {
  tag: WPTag;
  page: number;
  perPage: number;
}

export default function TagBlogPage({ tag, page, perPage }: TagBlogPageProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [pagination, setPagination] = useState<WPPaginationInfo>({
    total: 0,
    totalPages: 0,
    currentPage: page,
    perPage,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTagPosts = async () => {
      try {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const url = new URL(`${baseUrl}/api/blog`);
        url.searchParams.append('tag', tag.slug);
        url.searchParams.append('page', page.toString());
        url.searchParams.append('perPage', perPage.toString());

        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error('Failed to fetch tag posts');
        }

        const data = await response.json();
        setPosts(data.data || []);
        setPagination(prev => ({ ...prev, ...(data.pagination || {}) }));
        setError(null);
      } catch (err) {
        setError('Unable to load posts for this tag.');
        console.error('Error fetching tag posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTagPosts();
  }, [tag.slug, page, perPage]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <nav className="text-sm mb-4">
            <Link href="/blog" className="hover:text-purple-200">Blog</Link>
            <span className="mx-2">/</span>
            <span>Tag: {tag.name}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">#{tag.name}</h1>
          {tag.description && (
            <p className="text-xl text-purple-100 max-w-2xl">{tag.description}</p>
          )}
          <div className="mt-6 text-purple-100">
            <span className="font-semibold">{tag.count}</span> articles tagged with &quot;{tag.name}&quot;
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="animate-pulse space-y-8">
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
        ) : error ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link href="/blog" className="text-purple-600 hover:text-purple-700">
              ← Back to all articles
            </Link>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600 mb-4">
              No articles have been tagged with &quot;{tag.name}&quot; yet.
            </p>
            <Link href="/blog" className="text-purple-600 hover:text-purple-700">
              ← Browse all articles
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <BlogPagination
                pagination={pagination}
                basePath={`/tag/${tag.slug}`}
                className="mt-8"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BlogCard from './BlogCard';
import BlogPagination from './BlogPagination';
import { BlogPost, WPCategory, WPPaginationInfo } from '@/types/wordpress';

interface CategoryBlogPageProps {
  category: WPCategory;
  page: number;
  perPage: number;
  relatedCategories?: WPCategory[];
}

export default function CategoryBlogPage({ category, page, perPage, relatedCategories = [] }: CategoryBlogPageProps) {
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
    const fetchCategoryPosts = async () => {
      try {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const url = new URL(`${baseUrl}/api/blog`);
        url.searchParams.append('category', category.slug);
        url.searchParams.append('page', page.toString());
        url.searchParams.append('perPage', perPage.toString());

        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error('Failed to fetch category posts');
        }

        const data = await response.json();
        setPosts(data.data || []);
        setPagination(prev => ({ ...prev, ...(data.pagination || {}) }));
        setError(null);
      } catch (err) {
        setError('Unable to load posts for this category.');
        console.error('Error fetching category posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryPosts();
  }, [category.slug, page, perPage]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <nav className="text-sm mb-4">
            <Link href="/blog" className="hover:text-purple-200">Blog</Link>
            <span className="mx-2">/</span>
            <span>{category.name}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.name}</h1>
          {category.description && (
            <p className="text-xl text-purple-100 max-w-2xl">{category.description}</p>
          )}
          <div className="mt-6 text-purple-100">
            <span className="font-semibold">{category.count}</span> articles in this category
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
              No articles have been published in the &quot;{category.name}&quot; category yet.
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
                basePath={`/blog/category/${encodeURIComponent(category.slug)}`}
                className="mt-8"
              />
            )}

            {/* Related Categories Section */}
            {relatedCategories.length > 0 && (
              <div className="mt-12 bg-white rounded-lg shadow-sm p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Related Categories</h3>
                <p className="text-gray-600 mb-6">Explore similar categories you might be interested in.</p>
                <div className="flex flex-wrap gap-3">
                  {relatedCategories.map((relatedCat) => {
                    const encodedSlug = encodeURIComponent(relatedCat.slug);
                    return (
                      <Link
                        key={relatedCat.id}
                        href={`/blog/category/${encodedSlug}`}
                        className="inline-flex items-center px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors font-medium"
                      >
                        {relatedCat.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Explore More Section */}
            <div className="mt-8 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Explore More</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/"
                  className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow"
                >
                  <h4 className="font-semibold text-gray-900 mb-2">Browse All Parks</h4>
                  <p className="text-sm text-gray-600">Discover dog parks across California</p>
                </Link>
                <Link
                  href="/blog"
                  className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow"
                >
                  <h4 className="font-semibold text-gray-900 mb-2">All Blog Articles</h4>
                  <p className="text-sm text-gray-600">Read all our guides and articles</p>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
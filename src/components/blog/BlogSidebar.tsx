import Link from 'next/link';
import { WPCategory, WPTag } from '@/types/wordpress';

interface BlogSidebarProps {
  categories: WPCategory[];
  tags: WPTag[];
  recentPosts?: Array<{ id: number; title: string; slug: string; date: string }>;
  className?: string;
}

export default function BlogSidebar({
  categories,
  tags,
  recentPosts = [],
  className = '',
}: BlogSidebarProps) {
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Search */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Blog</h3>
        <form action="/blog/search" method="GET" className="relative">
          <input
            type="search"
            name="q"
            placeholder="Search articles..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/blog/category/${category.slug}`}
                  className="flex items-center justify-between text-gray-600 hover:text-purple-600 transition-colors"
                >
                  <span>{category.name}</span>
                  <span className="text-sm text-gray-400 bg-gray-200 px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 15).map((tag) => (
              <Link
                key={tag.id}
                href={`/blog/tag/${tag.slug}`}
                className="inline-block bg-white border border-gray-300 text-gray-600 px-3 py-1 rounded-full text-sm hover:bg-purple-100 hover:border-purple-300 hover:text-purple-700 transition-colors"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h3>
          <ul className="space-y-3">
            {recentPosts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="block text-gray-600 hover:text-purple-600 transition-colors group"
                >
                  <h4 className="font-medium text-sm group-hover:underline line-clamp-2">
                    {post.title}
                  </h4>
                  <time className="text-xs text-gray-400">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 rounded-lg text-white">
        <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
        <p className="text-purple-100 text-sm mb-4">
          Get the latest dog park tips and news delivered to your inbox.
        </p>
        <form
          action="/api/newsletter"
          method="POST"
          className="space-y-3"
        >
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded-md text-gray-900 focus:ring-2 focus:ring-purple-300 focus:outline-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-white text-purple-600 px-4 py-2 rounded-md font-medium hover:bg-purple-50 transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
}
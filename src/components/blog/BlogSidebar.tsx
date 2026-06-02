import Link from 'next/link';

import { WPCategory, WPTag } from '@/types/wordpress';
import BlogSidebarNewsletter from '@/components/blog/BlogSidebarNewsletter';

interface BlogSidebarProps {
  categories: WPCategory[];
  tags: WPTag[];
  recentPosts?: Array<{ id: number; title: string; slug: string; date: string }>;
  className?: string;
  defaultSearchValue?: string;
  activeCategory?: string;
  activeTag?: string;
}

export default function BlogSidebar({
  categories,
  tags,
  recentPosts = [],
  className = '',
  defaultSearchValue = '',
  activeCategory,
  activeTag,
}: BlogSidebarProps) {
  const topCategories = categories.slice(0, 8);
  const topTags = [...tags]
    .sort((a, b) => (b.count || 0) - (a.count || 0))
    .slice(0, 10);

  return (
    <div className={`flex flex-col gap-6 ${className}`}>


      {/* Categories */}
      {topCategories.length > 0 && (
        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Collections</h3>
            <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
              {categories.length} topics
            </span>
          </div>
          <ul className="space-y-3">
            {topCategories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/blog/category/${encodeURIComponent(category.slug)}`}
                  className="group flex items-center justify-between rounded-2xl border border-transparent px-3 py-2 transition hover:border-purple-200 hover:bg-purple-50"
                >
                  <div>
                    <p className="font-medium text-gray-900 group-hover:text-purple-700">{category.name}</p>
                    {category.description && (
                      <p className="text-xs text-gray-500 line-clamp-1">{category.description}</p>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-gray-400">#{category.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Tags */}
      {topTags.length > 0 && (
        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Popular tags</h3>
            <span className="text-xs font-medium uppercase tracking-wide text-gray-400">Trending</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {topTags.map((tag) => (
              <Link
                key={tag.id}
                href={`/blog/tag/${encodeURIComponent(tag.slug)}`}
                className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-600 transition hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recently published</h3>
            <span className="text-xs font-medium uppercase tracking-wide text-purple-600">Fresh</span>
          </div>
          <ul className="space-y-4">
            {recentPosts.map((post) => (
              <li key={post.id}>
                <Link href={`/blog/${post.slug}`} className="group block rounded-2xl px-2 py-2 transition hover:bg-purple-50">
                  <p className="line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-purple-700">
                    {post.title}
                  </p>
                  <time className="text-xs text-gray-500">
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
        </section>
      )}

      {/* Newsletter Signup */}
      <section className="rounded-3xl bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-500 p-6 text-white shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">Stay updated</p>
        <h3 className="mt-2 text-xl font-semibold">Get indoor dog park intel straight to your inbox</h3>
        <p className="mt-2 text-sm text-white/80">
          Twice a month we share new play space launches, seasonal checklists, and expert interviews.
        </p>
        <div className="mt-6">
          <BlogSidebarNewsletter />
        </div>
        <p className="mt-3 text-xs text-white/80">No spam. Unsubscribe anytime.</p>
      </section>
    </div>
  );
}
import Link from 'next/link';
import { WPCategory, WPTag } from '@/types/wordpress';

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
      {/* Search */}
      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600">Discover</p>
        <h3 className="mt-2 text-lg font-semibold text-gray-900">Search the journal</h3>
        <p className="mt-1 text-sm text-gray-500">
          Explore research-backed guides, park spotlights, and planning tips.
        </p>
        <form action="/blog" method="GET" className="mt-5">
          <label htmlFor="sidebar-search" className="sr-only">
            Search blog
          </label>
          {activeCategory && <input type="hidden" name="category" value={activeCategory} />}
          {activeTag && <input type="hidden" name="tag" value={activeTag} />}
          <div className="relative">
            <input
              id="sidebar-search"
              type="search"
              name="search"
              placeholder="Search articles..."
              defaultValue={defaultSearchValue}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-2xl bg-purple-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-purple-500"
              aria-label="Submit blog search"
            >
              Search
            </button>
          </div>
        </form>
      </section>

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
        <form action="/api/newsletter" method="POST" className="mt-6 space-y-3">
          <label htmlFor="sidebar-newsletter" className="sr-only">
            Email address
          </label>
          <input
            id="sidebar-newsletter"
            type="email"
            name="email"
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white placeholder:text-white/70 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/60"
            required
          />
          <button
            type="submit"
            className="w-full rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-purple-600 transition hover:bg-purple-50"
          >
            Subscribe
          </button>
        </form>
        <p className="mt-3 text-xs text-white/80">No spam. Unsubscribe anytime.</p>
      </section>
    </div>
  );
}
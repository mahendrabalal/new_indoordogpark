// Blog caching strategies and utilities

export interface CacheConfig {
  posts: {
    revalidate: number; // in seconds
    tags: string[];
  };
  categories: {
    revalidate: number;
    tags: string[];
  };
  tags: {
    revalidate: number;
    tags: string[];
  };
  singlePost: {
    revalidate: number;
    tags: string[];
  };
}

export const BLOG_CACHE_CONFIG: CacheConfig = {
  posts: {
    revalidate: 300, // 5 minutes
    tags: ['blog-posts', 'posts-list'],
  },
  categories: {
    revalidate: 3600, // 1 hour
    tags: ['blog-categories', 'categories-list'],
  },
  tags: {
    revalidate: 3600, // 1 hour
    tags: ['blog-tags', 'tags-list'],
  },
  singlePost: {
    revalidate: 1800, // 30 minutes
    tags: ['blog-post', 'single-post'],
  },
};

// Cache utility functions
export class BlogCacheManager {
  private static instance: BlogCacheManager;
  private cache = new Map<string, { data: unknown; timestamp: number; ttl: number }>();

  static getInstance(): BlogCacheManager {
    if (!BlogCacheManager.instance) {
      BlogCacheManager.instance = new BlogCacheManager();
    }
    return BlogCacheManager.instance;
  }

  set(key: string, data: unknown, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): unknown | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  invalidate(pattern: string): void {
    for (const [key] of this.cache.entries()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  // Get cache statistics
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// React Query style cache key generators
export const blogKeys = {
  all: ['blog'] as const,
  posts: (params?: Record<string, unknown>) => [...blogKeys.all, 'posts', params] as const,
  post: (slug: string) => [...blogKeys.all, 'post', slug] as const,
  categories: () => [...blogKeys.all, 'categories'] as const,
  tags: () => [...blogKeys.all, 'tags'] as const,
  categoryPosts: (slug: string, params?: Record<string, unknown>) =>
    [...blogKeys.all, 'category', slug, 'posts', params] as const,
  tagPosts: (slug: string, params?: Record<string, unknown>) =>
    [...blogKeys.all, 'tag', slug, 'posts', params] as const,
};

// Cache invalidation helpers
export const invalidateBlogCache = {
  posts: () => BlogCacheManager.getInstance().invalidate('posts'),
  post: (slug: string) => BlogCacheManager.getInstance().invalidate(`post-${slug}`),
  categories: () => BlogCacheManager.getInstance().invalidate('categories'),
  tags: () => BlogCacheManager.getInstance().invalidate('tags'),
  all: () => BlogCacheManager.getInstance().clear(),
};

// Next.js revalidation helpers
export const revalidateBlogPage = async (slug?: string) => {
  if (typeof window !== 'undefined') return; // Only run on server

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    if (slug) {
      // Revalidate specific post
      await fetch(`${baseUrl}/api/revalidate?secret=${process.env.REVALIDATE_SECRET}&path=/blog/${slug}`);
      await fetch(`${baseUrl}/api/revalidate?secret=${process.env.REVALIDATE_SECRET}&path=/blog`);
    } else {
      // Revalidate blog listing pages
      await fetch(`${baseUrl}/api/revalidate?secret=${process.env.REVALIDATE_SECRET}&path=/blog`);
      await fetch(`${baseUrl}/api/revalidate?secret=${process.env.REVALIDATE_SECRET}&path=/blog/categories`);
      await fetch(`${baseUrl}/api/revalidate?secret=${process.env.REVALIDATE_SECRET}&path=/blog/tags`);
    }
  } catch (error) {
    console.error('Failed to revalidate blog pages:', error);
  }
};

// Cache warming for critical pages
export const warmBlogCache = async () => {
  if (typeof window !== 'undefined') return; // Only run on server

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Warm blog listing page
    await fetch(`${baseUrl}/blog`, { next: { revalidate: 60 } });

    // Warm categories and tags
    await fetch(`${baseUrl}/api/blog/categories`, { next: { revalidate: 3600 } });
    await fetch(`${baseUrl}/api/blog/tags`, { next: { revalidate: 3600 } });

    console.log('Blog cache warmed successfully');
  } catch (error) {
    console.error('Failed to warm blog cache:', error);
  }
};
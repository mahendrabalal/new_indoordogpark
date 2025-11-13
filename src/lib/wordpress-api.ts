import { WordPressConfig, WPPost, WPMedia, WPCategory, WPTag, WPAuthor, BlogPost, BlogListResponse, BlogSearchParams } from '@/types/wordpress';
import { mockBlogPosts, mockCategories, mockTags } from './mock-blog-data';

// WordPress API Configuration
const WORDPRESS_CONFIG: WordPressConfig = {
  url: process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://your-wordpress-site.com',
  perPage: 10,
  username: process.env.WORDPRESS_USERNAME,
  password: process.env.WORDPRESS_PASSWORD,
};

// Automatically fall back to mock data when WordPress isn't configured
const USE_MOCK_DATA =
  !process.env.NEXT_PUBLIC_WORDPRESS_URL ||
  process.env.NEXT_PUBLIC_WORDPRESS_URL.includes('your-wordpress-site.com');

// Base API URL
const getApiUrl = (endpoint: string) => `${WORDPRESS_CONFIG.url}/wp-json/wp/v2/${endpoint}`;

// Helper function to create auth header
const getAuthHeaders = (): Record<string, string> => {
  if (WORDPRESS_CONFIG.username && WORDPRESS_CONFIG.password) {
    const auth = Buffer.from(`${WORDPRESS_CONFIG.username}:${WORDPRESS_CONFIG.password}`).toString('base64');
    return {
      'Authorization': `Basic ${auth}`,
    };
  }
  return {};
};

// Generic fetch function with error handling
async function fetchFromWordPress<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    const url = getApiUrl(endpoint);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...(options.headers as Record<string, string> || {}),
    };

    const response = await fetch(url, {
      headers,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('WordPress API fetch error:', error);
    throw error;
  }
}

// Get total number of posts for pagination
async function getTotalPosts(searchParams: BlogSearchParams = {}): Promise<number> {
  const params = new URLSearchParams();

  // Add search parameters
  if (searchParams.search) params.append('search', searchParams.search);
  if (searchParams.category) params.append('categories', searchParams.category);
  if (searchParams.tag) params.append('tags', searchParams.tag);
  if (searchParams.author) params.append('author', searchParams.author.toString());
  if (searchParams.status) params.append('status', searchParams.status);

  // Request only headers to get total count
  const endpoint = `posts?${params.toString()}`;
  const url = getApiUrl(endpoint);

  try {
    const response = await fetch(url, { method: 'HEAD' });
    const totalHeader = response.headers.get('X-WP-Total');
    return totalHeader ? parseInt(totalHeader, 10) : 0;
  } catch (error) {
    console.error('Error fetching total posts:', error);
    return 0;
  }
}

// Fetch posts with pagination and filtering
export async function fetchPosts(searchParams: BlogSearchParams = {}): Promise<BlogListResponse> {
  // Use mock data if WordPress is not configured
  if (USE_MOCK_DATA) {
    let posts = [...mockBlogPosts];

    // Apply search filters to mock data
    if (searchParams.search) {
      const searchLower = searchParams.search.toLowerCase();
      posts = posts.filter(post =>
        post.title.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower)
      );
    }

    if (searchParams.category) {
      posts = posts.filter(post =>
        post.categories.some(cat => cat.slug === searchParams.category)
      );
    }

    if (searchParams.tag) {
      posts = posts.filter(post =>
        post.tags.some(tag => tag.slug === searchParams.tag)
      );
    }

    // Apply sorting
    if (searchParams.orderBy === 'date') {
      posts.sort((a, b) => {
        const comparison = searchParams.order === 'desc' ? 1 : -1;
        return comparison * (new Date(b.date).getTime() - new Date(a.date).getTime());
      });
    } else if (searchParams.orderBy === 'title') {
      posts.sort((a, b) => {
        const comparison = searchParams.order === 'desc' ? 1 : -1;
        return comparison * a.title.localeCompare(b.title);
      });
    }

    // Apply pagination
    const page = searchParams.page || 1;
    const perPage = searchParams.perPage || 10;
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedPosts = posts.slice(startIndex, endIndex);

    return {
      posts: paginatedPosts,
      pagination: {
        total: posts.length,
        totalPages: Math.ceil(posts.length / perPage),
        currentPage: page,
        perPage,
      },
    };
  }

  // Original WordPress API logic
  const params = new URLSearchParams();

  // Add search parameters
  if (searchParams.search) params.append('search', searchParams.search);
  if (searchParams.category) params.append('categories', searchParams.category);
  if (searchParams.tag) params.append('tags', searchParams.tag);
  if (searchParams.author) params.append('author', searchParams.author.toString());
  if (searchParams.status) params.append('status', searchParams.status);
  if (searchParams.orderBy) params.append('orderby', searchParams.orderBy);
  if (searchParams.order) params.append('order', searchParams.order);

  // Pagination
  const page = searchParams.page || 1;
  const perPage = searchParams.perPage || WORDPRESS_CONFIG.perPage || 10;
  params.append('page', page.toString());
  params.append('per_page', perPage.toString());

  // Always embed related data
  params.append('_embed', 'wp:featuredmedia,wp:term,author');

  const endpoint = `posts?${params.toString()}`;
  const posts = await fetchFromWordPress<WPPost[]>(endpoint);

  // Get total posts for pagination
  const total = await getTotalPosts(searchParams);
  const totalPages = Math.ceil(total / perPage);

  // Transform posts to include embedded data
  const transformedPosts = await Promise.all(posts.map(transformPost));

  return {
    posts: transformedPosts,
    pagination: {
      total,
      totalPages,
      currentPage: page,
      perPage,
    },
  };
}

// Fetch single post by slug
export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  if (USE_MOCK_DATA) {
    const post = mockBlogPosts.find(p => p.slug === slug);
    return post || null;
  }

  const endpoint = `posts?slug=${slug}&_embed=wp:featuredmedia,wp:term,author`;
  const posts = await fetchFromWordPress<WPPost[]>(endpoint);

  if (posts.length === 0) {
    return null;
  }

  return await transformPost(posts[0]);
}

// Fetch categories
export async function fetchCategories(): Promise<WPCategory[]> {
  if (USE_MOCK_DATA) {
    return mockCategories;
  }

  return fetchFromWordPress<WPCategory[]>('categories?per_page=100');
}

// Fetch tags
export async function fetchTags(): Promise<WPTag[]> {
  if (USE_MOCK_DATA) {
    return mockTags;
  }

  return fetchFromWordPress<WPTag[]>('tags?per_page=100');
}

// Fetch media by ID
export async function fetchMedia(id: number): Promise<WPMedia | null> {
  try {
    return await fetchFromWordPress<WPMedia>(`media/${id}`);
  } catch (error) {
    console.error('Error fetching media:', error);
    return null;
  }
}

// Transform WordPress post to our BlogPost format
async function transformPost(post: WPPost): Promise<BlogPost> {
  // Extract embedded data
  const embedded = post._embedded || {};

  // Get featured media
  let featuredImage: WPMedia | undefined;
  if (embedded['wp:featuredmedia'] && embedded['wp:featuredmedia'].length > 0) {
    featuredImage = embedded['wp:featuredmedia'][0] as WPMedia;
  }

  // Get author
  let author: WPAuthor | undefined;
  if (embedded.author && embedded.author.length > 0) {
    author = embedded.author[0] as WPAuthor;
  }

  // Extract categories and tags from terms
  const categories: WPCategory[] = [];
  const tags: WPTag[] = [];

  if (embedded['wp:term']) {
    for (const termGroup of embedded['wp:term']) {
      for (const term of termGroup) {
        if (term.taxonomy === 'category') {
          categories.push(term as WPCategory);
        } else if (term.taxonomy === 'post_tag') {
          tags.push(term as WPTag);
        }
      }
    }
  }

  return {
    id: post.id,
    title: post.title.rendered,
    slug: post.slug,
    content: post.content.rendered,
    excerpt: post.excerpt.rendered,
    date: post.date,
    modified: post.modified,
    author,
    categories,
    tags,
    featuredImage,
    link: post.link,
    status: post.status,
    commentStatus: post.comment_status,
  };
}

// Search posts
export async function searchPosts(query: string, page: number = 1, perPage: number = 10): Promise<BlogListResponse> {
  return fetchPosts({
    search: query,
    page,
    perPage,
    status: 'publish',
  });
}

// Get posts by category
export async function getPostsByCategory(categorySlug: string, page: number = 1, perPage: number = 10): Promise<BlogListResponse> {
  // First get the category ID from slug
  const categories = await fetchCategories();
  const category = categories.find(cat => cat.slug === categorySlug);

  if (!category) {
    return {
      posts: [],
      pagination: { total: 0, totalPages: 0, currentPage: page, perPage },
    };
  }

  return fetchPosts({
    category: category.id.toString(),
    page,
    perPage,
    status: 'publish',
  });
}

// Get posts by tag
export async function getPostsByTag(tagSlug: string, page: number = 1, perPage: number = 10): Promise<BlogListResponse> {
  // First get the tag ID from slug
  const tags = await fetchTags();
  const tag = tags.find(t => t.slug === tagSlug);

  if (!tag) {
    return {
      posts: [],
      pagination: { total: 0, totalPages: 0, currentPage: page, perPage },
    };
  }

  return fetchPosts({
    tag: tag.id.toString(),
    page,
    perPage,
    status: 'publish',
  });
}

// Get recent posts
export async function getRecentPosts(limit: number = 5): Promise<BlogPost[]> {
  const response = await fetchPosts({
    perPage: limit,
    orderBy: 'date',
    order: 'desc',
    status: 'publish',
  });

  return response.posts;
}
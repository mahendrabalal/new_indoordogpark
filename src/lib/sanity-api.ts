import { sanityClient, queries, urlForImage, sanityConfig } from './sanity-client';
import { BlogPost, BlogListResponse, BlogSearchParams, WPMedia } from '@/types/wordpress';
import { PortableTextBlock } from '@portabletext/types';
import { unstable_cache } from 'next/cache';

// Retry wrapper for transient network errors (e.g. DNS lookup failures, timeouts)
async function withRetry<T>(fn: () => Promise<T>, retries = 2, delayMs = 500): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isLastAttempt = attempt === retries;
      const isTransient =
        error instanceof TypeError ||
        (error instanceof Error && ('isNetworkError' in error || error.message.includes('fetch failed') || error.message.includes('ENOTFOUND') || error.message.includes('ETIMEDOUT') || error.message.includes('ECONNRESET')));

      if (isLastAttempt || !isTransient) {
        throw error;
      }
      console.warn(`[Sanity API] Transient error (attempt ${attempt + 1}/${retries + 1}), retrying in ${delayMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
    }
  }
  // TypeScript: unreachable, but satisfies return type
  throw new Error('withRetry exhausted');
}

interface SanitySlug {
  current: string;
}

interface SanityImageAsset {
  _id: string;
  _ref?: string;
  url?: string;
  metadata?: {
    dimensions?: {
      width?: number;
      height?: number;
    };
  };
}

interface SanityImage {
  asset?: SanityImageAsset;
  alt?: string;
  caption?: string;
}

interface SanityAuthor {
  _id: string;
  name: string;
  slug?: SanitySlug;
  bio?: string;
  image?: SanityImage;
}

interface SanityCategory {
  _id: string;
  title: string;
  slug: SanitySlug;
  description?: string;
  postCount?: number;
}

interface SanityTag {
  _id: string;
  title: string;
  slug: SanitySlug;
  postCount?: number;
}

interface SanityPortableChild {
  _type?: string;
  text?: string;
  marks?: string[];
}

interface SanityMarkDef {
  _key: string;
  _type: string;
  href?: string;
}

interface SanityVideoFileAsset {
  _id: string;
  url?: string;
  originalFilename?: string;
  mimeType?: string;
  size?: number;
  assetId?: string;
  path?: string;
}

interface SanityVideoFile {
  asset?: SanityVideoFileAsset;
}

type SanityPortableBlock = PortableTextBlock & {
  style?: string;
  listItem?: 'bullet' | 'number';
  children?: SanityPortableChild[];
  markDefs?: SanityMarkDef[];
  alt?: string;
  caption?: string;
  asset?: SanityImageAsset;
  html?: string; // For HTML blocks
  videoType?: 'youtube' | 'vimeo' | 'file' | 'embed';
  youtubeUrl?: string;
  vimeoUrl?: string;
  videoFile?: SanityVideoFile;
  embedCode?: string;
  autoplay?: boolean;
  loop?: boolean;
};

interface SanityPost {
  _id: string;
  title: string;
  slug: SanitySlug;
  excerpt?: string;
  content?: SanityPortableBlock[];
  publishedAt: string;
  _updatedAt: string;
  lastUpdated?: string;
  mainImage?: SanityImage;
  author?: SanityAuthor;
  reviewedBy?: SanityAuthor;
  factCheckedBy?: SanityAuthor;
  categories?: SanityCategory[];
  tags?: SanityTag[];
}

// Helper function to convert Portable Text to HTML for compatibility
function portableTextToHtml(blocks: SanityPortableBlock[] = []): string {
  if (!blocks.length) return '';

  // Helper to process children text with marks
  const processChildren = (children: SanityPortableChild[] = [], markDefs: SanityMarkDef[] = []): string => {
    return children
      .map((child) => {
        let text = child.text || '';
        if (child.marks?.includes('strong')) text = `<strong>${text}</strong>`;
        if (child.marks?.includes('em')) text = `<em>${text}</em>`;
        if (child.marks?.includes('code')) text = `<code>${text}</code>`;
        if (child.marks?.includes('underline')) text = `<u>${text}</u>`;
        if (child.marks?.includes('strike-through')) text = `<s>${text}</s>`;

        // Handle link annotations
        const linkMark = child.marks?.find((mark: string) =>
          markDefs.some((def) => def._key === mark && def._type === 'link')
        );
        if (linkMark) {
          const linkDef = markDefs.find((def) => def._key === linkMark);
          if (linkDef?.href) text = `<a href="${linkDef.href}">${text}</a>`;
        }

        return text;
      })
      .join('');
  };

  // Group consecutive list items together
  const result: string[] = [];
  let currentList: Array<{ listItem: string; children: string }> | null = null;
  let currentListItem: string | null = null;

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    if (block._type === 'block') {
      const style = block.style || 'normal';
      const markDefs = block.markDefs ?? [];
      const children = processChildren(block.children, markDefs);

      // Check if this is a list item
      const listItem = block.listItem;

      if (listItem) {
        // If we're starting a new list or changing list type, close previous list
        if (currentList && currentListItem !== listItem) {
          const listTag = currentListItem === 'bullet' ? 'ul' : 'ol';
          const listItems = currentList.map((item: { listItem: string; children: string }) => `<li>${item.children}</li>`).join('');
          result.push(`<${listTag}>${listItems}</${listTag}>`);
          currentList = [];
        }

        // Initialize list if needed
        if (!currentList) {
          currentList = [];
          currentListItem = listItem;
        }

        // Add item to current list
        currentList.push({ listItem, children });
      } else {
        // Not a list item - close any open list first
        if (currentList) {
          const listTag = currentListItem === 'bullet' ? 'ul' : 'ol';
          const listItems = currentList.map((item: { listItem: string; children: string }) => `<li>${item.children}</li>`).join('');
          result.push(`<${listTag}>${listItems}</${listTag}>`);
          currentList = null;
          currentListItem = null;
        }

        // Process regular block
        switch (style) {
          case 'h1': result.push(`<h1>${children}</h1>`); break;
          case 'h2': result.push(`<h2>${children}</h2>`); break;
          case 'h3': result.push(`<h3>${children}</h3>`); break;
          case 'h4': result.push(`<h4>${children}</h4>`); break;
          case 'blockquote': result.push(`<blockquote>${children}</blockquote>`); break;
          case 'normal':
          default: result.push(`<p>${children}</p>`); break;
        }
      }
    } else if (block._type === 'image' && block.asset) {
      // Close any open list before adding image
      if (currentList) {
        const listTag = currentListItem === 'bullet' ? 'ul' : 'ol';
        const listItems = currentList.map((item: { listItem: string; children: string }) => `<li>${item.children}</li>`).join('');
        result.push(`<${listTag}>${listItems}</${listTag}>`);
        currentList = null;
        currentListItem = null;
      }

      let imageUrl = '';
      try {
        if (block.asset.url) {
          imageUrl = block.asset.url + (block.asset.url.includes('?') ? '&' : '?') + 'w=800';
        } else if (block.asset._id || block.asset._ref) {
          imageUrl = urlForImage(block).width(800).url();
        }
      } catch (e) {
        console.warn('[Sanity API] Failed to generate image URL for block:', e);
        imageUrl = block.asset.url || '';
      }

      if (imageUrl) {
        const alt = block.alt || '';
        const caption = block.caption ? `<figcaption>${block.caption}</figcaption>` : '';
        result.push(`<figure><img src="${imageUrl}" alt="${alt}" />${caption}</figure>`);
      }
    } else if (block._type === 'videoBlock') {
      // Close any open list before adding video
      if (currentList) {
        const listTag = currentListItem === 'bullet' ? 'ul' : 'ol';
        const listItems = currentList.map((item: { listItem: string; children: string }) => `<li>${item.children}</li>`).join('');
        result.push(`<${listTag}>${listItems}</${listTag}>`);
        currentList = null;
        currentListItem = null;
      }

      let videoHtml = '';
      const autoplay = block.autoplay ? '1' : '0';
      const loop = block.loop ? '1' : '0';
      const caption = block.caption ? `<figcaption>${block.caption}</figcaption>` : '';

      if (block.videoType === 'youtube' && block.youtubeUrl) {
        const youtubeId = block.youtubeUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
        if (youtubeId) {
          videoHtml = `<div class="video-wrapper video-youtube"><iframe src="https://www.youtube.com/embed/${youtubeId}?rel=0&autoplay=${autoplay}&loop=${loop}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
        }
      } else if (block.videoType === 'vimeo' && block.vimeoUrl) {
        const vimeoId = block.vimeoUrl.match(/(?:vimeo\.com\/)(?:.*\/)?(\d+)/)?.[1];
        if (vimeoId) {
          videoHtml = `<div class="video-wrapper video-vimeo"><iframe src="https://player.vimeo.com/video/${vimeoId}?autoplay=${autoplay}&loop=${loop}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
        }
      } else if (block.videoType === 'file' && block.videoFile?.asset) {
        const videoUrl = block.videoFile.asset.url;
        const mimeType = block.videoFile.asset.mimeType || 'video/mp4';
        if (videoUrl) {
          videoHtml = `<div class="video-wrapper video-file"><video controls${block.autoplay ? ' autoplay' : ''}${block.loop ? ' loop' : ''} preload="metadata"><source src="${videoUrl}" type="${mimeType}">Your browser does not support the video tag.</video></div>`;
        }
      } else if (block.videoType === 'embed' && block.embedCode) {
        videoHtml = `<div class="video-wrapper video-embed">${block.embedCode}</div>`;
      }

      if (videoHtml) {
        result.push(`<figure class="video-figure">${videoHtml}${caption}</figure>`);
      }
    } else if (block._type === 'htmlBlock' && block.html) {
      if (currentList) {
        const listTag = currentListItem === 'bullet' ? 'ul' : 'ol';
        const listItems = currentList.map((item: { listItem: string; children: string }) => `<li>${item.children}</li>`).join('');
        result.push(`<${listTag}>${listItems}</${listTag}>`);
        currentList = null;
        currentListItem = null;
      }
      result.push(block.html);
    }
  }

  // Close any remaining open list
  if (currentList) {
    const listTag = currentListItem === 'bullet' ? 'ul' : 'ol';
    const listItems = currentList.map((item: { listItem: string; children: string }) => `<li>${item.children}</li>`).join('');
    result.push(`<${listTag}>${listItems}</${listTag}>`);
  }

  return result.join('\n');
}

// Convert Sanity post to WordPress-compatible BlogPost format
function sanitizeNumericId(idValue: string | undefined, fallback = 1): number {
  if (!idValue) return fallback;
  const digits = parseInt(idValue.replace(/\D/g, '').slice(0, 8), 10);
  return Number.isNaN(digits) ? fallback : digits;
}

function sanityAuthorToWPAuthor(author?: SanityAuthor) {
  if (!author) return undefined;
  return {
    id: sanitizeNumericId(author._id),
    name: author.name,
    slug: author.slug?.current || author.name.toLowerCase().replace(/\s+/g, '-'),
    description: author.bio || '',
    url: '',
    link: `/blog/author/${author.slug?.current || author.name.toLowerCase().replace(/\s+/g, '-')}`,
    avatar_urls: {
      '96': author.image ? urlForImage(author.image).width(96).height(96).url() : '',
      '48': author.image ? urlForImage(author.image).width(48).height(48).url() : '',
      '24': author.image ? urlForImage(author.image).width(24).height(24).url() : '',
    },
  };
}

function sanityPostToBlogPost(sanityPost: SanityPost): BlogPost {
  const featuredImage: WPMedia | undefined = sanityPost.mainImage?.asset
    ? (() => {
      try {
        const baseWidth = sanityPost.mainImage.asset.metadata?.dimensions?.width || 1200;
        const baseHeight = sanityPost.mainImage.asset.metadata?.dimensions?.height || 630;
        // Helper to get URL with fallback
        const getImageUrl = (width: number) => {
          try {
            // Priority 1: Use builder if we have what looks like a ref or object
            const asset = sanityPost.mainImage?.asset;
            if (sanityPost.mainImage && (asset?._id || (asset as SanityImageAsset)?._ref)) {
              return urlForImage(sanityPost.mainImage).width(width).url();
            }
            // Priority 2: Use direct URL from query if builder fails/skips
            if (asset?.url) {
              return asset.url + (asset.url.includes('?') ? '&' : '?') + `w=${width}`;
            }
            return '';
          } catch (e) {
            console.warn(`[Sanity API] Failed to generate ${width}px image for ${sanityPost.slug.current}:`, e);
            return sanityPost.mainImage?.asset?.url || '';
          }
        };

        const largeUrl = getImageUrl(1200);
        const mediumUrl = getImageUrl(800);
        const sourceUrl = getImageUrl(1200);

        // Use direct URL for link if builder fails
        let linkUrl = '';
        try {
          if (sanityPost.mainImage) {
            linkUrl = urlForImage(sanityPost.mainImage).url();
          }
        } catch {
          linkUrl = sanityPost.mainImage?.asset?.url || '';
        }

        // Validate URLs
        const isValidUrl = (url: string | undefined): boolean => {
          return !!url &&
            typeof url === 'string' &&
            url.trim() !== '' &&
            (url.startsWith('http') || url.startsWith('//'));
        };

        if (!isValidUrl(largeUrl) && !isValidUrl(sanityPost.mainImage.asset.url)) {
          console.warn(`[Sanity API] No valid image URLs for post: ${sanityPost.slug.current}`);
          return undefined;
        }

        return {
          id: sanitizeNumericId(sanityPost.mainImage.asset._id, Math.floor(Math.random() * 100000)),
          date: sanityPost.publishedAt,
          slug: sanityPost.slug.current,
          type: 'attachment',
          link: linkUrl || sanityPost.mainImage.asset.url || '',
          title: { rendered: sanityPost.mainImage.alt || sanityPost.title },
          author: sanitizeNumericId(sanityPost.author?._id),
          caption: { rendered: sanityPost.mainImage.caption || '' },
          alt_text: sanityPost.mainImage.alt || sanityPost.title,
          media_type: 'image',
          mime_type: 'image/jpeg',
          media_details: {
            width: baseWidth,
            height: baseHeight,
            file: `${sanityPost.slug.current}.jpg`,
            sizes: {
              large: {
                file: `${sanityPost.slug.current}-large.jpg`,
                width: 1200,
                height: Math.round((1200 / baseWidth) * baseHeight),
                mime_type: 'image/jpeg',
                source_url: largeUrl || sanityPost.mainImage.asset.url || '',
              },
              medium: {
                file: `${sanityPost.slug.current}-medium.jpg`,
                width: 800,
                height: Math.round((800 / baseWidth) * baseHeight),
                mime_type: 'image/jpeg',
                source_url: mediumUrl || sanityPost.mainImage.asset.url || '',
              },
            },
          },
          source_url: sourceUrl || sanityPost.mainImage.asset.url || '',
        } satisfies WPMedia;
      } catch (error) {
        console.error(`[Sanity API] Error generating image URLs for post: ${sanityPost.slug.current}`, error);
        return undefined;
      }
    })()
    : undefined;

  return {
    id: sanitizeNumericId(sanityPost._id, Math.floor(Math.random() * 100000)),
    title: sanityPost.title,
    slug: sanityPost.slug.current,
    excerpt: sanityPost.excerpt || '',
    content: portableTextToHtml(sanityPost.content || []),
    date: sanityPost.publishedAt,
    modified: sanityPost.lastUpdated || sanityPost._updatedAt,
    lastUpdated: sanityPost.lastUpdated,
    author: sanityAuthorToWPAuthor(sanityPost.author) || {
      id: 1,
      name: 'California Dog Parks Team',
      slug: 'california-dog-parks-team',
      description: 'Dedicated to helping dog owners find the best parks in California',
      url: '',
      link: '/blog/author/california-dog-parks-team',
      avatar_urls: { '96': '', '48': '', '24': '' },
    },
    factCheckedBy: sanityAuthorToWPAuthor(sanityPost.factCheckedBy),
    reviewedBy: sanityAuthorToWPAuthor(sanityPost.reviewedBy),
    categories: (sanityPost.categories || []).map((cat, index: number) => ({
      id: sanitizeNumericId(cat._id, index + 1),
      name: cat.title,
      slug: cat.slug.current,
      description: cat.description || '',
      count: cat.postCount || 0,
      link: `/blog/category/${cat.slug.current}`,
      taxonomy: 'category',
      parent: 0,
      meta: {},
    })),
    tags: (sanityPost.tags || []).map((tag, index: number) => ({
      id: sanitizeNumericId(tag._id, index + 1),
      name: tag.title,
      slug: tag.slug.current,
      description: '',
      count: tag.postCount || 0,
      link: `/blog/tag/${tag.slug.current}`,
      taxonomy: 'post_tag',
      meta: {},
    })),
    featuredImage,
    link: `/blog/${sanityPost.slug.current}`,
    status: 'publish',
    commentStatus: 'open',
  };
}

// Fetch posts with pagination and filtering
export async function fetchPosts(searchParams: BlogSearchParams = {}): Promise<BlogListResponse> {
  const emptyResponse = {
    posts: [],
    total: 0,
    totalPages: 0,
    page: searchParams.page || 1,
    perPage: searchParams.perPage || 10,
  };

  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return emptyResponse;
  }

  try {
    const page = searchParams.page || 1;
    const perPage = searchParams.perPage || 10;
    const start = (page - 1) * perPage;
    const end = start + perPage;

    let query = queries.posts;
    const params: Record<string, unknown> = { start, end };

    // Handle search
    if (searchParams.search) {
      query = queries.searchPosts;
      params.searchTerm = `*${searchParams.search}*`;
    }

    // Handle category filter
    if (searchParams.category) {
      query = queries.postsByCategory;
      params.categorySlug = searchParams.category;
    }

    // Handle tag filter
    if (searchParams.tag) {
      query = queries.postsByTag;
      params.tagSlug = searchParams.tag;
    }

    // Use regular client with CDN for performance
    // Cache invalidation handled via Next.js cache tags and revalidation
    const sanityPosts = await withRetry(() => sanityClient.fetch<SanityPost[]>(query, params));

    // Get the correct total count based on the filter
    let totalCount: number;
    if (searchParams.category) {
      totalCount = await withRetry(() => sanityClient.fetch<number>(queries.postCountByCategory, { categorySlug: searchParams.category }));
    } else if (searchParams.tag) {
      totalCount = await withRetry(() => sanityClient.fetch<number>(queries.postCountByTag, { tagSlug: searchParams.tag }));
    } else if (searchParams.search) {
      totalCount = await withRetry(() => sanityClient.fetch<number>(queries.postCountBySearch, { searchTerm: `*${searchParams.search}*` }));
    } else {
      totalCount = await withRetry(() => sanityClient.fetch<number>(queries.postCount));
    }

    const posts = sanityPosts.map(sanityPostToBlogPost);

    return {
      posts,
      total: totalCount,
      totalPages: Math.ceil(totalCount / perPage),
      page,
      perPage,
    };
  } catch (error) {
    console.error('Error fetching posts from Sanity:', error);
    throw error;
  }
}

// Fetch single post by slug
export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return null;
  try {
    // Use regular client with CDN for performance
    // Cache invalidation handled via Next.js cache tags and revalidation
    const sanityPost = await withRetry(() => sanityClient.fetch<SanityPost | null>(queries.postBySlug, { slug }));
    if (!sanityPost) return null;
    return sanityPostToBlogPost(sanityPost);
  } catch (error) {
    console.error('Error fetching post by slug from Sanity:', error);
    throw error;
  }
}

// Fetch categories
export async function fetchCategories() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
  try {
    const sanityCategories = await withRetry(() => sanityClient.fetch<SanityCategory[]>(queries.categories));
    return sanityCategories.map((cat, index: number) => ({
      id: parseInt(cat._id.replace(/\D/g, '').slice(0, 8)) || index + 1,
      name: cat.title,
      slug: cat.slug.current,
      description: cat.description || '',
      count: cat.postCount || 0,
      link: `/blog/category/${cat.slug.current}`,
      taxonomy: 'category',
      parent: 0,
      meta: {},
    }));
  } catch (error) {
    console.error('Error fetching categories from Sanity:', error);
    throw error;
  }
}

// Fetch tags
export async function fetchTags() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
  try {
    const sanityTags = await withRetry(() => sanityClient.fetch<SanityTag[]>(queries.tags));
    return sanityTags.map((tag, index: number) => ({
      id: parseInt(tag._id.replace(/\D/g, '').slice(0, 8)) || index + 1,
      name: tag.title,
      slug: tag.slug.current,
      description: '',
      count: tag.postCount || 0,
      link: `/blog/tag/${tag.slug.current}`,
      taxonomy: 'post_tag',
      meta: {},
    }));
  } catch (error) {
    console.error('Error fetching tags from Sanity:', error);
    throw error;
  }
}

// Cached versions with Next.js cache - using unstable_cache for proper revalidation
// Primary cache-busting: on-demand revalidation via Sanity webhook (instant)
// Fallback: time-based revalidation every 1 hour (safety net if webhook fails)
export async function getCachedPosts(searchParams: BlogSearchParams = {}): Promise<BlogListResponse> {
  const cacheKey = `blog-posts-${JSON.stringify(searchParams)}`;
  return unstable_cache(
    async () => fetchPosts(searchParams),
    [cacheKey],
    {
      revalidate: 3600, // 1 hour fallback — webhook handles instant updates
      tags: ['blog-posts', 'blog-list'],
    }
  )();
}

export async function getCachedPostBySlug(slug: string): Promise<BlogPost | null> {
  return unstable_cache(
    async () => fetchPostBySlug(slug),
    [`blog-post-${slug}`],
    {
      revalidate: 3600, // 1 hour fallback — webhook handles instant updates
      tags: ['blog-posts', `blog-post-${slug}`],
    }
  )();
}

export async function getCachedCategories() {
  return unstable_cache(
    async () => fetchCategories(),
    ['blog-categories'],
    {
      revalidate: 3600, // 1 hour — categories rarely change
      tags: ['blog-categories'],
    }
  )();
}

export async function getCachedTags() {
  return unstable_cache(
    async () => fetchTags(),
    ['blog-tags'],
    {
      revalidate: 3600, // 1 hour — tags rarely change
      tags: ['blog-tags'],
    }
  )();
}

// ──────────────────────────────────────────────
// Author API
// ──────────────────────────────────────────────

interface SanityAuthorFull {
  _id: string;
  name: string;
  slug: SanitySlug;
  bio?: string;
  image?: SanityImage;
  postCount?: number;
}

export interface AuthorProfile {
  id: string;
  name: string;
  slug: string;
  bio: string;
  avatarUrl: string;
  postCount: number;
}

function sanityAuthorToProfile(a: SanityAuthorFull): AuthorProfile {
  let avatarUrl = '';
  try {
    if (a.image) {
      avatarUrl = urlForImage(a.image).width(200).height(200).url();
    }
  } catch {
    avatarUrl = a.image?.asset?.url || '';
  }
  return {
    id: a._id,
    name: a.name,
    slug: a.slug?.current || a.name.toLowerCase().replace(/\s+/g, '-'),
    bio: a.bio || '',
    avatarUrl,
    postCount: a.postCount || 0,
  };
}

export async function fetchAuthorBySlug(slug: string): Promise<AuthorProfile | null> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return null;
  try {
    const author = await withRetry(() => sanityClient.fetch<SanityAuthorFull | null>(
      queries.authorBySlug,
      { slug }
    ));
    if (!author) return null;
    return sanityAuthorToProfile(author);
  } catch (error) {
    console.error('Error fetching author by slug:', error);
    throw error;
  }
}

export async function getCachedAuthorBySlug(slug: string): Promise<AuthorProfile | null> {
  return unstable_cache(
    async () => fetchAuthorBySlug(slug),
    [`blog-author-${slug}`],
    {
      revalidate: 3600, // 1 hour — author profiles rarely change
      tags: ['blog-authors', `blog-author-${slug}`],
    }
  )();
}

export async function fetchPostsByAuthor(
  authorSlug: string,
  page = 1,
  perPage = 12
): Promise<BlogListResponse> {
  const emptyResponse = { posts: [], total: 0, totalPages: 0, page, perPage };
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return emptyResponse;
  try {
    const start = (page - 1) * perPage;
    const end = start + perPage;

    const [sanityPosts, totalCount] = await Promise.all([
      withRetry(() => sanityClient.fetch<SanityPost[]>(queries.postsByAuthor, {
        authorSlug,
        start,
        end,
      })),
      withRetry(() => sanityClient.fetch<number>(queries.postCountByAuthor, { authorSlug })),
    ]);

    return {
      posts: sanityPosts.map(sanityPostToBlogPost),
      total: totalCount,
      totalPages: Math.ceil(totalCount / perPage),
      page,
      perPage,
    };
  } catch (error) {
    console.error('Error fetching posts by author:', error);
    throw error;
  }
}

export async function getCachedPostsByAuthor(
  authorSlug: string,
  page = 1,
  perPage = 12
): Promise<BlogListResponse> {
  return unstable_cache(
    async () => fetchPostsByAuthor(authorSlug, page, perPage),
    [`blog-author-posts-${authorSlug}-${page}-${perPage}`],
    {
      revalidate: 3600, // 1 hour fallback — webhook handles instant updates
      tags: ['blog-posts', `blog-author-${authorSlug}`],
    }
  )();
}

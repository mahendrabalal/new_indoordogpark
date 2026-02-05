import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Sanity project configuration
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

// Validate projectId - only throw if not in build environment
if (!projectId) {
  if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PHASE) {
    throw new Error('Configuration must contain `projectId`');
  }
}

export const sanityConfig = {
  projectId: projectId || 'placeholder',
  dataset: dataset,
  apiVersion: '2024-11-14',
  useCdn: true, // Use CDN for performance (best practice)
  // Cache invalidation handled via Next.js cache tags and on-demand revalidation
};

// Create Sanity client with CDN (best practice for performance)
export const sanityClient = createClient(sanityConfig);

// Image URL builder
const builder = imageUrlBuilder(sanityClient);

type SanityImageSource = Parameters<typeof builder.image>[0];

export function urlForImage(source: SanityImageSource) {
  return builder.image(source);
}

// GROQ Queries for blog content
export const queries = {
  // Fetch all published posts with pagination
  posts: `*[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc) [$start...$end] {
    _id,
    title,
    slug,
    excerpt,
    "content": body,
    publishedAt,
    _updatedAt,
    mainImage {
      asset->{
        _id,
        url,
        metadata {
          dimensions
        }
      },
      alt,
      caption
    },
    author->{
      _id,
      name,
      slug,
      bio,
      image {
        asset->{
          _id,
          url
        }
      }
    },
    categories[]->{
      _id,
      title,
      slug,
      description
    },
    tags[]->{
      _id,
      title,
      slug
    }
  }`,

  // Fetch single post by slug
  postBySlug: `*[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    _id,
    title,
    slug,
    excerpt,
    "content": body,
    publishedAt,
    _updatedAt,
    mainImage {
      asset->{
        _id,
        url,
        metadata {
          dimensions
        }
      },
      alt,
      caption
    },
    author->{
      _id,
      name,
      slug,
      bio,
      image {
        asset->{
          _id,
          url
        }
      }
    },
    categories[]->{
      _id,
      title,
      slug,
      description
    },
    tags[]->{
      _id,
      title,
      slug
    }
  }`,

  // Get total count of posts
  postCount: `count(*[_type == "post" && !(_id in path("drafts.**"))])`,

  // Get count of posts by category
  postCountByCategory: `count(*[_type == "post" && references(*[_type=="category" && slug.current == $categorySlug]._id) && !(_id in path("drafts.**"))])`,

  // Get count of posts by tag
  postCountByTag: `count(*[_type == "post" && references(*[_type=="tag" && slug.current == $tagSlug]._id) && !(_id in path("drafts.**"))])`,

  // Get count of posts by search
  postCountBySearch: `count(*[_type == "post" && !(_id in path("drafts.**")) && 
    (title match $searchTerm || excerpt match $searchTerm || pt::text(body) match $searchTerm)
  ])`,

  // Fetch all categories
  categories: `*[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    "postCount": count(*[_type == "post" && references(^._id) && !(_id in path("drafts.**"))])
  }`,

  // Fetch all tags
  tags: `*[_type == "tag"] | order(title asc) {
    _id,
    title,
    slug,
    "postCount": count(*[_type == "post" && references(^._id) && !(_id in path("drafts.**"))])
  }`,

  // Search posts
  searchPosts: `*[_type == "post" && !(_id in path("drafts.**")) && 
    (title match $searchTerm || excerpt match $searchTerm || pt::text(body) match $searchTerm)
  ] | order(publishedAt desc) [$start...$end] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    mainImage {
      asset->{
        _id,
        url
      },
      alt
    },
    author->{
      name
    },
    categories[]->{
      title,
      slug
    }
  }`,

  // Posts by category
  postsByCategory: `*[_type == "post" && references(*[_type=="category" && slug.current == $categorySlug]._id) && !(_id in path("drafts.**"))] | order(publishedAt desc) [$start...$end] {
    _id,
    title,
    slug,
    excerpt,
    "content": body,
    publishedAt,
    _updatedAt,
    mainImage {
      asset->{
        _id,
        url,
        metadata {
          dimensions
        }
      },
      alt,
      caption
    },
    author->{
      _id,
      name,
      slug,
      bio,
      image {
        asset->{
          _id,
          url
        }
      }
    },
    categories[]->{
      _id,
      title,
      slug,
      description
    },
    tags[]->{
      _id,
      title,
      slug
    }
  }`,

  // Posts by tag
  postsByTag: `*[_type == "post" && references(*[_type=="tag" && slug.current == $tagSlug]._id) && !(_id in path("drafts.**"))] | order(publishedAt desc) [$start...$end] {
    _id,
    title,
    slug,
    excerpt,
    "content": body,
    publishedAt,
    _updatedAt,
    mainImage {
      asset->{
        _id,
        url,
        metadata {
          dimensions
        }
      },
      alt,
      caption
    },
    author->{
      _id,
      name,
      slug,
      bio,
      image {
        asset->{
          _id,
          url
        }
      }
    },
    categories[]->{
      _id,
      title,
      slug,
      description
    },
    tags[]->{
      _id,
      title,
      slug
    }
  }`,
};


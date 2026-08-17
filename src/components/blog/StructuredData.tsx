import { BlogPost, WPCategory, WPTag } from '@/types/wordpress';
import { SITE_URL } from '@/lib/metadata';
import { AffiliateProduct } from '@/lib/affiliate-products';

interface StructuredDataProps {
  type: 'BlogPosting' | 'Blog' | 'BreadcrumbList' | 'ProductReview';
  data: BlogPost | BlogPost[] | { categories?: WPCategory[]; tags?: WPTag[] } | Record<string, never>;
  breadcrumbs?: Array<{ name: string; url: string }>;
  product?: AffiliateProduct;
}

export default function StructuredData({ type, data, breadcrumbs, product }: StructuredDataProps) {
  const generateStructuredData = () => {
    switch (type) {
      case 'BlogPosting':
        return generateBlogPostingData(data as BlogPost);
      case 'Blog':
        return generateBlogData(data as BlogPost[]);
      case 'BreadcrumbList':
        return generateBreadcrumbData(breadcrumbs || []);
      case 'ProductReview':
        return generateProductReviewData(data as BlogPost, product);
      default:
        return {};
    }
  };

  const generateBlogPostingData = (post: BlogPost) => {
    const baseUrl = SITE_URL;
    const authorName = post.author?.name || 'Indoor Dog Park Team';
    const authorImage = post.author?.avatar_urls?.['96'];
    const featuredImage = post.featuredImage?.source_url ||
                         post.featuredImage?.media_details?.sizes?.large?.source_url ||
                         post.featuredImage?.media_details?.sizes?.medium?.source_url;

    // Calculate reading time (average 200 words per minute)
    const wordCount = Math.ceil(post.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length);
    const timeRequired = `PT${Math.max(3, Math.ceil(wordCount / 200))}M`;

    // Extract clean description
    const cleanDescription = post.excerpt.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();

    const reviewer = post.factCheckedBy || post.reviewedBy;

    // Note: YouTube videos are extracted in the page component and added as separate VideoObject schemas

    const structuredData: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: cleanDescription,
      image: featuredImage ? [
        {
          '@type': 'ImageObject',
          url: featuredImage,
          width: post.featuredImage?.media_details?.width || 1200,
          height: post.featuredImage?.media_details?.height || 630,
        }
      ] : [],
      datePublished: post.date,
      dateModified: post.lastUpdated || post.modified,
      author: {
        '@type': 'Person',
        name: authorName,
        ...(authorImage && {
          image: {
            '@type': 'ImageObject',
            url: authorImage,
          },
        }),
        ...(post.author?.description && {
          description: post.author.description,
        }),
      },
      ...(reviewer && {
        reviewedBy: {
          '@type': 'Person',
          name: reviewer.name,
          ...(reviewer.avatar_urls?.['96'] && {
            image: {
              '@type': 'ImageObject',
              url: reviewer.avatar_urls['96'],
            },
          }),
          ...(reviewer.description && {
            description: reviewer.description,
          }),
        }
      }),
      publisher: {
        '@type': 'Organization',
        name: 'Indoor Dog Park',
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/images/logo/logo.png`,
          width: 200,
          height: 60,
        },
        url: baseUrl,
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${baseUrl}/blog/${post.slug}`,
      },
      url: `${baseUrl}/blog/${post.slug}`,
      wordCount,
      timeRequired,
      inLanguage: 'en-US',
      isPartOf: {
        '@type': 'Blog',
        name: 'Indoor Dog Park Blog',
        url: `${baseUrl}/blog`,
      },
      keywords: [
        ...post.categories.map(cat => cat.name),
        ...post.tags.map(tag => tag.name),
        'indoor dog parks',
        'dog parks',
        'California',
        'dog friendly',
        'pet care',
        'dog training',
      ].join(', '),
      ...(post.categories.length > 0 && {
        articleSection: post.categories.map(cat => cat.name),
      }),
    };

    // Remove undefined values
    return JSON.parse(JSON.stringify(structuredData));
  };

  const generateBlogData = (posts: BlogPost[]) => {
    const baseUrl = SITE_URL;

    return {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Indoor Dog Park Blog',
      description: 'Expert tips, guides, and stories about indoor dog parks, dog training, pet care, and creating the best indoor environment for your furry friends.',
      url: `${baseUrl}/blog`,
      publisher: {
        '@type': 'Organization',
        name: 'Indoor Dog Park',
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/images/logo/logo.png`,
          width: 200,
          height: 60,
        },
        url: baseUrl,
      },
      blogPost: posts.slice(0, 10).map(post => ({
        '@type': 'BlogPosting',
        headline: post.title,
        url: `${baseUrl}/blog/${post.slug}`,
        datePublished: post.date,
        dateModified: post.modified,
        author: {
          '@type': 'Person',
          name: post.author?.name || 'Indoor Dog Park Team',
        },
      })),
      inLanguage: 'en-US',
      potentialAction: {
        '@type': 'ReadAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${baseUrl}/blog`,
        },
      },
    };
  };

  const generateBreadcrumbData = (breadcrumbs: Array<{ name: string; url: string }>) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((breadcrumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: breadcrumb.name,
        item: breadcrumb.url.startsWith('http') ? breadcrumb.url : `${SITE_URL}${breadcrumb.url.startsWith('/') ? '' : '/'}${breadcrumb.url}`,
      })),
    };
  };

  const generateProductReviewData = (post: BlogPost, prod?: AffiliateProduct) => {
    const baseUrl = SITE_URL;
    if (!prod) return {};

    const featuredImage = post.featuredImage?.source_url ||
      post.featuredImage?.media_details?.sizes?.large?.source_url ||
      `${baseUrl}/images/logo/logo.png`;

    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: prod.productName,
      image: featuredImage,
      description: prod.description,
      brand: {
        '@type': 'Brand',
        name: prod.brand,
      },
      review: {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: String(prod.rating),
          bestRating: '5',
          worstRating: '1',
        },
        author: {
          '@type': 'Person',
          name: post.author?.name || 'Indoor Dog Park Review Team',
        },
        reviewBody: post.excerpt.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim(),
        datePublished: post.date,
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: String(prod.rating),
        reviewCount: String(prod.reviewCount),
        bestRating: '5',
        worstRating: '1',
      },
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'USD',
        priceRange: prod.priceRange || '$$',
        url: prod.amazonUrl,
        availability: 'https://schema.org/InStock',
      },
    };
  };

  const structuredData = generateStructuredData();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData, null, 2) }}
    />
  );
}
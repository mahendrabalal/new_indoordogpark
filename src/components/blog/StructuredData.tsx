import { BlogPost, WPCategory, WPTag } from '@/types/wordpress';
import { SITE_URL } from '@/lib/metadata';

interface StructuredDataProps {
  type: 'BlogPosting' | 'Blog' | 'BreadcrumbList';
  data: BlogPost | BlogPost[] | { categories?: WPCategory[]; tags?: WPTag[] } | Record<string, never>;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

export default function StructuredData({ type, data, breadcrumbs }: StructuredDataProps) {
  const generateStructuredData = () => {
    switch (type) {
      case 'BlogPosting':
        return generateBlogPostingData(data as BlogPost);
      case 'Blog':
        return generateBlogData(data as BlogPost[]);
      case 'BreadcrumbList':
        return generateBreadcrumbData(breadcrumbs || []);
      default:
        return {};
    }
  };

  const generateBlogPostingData = (post: BlogPost) => {
    const baseUrl = SITE_URL;
    const authorName = post.author?.name || 'Indoor Dog Park Team';
    const authorImage = post.author?.avatar_urls?.['96'];
    const featuredImage = post.featuredImage?.source_url;

    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt.replace(/<[^>]*>/g, '').trim(),
      image: featuredImage ? [featuredImage] : [],
      datePublished: post.date,
      dateModified: post.modified,
      author: {
        '@type': 'Person',
        name: authorName,
        image: authorImage ? {
          '@type': 'ImageObject',
          url: authorImage,
        } : undefined,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Indoor Dog Park',
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/images/logo/logo.png`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${baseUrl}/blog/${post.slug}`,
      },
      url: `${baseUrl}/blog/${post.slug}`,
      wordCount: Math.ceil(post.content.replace(/<[^>]*>/g, '').split(' ').length),
      inLanguage: 'en-US',
      isPartOf: {
        '@type': 'Blog',
        name: 'Indoor Dog Park Blog',
        url: `${baseUrl}/blog`,
      },
      keywords: [
        ...post.categories.map(cat => cat.name),
        ...post.tags.map(tag => tag.name),
        'dog parks', 'California', 'dog friendly', 'pet care'
      ].join(', '),
      articleSection: post.categories[0]?.name || 'General',
    };
  };

  const generateBlogData = (posts: BlogPost[]) => {
    const baseUrl = SITE_URL;

    return {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Indoor Dog Park Blog',
      description: 'Tips, guides, and stories about California dog parks, dog training, and pet-friendly activities.',
      url: `${baseUrl}/blog`,
      publisher: {
        '@type': 'Organization',
        name: 'Indoor Dog Park',
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/images/logo/logo.png`,
        },
      },
      blogPost: posts.map(post => ({
        '@type': 'BlogPosting',
        headline: post.title,
        url: `${baseUrl}/blog/${post.slug}`,
        datePublished: post.date,
        dateModified: post.modified,
      })),
      inLanguage: 'en-US',
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

  const structuredData = generateStructuredData();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData, null, 2) }}
    />
  );
}
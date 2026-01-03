import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import TagBlogPage from '@/components/blog/TagBlogPage';
import { WPTag } from '@/types/wordpress';

interface TagPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
    perPage?: string;
  };
}

// Normalize slug for matching (handles URL encoding, spaces, case, etc.)
function normalizeSlug(slug: string): string {
  return decodeURIComponent(slug)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')  // Replace spaces with hyphens
    .replace(/-+/g, '-')    // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

async function getTag(slug: string): Promise<WPTag | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/blog/tags`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const tags: WPTag[] = data.data || [];

    // Normalize the requested slug
    const normalizedSlug = normalizeSlug(slug);

    // Try exact match first (with original slug)
    let tag = tags.find(tag => tag.slug === slug);
    
    // If not found, try normalized match
    if (!tag) {
      tag = tags.find(tag => {
        const tagSlug = normalizeSlug(tag.slug);
        return tagSlug === normalizedSlug;
      });
    }

    // If still not found, try matching by name (case-insensitive, normalized)
    if (!tag) {
      const normalizedName = normalizedSlug.replace(/-/g, ' ');
      tag = tags.find(tag => {
        const tagNameNormalized = tag.name.toLowerCase().trim().replace(/\s+/g, '-');
        return tagNameNormalized === normalizedSlug || 
               tag.name.toLowerCase().trim() === normalizedName;
      });
    }

    return tag || null;
  } catch (error) {
    console.error('Error fetching tag:', error);
    return null;
  }
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const tag = await getTag(params.slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indoordogpark.org';

  if (!tag) {
    return {
      title: 'Tag Not Found',
      description: 'The tag you are looking for could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${tag.name} Articles - Indoor Dog Park Blog`;
  const description = tag.description || `Read all articles tagged with ${tag.name}. Expert tips, guides, and stories about indoor dog parks.`;
  const canonicalUrl = `${siteUrl}/blog/tag/${tag.slug}`;
  const ogImage = `${siteUrl}/images/hero/hero.webp`;

  return {
    title,
    description,
    keywords: `${tag.name}, indoor dog parks, dog training, pet care, California dog parks`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
      siteName: 'Indoor Dog Park',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${tag.name} - Indoor Dog Park Blog`,
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      site: '@indoordogpark',
      creator: '@indoordogpark',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const tag = await getTag(params.slug);

  if (!tag) {
    return notFound();
  }

  // Return 404 if tag exists but has no posts (prevents Soft 404 errors)
  if (!tag.count || tag.count === 0) {
    return notFound();
  }

  // Redirect to canonical slug if the requested slug doesn't match exactly
  // (handles URL encoding, spaces, case differences)
  if (tag.slug !== params.slug && normalizeSlug(tag.slug) === normalizeSlug(params.slug)) {
    const qs = new URLSearchParams();
    if (searchParams.page && searchParams.page !== '1') qs.set('page', searchParams.page);
    if (searchParams.perPage && searchParams.perPage !== '12') qs.set('perPage', searchParams.perPage);
    const suffix = qs.toString() ? `?${qs.toString()}` : '';
    permanentRedirect(`/blog/tag/${encodeURIComponent(tag.slug)}${suffix}`);
  }

  const page = parseInt(searchParams.page || '1');
  const perPage = parseInt(searchParams.perPage || '12');

  return <TagBlogPage tag={tag} page={page} perPage={perPage} />;
}
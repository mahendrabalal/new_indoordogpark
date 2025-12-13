import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { WPTag } from '@/types/wordpress';
import { getCachedTags } from '@/lib/sanity-api';
import { SITE_URL } from '@/lib/metadata';

interface TagPageProps {
  params: {
    slug: string;
  };
}

async function getTag(slug: string): Promise<WPTag | null> {
  try {
    const tags = await getCachedTags();
    return tags.find(tag => tag.slug === slug) || null;
  } catch (error) {
    console.error('Error fetching tag:', error);
    return null;
  }
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const tag = await getTag(params.slug);

  if (!tag) {
    return {
      title: 'Tag Not Found | Indoor Dog Park',
      description: 'The tag you are looking for could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  // Legacy route: canonicalize to /blog/tag/:slug (avoid duplicate content)
  const canonicalUrl = `/blog/tag/${encodeURIComponent(tag.slug)}`;

  return {
    title: `${tag.name} Articles | Indoor Dog Park Blog`,
    description: `Find all articles tagged with ${tag.name} about indoor dog parks, dog recreation, and pet care.`,
    keywords: [
      tag.name.toLowerCase(),
      'dog park articles',
      'indoor dog park',
      'dog recreation',
      'pet care',
      'California dog parks'
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${tag.name} Articles | Indoor Dog Park Blog`,
      description: `Articles tagged with ${tag.name}`,
      url: `${SITE_URL}${canonicalUrl}`,
      type: 'website',
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const tag = await getTag(params.slug);

  if (!tag) {
    return notFound();
  }

  // Always 301 redirect legacy route to canonical blog route
  permanentRedirect(`/blog/tag/${encodeURIComponent(tag.slug)}`);
}

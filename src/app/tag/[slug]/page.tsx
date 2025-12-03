import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TagBlogPage from '@/components/blog/TagBlogPage';
import { WPTag } from '@/types/wordpress';
import { getCachedTags } from '@/lib/sanity-api';
import { getRelatedTags } from '@/lib/related-content';

interface TagPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
    perPage?: string;
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
    };
  }

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
    openGraph: {
      title: `${tag.name} Articles | Indoor Dog Park Blog`,
      description: `Articles tagged with ${tag.name}`,
      url: `https://www.indoordogpark.org/tag/${tag.slug}`,
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const tag = await getTag(params.slug);

  if (!tag) {
    return notFound();
  }

  const page = parseInt(searchParams.page || '1');
  const perPage = parseInt(searchParams.perPage || '12');

  // Get related tags
  const relatedTags = await getRelatedTags(tag, 4);

  return <TagBlogPage tag={tag} page={page} perPage={perPage} relatedTags={relatedTags} />;
}

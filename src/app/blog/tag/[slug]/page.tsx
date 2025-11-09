import { Metadata } from 'next';
import { notFound } from 'next/navigation';
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
      title: 'Tag Not Found',
      description: 'The tag you are looking for could not be found.',
    };
  }

  return {
    title: `${tag.name} Articles - California Dog Parks Blog`,
    description: tag.description || `Read all articles tagged with ${tag.name}.`,
    openGraph: {
      title: `${tag.name} - California Dog Parks Blog`,
      description: tag.description || `Articles about ${tag.name}`,
      type: 'website',
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

  return <TagBlogPage tag={tag} page={page} perPage={perPage} />;
}
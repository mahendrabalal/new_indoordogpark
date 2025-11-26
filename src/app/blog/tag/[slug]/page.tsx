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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indoordogpark.org';

  if (!tag) {
    return {
      title: 'Tag Not Found',
      description: 'The tag you are looking for could not be found.',
    };
  }

  const title = `${tag.name} Articles - Indoor Dog Park Blog`;
  const description = tag.description || `Read all articles tagged with ${tag.name}. Expert tips, guides, and stories about indoor dog parks.`;
  const canonicalUrl = `/blog/tag/${tag.slug}`;
  const ogImage = `${siteUrl}/images/hero/hero.png`;

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

  const page = parseInt(searchParams.page || '1');
  const perPage = parseInt(searchParams.perPage || '12');

  return <TagBlogPage tag={tag} page={page} perPage={perPage} />;
}
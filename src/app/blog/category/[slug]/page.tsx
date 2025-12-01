import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CategoryBlogPage from '@/components/blog/CategoryBlogPage';
import { WPCategory } from '@/types/wordpress';

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
    perPage?: string;
  };
}

async function getCategory(slug: string): Promise<WPCategory | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/blog/categories`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const categories: WPCategory[] = data.data || [];

    return categories.find(cat => cat.slug === slug) || null;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategory(params.slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indoordogpark.org';

  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The category you are looking for could not be found.',
    };
  }

  const title = `${category.name} Articles - Indoor Dog Park Blog`;
  const description = category.description || `Read all articles in the ${category.name} category. Expert tips, guides, and stories about indoor dog parks.`;
  const canonicalUrl = `/blog/category/${category.slug}`;
  const ogImage = `${siteUrl}/images/hero/hero.webp`;

  return {
    title,
    description,
    keywords: `${category.name}, indoor dog parks, dog training, pet care, California dog parks`,
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
          alt: `${category.name} - Indoor Dog Park Blog`,
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

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category = await getCategory(params.slug);

  if (!category) {
    return notFound();
  }

  const page = parseInt(searchParams.page || '1');
  const perPage = parseInt(searchParams.perPage || '12');

  return <CategoryBlogPage category={category} page={page} perPage={perPage} />;
}
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CategoryBlogPage from '@/components/blog/CategoryBlogPage';
import { WPCategory } from '@/types/wordpress';
import { getCachedCategories } from '@/lib/sanity-api';

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
    const categories = await getCachedCategories();
    return categories.find(cat => cat.slug === slug) || null;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategory(params.slug);

  if (!category) {
    return {
      title: 'Category Not Found | Indoor Dog Park',
      description: 'The category you are looking for could not be found.',
    };
  }

  return {
    title: `${category.name} Articles | Indoor Dog Park Blog`,
    description: category.description || `Read all articles about ${category.name} for indoor dog parks and dog recreation.`,
    keywords: [
      category.name.toLowerCase(),
      'dog park articles',
      'indoor dog park',
      'dog recreation',
      'pet care',
      'California dog parks'
    ],
    openGraph: {
      title: `${category.name} Articles | Indoor Dog Park Blog`,
      description: category.description || `Articles about ${category.name}`,
      url: `https://www.indoordogpark.org/category/${category.slug}`,
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
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

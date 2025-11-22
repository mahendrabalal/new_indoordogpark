import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
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
    // Decode URL-encoded slugs (e.g., "indoor%20dog%20park" -> "indoor dog park")
    const decodedSlug = decodeURIComponent(slug);
    // Also try the slug as-is in case it's already decoded
    const categories = await getCachedCategories();
    return categories.find(cat => cat.slug === decodedSlug || cat.slug === slug) || null;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  // Decode slug for lookup
  const decodedSlug = decodeURIComponent(params.slug);
  const category = await getCategory(decodedSlug);

  if (!category) {
    return {
      title: 'Category Not Found | Indoor Dog Park',
      description: 'The category you are looking for could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  // Use canonical slug for URLs
  const canonicalSlug = category.slug;
  const canonicalUrl = `https://www.indoordogpark.org/category/${canonicalSlug}`;

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
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${category.name} Articles | Indoor Dog Park Blog`,
      description: category.description || `Articles about ${category.name}`,
      url: canonicalUrl,
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  // Decode slug for lookup
  const decodedSlug = decodeURIComponent(params.slug);
  const category = await getCategory(decodedSlug);

  if (!category) {
    return notFound();
  }

  // Redirect to canonical slug if different (301 permanent redirect for SEO)
  if (category.slug !== decodedSlug) {
    permanentRedirect(`/category/${category.slug}`);
  }

  const page = parseInt(searchParams.page || '1');
  const perPage = parseInt(searchParams.perPage || '12');

  return <CategoryBlogPage category={category} page={page} perPage={perPage} />;
}

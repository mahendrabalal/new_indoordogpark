import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { WPCategory } from '@/types/wordpress';
import { getCachedCategories } from '@/lib/sanity-api';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

// Normalize slug for matching (handles URL encoding, spaces, case, etc.)
function normalizeSlug(slug: string): string {
  return decodeURIComponent(slug)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function getCategory(slug: string): Promise<WPCategory | null> {
  try {
    const categories = await getCachedCategories();
    const normalizedSlug = normalizeSlug(slug);
    
    // Try exact match first
    let category = categories.find(cat => cat.slug === slug);
    
    // If not found, try normalized match
    if (!category) {
      category = categories.find(cat => {
        const catSlug = normalizeSlug(cat.slug);
        return catSlug === normalizedSlug;
      });
    }
    
    return category || null;
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

  // Legacy route: redirect to canonical /blog/category/:slug (avoid duplicate content)
  const encodedSlug = encodeURIComponent(category.slug);
  const canonicalUrl = `/blog/category/${encodedSlug}`;

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
      index: false,
      follow: true,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Decode slug for lookup
  const decodedSlug = decodeURIComponent(params.slug);
  const category = await getCategory(decodedSlug);

  if (!category) {
    return notFound();
  }

  // Always 301 redirect legacy route to canonical blog route
  permanentRedirect(`/blog/category/${encodeURIComponent(category.slug)}`);
}

import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogCard from '@/components/blog/BlogCard';
import BlogPagination from '@/components/blog/BlogPagination';
import { getCachedAuthorBySlug, getCachedPostsByAuthor } from '@/lib/sanity-api';
import { SITE_URL } from '@/lib/metadata';
import { WPPaginationInfo } from '@/types/wordpress';

export const revalidate = 86400; // 24 hours
export const dynamicParams = true;

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  let author;
  try {
    author = await getCachedAuthorBySlug(slug);
  } catch (error) {
    console.error('Error fetching author metadata:', error);
    author = null;
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indoordogpark.org';

  if (!author) {
    return {
      title: 'Author Not Found - Indoor Dog Park',
      description: 'This author page could not be found.',
      robots: { index: false, follow: false },
    };
  }

  const title = `${author.name} - Author at Indoor Dog Park`;
  const description =
    author.bio ||
    `Read all ${author.postCount} articles written by ${author.name} on Indoor Dog Park — your go-to resource for indoor dog parks and pet care.`;

  return {
    title,
    description,
    authors: [{ name: author.name }],
    alternates: { canonical: `${siteUrl}/blog/author/${author.slug}` },
    openGraph: {
      title,
      description,
      type: 'profile',
      url: `${siteUrl}/blog/author/${author.slug}`,
      siteName: 'Indoor Dog Park',
      locale: 'en_US',
      images: author.avatarUrl
        ? [{ url: author.avatarUrl, width: 200, height: 200, alt: author.name }]
        : [{ url: `${siteUrl}/images/og-image.jpg`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: author.avatarUrl ? [author.avatarUrl] : [`${siteUrl}/images/og-image.jpg`],
      site: '@indoordogpark',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function AuthorPage({ params, searchParams }: AuthorPageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || '1', 10));
  const perPage = 12;

  let author;
  let blogData;
  try {
    [author, blogData] = await Promise.all([
      getCachedAuthorBySlug(slug),
      getCachedPostsByAuthor(slug, page, perPage),
    ]);
  } catch (error) {
    console.error('Error fetching author page data:', error);
    return notFound();
  }

  if (!author) return notFound();

  const posts = blogData.posts;
  const pagination: WPPaginationInfo = {
    total: blogData.total,
    totalPages: blogData.totalPages,
    currentPage: page,
    perPage,
  };

  // ── JSON-LD Structured Data (ProfilePage + ItemList) ─────────────────────
  const profilePageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: author.name,
      url: `${SITE_URL}/blog/author/${author.slug}`,
      description: author.bio || undefined,
      image: author.avatarUrl || undefined,
      worksFor: {
        '@type': 'Organization',
        name: 'Indoor Dog Park',
        url: SITE_URL,
      },
    },
  };

  const itemListSchema =
    posts.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `Articles by ${author.name}`,
          url: `${SITE_URL}/blog/author/${author.slug}`,
          numberOfItems: blogData.total,
          itemListElement: posts.map((post, i) => ({
            '@type': 'ListItem',
            position: (page - 1) * perPage + i + 1,
            item: {
              '@type': 'BlogPosting',
              headline: post.title,
              url: `${SITE_URL}/blog/${post.slug}`,
              datePublished: post.date,
              author: { '@type': 'Person', name: author.name },
            },
          })),
        }
      : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: author.name, item: `${SITE_URL}/blog/author/${author.slug}` },
    ],
  };

  return (
    <>
      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }} />
      {itemListSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Header variant="light" />

      <main className="min-h-screen bg-gray-50">
        {/* ── Author Hero ─────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 text-white">
          <div className="container mx-auto px-4 py-16">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="text-sm mb-8">
              <ol className="flex items-center gap-2 text-green-200">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href="/blog" prefetch={false} className="hover:text-white transition-colors">Blog</Link></li>
                <li aria-hidden="true">/</li>
                <li className="text-white font-medium" aria-current="page">{author.name}</li>
              </ol>
            </nav>

            {/* Author Card */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {author.avatarUrl ? (
                  <div className="relative w-28 h-28 rounded-full overflow-hidden ring-4 ring-white/30 shadow-2xl">
                    <Image
                      src={author.avatarUrl}
                      alt={author.name}
                      fill
                      className="object-cover"
                      priority
                      sizes="112px"
                    />
                  </div>
                ) : (
                  <div className="w-28 h-28 rounded-full bg-white/20 ring-4 ring-white/30 flex items-center justify-center shadow-2xl">
                    <svg className="w-14 h-14 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="text-center sm:text-left">
                <p className="text-green-200 text-sm font-semibold uppercase tracking-widest mb-1">Author</p>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight">{author.name}</h1>
                {author.bio && (
                  <p className="text-green-100 text-lg leading-relaxed max-w-2xl">{author.bio}</p>
                )}
                <div className="mt-4 inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {blogData.total} {blogData.total === 1 ? 'article' : 'articles'} published
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Posts Grid ──────────────────────────────────────────────────── */}
        <div className="container mx-auto px-4 py-12">
          {posts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No articles yet</h2>
              <p className="text-gray-500 mb-6">{author.name} hasn&apos;t published any articles yet.</p>
              <Link href="/blog" prefetch={false} className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                ← Browse all articles
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  Articles by <span className="text-green-600">{author.name}</span>
                </h2>
                {pagination.totalPages > 1 && (
                  <span className="text-sm text-gray-500">
                    Page {page} of {pagination.totalPages}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <BlogPagination
                  pagination={pagination}
                  basePath={`/blog/author/${author.slug}`}
                  className="mt-4"
                />
              )}

              {/* Back to Blog */}
              <div className="mt-12 pt-8 border-t border-gray-200 text-center">
                <Link
                  href="/blog"
                  prefetch={false}
                  className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                  ← Back to all articles
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

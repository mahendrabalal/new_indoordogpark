import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getCachedAllAuthors } from '@/lib/sanity-api';
import { SITE_URL } from '@/lib/metadata';
import '@/app/blog/blog.css';

export const revalidate = 3600; // 1 hour

export const metadata: Metadata = {
  title: 'Meet Our Authors | Indoor Dog Park Blog',
  description:
    'Meet the pet care writers and indoor dog park experts behind IndoorDogPark.org. Our team of dog lovers, researchers, and industry insiders create guides, reviews, and city spotlights.',
  alternates: {
    canonical: '/blog/authors',
  },
  openGraph: {
    title: 'Meet Our Authors | Indoor Dog Park Blog',
    description:
      'Meet the pet care writers and indoor dog park experts behind IndoorDogPark.org.',
    url: 'https://www.indoordogpark.org/blog/authors',
    type: 'website',
    siteName: 'Indoor Dog Park',
    images: [
      {
        url: '/images/hero/hero.webp',
        width: 1200,
        height: 630,
        alt: 'Indoor Dog Park Team of Authors',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function AuthorsPage() {
  const authors = await getCachedAllAuthors();

  // Schema: ItemList of all author profiles
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Indoor Dog Park Authors',
    description: 'The pet care writers and experts behind IndoorDogPark.org',
    url: `${SITE_URL}/blog/authors`,
    numberOfItems: authors.length,
    itemListElement: authors.map((author, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Person',
        name: author.name,
        url: `${SITE_URL}/blog/author/${author.slug}`,
        description: author.bio || undefined,
        image: author.avatarUrl || undefined,
        jobTitle: 'Pet Care Writer & Indoor Dog Park Expert',
        worksFor: {
          '@type': 'Organization',
          name: 'Indoor Dog Park',
          url: SITE_URL,
        },
      },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: 'Authors', item: `${SITE_URL}/blog/authors` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Header variant="light" />

      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 text-white">
          <div className="container mx-auto px-4 py-16">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="text-sm mb-8">
              <ol className="flex items-center gap-2 text-green-200">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href="/blog" prefetch={false} className="hover:text-white transition-colors">Blog</Link></li>
                <li aria-hidden="true">/</li>
                <li className="text-white font-medium" aria-current="page">Authors</li>
              </ol>
            </nav>

            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              Meet Our Authors
            </h1>
            <p className="text-green-100 text-lg max-w-2xl leading-relaxed">
              Dog lovers, researchers, and pet industry experts dedicated to helping you find the
              best indoor play spaces, training facilities, and dog-friendly places across the US.
            </p>
          </div>
        </div>

        {/* Authors Grid */}
        <div className="container mx-auto px-4 py-16">
          {authors.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-xl">No authors found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {authors.map((author) => {
                const isTeamAccount = author.name.toLowerCase().includes('team');
                return (
                  <Link
                    key={author.id}
                    href={`/blog/author/${author.slug}`}
                    className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center hover:shadow-md hover:border-green-200 transition-all duration-200"
                  >
                    {/* Avatar */}
                    <div className="relative mb-5">
                      {author.avatarUrl ? (
                        <div className="relative w-24 h-24 rounded-full overflow-hidden ring-2 ring-gray-100 group-hover:ring-green-300 transition-all">
                          <Image
                            src={author.avatarUrl}
                            alt={author.name}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center ring-2 ring-gray-100 group-hover:ring-green-300 transition-all">
                          <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Name & role */}
                    <p className="text-xs font-semibold uppercase tracking-widest text-green-600 mb-1">
                      {isTeamAccount ? 'Editorial Team' : 'Author'}
                    </p>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">
                      {author.name}
                    </h2>

                    {/* Bio excerpt */}
                    {author.bio && (
                      <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-3">
                        {author.bio}
                      </p>
                    )}

                    {/* Article count */}
                    <div className="mt-auto flex items-center gap-1.5 text-sm font-medium text-gray-600 bg-gray-50 rounded-full px-4 py-1.5">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {author.postCount} {author.postCount === 1 ? 'article' : 'articles'}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Back to blog */}
          <div className="mt-16 pt-8 border-t border-gray-200 text-center">
            <Link
              href="/blog"
              prefetch={false}
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              ← Back to all articles
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

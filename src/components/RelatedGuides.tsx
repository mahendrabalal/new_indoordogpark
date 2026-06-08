import Link from 'next/link';
import Image from 'next/image';
import { getCachedPosts } from '@/lib/sanity-api';

interface RelatedGuidesProps {
  citySlug?: string;
  count?: number;
}

export default async function RelatedGuides({ citySlug, count = 3 }: RelatedGuidesProps) {
  // Fetch the latest posts. This forms the "Cluster" links for the pillar page.
  const { posts } = await getCachedPosts({ perPage: count });

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section id="related-guides" className="related-guides-section" style={{ padding: '80px 0', background: '#f8fafc' }}>
      <div className="section-shell">
        <div className="section-heading" style={{ marginBottom: '40px' }}>
          <span className="section-eyebrow" style={{ color: '#6366f1', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Expert Resources
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '8px' }}>
            Expert Guides & Tips
          </h2>
          <p style={{ color: '#64748b', marginTop: '12px', fontSize: '1.125rem' }}>
            Everything you need to know before visiting an indoor dog park.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {posts.map((post) => (
            <Link 
              key={post.id} 
              href={post.link} 
              style={{ display: 'block', background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', transition: 'all 0.2s', textDecoration: 'none' }} 
              className="group hover:shadow-lg hover:-translate-y-1"
            >
              {post.featuredImage?.source_url ? (
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#e2e8f0' }}>
                  <Image 
                    src={post.featuredImage.source_url} 
                    alt={post.featuredImage.alt_text || post.title} 
                    fill 
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover' }} 
                  />
                </div>
              ) : (
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="bi bi-journal-text" style={{ fontSize: '3rem', color: '#94a3b8' }}></i>
                </div>
              )}
              <div style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.4, marginBottom: '8px', transition: 'color 0.2s' }} className="group-hover:text-indigo-600">
                  {post.title}
                </h3>
                {/* Ensure the excerpt renders cleanly. Usually it contains HTML tags from WP/Sanity */}
                <div 
                  style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }} 
                  dangerouslySetInnerHTML={{ __html: post.excerpt }} 
                />
              </div>
            </Link>
          ))}
        </div>
        
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
           <Link href="/blog" prefetch={false} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#6366f1', textDecoration: 'none', padding: '12px 24px', borderRadius: '999px', background: '#e0e7ff', transition: 'background 0.2s' }} className="hover:bg-indigo-200">
             View all guides <i className="bi bi-arrow-right"></i>
           </Link>
        </div>
      </div>
    </section>
  );
}

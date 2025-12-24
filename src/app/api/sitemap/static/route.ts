import { NextResponse } from 'next/server'
import { SITE_URL } from '@/lib/metadata'
import { MetadataRoute } from 'next'

export const revalidate = 3600
export const dynamic = 'force-dynamic'
export const maxDuration = 10
export const runtime = 'nodejs'

/**
 * Static pages sitemap API route
 * Returns XML sitemap for static/landing pages
 */
export async function GET() {
  const baseUrl = SITE_URL
  const currentDate = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/parks-with-bars`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/training-facilities`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/list-your-park`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },

    {
      url: `${baseUrl}/how-it-works`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/help`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/owner-resources`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/partners`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/media`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/cookie-preferences`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.2,
    },
  ]

  // Generate XML sitemap
  const xml = generateSitemapXML(staticPages)

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
    },
  })
}

function generateSitemapXML(pages: MetadataRoute.Sitemap): string {
  const urls = pages
    .map((page) => {
      const lastmod = page.lastModified
        ? `<lastmod>${typeof page.lastModified === 'string' ? page.lastModified : page.lastModified.toISOString()}</lastmod>`
        : ''
      const changefreq = page.changeFrequency
        ? `<changefreq>${page.changeFrequency}</changefreq>`
        : ''
      const priority = page.priority !== undefined ? `<priority>${page.priority}</priority>` : ''

      return `  <url>
    <loc>${escapeXML(page.url)}</loc>${lastmod ? `\n    ${lastmod}` : ''}${changefreq ? `\n    ${changefreq}` : ''}${priority ? `\n    ${priority}` : ''}
  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
}

function escapeXML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}


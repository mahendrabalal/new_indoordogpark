import { NextResponse } from 'next/server'
import { SITE_URL } from '@/lib/metadata'
import { MetadataRoute } from 'next'
import { getAllStateSlugs, getStateContentBySlug } from '@/lib/state-page-data'

export const revalidate = 3600
export const dynamic = 'force-dynamic'
export const maxDuration = 30
export const runtime = 'nodejs'

/**
 * States sitemap API route
 * Returns XML sitemap for indexable state pages only
 */
export async function GET() {
  const baseUrl = SITE_URL
  const currentDate = new Date()
  const statePages: MetadataRoute.Sitemap = []

  try {
    const stateSlugs = await getAllStateSlugs()

    for (const slug of stateSlugs) {
      const stateContent = await getStateContentBySlug(slug)
      if (!stateContent || !stateContent.indexable) continue

      statePages.push({
        url: `${baseUrl}/states/${slug}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })
    }
  } catch (error) {
    console.error('[sitemap-states] Error building states sitemap:', error)
    return new NextResponse(generateSitemapXML([]), {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
      },
    })
  }

  return new NextResponse(generateSitemapXML(statePages), {
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



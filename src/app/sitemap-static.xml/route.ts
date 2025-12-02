import { NextResponse } from 'next/server'
import { getStaticPagesSitemap, generateSitemapXML } from '@/lib/sitemap-utils'

export const revalidate = 3600
export const dynamic = 'force-dynamic'
export const maxDuration = 10
export const runtime = 'nodejs'

/**
 * Static pages sitemap route handler
 * Returns XML sitemap for static/landing pages
 */
export async function GET() {
  try {
    const staticPages = await getStaticPagesSitemap()
    const xml = generateSitemapXML(staticPages)

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
      },
    })
  } catch (error) {
    console.error('[sitemap-static.xml] Error generating sitemap:', error)
    // Return empty sitemap on error
    return new NextResponse(generateSitemapXML([]), {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    })
  }
}


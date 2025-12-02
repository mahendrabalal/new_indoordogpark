import { NextResponse } from 'next/server'
import { getBlogSitemap, generateSitemapXML } from '@/lib/sitemap-utils'

export const revalidate = 3600
export const dynamic = 'force-dynamic'
export const maxDuration = 20
export const runtime = 'nodejs'

/**
 * Blog sitemap route handler
 * Returns XML sitemap for blog posts, categories, and tags
 */
export async function GET() {
  try {
    const blogPages = await getBlogSitemap()
    const xml = generateSitemapXML(blogPages)

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
      },
    })
  } catch (error) {
    console.error('[sitemap-blog.xml] Error generating sitemap:', error)
    // Return empty sitemap on error
    return new NextResponse(generateSitemapXML([]), {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    })
  }
}


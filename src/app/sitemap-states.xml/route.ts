import { NextResponse } from 'next/server'
import { getStatesSitemap, generateSitemapXML } from '@/lib/sitemap-utils'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * States sitemap route handler
 * Returns XML sitemap for all active state pages
 */
export async function GET() {
  try {
    const statePages = await getStatesSitemap()
    const xml = generateSitemapXML(statePages)

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
      },
    })
  } catch (error) {
    console.error('[sitemap-states.xml] Error generating sitemap:', error)
    // Return empty sitemap on error
    return new NextResponse(generateSitemapXML([]), {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    })
  }
}

import { NextResponse } from 'next/server'
import { getCitiesSitemap, generateSitemapXML } from '@/lib/sitemap-utils'

export const revalidate = 3600
export const dynamic = 'force-dynamic'
export const maxDuration = 30
export const runtime = 'nodejs'

/**
 * Cities sitemap route handler
 * Returns XML sitemap for all city pages
 */
export async function GET() {
  try {
    const cityPages = await getCitiesSitemap()
    const xml = generateSitemapXML(cityPages)

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
      },
    })
  } catch (error) {
    console.error('[sitemap-cities.xml] Error generating sitemap:', error)
    // Return empty sitemap on error
    return new NextResponse(generateSitemapXML([]), {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    })
  }
}


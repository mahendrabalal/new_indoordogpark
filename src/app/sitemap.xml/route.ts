import { NextResponse } from 'next/server'
import { SITE_URL } from '@/lib/metadata'
import { generateSitemapIndexXML } from '@/lib/sitemap-utils'

export const dynamic = 'force-dynamic'

/**
 * Main sitemap index - Industry best practice for sites with 500+ URLs
 * Returns XML sitemap index pointing to separate sitemaps
 * 
 * Google recommends sitemap index for large sites:
 * https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
 */
export async function GET() {
  const baseUrl = SITE_URL
  const currentDate = new Date()

  // Generate sitemap index XML using utility function
  const xml = generateSitemapIndexXML([
    { loc: `${baseUrl}/sitemap-static.xml`, lastmod: currentDate },
    { loc: `${baseUrl}/sitemap-parks.xml`, lastmod: currentDate },
    { loc: `${baseUrl}/sitemap-cities.xml`, lastmod: currentDate },
    { loc: `${baseUrl}/sitemap-states.xml`, lastmod: currentDate },
    { loc: `${baseUrl}/sitemap-blog.xml`, lastmod: currentDate },
  ])

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
    },
  })
}


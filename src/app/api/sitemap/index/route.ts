import { NextResponse } from 'next/server'
import { SITE_URL } from '@/lib/metadata'

export const revalidate = 3600
export const dynamic = 'force-dynamic'
export const maxDuration = 10
export const runtime = 'nodejs'

/**
 * Sitemap index API route
 * Returns XML sitemap index pointing to all sub-sitemaps
 * Industry best practice for sites with 500+ URLs
 */
export async function GET() {
  const baseUrl = SITE_URL
  const currentDate = new Date()

  // Generate sitemap index XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${escapeXML(`${baseUrl}/sitemap-static.xml`)}</loc>
    <lastmod>${currentDate.toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${escapeXML(`${baseUrl}/sitemap-parks.xml`)}</loc>
    <lastmod>${currentDate.toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${escapeXML(`${baseUrl}/sitemap-cities.xml`)}</loc>
    <lastmod>${currentDate.toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${escapeXML(`${baseUrl}/sitemap-blog.xml`)}</loc>
    <lastmod>${currentDate.toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
    },
  })
}

function escapeXML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}


















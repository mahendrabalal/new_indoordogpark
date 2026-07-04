import { NextResponse } from 'next/server'
import { getParksImageSitemapData, generateImageSitemapXML } from '@/lib/sitemap-images-utils'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const parkData = await getParksImageSitemapData()
    const xml = generateImageSitemapXML(parkData)

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
      },
    })
  } catch (error) {
    console.error('[sitemap-images.xml] Error generating image sitemap:', error)
    return new NextResponse(generateImageSitemapXML([]), {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    })
  }
}

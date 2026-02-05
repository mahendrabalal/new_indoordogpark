import { NextResponse } from 'next/server'
import { getAllCitySlugs } from '@/lib/parks-data'
import { SITE_URL } from '@/lib/metadata'
import { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Cities sitemap API route
 * Returns XML sitemap for all city pages
 */
export async function GET() {
  const baseUrl = SITE_URL
  const currentDate = new Date()
  const cityPages: MetadataRoute.Sitemap = []

  try {
    // Add city pages (includes both static cities and priority cities)
    // Calculate lastModified based on most recent park update in each city
    const citySlugs = await getAllCitySlugs()
    console.log(`[sitemap-cities] Processing ${citySlugs.length} cities`)

    const { getCityContentBySlug } = await import('@/lib/parks-data')

    for (const slug of citySlugs) {
      try {
        // Get city content to find parks in this city
        const cityContent = await getCityContentBySlug(slug)

        // Get the most recent lastUpdated date from parks in this city
        let cityLastModified = currentDate
        if (cityContent && cityContent.cityParks.length > 0) {
          const parkDates = cityContent.cityParks
            .map((park) => (park.lastUpdated ? new Date(park.lastUpdated) : null))
            .filter((date): date is Date => date !== null && !isNaN(date.getTime()))

          if (parkDates.length > 0) {
            cityLastModified = new Date(Math.max(...parkDates.map((d) => d.getTime())))
          }
        }

        cityPages.push({
          url: `${baseUrl}/cities/${slug}`,
          lastModified: cityLastModified,
          changeFrequency: 'weekly' as const,
          priority: 0.75,
        })
      } catch (cityError) {
        // Skip individual city if it fails, but continue with others
        console.warn(`[sitemap-cities] Failed to process city ${slug}:`, {
          error: cityError instanceof Error ? cityError.message : String(cityError),
        })
      }
    }

    console.log(`[sitemap-cities] Successfully added ${cityPages.length} city pages to sitemap`)
  } catch (error) {
    console.error('[sitemap-cities] CRITICAL: Error building city sitemap entries:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    // Return empty sitemap instead of failing completely
    return new NextResponse(generateSitemapXML([]), {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
      },
    })
  }

  const xml = generateSitemapXML(cityPages)

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


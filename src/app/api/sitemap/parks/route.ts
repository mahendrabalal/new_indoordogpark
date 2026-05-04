import { NextResponse } from 'next/server'
import { supabaseAdminClient } from '@/lib/supabase-admin'
import { SITE_URL } from '@/lib/metadata'
import { MetadataRoute } from 'next'
import { getParkUrl } from '@/lib/routing'

// Simplified segment configs for build troubleshooting
export const dynamic = 'force-dynamic'

/**
 * Parks sitemap API route (Edge-compatible)
 * Returns XML sitemap for all park pages
 * Uses Supabase to fetch all parks instead of filesystem
 */
export async function GET() {
  const baseUrl = SITE_URL
  const currentDate = new Date()
  const parkPages: MetadataRoute.Sitemap = []

  try {
    // Fetch all approved parks from Supabase
    const { data: parks, error } = await supabaseAdminClient
      .from('park_submissions')
      .select('id, slug, name, updated_at, approved_at')
      .eq('status', 'approved')
      .not('approved_at', 'is', null)
      .order('name', { ascending: true })

    if (error) {
      console.error('[sitemap-parks] Supabase error:', error)
      return new NextResponse(generateSitemapXML([]), {
        status: 200,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
        },
      })
    }

    if (!parks || parks.length === 0) {
      console.warn('[sitemap-parks] WARNING: No parks found in database')
      return new NextResponse(generateSitemapXML([]), {
        status: 200,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
        },
      })
    }

    console.log(`[sitemap-parks] Successfully loaded ${parks.length} parks from Supabase`)

    // Build sitemap entries
    const seenUrls = new Set<string>()
    let skippedCount = 0

    for (const park of parks) {
      const slug = park.slug || park.id
      if (!slug) {
        skippedCount++
        continue
      }

      const parkUrl = `${baseUrl}${getParkUrl(park)}`

      // Skip duplicates
      if (seenUrls.has(parkUrl)) {
        skippedCount++
        continue
      }

      seenUrls.add(parkUrl)
      const lastUpdated = park.updated_at ? new Date(park.updated_at) : currentDate

      parkPages.push({
        url: parkUrl,
        lastModified: lastUpdated,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })
    }

    if (skippedCount > 0) {
      console.warn(`[sitemap-parks] Skipped ${skippedCount} parks without slugs or duplicates`)
    }

    console.log(`[sitemap-parks] Successfully added ${parkPages.length} park pages to sitemap`)
  } catch (error) {
    console.error('[sitemap-parks] CRITICAL: Error building park sitemap:', error)
    return new NextResponse(generateSitemapXML([]), {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
      },
    })
  }

  const xml = generateSitemapXML(parkPages)

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

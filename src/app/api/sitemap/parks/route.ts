import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { resolve } from 'path'
import { getAllStaticParks, mapSubmissionToDogPark, type SubmissionRow } from '@/lib/parks-data'
import { supabaseAdminClient } from '@/lib/supabase-admin'
import { SITE_URL } from '@/lib/metadata'
import type { DogPark } from '@/types/dog-park'
import { MetadataRoute } from 'next'

export const revalidate = 3600
export const dynamic = 'force-dynamic'
export const maxDuration = 60
export const runtime = 'nodejs'

/**
 * Parks sitemap API route
 * Returns XML sitemap for all park pages
 */
export async function GET() {
  const baseUrl = SITE_URL
  const currentDate = new Date()
  const parkPages: MetadataRoute.Sitemap = []

  try {
    let allParks: DogPark[] = []

    // Try to get parks using the library function first
    try {
      allParks = await getAllStaticParks()
      console.log(`[sitemap-parks] Successfully loaded ${allParks.length} parks via library function`)
    } catch (libraryError) {
      console.error('[sitemap-parks] Library function failed, trying direct file read:', {
        error: libraryError instanceof Error ? libraryError.message : String(libraryError),
        stack: libraryError instanceof Error ? libraryError.stack : undefined,
        cwd: process.cwd(),
      })

      // Fallback: Read parks directly from JSON files using absolute paths
      try {
        const parksFromFiles: DogPark[] = []
        const projectRoot = process.cwd()

        // Load California parks
        try {
          const californiaPath = resolve(projectRoot, 'public', 'data', 'california.json')
          const californiaContent = await readFile(californiaPath, 'utf-8')
          const californiaParks: DogPark[] = JSON.parse(californiaContent)
          parksFromFiles.push(...californiaParks)
          console.log(`[sitemap-parks] Loaded ${californiaParks.length} California parks`)
        } catch (error) {
          console.error('[sitemap-parks] Failed to read California parks:', {
            error: error instanceof Error ? error.message : String(error),
            path: resolve(projectRoot, 'public', 'data', 'california.json'),
          })
        }

        // Load Washington parks
        try {
          const washingtonPath = resolve(projectRoot, 'public', 'data', 'washington.json')
          const washingtonContent = await readFile(washingtonPath, 'utf-8')
          const washingtonParks: DogPark[] = JSON.parse(washingtonContent)
          parksFromFiles.push(...washingtonParks)
          console.log(`[sitemap-parks] Loaded ${washingtonParks.length} Washington parks`)
        } catch (error) {
          console.error('[sitemap-parks] Failed to read Washington parks:', {
            error: error instanceof Error ? error.message : String(error),
            path: resolve(projectRoot, 'public', 'data', 'washington.json'),
          })
        }

        // Load Mixmatch parks
        try {
          const mixmatchPath = resolve(projectRoot, 'public', 'data', 'mixmatch.json')
          const mixmatchContent = await readFile(mixmatchPath, 'utf-8')
          const mixmatchParks: DogPark[] = JSON.parse(mixmatchContent)
          parksFromFiles.push(...mixmatchParks)
          console.log(`[sitemap-parks] Loaded ${mixmatchParks.length} Mixmatch parks`)
        } catch (error) {
          console.error('[sitemap-parks] Failed to read Mixmatch parks:', {
            error: error instanceof Error ? error.message : String(error),
            path: resolve(projectRoot, 'public', 'data', 'mixmatch.json'),
          })
        }

        allParks = parksFromFiles
        console.log(`[sitemap-parks] Total parks loaded from files: ${allParks.length}`)
      } catch (fileError) {
        console.error('[sitemap-parks] Critical: Failed to read parks from files:', {
          error: fileError instanceof Error ? fileError.message : String(fileError),
          stack: fileError instanceof Error ? fileError.stack : undefined,
          cwd: process.cwd(),
        })
        allParks = []
      }
    }

    if (!allParks || allParks.length === 0) {
      console.warn('[sitemap-parks] WARNING: No parks loaded - returning empty sitemap')
      return new NextResponse(generateSitemapXML([]), {
        status: 200,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
        },
      })
    }

    // Also load approved database submissions (user-submitted parks)
    try {
      const { data: submissions, error: dbError } = await supabaseAdminClient
        .from('park_submissions')
        .select('*')
        .eq('status', 'approved')
        .not('approved_at', 'is', null)

      if (!dbError && submissions && submissions.length > 0) {
        const submissionParks = submissions.map((sub) => mapSubmissionToDogPark(sub as SubmissionRow))
        allParks.push(...submissionParks)
        console.log(`[sitemap-parks] Added ${submissionParks.length} approved database submissions`)
      } else if (dbError) {
        console.warn('[sitemap-parks] Failed to load database submissions:', dbError)
      }
    } catch (dbError) {
      console.warn('[sitemap-parks] Error loading database submissions:', dbError)
      // Continue with static parks even if database fails
    }

    console.log(`[sitemap-parks] Processing ${allParks.length} total parks (static + database) into sitemap`)

    // Add individual park pages (deduplicate by URL)
    let skippedCount = 0
    const seenUrls = new Set<string>()

    for (const park of allParks) {
      const slug = park.slug || park.id
      if (!slug) {
        skippedCount++
        continue
      }

      const parkUrl = `${baseUrl}/parks/${slug}`

      // Skip if we've already added this URL (deduplicate)
      if (seenUrls.has(parkUrl)) {
        skippedCount++
        continue
      }

      seenUrls.add(parkUrl)
      const lastUpdated = park.lastUpdated ? new Date(park.lastUpdated) : currentDate

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
    console.error('[sitemap-parks] CRITICAL: Error building park sitemap entries:', {
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


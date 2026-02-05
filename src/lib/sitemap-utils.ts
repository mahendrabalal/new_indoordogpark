import { MetadataRoute } from 'next'
import { SITE_URL } from './metadata'
import { DogPark } from '@/types/dog-park'
import {
  getAllStaticParks,
  getAllCitySlugs,
  getCityContentBySlug,
  mapSubmissionToDogPark,
  type SubmissionRow
} from './parks-data'
import { supabaseAdminClient } from './supabase-admin'
import { getCachedPosts, getCachedCategories, getCachedTags } from './sanity-api'

/**
 * Shared utilities for sitemap generation
 * Used by both API routes and XML route handlers
 */

/**
 * Escapes XML special characters
 */
export function escapeXML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Generates XML sitemap from MetadataRoute.Sitemap array
 */
export function generateSitemapXML(pages: MetadataRoute.Sitemap): string {
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

/**
 * Generates sitemap index XML
 */
export function generateSitemapIndexXML(sitemaps: Array<{ loc: string; lastmod?: Date }>): string {
  const sitemapEntries = sitemaps
    .map((sitemap) => {
      const lastmod = sitemap.lastmod
        ? `\n    <lastmod>${sitemap.lastmod.toISOString()}</lastmod>`
        : ''
      return `  <sitemap>
    <loc>${escapeXML(sitemap.loc)}</loc>${lastmod}
  </sitemap>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`
}

/**
 * Gets static pages sitemap data
 */
export async function getStaticPagesSitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL
  const currentDate = new Date()

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/parks-with-bars`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/training-facilities`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/list-your-park`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },

    {
      url: `${baseUrl}/how-it-works`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/owner-resources`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/partners`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/cookie-preferences`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.2,
    },
  ]
}
/**
 * Gets parks sitemap data
 */
export async function getParksSitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL
  const currentDate = new Date()
  const parkPages: MetadataRoute.Sitemap = []

  try {
    let allParks: DogPark[] = []

    // Use the library function which is now Edge-compatible (imports JSON instead of fs)
    try {
      allParks = await getAllStaticParks()
      console.log(`[sitemap-parks] Successfully loaded ${allParks.length} static parks`)
    } catch (libraryError) {
      console.error('[sitemap-parks] Failed to load static parks:', libraryError)
      allParks = []
    }

    if (!allParks || allParks.length === 0) {
      console.warn('[sitemap-parks] WARNING: No parks loaded - returning empty sitemap')
      return []
    }

    // Also load approved database submissions (user-submitted parks)
    try {
      const { data: submissions, error: dbError } = await supabaseAdminClient
        .from('park_submissions')
        .select('*')
        .eq('status', 'approved')
        .not('approved_at', 'is', null)

      if (!dbError && submissions && submissions.length > 0) {
        const submissionParks = submissions.map((sub: any) => mapSubmissionToDogPark(sub as SubmissionRow))
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
    return []
  }

  return parkPages
}

/**
 * Gets cities sitemap data
 */
export async function getCitiesSitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL
  const currentDate = new Date()
  const cityPages: MetadataRoute.Sitemap = []

  try {
    // Add city pages (includes both static cities and priority cities)
    // Calculate lastModified based on most recent park update in each city
    const citySlugs = await getAllCitySlugs()
    console.log(`[sitemap-cities] Processing ${citySlugs.length} cities`)

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
    return []
  }

  return cityPages
}

/**
 * Gets blog sitemap data (posts, categories, tags)
 */
export async function getBlogSitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL
  const currentDate = new Date()
  const blogPages: MetadataRoute.Sitemap = []
  const categoryPages: MetadataRoute.Sitemap = []
  const tagPages: MetadataRoute.Sitemap = []

  try {
    // Fetch all blog posts from Sanity
    const blogData = await getCachedPosts({ page: 1, perPage: 1000 })
    const posts = blogData.posts || []

    console.log(`[sitemap-blog] Processing ${posts.length} blog posts`)

    for (const post of posts) {
      const modifiedDate = post.modified ? new Date(post.modified) : new Date(post.date)

      blogPages.push({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: modifiedDate,
        changeFrequency: 'monthly' as const,
        priority: 0.65,
      })
    }

    // Fetch categories from Sanity
    const categories = await getCachedCategories()
    console.log(`[sitemap-blog] Processing ${categories.length} categories`)

    for (const category of categories) {
      // URL-encode category slug to handle spaces and special characters
      const encodedSlug = encodeURIComponent(category.slug)
      categoryPages.push({
        url: `${baseUrl}/blog/category/${encodedSlug}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })
    }

    // Fetch tags from Sanity
    const tags = await getCachedTags()
    console.log(`[sitemap-blog] Processing ${tags.length} tags`)

    for (const tag of tags) {
      tagPages.push({
        url: `${baseUrl}/blog/tag/${tag.slug}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.5,
      })
    }

    console.log(
      `[sitemap-blog] Successfully added ${blogPages.length + categoryPages.length + tagPages.length} blog pages to sitemap:
      - Blog posts: ${blogPages.length}
      - Categories: ${categoryPages.length}
      - Tags: ${tagPages.length}`,
    )
  } catch (error) {
    console.error('[sitemap-blog] CRITICAL: Error fetching blog data for sitemap:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    return []
  }

  return [...blogPages, ...categoryPages, ...tagPages]
}


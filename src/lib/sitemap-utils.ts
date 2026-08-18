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
import { getCachedPosts, getCachedCategories, getCachedTags } from './sanity-api'
import { getAllStateSlugs, getStateContentBySlug } from './state-page-data'
import { getParkUrl } from './routing'
import { getAllCities } from './cityData'

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
      url: `${baseUrl}/off-leash-dog-park`,
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
    {
      url: `${baseUrl}/tools`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/chocolate-toxicity-calculator`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/dog-exercise-calculator`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/weather-safety-calculator`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/dog-socialization-cost-calculator`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/dog-park-packing-list-generator`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    },

    // Directory hub pages
    {
      url: `${baseUrl}/parks`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cities`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/states`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },

    // Feature landing pages
    {
      url: `${baseUrl}/indoor-agility-courses`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/indoor-dog-pools`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/small-dog-areas`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/reports`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },

    // Guides
    {
      url: `${baseUrl}/guides`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides/body-language`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guides/etiquette-checklist`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guides/first-aid`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guides/park-vs-daycare`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guides/safety-assessment`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guides/what-to-pack`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    },

    // Additional tool pages
    {
      url: `${baseUrl}/tools/dog-bmi-calculator`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/dog-calorie-calculator`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/dog-hydration-calculator`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/dog-park-etiquette-quiz`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/dog-space-estimator`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/puppy-vaccination-calculator`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
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

      const parkUrl = `${baseUrl}${getParkUrl(park)}`

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
    const allParks = await getAllStaticParks()
    const cities = getAllCities(allParks)
    const seenUrls = new Set<string>()

    for (const city of cities) {
      // Must match indexability threshold (>= 3 verified listings)
      if (city.parkCount < 3) {
        continue
      }

      const cityUrl = `${baseUrl}/cities/${city.slug}`
      if (seenUrls.has(cityUrl)) {
        continue
      }
      seenUrls.add(cityUrl)

      cityPages.push({
        url: cityUrl,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.75,
      })
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
 * Gets states sitemap data
 */
export async function getStatesSitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL
  const currentDate = new Date()
  const statePages: MetadataRoute.Sitemap = []

  try {
    const stateSlugs = await getAllStateSlugs()
    console.log(`[sitemap-states] Processing ${stateSlugs.length} states`)

    for (const slug of stateSlugs) {
      try {
        const stateContent = await getStateContentBySlug(slug)

        if (!stateContent || !stateContent.indexable) {
          continue
        }

        let stateLastModified = currentDate
        if (stateContent.cities && stateContent.cities.length > 0) {
          // You could derive the most recent park update across all cities here,
          // but currentDate is safe for now given weekly change frequency.
          stateLastModified = currentDate
        }

        statePages.push({
          url: `${baseUrl}/states/${stateContent.canonicalSlug}`,
          lastModified: stateLastModified,
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        })
      } catch (stateError) {
        console.warn(`[sitemap-states] Failed to process state ${slug}:`, {
          error: stateError instanceof Error ? stateError.message : String(stateError),
        })
      }
    }

    console.log(`[sitemap-states] Successfully added ${statePages.length} state pages to sitemap`)
  } catch (error) {
    console.error('[sitemap-states] CRITICAL: Error building state sitemap entries:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    return []
  }

  return statePages
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

    // Fetch categories from Sanity (DISABLED FOR ADSENSE COMPLIANCE)
    /*
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
    */

    console.log(
      `[sitemap-blog] Successfully added ${blogPages.length} blog pages to sitemap:
      - Blog posts: ${blogPages.length}
      - Categories: 0 (Disabled)
      - Tags: 0 (Disabled)`,
    )
  } catch (error) {
    console.error('[sitemap-blog] CRITICAL: Error fetching blog data for sitemap:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    return []
  }

  return [...blogPages]
}

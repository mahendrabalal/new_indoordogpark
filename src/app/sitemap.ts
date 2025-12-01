import { MetadataRoute } from 'next'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { getAllStaticParks, getAllCitySlugs } from '@/lib/parks-data'
import { getCachedPosts, getCachedCategories, getCachedTags } from '@/lib/sanity-api'
import { SITE_URL } from '@/lib/metadata'
import type { DogPark } from '@/types/dog-park'

// Revalidate sitemap every hour
export const revalidate = 3600

// Ensure sitemap is generated at runtime (not build time)
export const dynamic = 'force-dynamic'

// Sitemap includes all parks, cities, and blog pages (744+ URLs)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL
  const currentDate = new Date()

  // Static pages with their priorities and update frequencies
  const staticPages: MetadataRoute.Sitemap = [
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
      url: `${baseUrl}/guides`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/help`,
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
      url: `${baseUrl}/media`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/cookie-preferences`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.2,
    },
  ]

  // Dynamic park pages - separate try-catch to prevent one failure from blocking the other
  const parkPages: MetadataRoute.Sitemap = []
  
  try {
    let allParks: DogPark[] = []
    
    // Try to get parks using the library function first
    try {
      allParks = await getAllStaticParks()
    } catch (libraryError) {
      console.warn('[sitemap] getAllStaticParks failed, trying direct file read:', libraryError)
      
      // Fallback: Read parks directly from JSON files
      try {
        const parksFromFiles: DogPark[] = []
        
        // Load California parks
        try {
          const californiaPath = join(process.cwd(), 'public/data/california.json')
          const californiaContent = await readFile(californiaPath, 'utf-8')
          const californiaParks: DogPark[] = JSON.parse(californiaContent)
          parksFromFiles.push(...californiaParks)
        } catch (error) {
          console.error('[sitemap] Failed to read California parks:', error)
        }
        
        // Load Washington parks
        try {
          const washingtonPath = join(process.cwd(), 'public/data/washington.json')
          const washingtonContent = await readFile(washingtonPath, 'utf-8')
          const washingtonParks: DogPark[] = JSON.parse(washingtonContent)
          parksFromFiles.push(...washingtonParks)
        } catch (error) {
          console.error('[sitemap] Failed to read Washington parks:', error)
        }
        
        // Load Mixmatch parks
        try {
          const mixmatchPath = join(process.cwd(), 'public/data/mixmatch.json')
          const mixmatchContent = await readFile(mixmatchPath, 'utf-8')
          const mixmatchParks: DogPark[] = JSON.parse(mixmatchContent)
          parksFromFiles.push(...mixmatchParks)
        } catch (error) {
          console.error('[sitemap] Failed to read Mixmatch parks:', error)
        }
        
        allParks = parksFromFiles
        console.log(`[sitemap] Loaded ${allParks.length} parks directly from files`)
      } catch (fileError) {
        console.error('[sitemap] Failed to read parks from files:', fileError)
        allParks = []
      }
    }
    
    if (!allParks || allParks.length === 0) {
      console.warn('[sitemap] No parks loaded - park pages will be skipped')
    } else {
      console.log(`[sitemap] Processing ${allParks.length} parks into sitemap`)
      
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
        console.warn(`[sitemap] Skipped ${skippedCount} parks without slugs`)
      }
      
      console.log(`[sitemap] Added ${parkPages.length} park pages to sitemap`)
    }
  } catch (error) {
    console.error('[sitemap] Error building park sitemap entries:', error)
    // Continue even if parks fail - don't block the entire sitemap
  }

  // City pages - separate try-catch
  const cityPages: MetadataRoute.Sitemap = []
  
  try {
    // Add city pages (includes both static cities and priority cities)
    // Calculate lastModified based on most recent park update in each city
    const citySlugs = await getAllCitySlugs()
    const { getCityContentBySlug } = await import('@/lib/parks-data')
    
    for (const slug of citySlugs) {
      try {
        // Get city content to find parks in this city
        const cityContent = await getCityContentBySlug(slug)
        
        // Get the most recent lastUpdated date from parks in this city
        let cityLastModified = currentDate
        if (cityContent && cityContent.cityParks.length > 0) {
          const parkDates = cityContent.cityParks
            .map((park) => park.lastUpdated ? new Date(park.lastUpdated) : null)
            .filter((date): date is Date => date !== null && !isNaN(date.getTime()))
          
          if (parkDates.length > 0) {
            cityLastModified = new Date(Math.max(...parkDates.map(d => d.getTime())))
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
        console.warn(`[sitemap] Failed to process city ${slug}:`, cityError)
      }
    }
    
    console.log(`[sitemap] Added ${cityPages.length} city pages to sitemap`)
  } catch (error) {
    console.error('[sitemap] Error building city sitemap entries:', error)
    // Continue even if cities fail - don't block the entire sitemap
  }

  // Blog posts from Sanity
  const blogPages: MetadataRoute.Sitemap = []
  const categoryPages: MetadataRoute.Sitemap = []
  const tagPages: MetadataRoute.Sitemap = []
  
  try {
    // Fetch all blog posts from Sanity
    const blogData = await getCachedPosts({ page: 1, perPage: 1000 })
    const posts = blogData.posts || []

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
    for (const category of categories) {
      // URL-encode category slug to handle spaces and special characters
      const encodedSlug = encodeURIComponent(category.slug)
      categoryPages.push({
        url: `${baseUrl}/category/${encodedSlug}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })
    }

    // Fetch tags from Sanity
    const tags = await getCachedTags()
    for (const tag of tags) {
      tagPages.push({
        url: `${baseUrl}/tag/${tag.slug}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.5,
      })
    }
  } catch (error) {
    console.error('Error fetching blog data for sitemap:', error)
    // Continue with available data even if blog data fails
  }

  // Combine all pages and return
  const allPages: MetadataRoute.Sitemap = [
    ...staticPages,
    ...parkPages,
    ...cityPages,
    ...blogPages,
    ...categoryPages,
    ...tagPages,
  ]

  console.log(`[sitemap] Generated sitemap with ${allPages.length} total URLs:
    - Static pages: ${staticPages.length}
    - Park pages: ${parkPages.length}
    - City pages: ${cityPages.length}
    - Blog posts: ${blogPages.length}
    - Blog categories: ${categoryPages.length}
    - Blog tags: ${tagPages.length}`)

  return allPages
}
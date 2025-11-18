import { MetadataRoute } from 'next'
import { getAllStaticParks, getAllCitySlugs } from '@/lib/parks-data'
import { getCachedPosts, getCachedCategories, getCachedTags } from '@/lib/sanity-api'
import { SITE_URL } from '@/lib/metadata'

// Revalidate sitemap every hour
export const revalidate = 3600

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
      url: `${baseUrl}/list-property`,
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

  // Dynamic park pages
  const parkPages: MetadataRoute.Sitemap = []
  const cityPages: MetadataRoute.Sitemap = []
  
  try {
    const allParks = await getAllStaticParks()
    
    // Add individual park pages
    for (const park of allParks) {
      const slug = park.slug || park.id
      const lastUpdated = park.lastUpdated ? new Date(park.lastUpdated) : currentDate
      
      parkPages.push({
        url: `${baseUrl}/parks/${slug}`,
        lastModified: lastUpdated,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })
    }

    // Add city pages (includes both static cities and priority cities)
    const citySlugs = await getAllCitySlugs()
    for (const slug of citySlugs) {
      cityPages.push({
        url: `${baseUrl}/cities/${slug}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.75,
      })
    }
  } catch (error) {
    console.error('Error building park/city sitemap entries:', error)
    // Continue with other pages even if parks fail
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
      categoryPages.push({
        url: `${baseUrl}/blog/category/${category.slug}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })
    }

    // Fetch tags from Sanity
    const tags = await getCachedTags()
    for (const tag of tags) {
      tagPages.push({
        url: `${baseUrl}/blog/tag/${tag.slug}`,
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

  return allPages
}
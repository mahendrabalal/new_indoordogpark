import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

interface Park {
  id: string
  name: string
  city: string
  slug?: string
}

interface CityData {
  slug: string
  [key: string]: unknown
}

interface BlogPost {
  slug: string
  modifiedAt?: string
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.indoordogpark.org'
  const currentDate = new Date()

  // Static pages with their priorities and update frequencies
  const staticPages = [
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
      priority: 0.6,
    },
  ]

  // Dynamic park pages
  const parkPages: MetadataRoute.Sitemap = []
  try {
    const parksDataPath = path.join(process.cwd(), 'public/data/california.json')
    if (fs.existsSync(parksDataPath)) {
      const parksData: Park[] = JSON.parse(fs.readFileSync(parksDataPath, 'utf8'))

      parksData.forEach((park) => {
        const slug = park.slug || park.id
        parkPages.push({
          url: `${baseUrl}/parks/${slug}`,
          lastModified: currentDate,
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        })
      })
    }
  } catch (error) {
    console.error('Error reading parks data for sitemap:', error)
  }

  // City pages
  const cityPages: MetadataRoute.Sitemap = []
  try {
    const citiesDataPath = path.join(process.cwd(), 'public/data/cities.json')
    if (fs.existsSync(citiesDataPath)) {
      const citiesData: CityData[] = JSON.parse(fs.readFileSync(citiesDataPath, 'utf8'))

      citiesData.forEach((city) => {
        cityPages.push({
          url: `${baseUrl}/cities/${city.slug}`,
          lastModified: currentDate,
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        })
      })
    }
  } catch (error) {
    console.error('Error reading cities data for sitemap:', error)
  }

  // Blog posts and category pages
  const blogPages: MetadataRoute.Sitemap = []
  try {
    const blogDataPath = path.join(process.cwd(), 'public/data/blog-posts.json')
    if (fs.existsSync(blogDataPath)) {
      const blogPosts: BlogPost[] = JSON.parse(fs.readFileSync(blogDataPath, 'utf8'))

      blogPosts.forEach((post) => {
        blogPages.push({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: post.modifiedAt ? new Date(post.modifiedAt) : currentDate,
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        })
      })
    }
  } catch (error) {
    console.error('Error reading blog data for sitemap:', error)
  }

  // Blog category pages (common dog-related categories)
  const blogCategories = [
    'dog-park-reviews',
    'dog-training',
    'dog-health',
    'dog-activities',
    'california-dog-parks',
    'indoor-dog-parks'
  ]

  const categoryPages = blogCategories.map((category) => ({
    url: `${baseUrl}/blog/category/${category}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))

  return [
    ...staticPages,
    ...parkPages,
    ...cityPages,
    ...blogPages,
    ...categoryPages,
  ]
}
import { NextResponse } from 'next/server'
import { getCachedPosts, getCachedCategories, getCachedTags } from '@/lib/sanity-api'
import { SITE_URL } from '@/lib/metadata'
import { MetadataRoute } from 'next'

export const revalidate = 3600
export const dynamic = 'force-dynamic'
export const maxDuration = 20
export const runtime = 'nodejs'

/**
 * Blog sitemap API route
 * Returns XML sitemap for blog posts, categories, and tags
 */
export async function GET() {
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
        url: `${baseUrl}/category/${encodedSlug}`,
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
        url: `${baseUrl}/tag/${tag.slug}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.5,
      })
    }

    const allBlogPages = [...blogPages, ...categoryPages, ...tagPages]
    console.log(
      `[sitemap-blog] Successfully added ${allBlogPages.length} blog pages to sitemap:
      - Blog posts: ${blogPages.length}
      - Categories: ${categoryPages.length}
      - Tags: ${tagPages.length}`,
    )
  } catch (error) {
    console.error('[sitemap-blog] CRITICAL: Error fetching blog data for sitemap:', {
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

  const xml = generateSitemapXML([...blogPages, ...categoryPages, ...tagPages])

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


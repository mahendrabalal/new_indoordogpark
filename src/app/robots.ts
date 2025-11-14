import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indoordogpark.org'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/dashboard/',
          '/payment/',
          '/checkout/',
          '/login',
          '/signup',
          '/studio/', // Sanity Studio
          '/webhook/', // Webhook endpoints
          '/private/',
          '/_next/static/media/', // Internal Next.js files
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/parks/',
          '/cities/',
          '/blog/',
          '/images/',
          '/icons/',
          '/_next/static/', // Allow static assets for crawling
          '/_next/image/', // Allow Next.js image optimization
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/dashboard/',
          '/payment/',
          '/checkout/',
          '/login',
          '/signup',
          '/studio/',
          '/webhook/',
          '/private/',
        ],
        crawlDelay: 0,
      },
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/parks/',
          '/cities/',
          '/blog/',
          '/images/',
          '/icons/',
          '/_next/static/',
          '/_next/image/',
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/dashboard/',
          '/payment/',
          '/checkout/',
          '/login',
          '/signup',
          '/studio/',
          '/webhook/',
          '/private/',
        ],
        crawlDelay: 0,
      },
      // Allow image bots to access public images
      {
        userAgent: 'Googlebot-Image',
        allow: [
          '/images/',
          '/icons/',
          '/_next/image/',
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/private/',
        ],
      },
      // Allow video bots
      {
        userAgent: 'Googlebot-Video',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/private/',
          '/payment/',
          '/checkout/',
        ],
      },
      // Explicitly block aggressive crawlers and scrapers
      {
        userAgent: [
          'AhrefsBot',
          'SemrushBot',
          'DotBot',
          'MJ12bot',
          'BLEXBot',
          'PetalBot',
          'DataForSeoBot',
          'SeznamBot',
          'MauiBot',
          'AspiegelBot',
        ],
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
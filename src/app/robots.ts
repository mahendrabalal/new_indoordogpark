import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indoordogpark.org'

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/8abd796f2d329b8de96a77235663de27.txt', // IndexNow key file for search engine verification
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/dashboard/',
          '/payment/',
          '/checkout/',
          '/studio/', // Sanity Studio
          '/webhook/', // Webhook endpoints
          '/private/',
          '/_next/static/media/', // Internal Next.js files
          '/login',   // Auth pages — block to save crawl budget
          '/signup',  // Auth pages — block to save crawl budget
        ],
        // Be polite to smaller bots/scrapers without slowing down Google/Bing (they ignore crawlDelay anyway)
        crawlDelay: 1,
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/parks/',
          '/dog-training/',
          '/dog-friendly/',
          '/cities/',
          '/states/',
          '/blog/',
          '/about',
          '/contact',
          '/faq',
          '/how-it-works',
          '/list-your-park',
          '/owner-resources',
          '/partners',
          '/privacy',
          '/terms',
          '/cookie-preferences',
          '/images/',
          '/icons/',
          '/_next/static/', // Allow static assets for crawling
          '/_next/image/', // Allow Next.js image optimization
          '/8abd796f2d329b8de96a77235663de27.txt', // IndexNow key file
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/dashboard/',
          '/payment/',
          '/checkout/',
          '/studio/',
          '/webhook/',
          '/private/',
          '/login',
          '/signup',
        ],
        crawlDelay: 0,
      },
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/parks/',
          '/cities/',
          '/states/',
          '/blog/',
          '/about',
          '/contact',
          '/faq',
          '/how-it-works',
          '/list-your-park',
          '/owner-resources',
          '/partners',
          '/privacy',
          '/terms',
          '/cookie-preferences',
          '/images/',
          '/icons/',
          '/_next/static/',
          '/_next/image/',
          '/8abd796f2d329b8de96a77235663de27.txt', // IndexNow key file
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/dashboard/',
          '/payment/',
          '/checkout/',
          '/studio/',
          '/webhook/',
          '/private/',
          '/login',
          '/signup',
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
    host: baseUrl,
  }
}
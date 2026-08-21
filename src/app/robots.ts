import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indoordogpark.org'

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/', // Explicitly allow all public routes
          '/llms.txt', // Standard manifest for AI search engines
          '/8abd796f2d329b8de96a77235663de27.txt', // IndexNow key file
        ],
        disallow: [
          '/admin/',
          '/outreach-studio/', // Internal admin tools
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
      },
      {
        userAgent: ['Googlebot', 'Bingbot'],
        allow: [
          '/', // Explicitly allow all public routes
          '/_next/static/', // Allow static assets for crawling rendering
          '/_next/image/', // Allow Next.js image optimization
        ],
        disallow: [
          '/admin/',
          '/outreach-studio/',
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
          '/outreach-studio/',
          '/api/',
          '/private/',
        ],
      },
      // Allow video bots
      {
        userAgent: 'Googlebot-Video',
        disallow: [
          '/admin/',
          '/outreach-studio/',
          '/api/',
          '/private/',
          '/payment/',
          '/checkout/',
        ],
      },
      // Explicitly allow AI Search Engines & assistants
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'OAI-SearchBot',
          'ClaudeBot',
          'PerplexityBot',
          'Google-Extended',
          'SemrushBot',
        ],
        disallow: [
          '/admin/',
          '/outreach-studio/',
          '/api/',
          '/private/',
          '/studio/',
        ],
      },
      // Explicitly block aggressive scrapers and data harvesters
      {
        userAgent: [
          'AhrefsBot',
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
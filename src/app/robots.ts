import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.indoordogpark.org'

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
          '/login',
          '/signup',
          '/_next/',
          '/static/',
          '/*.json$',
          '/private/',
          '/temp/',
          '*.pdf$',
          '/*?*',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/dashboard/',
          '/payment/',
          '/login',
          '/signup',
        ],
        crawlDelay: 1,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/dashboard/',
          '/payment/',
          '/login',
          '/signup',
        ],
        crawlDelay: 2,
      },
      // Allow specific bots for images and resources
      {
        userAgent: 'Googlebot-Image',
        allow: '/public/data/',
        allow: '/images/',
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: 'Googlebot-Video',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
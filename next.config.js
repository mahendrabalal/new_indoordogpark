const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_SOCIAL_INSTAGRAM: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || 'https://www.instagram.com/indoordogpark2025/',
  },
  images: {
    // Industry best practice: Configure image optimization properly
    // Local images in public folder should use unoptimized prop to avoid 402 errors
    // This prevents hitting Next.js Image Optimization API limits
    remotePatterns: [
      // Only allow local images and essential third-party domains
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Google user content images (all variants)
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh4.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh5.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh6.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'places.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'cdnjs.cloudflare.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'streetviewpixels-pa.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'streetviewpixels-na.googleapis.com',
      },
      // Park website images
      {
        protocol: 'https',
        hostname: 'baetailsdogdaycare.com',
      },
      {
        protocol: 'https',
        hostname: 'www.nycgovparks.org',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    // Optimize image loading - reduced sizes for better performance
    // Smaller sizes reduce initial load and improve LCP
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache optimized images - long cache for better performance
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    // Note: Image quality is set per-image using the quality prop on Image components
    // Default Next.js quality is 75, which provides good balance
    // Enable image optimization
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Security and Performance Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://pagead2.googlesyndication.com https://partner.googleadservices.com https://tpc.googlesyndication.com https://ep2.adtrafficquality.google https://fundingchoicesmessages.google.com https://vercel.live; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net https://unpkg.com; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net data:; connect-src 'self' https: wss:; frame-src 'self' https:; frame-ancestors 'self' https://adsense.google.com https://www.google.com https://googleads.g.doubleclick.net;",
          },
        ],
      },
      // Static assets with long-term caching
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      // Font files with long-term caching
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // CSS and JS files
      {
        source: '/:path*\\.(css|js)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Data files with shorter cache for updates
      {
        source: '/data/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
      {
        source: '/icons/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // SEO-friendly files
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
      // IndexNow API key file
      {
        source: '/8abd796f2d329b8de96a77235663de27.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      // Redirect trailing slashes (except root) for consistency
      {
        source: '/:path+/',
        destination: '/:path+',
        permanent: true,
      },
      // Redirect state names mistakenly used as cities to the homepage
      {
        source: '/cities/:slug(california|ca|new-york|ny|washington|wa|florida|fl|texas|tx)',
        destination: '/',
        permanent: true,
      },
      // Consolidate privacy policy URLs - redirect /privacy-policy to /privacy
      {
        source: '/privacy-policy',
        destination: '/privacy',
        permanent: true,
      },
      {
        source: '/blog/how-to-tire-out-your-dog-indoors-10-proven-strategies',
        destination: '/blog/how-to-tire-out-a-high-energy-dog-indoors-without-ruining-your-house',
        permanent: true,
      },
      {
        source: '/blog/san-antonio-indoor-dog-parks',
        destination: '/blog/top-10-bestindoor-dog-park-in-san-antonio-texas',
        permanent: true,
      },
      {
        source: '/blog/fort-worth-indoor-dog-parks',
        destination: '/blog/top-10-indoor-dog-parks-and-dog-daycares-in-fort-worth-texas',
        permanent: true,
      },
      {
        source: '/parks/oneida-run',
        destination: '/parks/oneida-run-bronx',
        permanent: true,
      },
      {
        source: '/parks/down-town-indoor-dog-park-durham',
        destination: '/parks/downtown-durham-dog-park',
        permanent: true,
      },
      {
        source: '/parks/central-bark-fort-lauderdale',
        destination: '/parks/central-bark-fort-lauderdale-oakland-park',
        permanent: true,
      },
      {
        source: '/parks/pet-play-place',
        destination: '/parks/pet-play-place-kennesaw',
        permanent: true,
      },
      {
        source: '/parks/barking-hound-village-buckhead',
        destination: '/parks/barking-hound-village-buckhead-atlanta',
        permanent: true,
      },
      {
        source: '/parks/woofs-n-whiskers',
        destination: '/parks/woofs-n-whiskers-brooklyn',
        permanent: true,
      },
      {
        source: '/parks/barking-hound-village-cheshire',
        destination: '/parks/barking-hound-village-cheshire-atlanta',
        permanent: true,
      },
      {
        source: '/parks/petsmart-doggie-day-camp',
        destination: '/parks/petsmart-doggie-day-camp-secaucus',
        permanent: true,
      },
      {
        source: '/parks/zen-canine-club',
        destination: '/parks/zen-canine-club-miami-lakes',
        permanent: true,
      },
      {
        source: '/parks/hi-bk-doggy-daycare',
        destination: '/parks/hi-bk-doggy-daycare-brooklyn',
        permanent: true,
      },
      {
        source: '/parks/the-martial-arfs-dog-training-fitness-center',
        destination: '/parks/the-martial-arfs-dog-training-fitness-center-carle-place',
        permanent: true,
      },
      {
        source: '/parks/pet-super-nanny',
        destination: '/parks/pet-super-nanny-brooklyn',
        permanent: true,
      },
      {
        source: '/parks/prospect-park-carousel',
        destination: '/parks/prospect-park-carousel-brooklyn',
        permanent: true,
      },
      {
        source: '/parks/digs-canine-hotel-spa-daycare',
        destination: '/parks/digs-canine-hotel-spa-daycare-brooklyn',
        permanent: true,
      },
      // City misspelling redirects
      {
        source: '/cities/newark-ng',
        destination: '/cities/newark-nj',
        permanent: true,
      },
      {
        source: '/cities/tuscon',
        destination: '/cities/tucson',
        permanent: true,
      },
      // Fix broken redirects
      {
        source: '/blog/starting-indoor-dog-park-business-guide',
        destination: '/blog/how-to-start-an-indoor-dog-park-a-step-by-step-guide',
        permanent: true,
      },
      {
        source: '/parks/indoor-dog-park-california-california',
        destination: '/parks/indoor-dog-park-california',
        permanent: true,
      },
      // Redirect old query parameter URLs to dedicated routes
      {
        source: '/',
        has: [
          {
            type: 'query',
            key: 'type',
            value: 'bar',
          },
        ],
        destination: '/parks-with-bars',
        permanent: true,
      },
      {
        source: '/',
        has: [
          {
            type: 'query',
            key: 'type',
            value: 'training',
          },
        ],
        destination: '/training-facilities',
        permanent: true,
      },
      // ── GSC 404 fixes (August 2026) ──────────────────────────────
      // Blog category that doesn't exist in Sanity → top-level feature page
      {
        source: '/blog/category/parks-with-bars',
        destination: '/parks-with-bars',
        permanent: true,
      },
      // Variant blog slugs → actual live posts
      {
        source: '/blog/top-10-best-indoor-dog-parks-in-bakersfield-ca',
        destination: '/blog/10-best-indoor-dog-parks-and-daycares-in-bakersfield-ca',
        permanent: true,
      },
      {
        source: '/blog/top-10-best-indoor-dog-parks-in-tampa-fl',
        destination: '/blog/10-best-indoor-dog-parks-dog-bars-and-daycares-in-tampa-fl',
        permanent: true,
      },
      {
        source: '/blog/san-diego-indoor-dog-parks',
        destination: '/blog/top-10-best-indoor-dog-parks-in-san-diego-california',
        permanent: true,
      },
      // Roxbury is the township name; actual city in data is Succasunna
      {
        source: '/cities/roxbury-nj',
        destination: '/cities/succasunna',
        permanent: true,
      },
    ];
  },
  // Trailing slash configuration for consistent URLs
  trailingSlash: false,
  // Compression
  compress: true,
  // Power by header
  poweredByHeader: false,
  // Optimize production builds
  productionBrowserSourceMaps: false,
  // Optimize bundle size
  experimental: {
    // CSS optimization - requires 'critters' package (now installed)
    optimizeCss: false,
    optimizePackageImports: ['@heroicons/react', 'date-fns'],
    // Enable partial prerendering for better performance
    ppr: false, // Disable for now as it's experimental
  },
  // Optimize compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  webpack: (config, { webpack, isServer, dev }) => {
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');


    return config;
  },
};

module.exports = nextConfig;

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
      // SEO Cannibalization Redirects
      { source: '/blog/top-10-best-indoor-dog-parks-in-anaheim', destination: '/cities/anaheim', permanent: true },
      { source: '/blog/top-10-best-indoor-dog-parks-in-lexington-ky', destination: '/cities/lexington', permanent: true },
      { source: '/blog/top-10-best-indoor-dog-parks-in-orlando', destination: '/cities/orlando', permanent: true },
      { source: '/blog/top-10-best-indoor-dog-parks-in-riverside-ca', destination: '/cities/riverside', permanent: true },
      { source: '/blog/top-10-best-indoor-dog-parks-in-stockton-ca', destination: '/cities/stockton', permanent: true },
      { source: '/blog/top-5-indoor-dog-parks-honolulu', destination: '/cities/honolulu', permanent: true },
      { source: '/blog/top-5-indoor-dog-parks-islip', destination: '/cities/islip', permanent: true },
      { source: '/blog/top-5-indoor-dog-parks-new-orleans', destination: '/cities/new-orleans', permanent: true },
      { source: '/blog/top-8-best-indoor-dog-parks-in-corpus-christi-tx', destination: '/cities/corpus-christi', permanent: true },
      { source: '/blog/top-8-best-indoor-dog-parks-in-irvine-ca', destination: '/cities/irvine', permanent: true },
      { source: '/blog/top-8-best-indoor-dog-parks-in-newark-nj', destination: '/cities/newark', permanent: true },
      {
        source: '/blog/top-8-best-indoor-dog-parks-in-santa-ana-ca',
        destination: '/cities/santa-ana',
        permanent: true,
      },
      {
        source: '/blog/top-5-best-indoor-dog-parks-in-fresno-beat-the-central-valley-heat',
        destination: '/cities/fresno',
        permanent: true,
      },
      {
        source: '/blog/top-10-best-indoor-dog-parks-in-denver-colorado',
        destination: '/cities/denver',
        permanent: true,
      },
      {
        source: '/blog/top-5-best-indoor-dog-parks-in-san-francisco',
        destination: '/cities/san-francisco',
        permanent: true,
      },
      {
        source: '/blog/top-10-best-indoor-dog-parks-in-san-jose-and-indoor-friendly-play-areas',
        destination: '/cities/san-jose',
        permanent: true,
      },
      {
        source: '/blog/top-5-best-indoor-dog-parks-in-oklahoma-city',
        destination: '/cities/oklahoma-city',
        permanent: true,
      },
      {
        source: '/blog/top-5-best-indoor-dog-parks-in-milwaukee-your-winter-play-guide',
        destination: '/cities/milwaukee',
        permanent: true,
      },
      {
        source: '/blog/top-10-bestindoor-dog-park-in-san-antonio-texas',
        destination: '/cities/san-antonio',
        permanent: true,
      },
      {
        source: '/blog/top-7-best-indoor-dog-parks-and-daycares-in-aurora-co',
        destination: '/cities/aurora',
        permanent: true,
      },
      {
        source: '/blog/top-10-indoor-dog-parks-and-dog-daycares-in-fort-worth-texas',
        destination: '/cities/fort-worth',
        permanent: true,
      },
      {
        source: '/blog/7-best-indoor-dog-parks-in-minneapolis',
        destination: '/cities/minneapolis',
        permanent: true,
      },
      {
        source: '/blog/top-10-best-indoor-dog-parks-in-houston',
        destination: '/cities/houston',
        permanent: true,
      },
      {
        source: '/blog/8-best-indoor-dog-parks-in-las-vegas',
        destination: '/cities/las-vegas',
        permanent: true,
      },
      {
        source: '/blog/best-indoor-dog-parks-in-chicago',
        destination: '/cities/chicago',
        permanent: true,
      },
      {
        source: '/blog/10-best-indoor-dog-parks-and-daycares-in-oakland-ca',
        destination: '/cities/oakland',
        permanent: true,
      },
      {
        source: '/blog/top-10-best-indoor-dog-parks-in-dallas-texas',
        destination: '/cities/dallas',
        permanent: true,
      },
      {
        source: '/blog/top-10-best-indoor-dog-parks-in-raleigh-nc-play-hard-rain-or-shine',
        destination: '/cities/raleigh',
        permanent: true,
      },
      {
        source: '/blog/the-ultimate-guide-to-the-top-10-indoor-dog-parks-in-virginia-beach-va',
        destination: '/cities/virginia-beach',
        permanent: true,
      },
      {
        source: '/blog/top-5-best-indoor-dog-parks-in-memphis-your-ultimate-guide-for-year-round-play',
        destination: '/cities/memphis',
        permanent: true,
      },
      {
        source: '/blog/top-5-best-indoor-dog-parks-in-sacramento-beat-the-central-valley-heat',
        destination: '/cities/sacramento',
        permanent: true,
      },
      {
        source: '/blog/4-best-indoor-dog-parks-in-columbus-ohio',
        destination: '/cities/columbus',
        permanent: true,
      },
      {
        source: '/blog/top-5-best-indoor-dog-parks-in-brooklyn-complete-local-guide-pet-parents',
        destination: '/cities/brooklyn',
        permanent: true,
      },
      {
        source: '/blog/best-indoor-dog-parks-in-portland-oregon',
        destination: '/cities/portland',
        permanent: true,
      },
      {
        source: '/blog/top-5-best-indoor-dog-parks-in-seattle',
        destination: '/cities/seattle',
        permanent: true,
      },
      {
        source: '/blog/the-ultimate-guide-to-the-top-10-indoor-dog-parks-in-omaha-ne',
        destination: '/cities/omaha',
        permanent: true,
      },
      {
        source: '/blog/best-indoor-dog-parks-new-york-city',
        destination: '/cities/new-york',
        permanent: true,
      },
      {
        source: '/blog/top-6-best-indoor-dog-parks-and-daycares-in-wichita-ks',
        destination: '/cities/wichita',
        permanent: true,
      },
      {
        source: '/blog/the-ultimate-guide-to-the-top-10-indoor-dog-parks-in-brookhaven-ga',
        destination: '/cities/brookhaven',
        permanent: true,
      },
      {
        source: '/blog/top-5-best-indoor-dog-parks-in-boston',
        destination: '/cities/boston',
        permanent: true,
      },
      {
        source: '/blog/top-5-best-indoor-dog-parks-in-detroit',
        destination: '/cities/detroit',
        permanent: true,
      },
      {
        source: '/blog/top-8-best-indoor-dog-parks-in-kansas-city-your-all-weather-playbook',
        destination: '/cities/kansas-city',
        permanent: true,
      },
      {
        source: '/blog/best-indoor-dog-parks-in-phoenix-your-complete-guide',
        destination: '/cities/phoenix',
        permanent: true,
      },
      {
        source: '/blog/top-10-best-doggy-soft-play-areas-in-los-angeles',
        destination: '/cities/los-angeles',
        permanent: true,
      },
      {
        source: '/blog/top-10-best-indoor-dog-parks-in-charlotte-nc',
        destination: '/cities/charlotte',
        permanent: true,
      },
      {
        source: '/blog/top-5-best-indoor-dog-parks-in-indianapolis',
        destination: '/cities/indianapolis',
        permanent: true,
      },
      {
        source: '/blog/top-indoor-dog-parks-in-jacksonville-florida',
        destination: '/cities/jacksonville',
        permanent: true,
      },
      {
        source: '/blog/indoor-dog-parks-in-austin-tx-top-spots-for-your-pup',
        destination: '/cities/austin',
        permanent: true,
      },
      {
        source: '/blog/top-10-best-indoor-dog-parks-in-mesa-az',
        destination: '/cities/mesa',
        permanent: true,
      },
      {
        source: '/blog/top-5-best-indoor-dog-parks-in-washington-dc',
        destination: '/cities/washington-dc',
        permanent: true,
      },
      {
        source: '/blog/top-6-best-indoor-dog-parks-and-daycares-in-arlington-tx',
        destination: '/cities/arlington',
        permanent: true,
      },
      {
        source: '/blog/the-ultimate-guide-to-the-top-10-indoor-dog-parks-in-colorado-springs-co',
        destination: '/cities/colorado-springs',
        permanent: true,
      },
      {
        source: '/blog/top-5-best-indoor-dog-parks-in-el-paso',
        destination: '/cities/el-paso',
        permanent: true,
      },
      {
        source: '/blog/10-best-indoor-dog-parks-dog-bars-and-daycares-in-tampa-fl',
        destination: '/cities/tampa',
        permanent: true,
      },
      {
        source: '/blog/10-best-indoor-dog-parks-and-daycares-in-bakersfield-ca',
        destination: '/cities/bakersfield',
        permanent: true,
      },
      {
        source: '/blog/top-7-best-climate-controlled-dog-play-areas-in-albuquerque-nm',
        destination: '/cities/albuquerque',
        permanent: true,
      },
      {
        source: '/blog/top-10-best-indoor-dog-parks-in-miami-fl-beat-the-heat-and-humidity',
        destination: '/cities/miami',
        permanent: true,
      },
      {
        source: '/blog/the-ultimate-guide-to-the-top-10-best-indoor-dog-parks-in-long-beach-ca',
        destination: '/cities/long-beach',
        permanent: true,
      },
      {
        source: '/blog/top-10-best-indoor-dog-parks-in-san-diego-california',
        destination: '/cities/san-diego',
        permanent: true,
      },
      {
        source: '/blog/top-5-best-indoor-dog-parks-in-henderson-nevada-a-complete-guide',
        destination: '/cities/henderson',
        permanent: true,
      },
      {
        source: '/blog/9-best-indoor-dog-parks-in-tulsa-where-to-play-rain-or-shine',
        destination: '/cities/tulsa',
        permanent: true,
      },
      {
        source: '/blog/top-8-best-indoor-dog-parks-in-tucson-a-local-s-guide-to-beating-the-heat',
        destination: '/cities/tucson',
        permanent: true,
      },
      {
        source: '/blog/best-indoor-dog-parks-in-long-island',
        destination: '/cities/long-island',
        permanent: true,
      },
      {
        source: '/blog/top-8-best-indoor-dog-parks-in-atlanta-surviving-the-georgia-heat-and-rain',
        destination: '/cities/atlanta',
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
      // Legacy health/safety post → live blog post
      {
        source: '/blog/dog-throwing-up-white-foam',
        destination: '/blog/why-is-my-dog-throwing-up-white-foam-causes-facts-and-when-to-call-the-vet',
        permanent: true,
      },
      // Legacy San Jose blog post → live blog post
      {
        source: '/blog/top-10-indoor-dog-parks-san-jose',
        destination: '/blog/top-10-best-indoor-dog-parks-in-san-jose-and-indoor-friendly-play-areas',
        permanent: true,
      },
      // Typo URL /hour → /how-it-works
      {
        source: '/hour',
        destination: '/how-it-works',
        permanent: true,
      },
      // Legacy author URL → /about
      {
        source: '/blog/author/indoor-dog-park-directory-team',
        destination: '/about',
        permanent: true,
      },
      // Malformed legacy city slugs from old scraped address data
      {
        source: '/cities/nj-08550-nj',
        destination: '/cities/west-windsor-nj',
        permanent: true,
      },
      {
        source: '/cities/weehawken-township-nj',
        destination: '/cities/weehawken-nj',
        permanent: true,
      },
      {
        source: '/cities/105-california-ave-nj',
        destination: '/cities/middletown-nj',
        permanent: true,
      },
      // Batch 3 GSC 404 fixes
      {
        source: '/cities/llc-nj',
        destination: '/cities',
        permanent: true,
      },
      {
        source: '/cities/ewing-township-nj',
        destination: '/cities/ewing-nj',
        permanent: true,
      },
      {
        source: '/parks/canine-ph-d-dog-training-inc-decatur',
        destination: '/dog-training',
        permanent: true,
      },
      {
        source: '/attractions',
        destination: '/parks',
        permanent: true,
      },
      {
        source: '/students',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/vets',
        destination: '/guides/first-aid',
        permanent: true,
      },
      {
        source: '/$',
        destination: '/',
        permanent: true,
      },
      {
        source: '/cities/nj-07071',
        destination: '/cities/lyndhurst-nj',
        permanent: true,
      },
      {
        source: '/cities/nj-08628-nj',
        destination: '/cities/ewing-nj',
        permanent: true,
      },
      // Batch 4 GSC 404 fixes
      {
        source: '/trails',
        destination: '/off-leash-dog-park',
        permanent: true,
      },
      {
        source: '/services',
        destination: '/owner-resources',
        permanent: true,
      },
      {
        source: '/rules',
        destination: '/guides/etiquette-checklist',
        permanent: true,
      },
      {
        source: '/cities/387-rifle-camp-rd-nj',
        destination: '/cities/woodland-park-nj',
        permanent: true,
      },
      {
        source: '/cities/nj-07095',
        destination: '/cities/woodbridge-nj',
        permanent: true,
      },
      {
        source: '/parks/priority-pdx-pearl-pack',
        destination: '/cities/portland-or',
        permanent: true,
      },
      {
        source: '/cities/hamilton-ml3-6qr-nj',
        destination: '/cities/hamilton-nj',
        permanent: true,
      },
      {
        source: '/lakenorman',
        destination: '/states/north-carolina',
        permanent: true,
      },
      {
        source: '/cities/west-windsor-township-nj',
        destination: '/cities/west-windsor-nj',
        permanent: true,
      },
      {
        source: '/cities/40-main-st-nj',
        destination: '/cities',
        permanent: true,
      },
      // Batch 5 GSC 404 fixes
      {
        source: '/history',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/cities/557-englishtown-rd',
        destination: '/cities/monroe-township-nj',
        permanent: true,
      },
      {
        source: '/cities/nj-07733-nj',
        destination: '/cities/holmdel-nj',
        permanent: true,
      },
      {
        source: '/community',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/locations',
        destination: '/cities',
        permanent: true,
      },
      {
        source: '/regulations',
        destination: '/guides/etiquette-checklist',
        permanent: true,
      },
      {
        source: '/directory',
        destination: '/parks',
        permanent: true,
      },
      {
        source: '/cities/5137-69th-st',
        destination: '/cities',
        permanent: true,
      },
      {
        source: '/cities/nj-07002-nj',
        destination: '/cities/bayonne-nj',
        permanent: true,
      },
      {
        source: '/cities/nj-08701',
        destination: '/cities/lakewood-nj',
        permanent: true,
      },
      // Short blog slug → full live slug
      {
        source: '/blog/are-indoor-dog-parks-safe',
        destination: '/blog/are-indoor-dog-parks-safe-a-veterinarian-backed-health-and-safety-guide',
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

const path = require('path');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

let supabaseHostname;
try {
  if (SUPABASE_URL) {
    const parsed = new URL(SUPABASE_URL);
    supabaseHostname = parsed.hostname;
  }
} catch (error) {
  console.warn('[next.config.js] Failed to parse NEXT_PUBLIC_SUPABASE_URL:', error);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
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
      ...(supabaseHostname
        ? [
            {
              protocol: 'https',
              hostname: supabaseHostname,
              pathname: '/storage/v1/object/public/**',
            },
          ]
        : []),
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
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
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
  // Rewrites for sitemap API routes (map .xml URLs to API routes)
  async rewrites() {
    return [
      {
        source: '/sitemap-static.xml',
        destination: '/api/sitemap/static',
      },
      {
        source: '/sitemap-parks.xml',
        destination: '/api/sitemap/parks',
      },
      {
        source: '/sitemap-cities.xml',
        destination: '/api/sitemap/cities',
      },
      {
        source: '/sitemap-blog.xml',
        destination: '/api/sitemap/blog',
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
      // Consolidate privacy policy URLs - redirect /privacy-policy to /privacy
      {
        source: '/privacy-policy',
        destination: '/privacy',
        permanent: true,
      },
      // Note: Removed old blog category/tag redirects to avoid sitemap conflicts
  // Search engines should discover the new URLs naturally
      // Redirect old park slugs to new city-inclusive slugs
      {
        source: '/parks/oneida-run',
        destination: '/parks/oneida-run-bronx',
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
      // Add more redirects as needed for old URLs or common misspellings
    ];
  },
  // Trailing slash configuration for consistent URLs
  trailingSlash: false,
  // Compression
  compress: true,
  // Enable SWC minification for better performance
  swcMinify: true,
  // Power by header
  poweredByHeader: false,
  // Optimize production builds
  productionBrowserSourceMaps: false,
  // Optimize bundle size
  experimental: {
    // CSS optimization - requires 'critters' package (now installed)
    optimizeCss: true,
    optimizePackageImports: ['@heroicons/react', 'date-fns', 'leaflet', 'react-leaflet'],
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
    
    // Fix Supabase Edge Runtime warnings by providing polyfills for Node.js APIs
    // These are used by @supabase/supabase-js and @supabase/realtime-js but aren't
    // actually required for Edge Runtime functionality
    config.plugins = config.plugins || [];
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.version': JSON.stringify(process.version || 'v18.0.0'),
        'process.versions': JSON.stringify(process.versions || {}),
      })
    );
    
    return config;
  },
};

module.exports = nextConfig;

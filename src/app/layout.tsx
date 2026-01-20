import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { FavoritesProvider } from '@/contexts/FavoritesContext'
import { LazyStyles } from '@/components/LazyStyles'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import CoreWebVitals from '@/components/CoreWebVitals'
import ErrorBoundary from '@/components/ErrorBoundary'

const inter = Inter({
  subsets: ['latin'],
  display: 'optional', // Use optional for better performance - prevents layout shift by using fallback if font not ready
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'arial', 'sans-serif'],
  variable: '--font-inter',
  adjustFontFallback: true, // Automatically adjusts line-height to match fallback font
  // Optimize font loading - reduce layout shift
  weight: ['400', '500', '600', '700'], // Only load weights we actually use
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indoordogpark.org'),
  title: {
    default: 'Best Indoor Dog Parks in California | Indoor Dog Park',
    template: '%s | Indoor Dog Park'
  },
  description:
    'Find year-round indoor dog parks across California. Search by city, neighborhood, or zip to discover safe, climate-controlled play spaces for your dog.',
  applicationName: 'Indoor Dog Park',
  keywords: [
    'indoor dog park',
    'dog play area',
    'dog recreation',
    'indoor dog facility',
    'dog daycare',
    'dog training',
    'dog boarding',
    'pet services',
    'canine activities',
    'off-leash dog areas',
    'California dog parks',
    'dog-friendly spaces'
  ],
  authors: [{ name: 'Indoor Dog Park Team', url: 'https://www.indoordogpark.org' }],
  creator: 'Indoor Dog Park',
  publisher: 'Indoor Dog Park',
  category: 'Pet Services',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.indoordogpark.org',
    title: 'Best Indoor Dog Parks in California | Indoor Dog Park',
    description:
      'Find year-round indoor dog parks across California. Search by city, neighborhood, or zip to discover safe, climate-controlled play spaces for your dog.',
    siteName: 'Indoor Dog Park',
    images: [
      {
        url: '/images/hero/hero.webp',
        width: 1200,
        height: 630,
        alt: 'Indoor Dog Park - Find Indoor Dog Parks & Play Areas',
        type: 'image/webp',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Indoor Dog Parks in California | Indoor Dog Park',
    description:
      'Find year-round indoor dog parks across California. Search by city, neighborhood, or zip to discover safe, climate-controlled play spaces for your dog.',
    images: ['/images/hero/hero.webp'],
    site: '@indoordogpark',
    creator: '@indoordogpark',
  },
  alternates: {
    canonical: 'https://www.indoordogpark.org',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    // Add verification codes through environment variables:
    // NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    // NEXT_PUBLIC_YANDEX_VERIFICATION
    // NEXT_PUBLIC_BING_VERIFICATION
  },
  icons: {
    icon: [
      { url: '/favicon.ico.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  other: {
    'theme-color': '#7c3aed',
    'msapplication-TileColor': '#7c3aed',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Indoor Dog Park',
    'mobile-web-app-capable': 'yes',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Structured data for Organization
  // Social media links can be configured via environment variables:
  // NEXT_PUBLIC_SOCIAL_FACEBOOK, NEXT_PUBLIC_SOCIAL_TWITTER, NEXT_PUBLIC_SOCIAL_INSTAGRAM, etc.
  const socialMediaLinks = [
    process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK,
    process.env.NEXT_PUBLIC_SOCIAL_TWITTER,
    process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM,
    process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN,
    process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE,
  ].filter((url): url is string => Boolean(url) && typeof url === 'string')

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Indoor Dog Park',
    url: 'https://www.indoordogpark.org',
    logo: 'https://www.indoordogpark.org/images/logo/logo-512.png',
    description: 'California\'s premier directory for indoor dog parks, play areas, and dog-friendly facilities.',
    ...(socialMediaLinks.length > 0 && { sameAs: socialMediaLinks }),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: 'en',
    },
  }

  // Structured data for WebSite
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Indoor Dog Park',
    url: 'https://www.indoordogpark.org',
    description: 'Find the best indoor dog parks and facilities across California',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.indoordogpark.org/?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <html lang="en">
      <head>
        {/* Grow by Mediavine - Top placement for verification reliability */}
        <script
          data-grow-initializer=""
          dangerouslySetInnerHTML={{
            __html: `!(function(){window.growMe||((window.growMe=function(e){window.growMe._.push(e);}),(window.growMe._=[]));var e=document.createElement("script");(e.type="text/javascript"),(e.src="https://faves.grow.me/main.js"),(e.defer=!0),e.setAttribute("data-grow-faves-site-id","U2l0ZTo2NWU3MDY3YS0wNzI0LTQ0NjktYTZmYS1iYzU0YWYzNWYzOTg=");var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t);})();`,
          }}
        />

        {/* Preconnect to most critical domains only (limit to 4 to avoid warnings) */}
        {/* Google Fonts - highest priority for font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Images - critical for LCP */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        {/* CDN for Bootstrap Icons - loaded lazily but preconnect for faster load */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        {/* DNS prefetch for less critical resources */}
        <link rel="dns-prefetch" href="https://unpkg.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* Preload critical resources for faster initial render */}
        {/* Logo is used in header and search layout - preload for better LCP */}
        <link rel="preload" href="/images/logo/logo.png" as="image" type="image/png" />

        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/icons/icon-192x192.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#7c3aed" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />

        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8688786543603411"
          crossOrigin="anonymous"
        />

      </head>
      <body className={inter.className}>
        <ErrorBoundary level="page">
          <GoogleAnalytics />
          <CoreWebVitals />
          <LazyStyles />
          <AuthProvider>
            <FavoritesProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </FavoritesProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { ToastProvider } from '@/contexts/ToastContext'
import { LazyStyles } from '@/components/LazyStyles'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import CoreWebVitals from '@/components/CoreWebVitals'
import ErrorBoundary from '@/components/ErrorBoundary'
import CookieBanner from '@/components/CookieBanner'
// import NewsletterPopup from '@/components/NewsletterPopup'
import AdSense from '@/components/AdSense'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/next'

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
    default: 'Indoor Dog Parks Near You | Find the Best Indoor Dog Parks',
    template: '%s | Indoor Dog Park'
  },
  description:
    'Find year-round indoor dog parks across the United States. Search by city, state, or zip to discover safe, climate-controlled play spaces for your dog.',
  applicationName: 'Indoor Dog Park',
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
    title: 'Indoor Dog Parks Near You | Find the Best Indoor Dog Parks',
    description:
      'Find year-round indoor dog parks across the United States. Search by city, state, or zip to discover safe, climate-controlled play spaces for your dog.',
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
    title: 'Indoor Dog Parks Near You | Find the Best Indoor Dog Parks',
    description:
      'Find year-round indoor dog parks across the United States. Search by city, state, or zip to discover safe, climate-controlled play spaces for your dog.',
    images: ['/images/hero/hero.webp'],
    site: '@indoordogpark',
    creator: '@indoordogpark',
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
      { url: '/favicon.svg', type: 'image/svg+xml' },
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
  // Social media links can be configured via environment variables, falling back to default profiles
  const socialMediaLinks = [
    process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || 'https://facebook.com/indoordogpark',
    process.env.NEXT_PUBLIC_SOCIAL_TWITTER || 'https://twitter.com/indoordogpark',
    process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || 'https://instagram.com/indoordogpark',
    process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || 'https://linkedin.com/company/indoor-dog-park',
    process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE || 'https://youtube.com/@indoordogpark',
  ].filter((url): url is string => Boolean(url) && typeof url === 'string')

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Indoor Dog Park',
    url: 'https://www.indoordogpark.org',
    logo: 'https://www.indoordogpark.org/images/logo/logo-512.png',
    description: 'The premier US directory for indoor dog parks, play areas, and dog-friendly facilities.',
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
    description: 'Find the best indoor dog parks and facilities across the United States',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.indoordogpark.org/?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>

        <meta name="p:domain_verify" content="0563fd1fc3dbf5ddf80e6b177ae94816" />

        {/* Google AdSense - safely loaded dynamic script to prevent Next.js hydration exceptions */}
        <AdSense />

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
        {/* Hero image is the Largest Contentful Paint (LCP) element - preload is critical */}
        <link rel="preload" href="/images/hero/hero.webp" as="image" type="image/webp" fetchPriority="high" />

        <link rel="manifest" href="/manifest.json" />

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


      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ErrorBoundary level="page">
          <GoogleAnalytics />
          <CoreWebVitals />
          <Analytics />
          <SpeedInsights />
          <LazyStyles />
          {/* <NewsletterPopup /> */}
          <ToastProvider>
            {children}
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
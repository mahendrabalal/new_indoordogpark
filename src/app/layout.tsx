import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { FavoritesProvider } from '@/contexts/FavoritesContext'
import { LazyStyles } from '@/components/LazyStyles'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import CoreWebVitals from '@/components/CoreWebVitals'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  variable: '--font-inter',
  adjustFontFallback: true,
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
        {/* Preconnect to external domains for faster resource loading */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://unpkg.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://unpkg.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        
        {/* Preload critical hero image */}
        <link rel="preload" href="/images/hero/hero.webp" as="image" type="image/webp" />
        
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/icons/icon-192x192.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#7c3aed" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body className={inter.className}>
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
      </body>
    </html>
  )
}
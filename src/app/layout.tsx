import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

const sitePublishedTime =
  process.env.NEXT_PUBLIC_SITE_PUBLISHED_AT || '2024-01-15T00:00:00.000Z'
const siteModifiedTime =
  process.env.NEXT_PUBLIC_SITE_MODIFIED_AT || '2025-11-15T00:00:00.000Z'

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
    type: 'article',
    locale: 'en_US',
    url: 'https://www.indoordogpark.org',
    title: 'Best Indoor Dog Parks in California | Indoor Dog Park',
    description:
      'Find year-round indoor dog parks across California. Search by city, neighborhood, or zip to discover safe, climate-controlled play spaces for your dog.',
    siteName: 'Indoor Dog Park',
    publishedTime: sitePublishedTime,
    modifiedTime: siteModifiedTime,
    images: [
      {
        url: '/images/hero/hero.png',
        width: 1200,
        height: 630,
        alt: 'Indoor Dog Park - Find Indoor Dog Parks & Play Areas',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Indoor Dog Parks in California | Indoor Dog Park',
    description:
      'Find year-round indoor dog parks across California. Search by city, neighborhood, or zip to discover safe, climate-controlled play spaces for your dog.',
    images: ['/images/hero/hero.png'],
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
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Indoor Dog Park',
    url: 'https://www.indoordogpark.org',
    logo: 'https://www.indoordogpark.org/images/logo/logo-512.png',
    description: 'California\'s premier directory for indoor dog parks, play areas, and dog-friendly facilities.',
    sameAs: [
      // Add your social media profiles here
      // 'https://www.facebook.com/indoordogpark',
      // 'https://twitter.com/indoordogpark',
      // 'https://www.instagram.com/indoordogpark',
    ],
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
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
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
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
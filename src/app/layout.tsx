import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Indoor Dog Park - Find Indoor Dog Parks & Play Areas',
    template: '%s | Indoor Dog Park'
  },
  description: 'Find the best indoor dog parks, play areas, and facilities near you. Search by location, amenities, and services. Your trusted directory for indoor dog recreation across the United States.',
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
    'off-leash dog areas'
  ],
  authors: [{ name: 'Indoor Dog Park Team' }],
  creator: 'Indoor Dog Park',
  publisher: 'Indoor Dog Park',
  robots: {
    index: true,
    follow: true,
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
    title: 'Indoor Dog Park - Find Indoor Dog Parks & Play Areas',
    description: 'Find the best indoor dog parks, play areas, and facilities near you. Search by location, amenities, and services.',
    siteName: 'Indoor Dog Park',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Indoor Dog Park - Find Indoor Dog Parks & Play Areas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Indoor Dog Park - Find Indoor Dog Parks & Play Areas',
    description: 'Find the best indoor dog parks, play areas, and facilities near you. Search by location, amenities, and services.',
    images: ['/images/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://www.indoordogpark.org',
  },
  other: {
    'theme-color': '#7c3aed',
    'msapplication-TileColor': '#7c3aed',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
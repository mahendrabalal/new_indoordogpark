/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Only allow local images and essential third-party domains
    domains: [
      'images.unsplash.com',
      'lh3.googleusercontent.com',
      'cdnjs.cloudflare.com',
      'via.placeholder.com', // Added for blog mock images
      'secure.gravatar.com', // Added for WordPress author avatars
      // Removed 'places.googleapis.com' - now serving images locally
    ],
    formats: ['image/avif', 'image/webp'],
    // Optimize image loading
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache optimized images
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },
}

module.exports = nextConfig

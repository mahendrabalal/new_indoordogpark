import { SITE_URL } from './metadata'
import { DogPark } from '@/types/dog-park'
import { getAllStaticParks, mapSubmissionToDogPark, type SubmissionRow } from './parks-data'
import { getParkUrl } from './routing'
import { escapeXML } from './sitemap-utils'

/**
 * Generates an Image Sitemap XML based on Google's guidelines.
 */
export function generateImageSitemapXML(parks: Array<{ url: string; images: string[]; title: string }>): string {
  const urls = parks
    .filter(park => park.images.length > 0)
    .map(park => {
      const imageTags = park.images
        .map(img => `    <image:image>\n      <image:loc>${escapeXML(img)}</image:loc>\n      <image:title>${escapeXML(park.title)}</image:title>\n    </image:image>`)
        .join('\n')

      return `  <url>\n    <loc>${escapeXML(park.url)}</loc>\n${imageTags}\n  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`
}

/**
 * Normalizes an image URL to an absolute URL.
 * Per Google's Image Sitemap spec, <image:loc> MUST be a fully qualified absolute URL.
 * - Relative paths (e.g. "/images/parks/...") are prefixed with SITE_URL.
 * - Already-absolute URLs (http:// or https://) pass through unchanged.
 * - Empty/invalid URLs are returned as-is (filtered out downstream).
 */
function toAbsoluteImageUrl(url: string): string {
  if (!url) return url
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  // Relative path — prepend site origin
  return `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`
}

export async function getParksImageSitemapData() {
  const baseUrl = SITE_URL
  const parkData: Array<{ url: string; images: string[]; title: string }> = []

  try {
    let allParks: DogPark[] = []
    
    try {
      allParks = await getAllStaticParks()
    } catch (e) {
      console.error(e)
    }



    const seenUrls = new Set<string>()

    for (const park of allParks) {
      const slug = park.slug || park.id
      if (!slug) continue
      
      const parkUrl = `${baseUrl}${getParkUrl(park)}`
      if (seenUrls.has(parkUrl)) continue
      seenUrls.add(parkUrl)
      
      const images: string[] = []
      if (park.photo) images.push(toAbsoluteImageUrl(park.photo))
      if (park.photos && park.photos.length > 0) {
        park.photos.forEach(p => {
          const absoluteUrl = toAbsoluteImageUrl(p.url)
          if (!images.includes(absoluteUrl)) images.push(absoluteUrl)
        })
      }

      if (images.length > 0) {
        parkData.push({
          url: parkUrl,
          images,
          title: park.name,
        })
      }
    }
  } catch (error) {
    console.error('[sitemap-images] Error building image sitemap entries:', error)
  }

  return parkData
}

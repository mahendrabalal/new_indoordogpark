import { NextResponse } from 'next/server';
import { getAllStaticParks } from '@/lib/parks-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indoordogpark.org';
  const parks = await getAllStaticParks();

  // Generate XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ';
  xml += 'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';

  // Add parks with images
  for (const park of parks) {
    const images: { url: string; title?: string; caption?: string }[] = [];

    // Main photo
    if (park.photo) {
      images.push({
        url: park.photo,
        title: park.name,
        caption: `Photo of ${park.name} in ${park.city}, ${park.state}`
      });
    }

    // Additional photos
    if (park.photos && park.photos.length > 0) {
      park.photos.forEach(photo => {
        // Don't duplicate main photo
        if (photo.url !== park.photo) {
          images.push({
            url: photo.url,
            title: park.name,
            caption: `Additional photo of ${park.name}`
          });
        }
      });
    }

    // Only add URL entry if there are images
    if (images.length > 0) {
      const parkUrl = `${baseUrl}/parks/${park.slug || park.id}`;
      
      xml += '  <url>\n';
      xml += `    <loc>${parkUrl}</loc>\n`;
      
      images.forEach(img => {
        // Ensure image URL is absolute
        const absoluteImgUrl = img.url.startsWith('http') 
          ? img.url 
          : `${baseUrl}${img.url.startsWith('/') ? '' : '/'}${img.url}`;
          
        xml += '    <image:image>\n';
        xml += `      <image:loc>${escapeXml(absoluteImgUrl)}</image:loc>\n`;
        if (img.title) xml += `      <image:title>${escapeXml(img.title)}</image:title>\n`;
        if (img.caption) xml += `      <image:caption>${escapeXml(img.caption)}</image:caption>\n`;
        xml += '    </image:image>\n';
      });
      
      xml += '  </url>\n';
    }
  }

  xml += '</urlset>';

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate',
    },
  });
}

function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

import { ImageResponse } from 'next/og'
import { getParkBySlug } from '@/lib/parks-data'
import { getStateName } from '@/lib/state'

export const alt = 'Indoor Dog Park'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const park = await getParkBySlug(slug)

  if (!park) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: 'white',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Indoor Dog Park
        </div>
      ),
      { ...size }
    )
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #4f46e5, #7c3aed)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: 80,
          color: 'white',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '8px 24px',
              borderRadius: 40,
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
            }}
          >
            IndoorDogPark.org
          </div>
        </div>
        
        <h1
          style={{
            fontSize: 72,
            fontWeight: 800,
            margin: '0 0 24px 0',
            lineHeight: 1.1,
            textShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          {park.name}
        </h1>
        
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 36,
            fontWeight: 500,
            opacity: 0.9,
          }}
        >
          <span>📍 {park.city}, {getStateName(park.state)}</span>
          {park.rating > 0 && (
            <span style={{ marginLeft: 40, display: 'flex', alignItems: 'center' }}>
              ⭐ {park.rating.toFixed(1)} 
              <span style={{ fontSize: 24, opacity: 0.8, marginLeft: 12 }}>
                ({park.reviewCount} reviews)
              </span>
            </span>
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

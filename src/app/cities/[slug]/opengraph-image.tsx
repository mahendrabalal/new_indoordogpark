import { ImageResponse } from 'next/og'
import { getCityContentBySlug } from '@/lib/parks-data'
import { getStateName } from '@/lib/state'

export const alt = 'Indoor Dog Parks'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const content = await getCityContentBySlug(slug)

  if (!content) {
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
          Indoor Dog Parks
        </div>
      ),
      { ...size }
    )
  }

  const { city, stats } = content

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #f43f5e, #e11d48)',
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
            fontSize: 64,
            fontWeight: 800,
            margin: '0 0 24px 0',
            lineHeight: 1.1,
            textShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          Top {stats.totalParks > 0 ? stats.totalParks : ''} Indoor Dog Parks in {city.name}, {getStateName(city.state)}
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
          <span>Find the best climate-controlled play areas for your dog.</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

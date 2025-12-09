import { NextResponse } from 'next/server'
import { getCachedTags } from '@/lib/sanity-api'

export const revalidate = 3600
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const tags = await getCachedTags()

    return NextResponse.json({
      success: true,
      data: tags,
      count: tags.length
    })
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch tags',
        data: [],
        count: 0
      },
      { status: 500 }
    )
  }
}
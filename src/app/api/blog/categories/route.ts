import { NextResponse } from 'next/server'
import { getCachedCategories } from '@/lib/sanity-api'

export const revalidate = 3600

export async function GET() {
  try {
    const categories = await getCachedCategories()

    return NextResponse.json(
      {
        success: true,
        data: categories,
        count: categories.length
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch categories',
        data: [],
        count: 0
      },
      { status: 500 }
    )
  }
}
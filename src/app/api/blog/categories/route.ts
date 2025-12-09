import { NextResponse } from 'next/server'
import { getCachedCategories } from '@/lib/sanity-api'

export const revalidate = 3600
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const categories = await getCachedCategories()

    return NextResponse.json({
      success: true,
      data: categories,
      count: categories.length
    })
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
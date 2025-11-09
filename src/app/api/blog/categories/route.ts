import { NextResponse } from 'next/server';
import { fetchCategories } from '@/lib/wordpress-api';

// GET /api/blog/categories - Fetch all blog categories
export async function GET() {
  try {
    const categories = await fetchCategories();

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Blog categories API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch blog categories',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
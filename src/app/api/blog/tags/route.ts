import { NextResponse } from 'next/server';
import { fetchTags } from '@/lib/wordpress-api';

// GET /api/blog/tags - Fetch all blog tags
export async function GET() {
  try {
    const tags = await fetchTags();

    return NextResponse.json({
      success: true,
      data: tags,
    });
  } catch (error) {
    console.error('Blog tags API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch blog tags',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
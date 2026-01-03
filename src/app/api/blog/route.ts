import { NextResponse } from 'next/server';
import { getCachedPosts } from '@/lib/sanity-api';
import { BlogSearchParams } from '@/types/wordpress';

export const revalidate = 300; // Revalidate every 5 minutes
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const blogParams: BlogSearchParams = {
      page: parseInt(searchParams.get('page') || '1'),
      perPage: parseInt(searchParams.get('perPage') || '12'),
    };

    // Handle search parameter
    const search = searchParams.get('search');
    if (search) {
      blogParams.search = search;
    }

    // Handle category filter
    const category = searchParams.get('category');
    if (category) {
      blogParams.category = category;
    }

    // Handle tag filter
    const tag = searchParams.get('tag');
    if (tag) {
      // Decode URL-encoded tag slugs
      blogParams.tag = decodeURIComponent(tag);
    }

    const blogData = await getCachedPosts(blogParams);

    return NextResponse.json({
      success: true,
      data: blogData.posts || [],
      pagination: {
        total: blogData.total || 0,
        totalPages: blogData.totalPages || 0,
        currentPage: blogData.page || 1,
        perPage: blogData.perPage || 12,
      },
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch blog posts',
        data: [],
        pagination: {
          total: 0,
          totalPages: 0,
          currentPage: 1,
          perPage: 12,
        },
      },
      { status: 500 }
    );
  }
}


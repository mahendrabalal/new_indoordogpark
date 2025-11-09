import { NextRequest, NextResponse } from 'next/server';
import { fetchPosts, searchPosts, getPostsByCategory, getPostsByTag } from '@/lib/wordpress-api';
import { applyRateLimit } from '@/lib/rate-limiter';
import BlogAnalytics from '@/lib/blog-analytics';

// GET /api/blog - Fetch blog posts with optional filtering
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    const { searchParams } = new URL(request.url);

    // Apply rate limiting
    const rateLimitResult = await applyRateLimit(
      request,
      searchParams.get('search') ? 'blogSearch' : 'blogPosts'
    );

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: rateLimitResult.error?.message || 'Rate limit exceeded',
        },
        {
          status: 429,
          headers: rateLimitResult.headers,
        }
      );
    }

    // Extract query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '10');
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    const tag = searchParams.get('tag') || undefined;
    const orderBy = (searchParams.get('orderBy') as 'date' | 'title' | 'modified') || 'date';
    const order = (searchParams.get('order') as 'asc' | 'desc') || 'desc';

    let response;

    // Route to appropriate fetching function based on parameters
    if (search) {
      response = await searchPosts(search, page, perPage);
    } else if (category) {
      response = await getPostsByCategory(category, page, perPage);
    } else if (tag) {
      response = await getPostsByTag(tag, page, perPage);
    } else {
      response = await fetchPosts({
        page,
        perPage,
        search,
        category,
        tag,
        orderBy,
        order,
        status: 'publish',
      });
    }

    // Track performance and analytics
    const responseTime = Date.now() - startTime;
    const analytics = BlogAnalytics.getInstance();
    analytics.trackApiCall('blog_posts', responseTime, true);

    return NextResponse.json({
      success: true,
      data: response.posts,
      pagination: response.pagination,
    }, {
      headers: rateLimitResult.headers,
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    const analytics = BlogAnalytics.getInstance();
    analytics.trackApiCall('blog_posts', responseTime, false, error as Error);

    console.error('Blog API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch blog posts',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
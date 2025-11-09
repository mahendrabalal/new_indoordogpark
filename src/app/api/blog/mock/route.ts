import { NextResponse } from 'next/server';
import { mockBlogPosts, mockCategories, mockTags } from '@/lib/mock-blog-data';

// GET /api/blog/mock - Fetch mock blog data for testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Extract query parameters
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = parseInt(searchParams.get('perPage') || '10');
  const search = searchParams.get('search') || undefined;
  const category = searchParams.get('category') || undefined;
  const tag = searchParams.get('tag') || undefined;
  const orderBy = (searchParams.get('orderBy') as 'date' | 'title' | 'modified') || 'date';
  const order = (searchParams.get('order') as 'asc' | 'desc') || 'desc';

  let posts = [...mockBlogPosts];

  // Apply search filter
  if (search) {
    posts = posts.filter(post =>
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.content.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Apply category filter
  if (category) {
    posts = posts.filter(post =>
      post.categories.some(cat => cat.slug === category)
    );
  }

  // Apply tag filter
  if (tag) {
    posts = posts.filter(post =>
      post.tags.some(tag => tag.slug === tag)
    );
  }

  // Apply sorting
  posts.sort((a, b) => {
    const aValue = orderBy === 'date' ? new Date(a.date).getTime() : orderBy === 'modified' ? new Date(a.modified).getTime() : a.title.toLowerCase();
    const bValue = orderBy === 'date' ? new Date(b.date).getTime() : orderBy === 'modified' ? new Date(b.modified).getTime() : b.title.toLowerCase();

    return order === 'desc' ? bValue - aValue : aValue - bValue;
  });

  // Apply pagination
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedPosts = posts.slice(startIndex, endIndex);

  const pagination = {
    total: posts.length,
    totalPages: Math.ceil(posts.length / perPage),
    currentPage: page,
    perPage,
  };

  return NextResponse.json({
    success: true,
    data: paginatedPosts,
    pagination,
    isMock: true, // Flag to indicate this is mock data
  });
}
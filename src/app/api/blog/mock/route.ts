import { NextResponse, NextRequest } from 'next/server';
import { mockBlogPosts } from '@/lib/mock-blog-data';

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
      post.tags.some(postTag => postTag.slug === tag)
    );
  }

  // Apply sorting
  posts.sort((a, b) => {
    let aValue: number | string;
    let bValue: number | string;

    if (orderBy === 'date') {
      aValue = new Date(a.date).getTime();
      bValue = new Date(b.date).getTime();
    } else if (orderBy === 'modified') {
      aValue = new Date(a.modified).getTime();
      bValue = new Date(b.modified).getTime();
    } else {
      aValue = a.title.toLowerCase();
      bValue = b.title.toLowerCase();
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return order === 'desc' ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
    } else {
      return order === 'desc' ? (bValue as number) - (aValue as number) : (aValue as number) - (bValue as number);
    }
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
import { NextResponse } from 'next/server';
import { mockTags } from '@/lib/mock-blog-data';

// GET /api/blog/mock/tags - Fetch mock tags
export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockTags,
    isMock: true,
  });
}
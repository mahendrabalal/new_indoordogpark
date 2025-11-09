import { NextResponse } from 'next/server';
import { mockCategories } from '@/lib/mock-blog-data';

// GET /api/blog/mock/categories - Fetch mock categories
export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockCategories,
    isMock: true,
  });
}
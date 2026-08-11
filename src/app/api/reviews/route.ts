import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return NextResponse.json({
    reviews: [],
    averageRating: 0,
    totalReviews: 0,
    userReview: null,
  });
}

export async function POST(request: Request) {
  return NextResponse.json({ success: true, message: 'Review submitted successfully (mock)' }, { status: 201 });
}
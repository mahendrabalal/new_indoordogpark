import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { DogPark } from '@/types/dog-park';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '20', 10));

    const filePath = join(process.cwd(), 'public/data/california.json');
    const fileContent = await readFile(filePath, 'utf-8');
    const allParks: DogPark[] = JSON.parse(fileContent);

    const startIdx = (page - 1) * limit;
    const endIdx = startIdx + limit;
    const parks = allParks.slice(startIdx, endIdx);
    const totalParks = allParks.length;
    const totalPages = Math.ceil(totalParks / limit);

    return NextResponse.json(
      {
        data: parks,
        pagination: {
          page,
          limit,
          totalParks,
          totalPages,
          hasMore: page < totalPages
        }
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
        }
      }
    );
  } catch (error) {
    console.error('Error fetching parks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch parks data' },
      { status: 500 }
    );
  }
}
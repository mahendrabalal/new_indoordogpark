import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { DogPark } from '@/types/dog-park';

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'public/data/california.json');
    const fileContent = await readFile(filePath, 'utf-8');
    const parks: DogPark[] = JSON.parse(fileContent);

    return NextResponse.json(parks, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    console.error('Error fetching parks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch parks data' },
      { status: 500 }
    );
  }
}
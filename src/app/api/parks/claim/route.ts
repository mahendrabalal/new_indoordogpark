import { NextRequest, NextResponse } from 'next/server';
import { getAllStaticParks } from '@/lib/parks-data';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Park ID is required' }, { status: 400 });
    }

    const staticParks = await getAllStaticParks();
    const park = staticParks.find((p) => p.id === id);

    if (!park) {
      return NextResponse.json({ error: 'Park not found' }, { status: 404 });
    }

    return NextResponse.json({ park });
  } catch (error) {
    console.error('[API] Error fetching park for claim:', error);
    return NextResponse.json({ error: 'Failed to fetch park' }, { status: 500 });
  }
}

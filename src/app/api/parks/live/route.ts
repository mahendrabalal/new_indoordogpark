import { NextResponse } from 'next/server';
import { DogPark } from '@/types/dog-park';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids');
    
    if (!ids) {
      return NextResponse.json(
        { error: 'Missing park IDs parameter' },
        { status: 400 }
      );
    }

    // Parse the comma-separated IDs
    const parkIds = ids.split(',').map(id => id.trim());
    
    // Fetch all parks data relative to the incoming request origin
    const requestUrl = new URL(request.url);
    const dataUrl = new URL('/data/california.json', requestUrl.origin);
    const response = await fetch(dataUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch parks data');
    }
    
    const allParks: DogPark[] = await response.json();
    
    // Filter parks by the requested IDs
    const filteredParks = allParks.filter(park => 
      parkIds.includes(park.id)
    );
    
    // Add some mock "live" data (in a real app, this would come from a real-time source)
    const parksWithLiveData = filteredParks.map(park => ({
      ...park,
      liveData: {
        currentVisitors: Math.floor(Math.random() * 20),
        lastUpdated: new Date().toISOString(),
        status: 'open' // or 'closed', 'maintenance', etc.
      }
    }));
    
    return NextResponse.json(parksWithLiveData);
  } catch (error) {
    console.error('Error fetching live park data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch live park data' },
      { status: 500 }
    );
  }
}

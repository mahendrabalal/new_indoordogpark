import { NextRequest, NextResponse } from 'next/server';

/**
 * Geocoding API endpoint
 * Converts addresses to latitude/longitude coordinates using Google Maps Geocoding API
 * 
 * Best practices:
 * - Server-side API key handling (keeps keys secure)
 * - Rate limiting handled by Google
 * - Error handling for invalid addresses
 */
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface GeocodeRequest {
  address?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GeocodeRequest = await request.json();
    const { address, street, city, state, zipCode } = body;

    // Build address string from components
    let addressString = address;
    if (!addressString) {
      const parts: string[] = [];
      if (street) parts.push(street);
      if (city) parts.push(city);
      if (state) parts.push(state);
      if (zipCode) parts.push(zipCode);
      addressString = parts.join(', ');
    }

    // Validate that we have enough information to geocode
    if (!addressString || addressString.trim().length < 5) {
      return NextResponse.json(
        { error: 'Insufficient address information. Please provide at least a city and state, or a complete address.' },
        { status: 400 }
      );
    }

    // Get API key from environment
    const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.error('Google Maps API key not configured');
      return NextResponse.json(
        { error: 'Geocoding service is not configured. Please contact support.' },
        { status: 503 }
      );
    }

    // Call Google Maps Geocoding API
    const geocodeUrl = new URL('https://maps.googleapis.com/maps/api/geocode/json');
    geocodeUrl.searchParams.set('address', addressString.trim());
    geocodeUrl.searchParams.set('key', apiKey);

    const response = await fetch(geocodeUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Geocoding API returned status ${response.status}`);
    }

    const data = await response.json();

    // Handle API errors
    if (data.status === 'REQUEST_DENIED') {
      console.error('Geocoding API error:', data.error_message);
      return NextResponse.json(
        { error: 'Geocoding service access denied. Please check API key configuration.' },
        { status: 503 }
      );
    }

    if (data.status === 'OVER_QUERY_LIMIT') {
      return NextResponse.json(
        { error: 'Geocoding service quota exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    if (data.status === 'ZERO_RESULTS') {
      return NextResponse.json(
        { error: 'Address not found. Please check the address and try again.' },
        { status: 404 }
      );
    }

    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      return NextResponse.json(
        { error: `Geocoding failed: ${data.status}` },
        { status: 400 }
      );
    }

    // Extract coordinates from the first result
    const location = data.results[0].geometry.location;
    const formattedAddress = data.results[0].formatted_address;

    return NextResponse.json({
      latitude: location.lat,
      longitude: location.lng,
      formattedAddress,
      addressComponents: data.results[0].address_components,
    });

  } catch (error) {
    console.error('Geocoding error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to geocode address' },
      { status: 500 }
    );
  }
}






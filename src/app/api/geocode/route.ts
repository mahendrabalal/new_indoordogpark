import { NextRequest, NextResponse } from 'next/server';

/**
 * Geocoding API endpoint
 * Converts addresses to latitude/longitude coordinates using OpenStreetMap Nominatim API
 * 
 * Note: uses Nominatim (free, no API key required)
 * Usage Limit: Max 1 request per second
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

    // Call OpenStreetMap Nominatim API
    // Docs: https://nominatim.org/release-docs/develop/api/Search/
    const geocodeUrl = new URL('https://nominatim.openstreetmap.org/search');
    geocodeUrl.searchParams.set('q', addressString.trim());
    geocodeUrl.searchParams.set('format', 'json');
    geocodeUrl.searchParams.set('limit', '1');
    geocodeUrl.searchParams.set('addressdetails', '1');
    geocodeUrl.searchParams.set('countrycodes', 'us'); // Limit to US since app is for California

    const response = await fetch(geocodeUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        // User-Agent is REQUIRED by Nominatim usage policy
        'User-Agent': 'IndoorDogPark/1.0 (internal-dev-testing)',
      },
    });

    if (!response.ok) {
      throw new Error(`Geocoding API returned status ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: 'Address not found. Please check the address and try again.' },
        { status: 404 }
      );
    }

    // Extract coordinates from the first result
    const result = data[0];

    // Convert to our standard format
    // Nominatim returns lat/lon as strings, we need numbers
    const latitude = parseFloat(result.lat);
    const longitude = parseFloat(result.lon);

    // Map address components if possible
    const addressComponents = result.address || {};

    return NextResponse.json({
      latitude,
      longitude,
      formattedAddress: result.display_name,
      // Provide raw components just in case
      addressComponents: [
        { types: ['street_number'], long_name: addressComponents.house_number },
        { types: ['route'], long_name: addressComponents.road },
        { types: ['locality'], long_name: addressComponents.city || addressComponents.town || addressComponents.village },
        { types: ['administrative_area_level_1'], long_name: addressComponents.state },
        { types: ['postal_code'], long_name: addressComponents.postcode },
        { types: ['country'], long_name: addressComponents.country },
      ].filter(c => c.long_name), // Filter out missing components
    });

  } catch (error) {
    console.error('Geocoding error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to geocode address' },
      { status: 500 }
    );
  }
}













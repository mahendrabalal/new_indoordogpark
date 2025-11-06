import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const current = searchParams.get('current');
    
    // Mock weather data - in a real app, you would fetch from a weather API
    const weatherData = {
      location: 'California',
      temperature: Math.floor(Math.random() * 30) + 60, // 60-90°F
      condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Clear'][Math.floor(Math.random() * 4)],
      humidity: Math.floor(Math.random() * 40) + 30, // 30-70%
      windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 mph
      lastUpdated: new Date().toISOString(),
      forecast: [
        { day: 'Tomorrow', high: 75, low: 60, condition: 'Sunny' },
        { day: 'Thursday', high: 73, low: 58, condition: 'Partly Cloudy' },
        { day: 'Friday', high: 70, low: 55, condition: 'Cloudy' },
      ]
    };
    
    if (current === 'true') {
      return NextResponse.json({
        current: weatherData
      });
    }
    
    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, type, source, name, parkName, city, state, zipCode, phone, website, streetAddress } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY;
    const BEEHIIV_PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID;

    if (!BEEHIIV_API_KEY || !BEEHIIV_PUBLICATION_ID) {
      console.error('Missing Beehiiv credentials in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Map fields to Beehiiv custom fields structure (these must be created in the Beehiiv dashboard to work)
    // We filter out undefined/empty values
    const customFields = [
      { name: 'user_type', value: type || 'consumer' },
      { name: 'source', value: source || 'website' },
      name ? { name: 'name', value: name } : null,
      parkName ? { name: 'park_name', value: parkName } : null,
      city ? { name: 'city', value: city } : null,
      state ? { name: 'state', value: state } : null,
      zipCode ? { name: 'zip_code', value: zipCode } : null,
      phone ? { name: 'phone', value: phone } : null,
      website ? { name: 'website', value: website } : null,
      streetAddress ? { name: 'street_address', value: streetAddress } : null,
    ].filter(Boolean);

    // Check if the user is already subscribed
    const checkResponse = await fetch(
      `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions/by_email/${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${BEEHIIV_API_KEY}`,
        },
      }
    );

    if (checkResponse.ok) {
      const existingData = await checkResponse.json();
      // If the user is active or validating, they are already on the list
      if (existingData.data && ['active', 'validating'].includes(existingData.data.status)) {
        return NextResponse.json(
          { message: "You're already on our list! 🐾" },
          { status: 200 }
        );
      }
    }

    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${BEEHIIV_API_KEY}`,
        },
        body: JSON.stringify({
          email: email,
          reactivate_existing: false,
          send_welcome_email: true,
          utm_source: 'indoordogpark.org',
          utm_medium: 'organic',
          utm_campaign: source || 'newsletter_form',
          custom_fields: customFields,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Beehiiv API error:', data);
      
      // If Beehiiv rejects custom fields that don't exist, we can try to fallback without custom fields
      if (data.errors && data.errors.some((e: any) => e.message?.includes('custom field'))) {
        console.log('Retrying subscription without custom fields...');
        const retryResponse = await fetch(
          `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${BEEHIIV_API_KEY}`,
            },
            body: JSON.stringify({
              email: email,
              reactivate_existing: false,
              send_welcome_email: true,
              utm_source: 'indoordogpark.org',
              utm_medium: 'organic',
              utm_campaign: source || 'newsletter_form',
            }),
          }
        );
        
        const retryData = await retryResponse.json();
        if (!retryResponse.ok) {
          throw new Error(retryData.message || 'Failed to subscribe to newsletter');
        }
        
        return NextResponse.json(
          { message: 'Successfully subscribed to the newsletter!' },
          { status: 201 }
        );
      }
      
      return NextResponse.json(
        { error: data.message || 'Failed to subscribe to newsletter' },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: 'Successfully subscribed to the newsletter!' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing subscription:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while subscribing.' },
      { status: 500 }
    );
  }
}

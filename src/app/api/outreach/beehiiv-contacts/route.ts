import { NextRequest, NextResponse } from 'next/server';

export interface BeehiivContact {
  id: string;
  email: string;
  status: string;
  createdAt: string;
  name?: string;
  parkName?: string;
  city?: string;
  state?: string;
  userType?: string;
}

export async function GET(request: NextRequest) {
  try {
    const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY;
    const BEEHIIV_PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID;

    if (!BEEHIIV_API_KEY || !BEEHIIV_PUBLICATION_ID || BEEHIIV_API_KEY.includes('your_')) {
      return NextResponse.json({
        success: false,
        configured: false,
        message: 'Beehiiv API credentials (BEEHIIV_API_KEY or BEEHIIV_PUBLICATION_ID) not configured in .env.local',
        contacts: [],
      });
    }

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '50';
    const query = (searchParams.get('q') || '').toLowerCase();

    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions?limit=${limit}&status=active&expand[]=custom_fields`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${BEEHIIV_API_KEY}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Beehiiv API fetch error:', response.status, errorText);
      return NextResponse.json({
        success: false,
        configured: true,
        error: `Beehiiv returned status ${response.status}`,
        contacts: [],
      });
    }

    const json = await response.json();
    const rawList = json.data || [];

    const contacts: BeehiivContact[] = rawList.map((sub: any) => {
      const customFields = sub.custom_fields || [];
      const getField = (fieldName: string) => {
        const found = customFields.find(
          (f: any) => f.name?.toLowerCase() === fieldName.toLowerCase()
        );
        return found ? found.value : undefined;
      };

      return {
        id: sub.id,
        email: sub.email,
        status: sub.status,
        createdAt: sub.created_at ? new Date(sub.created_at * 1000).toISOString() : '',
        name: getField('name') || getField('first_name'),
        parkName: getField('park_name') || getField('business_name'),
        city: getField('city'),
        state: getField('state'),
        userType: getField('user_type'),
      };
    });

    const filtered = query
      ? contacts.filter(
          (c) =>
            c.email.toLowerCase().includes(query) ||
            (c.name && c.name.toLowerCase().includes(query)) ||
            (c.parkName && c.parkName.toLowerCase().includes(query)) ||
            (c.city && c.city.toLowerCase().includes(query))
        )
      : contacts;

    return NextResponse.json({
      success: true,
      configured: true,
      totalCount: json.total_results || filtered.length,
      contacts: filtered,
    });
  } catch (error) {
    console.error('[api/outreach/beehiiv-contacts] error:', error);
    return NextResponse.json(
      {
        success: false,
        configured: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        contacts: [],
      },
      { status: 500 }
    );
  }
}

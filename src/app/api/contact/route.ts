import { NextRequest, NextResponse } from 'next/server';

interface ContactMessage {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactMessage = await request.json();

    // Validation
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Save to database (you can use Supabase here)
    // For now, we'll just log it and return success
    const contactData = {
      id: generateId(),
      ...body,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    // Log the contact message (in production, save to database)
    console.log('New contact message:', contactData);

    // TODO: Integrate with email service (Resend, SendGrid, etc.)
    // TODO: Save to Supabase or other database
    // TODO: Send confirmation email to user

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been received. We will get back to you soon.',
        id: contactData.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process your message. Please try again later.' },
      { status: 500 }
    );
  }
}

function generateId(): string {
  return `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

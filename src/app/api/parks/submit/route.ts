import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth-helpers';
import { supabaseAdminClient } from '@/lib/supabase-admin';
import type { ParkSubmissionForm } from '@/types/park-submission';

export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await getUserFromRequest(request);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to submit a park listing.' },
        { status: 401 }
      );
    }

    // Parse request body
    const body: ParkSubmissionForm & { listingType: 'free' | 'featured' } = await request.json();

    // Validate required fields
    const validationErrors = validateSubmission(body);
    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', errors: validationErrors },
        { status: 400 }
      );
    }

    // Generate full address
    const fullAddress = generateFullAddress(body);
    const slug = await generateUniqueSlug(body.name, body.city);

    // Prepare data for insertion
    const submissionData = {
      user_id: user.id,
      slug,
      name: body.name,
      business_type: body.businessType,
      description: body.description,
      address: body.address,
      street: body.street,
      city: body.city,
      state: body.state,
      zip_code: body.zipCode,
      full_address: fullAddress,
      latitude: body.latitude,
      longitude: body.longitude,
      phone: body.phone,
      email: body.email,
      website: body.website,
      social_media: body.socialMedia || {},
      opening_hours: body.openingHours || {},
      hours_24x7: body.hours24x7 || false,
      hours_note: body.hoursNote,
      pricing_info: body.pricingInfo || {},
      amenities: body.amenities || {},
      photos: body.photos || [],
      indoor_outdoor: body.indoorOutdoor,
      size_category: body.sizeCategory,
      surface_type: body.surfaceType,
      pet_friendly_features: body.petFriendlyFeatures || [],
      listing_type: body.listingType,
      status: 'pending',
    };

    // Insert submission into database
    const { data: submission, error: insertError } = await supabaseAdminClient
      .from('park_submissions')
      .insert([submissionData])
      .select()
      .single();

    if (insertError) {
      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: 'A park with this name and city already exists. Please adjust the name to make it unique.' },
          { status: 409 }
        );
      }

      console.error('Database insertion error:', insertError);
      return NextResponse.json(
        { error: 'Failed to submit park listing. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Park listing submitted successfully',
      submission,
    }, { status: 201 });

  } catch (error) {
    console.error('Park submission error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

// Validate submission data
function validateSubmission(data: ParkSubmissionForm): Record<string, string> {
  const errors: Record<string, string> = {};

  // Required fields
  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Park name is required';
  }
  if (!data.businessType) {
    errors.businessType = 'Business type is required';
  }
  if (!data.description || data.description.trim().length < 50) {
    errors.description = 'Description must be at least 50 characters';
  }
  if (!data.city || data.city.trim().length === 0) {
    errors.city = 'City is required';
  }
  if (!data.state) {
    errors.state = 'State is required';
  }

  // Email validation
  if (data.email && !isValidEmail(data.email)) {
    errors.email = 'Invalid email format';
  }

  // Website validation
  if (data.website && !isValidUrl(data.website)) {
    errors.website = 'Invalid website URL';
  }

  // Phone validation (basic)
  if (data.phone && data.phone.length < 10) {
    errors.phone = 'Invalid phone number';
  }

  return errors;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function generateFullAddress(data: ParkSubmissionForm): string {
  const parts = [];

  if (data.street) parts.push(data.street);
  if (data.city) parts.push(data.city);
  if (data.state) parts.push(data.state);
  if (data.zipCode) parts.push(data.zipCode);

  return parts.join(', ');
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function generateUniqueSlug(name: string, city?: string | null) {
  const base = slugify(`${name || 'park'}-${city || 'california'}`) || `park-${Date.now()}`;
  let candidate = base.slice(0, 80);
  let attempt = 1;

  while (attempt < 50) {
    const { data, error } = await supabaseAdminClient
      .from('park_submissions')
      .select('id')
      .eq('slug', candidate)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Slug check error:', error);
      break;
    }

    if (!data) {
      return candidate;
    }

    candidate = `${base}-${attempt}`.slice(0, 90);
    attempt += 1;
  }

  return `${base}-${randomUUID().slice(0, 8)}`;
}

// GET endpoint to retrieve user's submissions
export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await getUserFromRequest(request);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch user's submissions
    const { data: submissions, error: fetchError } = await supabaseAdminClient
      .from('park_submissions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch submissions' },
        { status: 500 }
      );
    }

    return NextResponse.json({ submissions }, { status: 200 });

  } catch (error) {
    console.error('GET submissions error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { sanityServerClient } from '@/lib/sanity-server';
import type { ParkSubmissionForm } from '@/types/park-submission';

export async function POST(request: NextRequest) {
  try {
    const userId = 'anonymous';
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

    // Format photos for Sanity
    const sanityPhotos = body.photos?.filter(p => p.id).map(p => ({
      _key: randomUUID(),
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: p.id
      }
    })) || [];

    // Prepare data for Sanity insertion
    const submissionData = {
      _type: 'parkSubmission',
      userId: userId,
      slug: { _type: 'slug', current: slug },
      name: body.name,
      businessType: body.businessType,
      description: body.description,
      address: fullAddress,
      city: body.city,
      state: body.state,
      zipCode: body.zipCode,
      latitude: body.latitude,
      longitude: body.longitude,
      phone: body.phone,
      email: body.email,
      website: body.website,
      socialMedia: body.socialMedia || {},
      amenities: body.amenities || {},
      rules: body.rules || {},
      pricingInfo: body.pricingInfo || {},
      photos: sanityPhotos,
      
      // For featured listings, start as 'free' until payment is confirmed via webhook
      listingType: body.listingType === 'featured' ? 'free' : body.listingType,
      status: 'approved', // Auto-approve submissions
    };

    // Insert submission into Sanity
    const submission = await sanityServerClient.create(submissionData);

    return NextResponse.json({
      success: true,
      message: 'Park listing submitted successfully',
      submission: { ...submission, id: submission._id },
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
  if (data.email && !isValidEmail(data.email)) {
    errors.email = 'Invalid email format';
  }
  if (data.website && !isValidUrl(data.website)) {
    errors.website = 'Invalid website URL';
  }
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
    // Check if slug exists in Sanity
    const existingCount = await sanityServerClient.fetch(
      `count(*[_type == "parkSubmission" && slug.current == $slug])`,
      { slug: candidate }
    );

    if (existingCount === 0) {
      return candidate;
    }

    candidate = `${base}-${attempt}`.slice(0, 90);
    attempt += 1;
  }

  return `${base}-${randomUUID().slice(0, 8)}`;
}



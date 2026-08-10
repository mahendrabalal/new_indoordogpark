import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth-helpers';
import { sanityServerClient } from '@/lib/sanity-server';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request: NextRequest) {
  try {
    // Auth check bypassed

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File is too large. Maximum size is 5MB.' },
        { status: 400 },
      );
    }

    const mimeType = file.type || 'application/octet-stream';

    if (!ALLOWED_FILE_TYPES.includes(mimeType)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload a JPG, PNG, WEBP, or GIF image.' },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const extension = getFileExtension(file.name, mimeType);
    const originalName = sanitizeFilename(file.name, extension);

    // Upload to Sanity Assets
    const asset = await sanityServerClient.assets.upload('image', fileBuffer, {
      filename: originalName,
      contentType: mimeType,
    });

    return NextResponse.json(
      {
        success: true,
        photo: {
          url: asset.url,
          id: asset._id,
          type: 'uploaded',
          source: 'user',
          uploadedAt: new Date().toISOString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Photo upload error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while uploading the photo.' },
      { status: 500 },
    );
  }
}

function getFileExtension(filename: string, mimeType: string) {
  const nameParts = filename?.split('.') ?? [];
  const extFromName = nameParts.length > 1 ? nameParts.pop() : undefined;

  if (extFromName) {
    return sanitizeExtension(extFromName);
  }

  const [, subtype] = mimeType.split('/');
  return sanitizeExtension(subtype || 'jpg');
}

function sanitizeExtension(ext: string) {
  return ext.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'jpg';
}

function sanitizeFilename(filename: string, extension: string) {
  const base = filename?.split('.').slice(0, -1).join('.') || 'uploaded-photo';
  const cleaned = base.replace(/[^a-z0-9-_]/gi, '').toLowerCase() || 'uploaded-photo';
  return `${cleaned}.${extension}`;
}

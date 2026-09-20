import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { sanityServerClient } from '@/lib/sanity-server';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/heic',
  'image/heif',
];

export async function POST(request: NextRequest) {
  try {
    // 1. Verify Sanity write token is configured
    if (!process.env.SANITY_API_TOKEN && !process.env.SANITY_API_WRITE_TOKEN) {
      console.error('[Upload Park Photos] SANITY_API_TOKEN or SANITY_API_WRITE_TOKEN is missing in environment variables.');
      return NextResponse.json(
        { error: 'Server configuration error: Sanity write token is missing in hosting environment.' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum allowed size is 5MB.` },
        { status: 400 }
      );
    }

    const mimeType = file.type || 'application/octet-stream';

    if (!ALLOWED_FILE_TYPES.includes(mimeType)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload a JPG, PNG, WEBP, or GIF image.' },
        { status: 400 }
      );
    }

    // Optional metadata
    const parkName = (formData.get('parkName') as string)?.trim() || '';
    const listingSlug = (formData.get('listingSlug') as string)?.trim() || '';
    const location = (formData.get('location') as string)?.trim() || '';
    const uploaderName = (formData.get('uploaderName') as string)?.trim() || '';
    const uploaderEmail = (formData.get('uploaderEmail') as string)?.trim() || '';
    const caption = (formData.get('caption') as string)?.trim() || '';

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const extension = getFileExtension(file.name, mimeType);
    const originalName = sanitizeFilename(file.name, extension);

    // 2. Upload to Sanity Asset CDN
    const asset = await sanityServerClient.assets.upload('image', fileBuffer, {
      filename: originalName,
      contentType: mimeType,
      title: parkName ? `${parkName} - Community Photo` : originalName,
      description: caption || (uploaderName ? `Submitted by ${uploaderName}` : undefined),
      creditLine: uploaderName || undefined,
    });

    if (!asset || !asset.url) {
      throw new Error('Sanity asset upload succeeded but did not return a valid asset URL.');
    }

    // 3. Create a communityPhoto moderation document in Sanity if park info is supplied
    let submissionId: string | undefined;
    if (parkName || listingSlug) {
      try {
        const doc = await sanityServerClient.create({
          _type: 'communityPhoto',
          parkName: parkName || 'Community Dog Park',
          listingSlug: listingSlug || undefined,
          location: location || undefined,
          uploaderName: uploaderName || undefined,
          uploaderEmail: uploaderEmail || undefined,
          notes: caption || undefined,
          status: 'pending',
          submittedAt: new Date().toISOString(),
          photos: [
            {
              _key: randomUUID(),
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: asset._id,
              },
              caption: caption || undefined,
            },
          ],
        });
        submissionId = doc._id;
      } catch (docErr) {
        // Non-fatal warning: the asset itself uploaded successfully
        console.warn('[Upload Park Photos] Notice: Could not create communityPhoto document:', docErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        photo: {
          url: asset.url,
          id: asset._id,
          type: 'uploaded',
          source: 'user',
          uploadedAt: new Date().toISOString(),
          submissionId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Upload Park Photos] Error:', error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred while uploading photo.';
    return NextResponse.json(
      { error: message },
      { status: 500 }
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

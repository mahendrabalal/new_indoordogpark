import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth-helpers';
import { supabaseAdminClient } from '@/lib/supabase-admin';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const STORAGE_BUCKET = process.env.SUPABASE_PHOTOS_BUCKET || 'park-submissions';

export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await getUserFromRequest(request);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in before uploading photos.' },
        { status: 401 },
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const sessionId = getStringField(formData.get('sessionId')) || user.id;
    const displayOrderValue = parseInt(getStringField(formData.get('displayOrder')) || '', 10);
    const displayOrder = Number.isFinite(displayOrderValue) ? displayOrderValue : 0;
    const altText = getStringField(formData.get('altText')) || 'Park photo';

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

    if (!STORAGE_BUCKET) {
      return NextResponse.json(
        { error: 'Storage bucket is not configured. Please set SUPABASE_PHOTOS_BUCKET.' },
        { status: 500 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const extension = getFileExtension(file.name, mimeType);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filePath = `parks/${user.id}/${timestamp}-${randomUUID()}.${extension}`;

    const originalName = sanitizeFilename(file.name, extension);

    const { error: uploadError } = await supabaseAdminClient.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, fileBuffer, {
        contentType: mimeType,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json(
        { error: 'Unable to upload the photo. Please try again.' },
        { status: 500 },
      );
    }

    const publicUrlData = supabaseAdminClient.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
    const publicUrl = publicUrlData.data.publicUrl;

    if (!publicUrl) {
      return NextResponse.json(
        { error: 'Failed to generate a public URL for the uploaded photo.' },
        { status: 500 },
      );
    }

    const { data: imageRecord, error: imageInsertError } = await supabaseAdminClient
      .from('submission_images')
      .insert({
        session_id: sessionId,
        park_slug: null,
        stripe_session_id: null,
        file_name: originalName,
        file_url: publicUrl,
        file_size: file.size,
        mime_type: mimeType,
        status: 'pending',
        display_order: displayOrder,
        alt_text: altText,
        user_id: user.id,
      })
      .select('id')
      .single();

    if (imageInsertError) {
      console.error('Failed to record submission image:', imageInsertError);
    }

    return NextResponse.json(
      {
        success: true,
        photo: {
          url: publicUrl,
          id: imageRecord?.id,
          type: 'uploaded',
          source: 'user',
          storagePath: filePath,
          uploadedAt: new Date().toISOString(),
          sessionId,
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

function getStringField(value: FormDataEntryValue | null) {
  return typeof value === 'string' ? value : null;
}

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
        { error: 'Unauthorized.' },
        { status: 401 },
      );
    }

    const userMetadata = user.user_metadata as { role?: string } | undefined;
    if (userMetadata?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden. Admin access required.' },
        { status: 403 }
      );
    }

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
        { error: 'Unsupported file type. Please upload an image.' },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const extension = getFileExtension(file.name, mimeType);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Store in a dedicated folder for email attachments
    const filePath = `email-attachments/${timestamp}-${randomUUID()}.${extension}`;

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
        { error: 'Unable to upload the attachment.' },
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

    return NextResponse.json(
      { success: true, url: publicUrl },
      { status: 201 },
    );
  } catch (error) {
    console.error('Email attachment upload error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
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

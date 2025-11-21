import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth-helpers';
import { supabaseAdminClient } from '@/lib/supabase-admin';

const STORAGE_BUCKET = process.env.SUPABASE_PHOTOS_BUCKET || 'park-submissions';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { submissionId: string } }
) {
  try {
    const { user, error: authError } = await getUserFromRequest(request);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userMetadata = user.user_metadata as { role?: string } | undefined;
    if (userMetadata?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const submissionId = params.submissionId;
    if (!submissionId) {
      return NextResponse.json({ error: 'Submission ID is required' }, { status: 400 });
    }

    const {
      data: submission,
      error: fetchError,
    } = await supabaseAdminClient
      .from('park_submissions')
      .select('id, photos')
      .eq('id', submissionId)
      .maybeSingle();

    if (fetchError) {
      console.error('Failed to load submission before delete:', fetchError);
      return NextResponse.json({ error: 'Failed to load submission' }, { status: 500 });
    }

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const photos = Array.isArray(submission.photos) ? submission.photos : [];
    const storagePaths = photos
      .map((photo) => {
        if (!photo || typeof photo !== 'object') {
          return null;
        }
        const typedPhoto = photo as { storagePath?: string; storage_path?: string };
        return typedPhoto.storagePath || typedPhoto.storage_path || null;
      })
      .filter((value): value is string => typeof value === 'string' && value.length > 0);

    if (storagePaths.length > 0) {
      const { error: removeError } = await supabaseAdminClient.storage.from(STORAGE_BUCKET).remove(storagePaths);

      if (removeError) {
        console.error('Failed to remove submission photos:', removeError);
      }
    }

    const { error: deleteError } = await supabaseAdminClient
      .from('park_submissions')
      .delete()
      .eq('id', submissionId);

    if (deleteError) {
      console.error('Failed to delete submission:', deleteError);
      return NextResponse.json({ error: 'Failed to delete submission' }, { status: 500 });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Submission deleted successfully',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Admin delete submission error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}




















import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth-helpers';
import { supabaseAdminClient } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

const STORAGE_BUCKET = process.env.SUPABASE_PHOTOS_BUCKET || 'park-submissions';

export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await getUserFromRequest(request);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check admin role
    const userMetadata = user.user_metadata as { role?: string } | undefined;
    if (userMetadata?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden. Admin access required.' },
        { status: 403 }
      );
    }

    const { submissionId, reason } = (await request.json()) as {
      submissionId?: string;
      reason?: string;
    };

    if (!submissionId || !reason) {
      return NextResponse.json(
        { error: 'Submission ID and rejection reason are required' },
        { status: 400 }
      );
    }

    // Fetch submission to get photos
    const { data: submission, error: fetchError } = await supabaseAdminClient
      .from('park_submissions')
      .select('photos')
      .eq('id', submissionId)
      .maybeSingle();

    if (fetchError) {
      console.error('Failed to load submission before reject:', fetchError);
      return NextResponse.json({ error: 'Failed to load submission' }, { status: 500 });
    }

    if (submission) {
      const photos = Array.isArray(submission.photos) ? submission.photos : [];
      const storagePaths = photos
        .map((photo: any) => {
          if (!photo || typeof photo !== 'object') return null;
          return photo.storagePath || photo.storage_path || null;
        })
        .filter((value: any): value is string => typeof value === 'string' && value.length > 0);

      const fileUrls = photos
        .map((photo: any) => {
          if (!photo || typeof photo !== 'object') return null;
          return photo.url || null;
        })
        .filter((value: any): value is string => typeof value === 'string' && value.length > 0);

      if (storagePaths.length > 0) {
        const { error: removeError } = await supabaseAdminClient.storage.from(STORAGE_BUCKET).remove(storagePaths);
        if (removeError) {
          console.error('Failed to remove submission photos:', removeError);
        }
      }

      if (fileUrls.length > 0) {
        const { error: dbImageError } = await supabaseAdminClient
          .from('submission_images')
          .delete()
          .in('file_url', fileUrls);
        if (dbImageError) {
          console.error('Failed to delete from submission_images:', dbImageError);
        }
      }
    }

    // Update submission status to rejected and clear photos
    const { error: updateError } = await supabaseAdminClient
      .from('park_submissions')
      .update({
        status: 'rejected',
        rejection_reason: reason,
        photos: [], // Clear photos array to prevent broken links
      })
      .eq('id', submissionId);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to reject submission' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Submission rejected',
    }, { status: 200 });

  } catch (error) {
    console.error('Reject submission error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

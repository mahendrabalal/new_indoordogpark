import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth-helpers';
import { supabaseAdminClient } from '@/lib/supabase-admin';
import { submitParkToIndexNow } from '@/lib/indexnow';

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

    const { submissionId } = (await request.json()) as { submissionId?: string };

    if (!submissionId) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      );
    }

    // First, fetch the submission to get name and city for slug generation
    const { data: submission, error: fetchError } = await supabaseAdminClient
      .from('park_submissions')
      .select('name, city, slug')
      .eq('id', submissionId)
      .maybeSingle();

    if (fetchError || !submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Generate slug if not already set
    function slugify(name: string, city?: string): string {
      const base = `${name}-${city || ''}`.trim().toLowerCase();
      return base
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const generatedSlug = submission.slug || slugify(submission.name, submission.city);

    // Update submission status to approved and ensure slug is set
    const { error: updateError } = await supabaseAdminClient
      .from('park_submissions')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: user.id,
        slug: generatedSlug, // Ensure slug is set
      })
      .eq('id', submissionId);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to approve submission' },
        { status: 500 }
      );
    }

    // Submit to IndexNow (non-blocking - don't fail approval if this fails)
    submitParkToIndexNow(generatedSlug).catch((error) => {
      console.error('[IndexNow] Failed to submit approved park:', error);
      // Log error but don't throw - approval was successful
    });

    return NextResponse.json({
      success: true,
      message: 'Submission approved successfully',
    }, { status: 200 });

  } catch (error) {
    console.error('Approve submission error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

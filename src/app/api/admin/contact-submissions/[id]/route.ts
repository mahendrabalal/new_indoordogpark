import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth-helpers';
import { supabaseAdminClient } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

const VALID_STATUSES = ['new', 'read', 'replied', 'archived'] as const;
type ContactStatus = typeof VALID_STATUSES[number];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error: authError } = await getUserFromRequest(request);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userMetadata = user.user_metadata as { role?: string } | undefined;
    if (userMetadata?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden. Admin access required.' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { status, adminNotes } = body as { status?: string; adminNotes?: string };

    // Build update object
    const updates: Record<string, unknown> = {};

    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status as ContactStatus)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
          { status: 400 }
        );
      }
      updates.status = status;
    }

    if (adminNotes !== undefined) {
      updates.admin_notes = adminNotes;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields provided for update.' },
        { status: 400 }
      );
    }

    const { data, error: updateError } = await supabaseAdminClient
      .from('contact_submissions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update contact submission' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Contact submission not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      contactSubmission: {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
        category: data.category,
        status: data.status,
        adminNotes: data.admin_notes,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
    });

  } catch (error) {
    console.error('Admin contact submission update error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error: authError } = await getUserFromRequest(request);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userMetadata = user.user_metadata as { role?: string } | undefined;
    if (userMetadata?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden. Admin access required.' },
        { status: 403 }
      );
    }

    const { id } = await params;

    const { error: deleteError } = await supabaseAdminClient
      .from('contact_submissions')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete contact submission' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Contact submission deleted successfully',
    });

  } catch (error) {
    console.error('Admin contact submission delete error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

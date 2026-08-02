import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth-helpers';
import { supabaseAdminClient } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
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

    // Get filter from query params
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const pageParam = Number.parseInt(searchParams.get('page') || '1', 10);
    const pageSizeParam = Number.parseInt(searchParams.get('pageSize') || '10', 10);

    const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
    const pageSize = Number.isNaN(pageSizeParam)
      ? 10
      : Math.min(Math.max(pageSizeParam, 1), 100);
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Build query
    let query = supabaseAdminClient
      .from('contact_submissions')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    const {
      data: submissions,
      error: fetchError,
      count,
    } = await query.range(from, to);

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch contact submissions' },
        { status: 500 }
      );
    }

    // Transform to camelCase for frontend consistency
    const transformedSubmissions = submissions?.map((sub: any) => ({
      id: sub.id,
      name: sub.name,
      email: sub.email,
      phone: sub.phone,
      subject: sub.subject,
      message: sub.message,
      category: sub.category,
      status: sub.status,
      adminNotes: sub.admin_notes,
      replyMessage: sub.reply_message,
      repliedAt: sub.replied_at,
      createdAt: sub.created_at,
      updatedAt: sub.updated_at,
    })) || [];

    const total = count ?? 0;
    const totalPages = total === 0 ? 1 : Math.max(1, Math.ceil(total / pageSize));

    return NextResponse.json(
      {
        contactSubmissions: transformedSubmissions,
        meta: {
          total,
          page,
          pageSize,
          totalPages,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Admin contact submissions fetch error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

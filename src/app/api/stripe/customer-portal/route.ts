import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth-helpers';
import { supabaseAdminClient } from '@/lib/supabase-admin';
import { createCustomerPortalSession } from '@/lib/stripe';
import { getBaseUrl } from '@/lib/base-url';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await getUserFromRequest(request);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { submissionId } = (await request.json()) as { submissionId?: string };

    if (!submissionId) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      );
    }

    // Get the submission to find the Stripe customer ID
    const { data: submission, error: fetchError } = await supabaseAdminClient
      .from('park_submissions')
      .select('stripe_customer_id')
      .eq('id', submissionId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !submission || !submission.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No subscription found for this listing' },
        { status: 404 }
      );
    }

    const baseUrl = await getBaseUrl(request);

    // Create customer portal session
    const portalSession = await createCustomerPortalSession({
      customerId: submission.stripe_customer_id,
      returnUrl: `${baseUrl}/dashboard`,
    });

    return NextResponse.json({
      url: portalSession.url,
    }, { status: 200 });

  } catch (error) {
    console.error('Customer portal error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create customer portal session' },
      { status: 500 }
    );
  }
}

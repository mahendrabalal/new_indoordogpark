import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { createCustomerPortalSession } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { submissionId } = await request.json();

    if (!submissionId) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      );
    }

    // Get the submission to find the Stripe customer ID
    const { data: submission, error: fetchError } = await supabase
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

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Create customer portal session
    const portalSession = await createCustomerPortalSession({
      customerId: submission.stripe_customer_id,
      returnUrl: `${baseUrl}/dashboard`,
    });

    return NextResponse.json({
      url: portalSession.url,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Customer portal error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create customer portal session' },
      { status: 500 }
    );
  }
}

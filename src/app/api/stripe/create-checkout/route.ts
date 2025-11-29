import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth-helpers';
import { supabaseAdminClient } from '@/lib/supabase-admin';
import { createCheckoutSession, STRIPE_CONFIG } from '@/lib/stripe';
import { getBaseUrl } from '@/lib/base-url';

export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await getUserFromRequest(request);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to continue.' },
        { status: 401 }
      );
    }

    // Parse request body
    const { submissionId } = (await request.json()) as { submissionId?: string };

    if (!submissionId) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      );
    }

    // Verify the submission belongs to the user
    const { data: submission, error: fetchError } = await supabaseAdminClient
      .from('park_submissions')
      .select('*')
      .eq('id', submissionId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !submission) {
      return NextResponse.json(
        { error: 'Submission not found or unauthorized' },
        { status: 404 }
      );
    }

    // Check if submission already has an active subscription
    // This prevents creating multiple checkout sessions for the same submission
    if (submission.stripe_subscription_id) {
      return NextResponse.json(
        { error: 'This listing already has an active subscription' },
        { status: 400 }
      );
    }

    const baseUrl = getBaseUrl(request);

    // Create checkout session with fallback success URL
    const session = await createCheckoutSession({
      priceId: STRIPE_CONFIG.FEATURED_PRICE_ID,
      unitAmount: STRIPE_CONFIG.FEATURED_PRICE,
      currency: STRIPE_CONFIG.CURRENCY,
      successUrl: `${baseUrl}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/list-your-park?canceled=true`,
      customerEmail: user.email,
      metadata: {
        userId: user.id,
        submissionId: submissionId,
        parkName: submission.name,
        fallbackSuccessUrl: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    }, { status: 200 });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    const genericMessage =
      error instanceof Error && /Invalid API Key/i.test(error.message)
        ? 'Payment processor is not configured correctly. Please contact support.'
        : 'Failed to create checkout session';

    return NextResponse.json(
      { error: genericMessage },
      { status: 500 }
    );
  }
}

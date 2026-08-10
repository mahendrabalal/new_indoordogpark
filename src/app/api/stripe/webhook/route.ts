import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe, verifyWebhookSignature } from '@/lib/stripe';
import { supabaseAdminClient } from '@/lib/supabase-admin';
import { sanityServerClient } from '@/lib/sanity-server';
import Stripe from 'stripe';
import type { SupabaseClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  console.log('🔔 Webhook received at /api/stripe/webhook');
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    console.error('❌ No signature found in webhook request');
    return NextResponse.json(
      { error: 'No signature found' },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('❌ STRIPE_WEBHOOK_SECRET not configured');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = verifyWebhookSignature(body, signature, webhookSecret);
    console.log(`✅ Webhook verified: ${event.type} (ID: ${event.id})`);
  } catch (error) {
    console.error('❌ Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    const supabase = supabaseAdminClient;

    console.log(`📦 Processing webhook event: ${event.type}`);
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`💳 Checkout session completed: ${session.id}, Payment status: ${session.payment_status}`);
        await handleCheckoutSessionCompleted(session, supabase);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription, supabase);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription, supabase);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice, supabase);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice, supabase);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
  supabaseClient: SupabaseClient
) {
  const { userId, submissionId, parkName } = session.metadata || {};

  if (!userId || !submissionId) {
    console.error('Missing metadata in checkout session');
    return;
  }

  if (session.payment_status !== 'paid') {
    console.error(
      `Checkout session completed but payment not successful. Session: ${session.id}, Payment Status: ${session.payment_status}, Submission: ${submissionId}`
    );
    return;
  }

  if (!session.subscription) {
    console.error(`Checkout session ${session.id} completed but no subscription found`);
    return;
  }

  const subscriptionId = session.subscription as string;
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subscriptionData = (subscription as any).data || subscription;

  const validStatuses = ['active', 'trialing'];
  if (!validStatuses.includes(subscriptionData.status)) {
    console.error(
      `Subscription ${subscriptionId} is not in a valid state. Status: ${subscriptionData.status}, Submission: ${submissionId}`
    );
    return;
  }

  const periodEnd = subscriptionData.current_period_end
    ? new Date(subscriptionData.current_period_end * 1000).toISOString()
    : new Date().toISOString();
  const periodStart = subscriptionData.current_period_start
    ? new Date(subscriptionData.current_period_start * 1000).toISOString()
    : new Date().toISOString();

  // Update park submission in Sanity with featured listing status
  try {
    await sanityServerClient.patch(submissionId).set({
      listingType: 'featured',
      stripeSubscriptionId: subscriptionId,
      stripeCustomerId: session.customer as string,
    }).commit();
  } catch (error) {
    console.error('Failed to update Sanity park submission:', error);
  }

  // Create subscription record in Supabase
  const { error: subscriptionError } = await supabaseClient
    .from('subscriptions')
    .insert([{
      user_id: userId,
      park_submission_id: submissionId,
      stripe_subscription_id: subscriptionId,
      stripe_customer_id: session.customer as string,
      stripe_price_id: subscription.items.data[0]?.price?.id ?? '',
      status: subscriptionData.status,
      current_period_start: periodStart,
      current_period_end: periodEnd,
      cancel_at_period_end: subscription.cancel_at_period_end,
    }]);

  if (subscriptionError) {
    console.error('Failed to create subscription record:', subscriptionError);
  }

  console.log(`Featured listing activated for park: ${parkName}`);
}

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
  supabaseClient: SupabaseClient
) {
  const subscriptionId = subscription.id;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subscriptionData = (subscription as any).data || subscription;
  const periodEnd = subscriptionData.current_period_end
    ? new Date(subscriptionData.current_period_end * 1000).toISOString()
    : new Date().toISOString();
  const periodStart = subscriptionData.current_period_start
    ? new Date(subscriptionData.current_period_start * 1000).toISOString()
    : new Date().toISOString();
  const canceledAt = subscriptionData.canceled_at
    ? new Date(subscriptionData.canceled_at * 1000).toISOString()
    : null;

  // Update subscription record
  const { error: subError } = await supabaseClient
    .from('subscriptions')
    .update({
      status: subscriptionData.status,
      current_period_start: periodStart,
      current_period_end: periodEnd,
      cancel_at_period_end: subscription.cancel_at_period_end,
      canceled_at: canceledAt,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscriptionId);

  if (subError) {
    console.error('Failed to update subscription:', subError);
  }

  console.log(`Subscription updated: ${subscriptionId}`);
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  supabaseClient: SupabaseClient
) {
  const subscriptionId = subscription.id;

  const { error: subError } = await supabaseClient
    .from('subscriptions')
    .update({
      status: 'canceled',
      canceled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscriptionId);

  if (subError) {
    console.error('Failed to update subscription:', subError);
  }

  // Downgrade park listing from featured to free in Sanity
  try {
    const submissions = await sanityServerClient.fetch(
      `*[_type == "parkSubmission" && stripeSubscriptionId == $stripeSubscriptionId]`,
      { stripeSubscriptionId: subscriptionId }
    );
    if (submissions && submissions.length > 0) {
      await sanityServerClient.patch(submissions[0]._id).set({
        listingType: 'free'
      }).commit();
    }
  } catch (error) {
    console.error('Failed to downgrade Sanity park listing:', error);
  }

  console.log(`Subscription canceled and listing downgraded: ${subscriptionId}`);
}

async function handleInvoicePaymentSucceeded(
  invoice: Stripe.Invoice,
  supabaseClient: SupabaseClient
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subscriptionId = (invoice as any).subscription as string | null;

  if (!subscriptionId) return;

  if (invoice.status !== 'paid') {
    console.error(
      `Invoice ${invoice.id} marked as payment_succeeded but not actually paid. Status: ${invoice.status}`
    );
    return;
  }

  // If submission isn't featured yet, upgrade it in Sanity
  try {
    const submissions = await sanityServerClient.fetch(
      `*[_type == "parkSubmission" && stripeSubscriptionId == $stripeSubscriptionId]`,
      { stripeSubscriptionId: subscriptionId }
    );
    if (submissions && submissions.length > 0 && submissions[0].listingType !== 'featured') {
      await sanityServerClient.patch(submissions[0]._id).set({
        listingType: 'featured'
      }).commit();
    }
  } catch (error) {
    console.error('Failed to upgrade Sanity park listing to featured:', error);
  }

  console.log(`Payment succeeded for subscription: ${subscriptionId}, Invoice: ${invoice.id}`);
}

async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice,
  supabaseClient: SupabaseClient
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subscriptionId = (invoice as any).subscription as string | null;
  if (!subscriptionId) return;
  console.log(`Payment failed for subscription: ${subscriptionId}`);
}

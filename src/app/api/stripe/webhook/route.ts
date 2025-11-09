import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe, verifyWebhookSignature } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';
import Stripe from 'stripe';
import type { SupabaseClient } from '@supabase/supabase-js';

// Disable body parsing, need raw body for webhook verification
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature found' },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not configured');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = verifyWebhookSignature(body, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Create Supabase client with service role for admin operations
  // Supabase client already imported

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
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
        await handleInvoicePaymentSucceeded(invoice);
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

  // Retrieve the subscription details
  const subscriptionId = session.subscription as string;
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // Extract dates safely - subscription is a Response object, access data via subscription.data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subscriptionData = (subscription as any).data || subscription;
  const periodEnd = subscriptionData.current_period_end
    ? new Date(subscriptionData.current_period_end * 1000).toISOString()
    : new Date().toISOString();
  const periodStart = subscriptionData.current_period_start
    ? new Date(subscriptionData.current_period_start * 1000).toISOString()
    : new Date().toISOString();

  // Update park submission with featured listing status
  const { error: updateError } = await supabaseClient
    .from('park_submissions')
    .update({
      listing_type: 'featured',
      stripe_subscription_id: subscriptionId,
      stripe_customer_id: session.customer as string,
      subscription_status: subscriptionData.status,
      subscription_current_period_end: periodEnd,
      updated_at: new Date().toISOString(),
    })
    .eq('id', submissionId);

  if (updateError) {
    console.error('Failed to update park submission:', updateError);
  }

  // Create subscription record
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

  // Extract dates safely - handle both Response and direct Subscription types
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

  // Update park submission
  const { error: parkError } = await supabaseClient
    .from('park_submissions')
    .update({
      subscription_status: subscriptionData.status,
      subscription_current_period_end: periodEnd,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscriptionId);

  if (parkError) {
    console.error('Failed to update park submission:', parkError);
  }

  console.log(`Subscription updated: ${subscriptionId}`);
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  supabaseClient: SupabaseClient
) {
  const subscriptionId = subscription.id;

  // Update subscription record
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

  // Downgrade park listing from featured to free
  const { error: parkError } = await supabaseClient
    .from('park_submissions')
    .update({
      listing_type: 'free',
      subscription_status: 'canceled',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscriptionId);

  if (parkError) {
    console.error('Failed to downgrade park listing:', parkError);
  }

  console.log(`Subscription canceled and listing downgraded: ${subscriptionId}`);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subscriptionId = (invoice as any).subscription as string | null;

  if (!subscriptionId) return;

  console.log(`Payment succeeded for subscription: ${subscriptionId}`);

  // You could send a success email notification here
}

async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice,
  supabaseClient: SupabaseClient
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subscriptionId = (invoice as any).subscription as string | null;

  if (!subscriptionId) return;

  // Update subscription status
  const { error } = await supabaseClient
    .from('park_submissions')
    .update({
      subscription_status: 'past_due',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscriptionId);

  if (error) {
    console.error('Failed to update payment status:', error);
  }

  console.log(`Payment failed for subscription: ${subscriptionId}`);

  // You could send a payment failed email notification here
}

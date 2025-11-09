import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createCustomer, createSubscription } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const { email, name, priceId, parkId, parkName } = (await req.json()) as {
      email?: string;
      name?: string;
      priceId?: string;
      parkId?: string;
      parkName?: string;
    };

    if (!email || !priceId) {
      return NextResponse.json(
        { error: 'Email and priceId are required' },
        { status: 400 }
      );
    }

    // Create a customer first
    const customer = await createCustomer(email, name);

    // Create metadata for the subscription
    const metadata: Record<string, string> = {};
    if (parkId) metadata.parkId = parkId;
    if (parkName) metadata.parkName = parkName;

    // Create the subscription
    const subscription = await createSubscription(
      customer.id,
      priceId,
      metadata
    );

    // Extract the client secret from the latest invoice's payment intent
    let clientSecret: string | undefined;
    const latestInvoice = subscription.latest_invoice;
    if (latestInvoice && typeof latestInvoice !== 'string') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const paymentIntent = (latestInvoice as any).payment_intent;
      if (paymentIntent && typeof paymentIntent !== 'string') {
        clientSecret = (paymentIntent as Stripe.PaymentIntent).client_secret ?? undefined;
      }
    }

    return NextResponse.json({
      subscriptionId: subscription.id,
      clientSecret,
      customerId: customer.id,
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}

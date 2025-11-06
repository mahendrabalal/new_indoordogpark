import { NextRequest, NextResponse } from 'next/server';
import { createCustomer, createSubscription } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const { email, name, priceId, parkId, parkName } = await req.json();

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
    const latestInvoice = subscription.latest_invoice as any;
    const paymentIntent = latestInvoice?.payment_intent;

    return NextResponse.json({
      subscriptionId: subscription.id,
      clientSecret: paymentIntent?.client_secret,
      customerId: customer.id,
    });
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}
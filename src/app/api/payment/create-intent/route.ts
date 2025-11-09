import { NextRequest, NextResponse } from 'next/server';
import { createPaymentIntent } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = 'usd', parkId, parkName } = (await req.json()) as {
      amount?: number;
      currency?: string;
      parkId?: string;
      parkName?: string;
    };

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Convert amount to cents (Stripe expects amount in smallest currency unit)
    const amountInCents = Math.round(amount * 100);

    const metadata: Record<string, string> = {};
    if (parkId) metadata.parkId = parkId;
    if (parkName) metadata.parkName = parkName;

    const paymentIntent = await createPaymentIntent(
      amountInCents,
      currency,
      metadata
    );

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}

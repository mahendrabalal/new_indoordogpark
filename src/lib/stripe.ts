import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

export const getStripeProducts = async () => {
  const products = await stripe.products.list({
    active: true,
    limit: 10,
  });
  return products;
};

export const getStripePrices = async (productId?: string) => {
  const params: Stripe.PriceListParams = {
    active: true,
    limit: 10,
  };
  
  if (productId) {
    params.product = productId;
  }
  
  const prices = await stripe.prices.list(params);
  return prices;
};

export const createPaymentIntent = async (
  amount: number,
  currency: string = 'usd',
  metadata?: Record<string, string>
) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  });
  
  return paymentIntent;
};

export const createCustomer = async (
  email: string,
  name?: string,
  metadata?: Record<string, string>
) => {
  const customer = await stripe.customers.create({
    email,
    name,
    metadata,
  });
  
  return customer;
};

export const createSubscription = async (
  customerId: string,
  priceId: string,
  metadata?: Record<string, string>
) => {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    metadata,
    payment_behavior: 'default_incomplete',
    payment_settings: {
      save_default_payment_method: 'on_subscription',
      payment_method_types: ['card'],
    },
    expand: ['latest_invoice.payment_intent'],
  });
  
  return subscription;
};

export const retrievePaymentIntent = async (paymentIntentId: string) => {
  return await stripe.paymentIntents.retrieve(paymentIntentId);
};

export const retrieveSubscription = async (subscriptionId: string) => {
  return await stripe.subscriptions.retrieve(subscriptionId);
};

export const cancelSubscription = async (subscriptionId: string) => {
  return await stripe.subscriptions.cancel(subscriptionId);
};

export const updateSubscription = async (
  subscriptionId: string,
  priceId: string
) => {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  return await stripe.subscriptions.update(subscriptionId, {
    items: [{
      id: subscription.items.data[0].id,
      price: priceId,
    }],
  });
};

// Stripe configuration constants for park listings
export const STRIPE_CONFIG = {
  FEATURED_PRICE_ID: process.env.STRIPE_FEATURED_PRICE_ID || '',
  FEATURED_PRICE: 9.99,
  CURRENCY: 'usd',
};

// Helper function to create a checkout session for park listings
export async function createCheckoutSession({
  priceId,
  unitAmount,
  currency = STRIPE_CONFIG.CURRENCY,
  successUrl,
  cancelUrl,
  customerId,
  customerEmail,
  metadata,
  productName = 'Featured Dog Park Listing',
}: {
  priceId?: string;
  unitAmount?: number;
  currency?: string;
  successUrl: string;
  cancelUrl: string;
  customerId?: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
  productName?: string;
}) {
  const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
    quantity: 1,
  };

  const buildInlinePrice = async () => {
    if (!unitAmount) {
      throw new Error('unitAmount is required when priceId is missing.');
    }

    lineItem.price_data = {
      currency,
      unit_amount: Math.round(unitAmount * 100),
      recurring: { interval: 'month' },
      product_data: {
        name: productName,
      },
    };
  };

  if (priceId) {
    try {
      const price = await stripe.prices.retrieve(priceId);
      if (price.type === 'recurring' && price.recurring) {
        lineItem.price = priceId;
      } else {
        const resolvedUnitAmountCents = unitAmount
          ? Math.round(unitAmount * 100)
          : price.unit_amount;

        if (!resolvedUnitAmountCents) {
          throw new Error('Could not determine unit amount from Stripe price.');
        }

        lineItem.price_data = {
          currency: price.currency ?? currency,
          unit_amount: resolvedUnitAmountCents,
          recurring: { interval: price.recurring?.interval ?? 'month' },
          product_data: {
            name: price.nickname || productName,
          },
        };
      }
    } catch (error) {
      console.warn('Falling back to inline price due to priceId issue:', error);
      lineItem.price = undefined;
    }
  }

  if (!lineItem.price && !lineItem.price_data) {
    await buildInlinePrice();
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [lineItem],
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer: customerId,
    customer_email: !customerId ? customerEmail : undefined,
    metadata,
    subscription_data: metadata ? {
      metadata,
    } : undefined,
    allow_promotion_codes: true, // Enable promotion code input in checkout
  });

  return session;
}

// Helper function to create a customer portal session
export async function createCustomerPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

// Helper function to cancel a subscription at period end
export async function cancelSubscriptionAtPeriodEnd(subscriptionId: string) {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });

  return subscription;
}

// Helper function to reactivate a subscription
export async function reactivateSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });

  return subscription;
}

// Helper function to verify webhook signature
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, secret);
}

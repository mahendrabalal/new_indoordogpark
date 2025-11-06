# Stripe Integration Guide

This guide explains how to use Stripe in your Dog Parks Next.js application for processing payments and managing featured listings.

## Configuration

Your Stripe configuration is already set up in `.env.local`:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_51S1rayFBheWcIExCOnTIEBjectYD1leLzfgEU5DBeHyY8j3lPt4NO6OWjhCtiJGo1Fgp1yqqCx5eg8RvPBeEAu0900UsCQn5eG
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51S1rayFBheWcIExCmfCGBuUrC1f0k9SGhHMBzPfwtcFw4y3xC1AbSy8DXUeUh0i8Xn0OM8EUNvMYio1oyJuAeGvj00IOWERkPC
STRIPE_WEBHOOK_SECRET=whsec_43yKnefS3fPaxtGUIQnk2gRJUlUcw6KF
STRIPE_FEATURED_PRICE_ID=price_1SQc2MFBheWcIExC91i01WCW
```

## Available Components and APIs

### 1. Payment Components

#### StripePayment Component
Located at: `src/components/StripePayment.tsx`

A reusable component for handling Stripe payments:

```tsx
import StripePayment from '@/components/StripePayment';

<StripePayment
  clientSecret={clientSecret}
  onSuccess={() => console.log('Payment successful')}
  onError={(error) => console.error('Payment failed:', error)}
/>
```

#### FeaturedListing Component
Located at: `src/components/FeaturedListing.tsx`

A complete component for purchasing featured listings:

```tsx
import FeaturedListing from '@/components/FeaturedListing';

<FeaturedListing
  parkId="park-123"
  parkName="Central Dog Park"
  price={20} // Optional, defaults to $20
/>
```

### 2. API Endpoints

#### Create Payment Intent
**Endpoint:** `POST /api/payment/create-intent`

Creates a payment intent for one-time payments:

```javascript
const response = await fetch('/api/payment/create-intent', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount: 20, // Amount in dollars
    currency: 'usd',
    parkId: 'park-123',
    parkName: 'Central Dog Park'
  }),
});

const { clientSecret, paymentIntentId } = await response.json();
```

#### Create Subscription
**Endpoint:** `POST /api/subscription/create`

Creates a subscription for recurring payments:

```javascript
const response = await fetch('/api/subscription/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'customer@example.com',
    name: 'John Doe',
    priceId: 'price_xxx',
    parkId: 'park-123',
    parkName: 'Central Dog Park'
  }),
});

const { subscriptionId, clientSecret, customerId } = await response.json();
```

#### Webhook Handler
**Endpoint:** `POST /api/webhook`

Handles Stripe webhook events for payment processing.

### 3. Stripe Utilities

Located at: `src/lib/stripe.ts`

Helper functions for Stripe operations:

```typescript
import {
  stripe,
  getStripeProducts,
  getStripePrices,
  createPaymentIntent,
  createCustomer,
  createSubscription,
  retrievePaymentIntent,
  retrieveSubscription,
  cancelSubscription,
  updateSubscription,
} from '@/lib/stripe';
```

## Using the Stripe CLI

You already have the Stripe CLI installed and configured. Here are some useful commands:

### View Your Account Info
```bash
stripe config --list
```

### Create Test Customers
```bash
stripe customers create --email "test@example.com" --name "Test User"
```

### Create Test Payments
```bash
stripe payment_intents create --amount 2000 --currency usd --description "Test payment"
```

### Listen for Webhooks Locally
```bash
stripe listen --forward-to localhost:3000/api/webhook
```

### Trigger Test Webhook Events
```bash
stripe trigger payment_intent.succeeded
stripe trigger payment_intent.payment_failed
stripe trigger invoice.payment_succeeded
```

## Testing Payments

### Test Card Numbers
Use these test card numbers for testing:

- **Success:** 4242 4242 4242 4242
- **Declined:** 4000 0000 0000 0002
- **Insufficient Funds:** 4000 0000 0000 9995

### Test Expiration Dates
- Any future date (e.g., 12/25)
- Any 3-digit CVC

## Webhook Events

Your webhook handler processes these events:

- `payment_intent.succeeded` - Payment completed successfully
- `payment_intent.payment_failed` - Payment failed
- `invoice.payment_succeeded` - Invoice paid (for subscriptions)
- `customer.subscription.created` - New subscription created
- `customer.subscription.updated` - Subscription updated
- `customer.subscription.deleted` - Subscription cancelled

## Products and Prices

You have a featured listing product set up:

- **Product ID:** `prod_TNMlxY27VPiWyQ`
- **Product Name:** "Featured Dog Park Listing"
- **Price ID:** `price_1SQc2MFBheWcIExC91i01WCW`
- **Amount:** $20.00 USD
- **Type:** One-time payment

## Security Considerations

1. **Never expose secret keys** in client-side code
2. **Always verify webhook signatures** using the webhook secret
3. **Use HTTPS** in production
4. **Validate amounts** on the server side
5. **Implement proper error handling** for all Stripe operations

## Production Deployment

When deploying to production:

1. **Update environment variables** with live mode keys
2. **Create live products and prices** in your Stripe dashboard
3. **Update webhook endpoints** to your production URL
4. **Test thoroughly** with small amounts first

## Common Issues and Solutions

### Webhook Signature Verification Failed
- Ensure `STRIPE_WEBHOOK_SECRET` is correctly set
- Check that you're using the correct webhook endpoint
- Verify the request body isn't modified

### Payment Intent Creation Failed
- Check your API key permissions
- Verify the amount is in cents (not dollars)
- Ensure currency codes are valid

### Stripe Elements Not Loading
- Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set
- Check that the Stripe React library is properly installed
- Ensure you're using a valid client secret

## Support

- **Stripe Documentation:** https://stripe.com/docs
- **Stripe CLI Documentation:** https://stripe.com/docs/stripe-cli
- **React Stripe.js Documentation:** https://stripe.com/docs/stripe-js/react

## Next Steps

1. Integrate the `FeaturedListing` component into your park detail pages
2. Add subscription options for recurring featured listings
3. Implement customer dashboard for managing subscriptions
4. Add analytics for tracking payment conversions
5. Set up automated billing and invoicing
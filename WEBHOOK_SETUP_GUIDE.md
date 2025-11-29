# Stripe Webhook Setup Guide

## Problem: Webhooks Not Receiving Events

If you see successful checkout sessions but no webhook events in your logs, the webhook isn't configured or forwarded correctly.

## Solution: Set Up Webhooks for Local Development

### Step 1: Install Stripe CLI (if not already installed)

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Verify installation
stripe --version
```

### Step 2: Login to Stripe CLI

```bash
stripe login
```

This will open your browser to authenticate with Stripe.

### Step 3: Forward Webhooks to Local Server

**In a separate terminal window**, run:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

**Important:** Keep this terminal running while testing! This command:
- Listens for webhook events from Stripe
- Forwards them to your local server at `localhost:3000/api/stripe/webhook`
- Outputs a webhook signing secret (starts with `whsec_`)

### Step 4: Update Environment Variables

When you run `stripe listen`, it will output something like:

```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

Copy this secret and update your `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

**Note:** This secret is different from the one in your Stripe Dashboard. Use the CLI secret for local development.

### Step 5: Restart Your Dev Server

After updating `.env.local`, restart your Next.js dev server:

```bash
npm run dev
```

### Step 6: Test the Webhook

1. Complete a checkout with a test card (`4242 4242 4242 4242`)
2. Check your terminal running `stripe listen` - you should see events
3. Check your Next.js dev server logs - you should see:
   - `🔔 Webhook received at /api/stripe/webhook`
   - `✅ Webhook verified: checkout.session.completed`
   - `💳 Checkout session completed: cs_test_...`

## For Production

When deploying to production (Vercel, etc.):

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Enter your production URL: `https://yourdomain.com/api/stripe/webhook`
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook signing secret
6. Add it to your production environment variables as `STRIPE_WEBHOOK_SECRET`

## Troubleshooting

### No webhook events in logs?

1. **Check if Stripe CLI is running:**
   ```bash
   # Should show "Ready! Your webhook signing secret is..."
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

2. **Check webhook secret in .env.local:**
   ```bash
   # Should match the secret from `stripe listen`
   echo $STRIPE_WEBHOOK_SECRET
   ```

3. **Check webhook endpoint URL:**
   - Local: `http://localhost:3000/api/stripe/webhook`
   - Production: `https://yourdomain.com/api/stripe/webhook`

4. **Verify payment actually succeeded:**
   - Go to Stripe Dashboard → Payments
   - Check if payment shows as "Succeeded"
   - If payment failed, webhook won't fire

### Webhook signature verification failed?

- Make sure you're using the webhook secret from `stripe listen` (for local) or Stripe Dashboard (for production)
- Don't mix local and production secrets

### Payment succeeded but listing not upgraded?

Check the webhook logs for:
- `✅ Webhook verified: checkout.session.completed`
- `💳 Checkout session completed: ... Payment status: paid`
- `Featured listing activated for park: ...`

If you see errors, check:
- Database connection
- Submission ID in metadata
- Payment status validation (should be 'paid')

## Quick Test

Test the webhook endpoint directly:

```bash
# In one terminal - forward webhooks
stripe listen --forward-to localhost:3000/api/stripe/webhook

# In another terminal - trigger a test event
stripe trigger checkout.session.completed
```

You should see the event in both terminals!


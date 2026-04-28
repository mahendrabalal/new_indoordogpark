# Update Webhook Secret

## ✅ Stripe CLI is Running!

Your Stripe CLI is now forwarding webhooks. You need to update your environment variable.

## Step 1: Update `.env.local`

Add or update this line in your `.env.local` file:

```env
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
```

**Important:** This is the webhook secret from your `stripe listen` command. It's different from the one in your Stripe Dashboard.

## Step 2: Restart Your Dev Server

After updating `.env.local`, restart your Next.js dev server:

1. Stop your current dev server (Ctrl+C)
2. Start it again: `npm run dev`

## Step 3: Test a Payment

1. Complete a checkout with a test card (`4242 4242 4242 4242`)
2. Watch both terminals:
   - **Stripe CLI terminal:** Should show webhook events being forwarded
   - **Dev server terminal:** Should show:
     ```
     🔔 Webhook received at /api/stripe/webhook
     ✅ Webhook verified: checkout.session.completed
     💳 Checkout session completed: cs_test_... Payment status: paid
     Featured listing activated for park: ...
     ```

## What to Expect

When everything is working:

1. ✅ Checkout completes successfully
2. ✅ Stripe CLI forwards webhook to your server
3. ✅ Webhook handler verifies payment status
4. ✅ Listing upgrades from 'free' to 'featured' in database
5. ✅ You see success logs in both terminals

## Troubleshooting

### Still not seeing webhooks?

1. **Check `.env.local` has the correct secret:**
   ```bash
   grep STRIPE_WEBHOOK_SECRET .env.local
   ```

2. **Verify Stripe CLI is still running:**
   - The terminal should show "Ready!" message
   - If it stopped, run `stripe listen --forward-to localhost:3000/api/stripe/webhook` again

3. **Check webhook endpoint:**
   - Make sure it's `/api/stripe/webhook` (not `/api/webhook`)

4. **Restart dev server:**
   - Environment variables are loaded on startup
   - Changes to `.env.local` require a restart

### Webhook signature verification failed?

- Make sure you're using the secret from `stripe listen` (not from Stripe Dashboard)
- The secret changes each time you restart `stripe listen`
- Update `.env.local` and restart dev server when secret changes



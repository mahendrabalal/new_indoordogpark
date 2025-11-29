# Troubleshooting: Webhooks Still Not Working

## Current Status
- ✅ Dev server running on port 3000
- ✅ Checkout session created successfully
- ✅ User redirected to dashboard
- ❌ **No webhook events received**

## Diagnostic Steps

### Step 1: Verify Stripe CLI is Running

**Do you have a separate terminal running this command?**

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

**If NO:**
1. Open a new terminal window
2. Run: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
3. Copy the webhook secret it shows
4. Add it to `.env.local` as `STRIPE_WEBHOOK_SECRET`
5. Restart your dev server

**If YES:**
- Check that terminal - do you see any webhook events being forwarded?
- If you see events but they're failing, check the error messages

### Step 2: Verify Webhook Secret

1. In your Stripe CLI terminal, copy the webhook secret (starts with `whsec_`)
2. Check your `.env.local` file has:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```
3. Make sure it matches EXACTLY what Stripe CLI shows
4. If you updated it, restart your dev server

### Step 3: Check Payment Status in Stripe Dashboard

1. Go to https://dashboard.stripe.com/test/payments
2. Find the payment with session ID: `cs_test_b1bgR2ND1LMPFtHH8Y0Dmwdu9FBSAtPDpKnQgpFsiwxCS0KDegHH2HtHiy`
3. Check the payment status:
   - **If "Succeeded"**: Webhook should have fired (check Stripe CLI terminal)
   - **If "Pending" or "Failed"**: Payment didn't complete, webhook won't fire

### Step 4: Test Webhook Endpoint Directly

In your Stripe CLI terminal, trigger a test event:

```bash
stripe trigger checkout.session.completed
```

**Expected result:**
- Stripe CLI should show: `--> checkout.session.completed [evt_...]`
- Your dev server should show: `🔔 Webhook received at /api/stripe/webhook`

**If this works:** Your webhook setup is correct, but real payments aren't triggering webhooks (check payment status)

**If this doesn't work:** Your webhook endpoint isn't receiving events (check Stripe CLI and webhook secret)

## Common Issues

### Issue 1: Stripe CLI Not Running
**Symptom:** No webhook events at all
**Fix:** Start Stripe CLI in a separate terminal

### Issue 2: Wrong Webhook Secret
**Symptom:** "Webhook signature verification failed" in logs
**Fix:** Update `.env.local` with the secret from `stripe listen` and restart server

### Issue 3: Payment Didn't Actually Complete
**Symptom:** Checkout shows success but payment is pending/failed in Stripe
**Fix:** Use a valid test card (`4242 4242 4242 4242`) and ensure payment succeeds

### Issue 4: Port Mismatch
**Symptom:** Stripe CLI forwarding to wrong port
**Fix:** Make sure Stripe CLI forwards to the same port as your dev server

## Quick Test

Run this command in your Stripe CLI terminal:

```bash
stripe trigger checkout.session.completed
```

Then check your dev server logs - you should see:
```
🔔 Webhook received at /api/stripe/webhook
✅ Webhook verified: checkout.session.completed
```

If you see this, your webhook setup is working! The issue is that real payments aren't completing successfully.



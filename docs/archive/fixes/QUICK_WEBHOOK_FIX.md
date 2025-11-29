# Quick Fix: Webhooks Not Working

## The Problem
Your checkout is completing successfully, but webhooks aren't being received, so listings aren't upgrading to "featured".

## The Solution (Choose One)

### Option 1: Use Stripe CLI (Recommended for Local Development)

**Step 1:** Open a **new terminal window** and run:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

**Step 2:** Copy the webhook secret it outputs (starts with `whsec_`)

**Step 3:** Update your `.env.local`:
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

**Step 4:** Restart your dev server (`npm run dev`)

**Step 5:** Test again - you should now see webhook events in your logs!

### Option 2: Manually Verify Payment (Quick Test)

If you want to test without setting up webhooks right now, you can manually verify the payment worked:

1. Go to Stripe Dashboard → Payments
2. Find the payment with session ID: `cs_test_b1AXIhmxg2gHVjXsHQsSFhQfMycQNtU2t3HN0XmqZbD7f3yQr8JSdlMDgw`
3. Check if it shows as "Succeeded"
4. If it succeeded, the webhook should have fired (but wasn't received locally)

### Option 3: Trigger Webhook Manually (For Testing)

If you have Stripe CLI installed:

```bash
# Trigger a test checkout.session.completed event
stripe trigger checkout.session.completed
```

This will send a test webhook to your local server (if `stripe listen` is running).

## How to Know It's Working

When webhooks are working, you'll see in your dev server logs:

```
🔔 Webhook received at /api/stripe/webhook
✅ Webhook verified: checkout.session.completed (ID: evt_...)
💳 Checkout session completed: cs_test_..., Payment status: paid
Featured listing activated for park: ...
```

## Why This Happens

- **Local Development:** Stripe can't reach `localhost:3000` from the internet
- **Solution:** Stripe CLI creates a tunnel to forward webhooks to your local server
- **Production:** Webhooks work automatically when deployed (configure endpoint in Stripe Dashboard)

## Next Steps

1. Set up Stripe CLI forwarding (Option 1 above)
2. Test a new checkout
3. Verify webhook events appear in logs
4. Check that listing upgrades to "featured" in your database



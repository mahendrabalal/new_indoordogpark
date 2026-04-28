# Final Webhook Setup Checklist

## ✅ Current Status
- Dev server running on port 3000 ✓
- Stripe CLI should be forwarding to port 3000

## Final Steps

### 1. Verify Stripe CLI is Running

In a **separate terminal**, make sure you have:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

You should see:
```
> Ready! Your webhook signing secret is whsec_...
```

### 2. Verify Webhook Secret in .env.local

Make sure your `.env.local` has the webhook secret from Stripe CLI:

```env
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
```

**Important:** If you restarted `stripe listen`, you'll get a NEW secret. Update `.env.local` with the new one and restart your dev server.

### 3. Restart Dev Server (if you updated .env.local)

If you just updated `.env.local`, restart your dev server:
1. Stop it (Ctrl+C)
2. Start again: `npm run dev`

### 4. Test a Payment

1. Go to `/list-your-park`
2. Complete the form and select "Featured" plan
3. Use test card: `4242 4242 4242 4242`
4. Complete checkout

### 5. Check Logs

**In your dev server terminal**, you should see:
```
🔔 Webhook received at /api/stripe/webhook
✅ Webhook verified: checkout.session.completed (ID: evt_...)
💳 Checkout session completed: cs_test_... Payment status: paid
Featured listing activated for park: ...
```

**In your Stripe CLI terminal**, you should see:
```
2025-01-XX XX:XX:XX   --> checkout.session.completed [evt_...]
2025-01-XX XX:XX:XX  <--  [200] POST http://localhost:3000/api/stripe/webhook [evt_...]
```

## Troubleshooting

### Still no webhooks?

1. **Check Stripe CLI is running:**
   - Should show "Ready!" message
   - Should be forwarding to `localhost:3000`

2. **Check webhook secret matches:**
   ```bash
   # In Stripe CLI terminal, copy the secret shown
   # In .env.local, make sure STRIPE_WEBHOOK_SECRET matches exactly
   ```

3. **Restart dev server after updating .env.local:**
   - Environment variables load on startup
   - Changes require a restart

4. **Check payment actually succeeded:**
   - Go to Stripe Dashboard → Payments
   - Verify payment shows as "Succeeded"
   - If payment failed, webhook won't fire

### Webhook signature verification failed?

- Secret in `.env.local` doesn't match Stripe CLI secret
- Update `.env.local` and restart dev server

## Success Indicators

When everything works:
- ✅ Webhook events appear in dev server logs
- ✅ Listing upgrades to "featured" in database
- ✅ You see "Featured listing activated" message
- ✅ Payment shows in Stripe Dashboard



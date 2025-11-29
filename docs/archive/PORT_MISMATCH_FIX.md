# Port Mismatch Fix

## The Problem

Your Stripe CLI is forwarding to `localhost:3000`, but your dev server is running on `localhost:3002` because ports 3000 and 3001 are already in use.

## Solution: Update Stripe CLI Forwarding

**Option 1: Forward to the correct port (Quick Fix)**

In your Stripe CLI terminal, stop it (Ctrl+C) and restart with the correct port:

```bash
stripe listen --forward-to localhost:3002/api/stripe/webhook
```

**Option 2: Free up port 3000 (Recommended)**

1. Find what's using port 3000:
   ```bash
   lsof -ti:3000
   ```

2. Kill the process:
   ```bash
   kill -9 $(lsof -ti:3000)
   ```

3. Do the same for port 3001:
   ```bash
   kill -9 $(lsof -ti:3001)
   ```

4. Restart your dev server - it should now use port 3000:
   ```bash
   npm run dev
   ```

5. Restart Stripe CLI (if you stopped it):
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

## After Fixing

Once the ports match, test a payment again. You should see webhook events in your dev server logs:

```
🔔 Webhook received at /api/stripe/webhook
✅ Webhook verified: checkout.session.completed
💳 Checkout session completed: cs_test_... Payment status: paid
```


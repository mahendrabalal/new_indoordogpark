# Payment Validation Fix: Prevent Unpaid Featured Listings

## Critical Issue
The webhook handler was upgrading park submissions to "featured" status on `checkout.session.completed` **without verifying that payment actually succeeded**. This allowed invalid credit card numbers to create featured listings without payment.

## Root Cause
The `checkout.session.completed` event fires when a checkout session is completed, **regardless of payment status**. It can fire even if:
- Payment failed
- Invalid credit card was used
- Payment was declined
- Test mode allowed invalid cards through

The webhook handler was not checking `session.payment_status` before upgrading to featured.

## Solution Implemented

### 1. Payment Status Validation
**File:** `src/app/api/stripe/webhook/route.ts` - `handleCheckoutSessionCompleted()`

Added validation checks:
- ✅ **`session.payment_status === 'paid'`** - Only proceed if payment actually succeeded
- ✅ **`session.subscription` exists** - Verify subscription was created
- ✅ **Subscription status is 'active' or 'trialing'** - Ensure subscription is valid

```typescript
// CRITICAL: Verify payment was actually successful
if (session.payment_status !== 'paid') {
  console.error(`Payment not successful. Status: ${session.payment_status}`);
  return; // Don't upgrade to featured
}

// Verify subscription is in valid state
const validStatuses = ['active', 'trialing'];
if (!validStatuses.includes(subscriptionData.status)) {
  console.error(`Subscription not in valid state: ${subscriptionData.status}`);
  return; // Don't upgrade to featured
}
```

### 2. Enhanced Invoice Payment Handler
**File:** `src/app/api/stripe/webhook/route.ts` - `handleInvoicePaymentSucceeded()`

Enhanced to:
- Verify invoice is actually paid (`invoice.paid === true` and `invoice.status === 'paid'`)
- Upgrade listings that weren't upgraded by `checkout.session.completed` (backup mechanism)
- Only upgrade if payment is confirmed

## How It Works Now

### Payment Flow:
1. User completes checkout with valid payment → `checkout.session.completed` fires
2. **Webhook validates:** `payment_status === 'paid'` ✅
3. **Webhook validates:** Subscription status is 'active' or 'trialing' ✅
4. **Only then** upgrades to `listing_type: 'featured'`

### Failed Payment Flow:
1. User completes checkout with invalid payment → `checkout.session.completed` fires
2. **Webhook validates:** `payment_status !== 'paid'` ❌
3. **Webhook returns early** - No upgrade to featured
4. Submission remains as `listing_type: 'free'`

### Backup Mechanism:
- `invoice.payment_succeeded` event also validates and upgrades (if needed)
- Provides redundancy in case `checkout.session.completed` fires before payment confirmation

## Testing

### Test Valid Payment:
1. Use Stripe test card: `4242 4242 4242 4242`
2. Complete checkout
3. Verify webhook logs show payment validation
4. Verify listing is upgraded to featured

### Test Invalid Payment:
1. Use invalid card number (e.g., random numbers)
2. Complete checkout (may show success in test mode)
3. Check webhook logs - should show payment status validation failure
4. Verify listing remains as 'free' (not upgraded)

### Test Failed Payment:
1. Use card that will decline: `4000 0000 0000 0002`
2. Complete checkout
3. Verify webhook doesn't upgrade to featured
4. Verify listing remains as 'free'

## Fixing Existing Incorrectly Upgraded Listings

If you have listings that were incorrectly upgraded to featured without payment, run this SQL:

```sql
-- Find incorrectly upgraded listings (featured but no valid subscription)
SELECT 
  id,
  name,
  city,
  listing_type,
  stripe_subscription_id,
  subscription_status,
  created_at
FROM park_submissions
WHERE listing_type = 'featured'
  AND (
    stripe_subscription_id IS NULL 
    OR stripe_subscription_id = ''
    OR subscription_status NOT IN ('active', 'trialing')
  );

-- Downgrade them to free
UPDATE park_submissions
SET listing_type = 'free',
    updated_at = NOW()
WHERE listing_type = 'featured'
  AND (
    stripe_subscription_id IS NULL 
    OR stripe_subscription_id = ''
    OR subscription_status NOT IN ('active', 'trialing')
  );
```

Or use the script: `scripts/fix-unpaid-featured-listings.sql`

## Stripe Test Mode Notes

⚠️ **Important:** In Stripe test mode, some invalid cards may appear to "succeed" in the UI but won't actually process payment. The webhook will now correctly reject these.

**Valid Test Cards:**
- `4242 4242 4242 4242` - Success
- `4000 0025 0000 3155` - Requires authentication

**Invalid Test Cards (will be rejected by webhook):**
- Random numbers
- `4000 0000 0000 0002` - Card declined
- `4000 0000 0000 9995` - Insufficient funds

## Files Modified

- `src/app/api/stripe/webhook/route.ts`
  - `handleCheckoutSessionCompleted()` - Added payment status validation
  - `handleInvoicePaymentSucceeded()` - Enhanced with validation and upgrade logic

## Security Impact

**Before:** Invalid payments could create featured listings
**After:** Only verified successful payments create featured listings

This prevents:
- Revenue loss from unpaid featured listings
- Abuse of the payment system
- Incorrect featured listings appearing on the site


# Stripe Promotion Code Setup - FIRST50

## ✅ Code Updated

I've enabled promotion codes in your Stripe checkout. Now you need to create the coupon in Stripe Dashboard.

## Step 1: Create Coupon in Stripe

1. Go to: https://dashboard.stripe.com/coupons
2. Click **"+ Create coupon"**
3. Fill in:
   - **Name:** `FIRST50`
   - **ID:** `FIRST50` (optional, but recommended)
   - **Discount type:** `Percentage`
   - **Percent off:** `50%`
   - **Duration:** `Once` (applies to first payment only)
   - **Redemption limits:** 
     - Can be used: `Unlimited` (or set a limit like 100)
   - **Expiration:** Optional (set end date if needed)
4. Click **"Create coupon"**

## Step 2: Create Promotion Code

1. After creating the coupon, click **"Create promotion code"**
2. Fill in:
   - **Code:** `FIRST50`
   - **Coupon:** Select the `FIRST50` coupon you just created
   - **Active:** ✅ Enabled
   - **Max redemptions:** Optional (limit how many times it can be used)
3. Click **"Create promotion code"**

## Step 3: Test It

1. Go to your checkout page
2. You should see a "Promo code" or "Add promotion code" link
3. Enter: `FIRST50`
4. It should apply 50% discount to the first payment

## How It Works

- **First payment:** 50% off (e.g., $9.99 → $4.99)
- **Subsequent payments:** Full price ($9.99/month)
- **Duration:** Only applies to the first invoice

## Alternative: Remove Promotion Mention

If you don't want to set up the promotion code, I can remove it from the email templates. Just let me know!

---

**Status:** Promotion code support enabled in checkout. Create the coupon in Stripe Dashboard to activate it.


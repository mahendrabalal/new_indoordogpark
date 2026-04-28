# Dog Park Listing Feature - Setup & Testing Guide

## Overview

This guide will help you set up and test the complete "List Your Park" feature with Stripe integration for free and featured ($9.99/month) listings.

## Features Implemented

✅ Multi-step park listing form (6 steps)
✅ User authentication integration
✅ Free listing option (requires admin approval)
✅ Featured listing option ($9.99/month via Stripe subscription)
✅ User dashboard to manage listings
✅ Stripe checkout integration
✅ Stripe webhook handler for subscription events
✅ Featured parks section on homepage
✅ Admin dashboard for approving/rejecting submissions
✅ Subscription management via Stripe Customer Portal

## Prerequisites

- Node.js and npm installed
- Supabase account and project
- Stripe account (test mode)
- All environment variables configured

## Step 1: Database Setup

### 1.1 Run the SQL Migration

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to your project: https://jmvgnrwqcjtrudadxttq.supabase.co
3. Click on "SQL Editor" in the left sidebar
4. Click "New query"
5. Copy the entire contents of `supabase/migrations/create_park_listings_tables.sql`
6. Paste it into the query editor
7. Click "Run" to execute the migration
8. Create a new query, paste the contents of `supabase/migrations/20241208120000_add_listing_type_to_park_submissions.sql`, and run it to backfill the required `listing_type` column (run this even if your database was created earlier).

This will create:
- `park_submissions` table (stores all park listings)
- `subscriptions` table (tracks Stripe subscriptions)
- Indexes for performance
- Row Level Security (RLS) policies
- Triggers for auto-updating timestamps and generating slugs

### 1.2 Verify Tables

After running the migration, verify the tables were created:
1. Go to "Table Editor" in Supabase Dashboard
2. You should see `park_submissions` and `subscriptions` tables

## Step 2: Stripe Configuration

### 2.1 Create a Product in Stripe

1. Log in to your Stripe Dashboard: https://dashboard.stripe.com
2. Make sure you're in **Test Mode** (toggle in top right)
3. Navigate to **Products** → **Add product**
4. Fill in:
   - Name: "Featured Dog Park Listing"
   - Description: "Premium featured listing for dog parks"
   - Price: $9.99 USD
   - Billing period: Monthly (recurring)
5. Click "Save product"
6. Copy the **Price ID** (starts with `price_`)
7. Update your `.env.local` with this Price ID (already done: `price_1SQc2MFBheWcIExC91i01WCW`)

### 2.2 Configure Webhook Endpoint

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://yourdomain.com/api/stripe/webhook` (for local testing, use Stripe CLI)
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click "Add endpoint"
6. Copy the **Signing secret** (starts with `whsec_`)
7. Update your `.env.local` with this webhook secret (already done)

### 2.3 Test Webhooks Locally with Stripe CLI

For local development, use the Stripe CLI to forward webhooks:

\`\`\`bash
# Login to Stripe CLI (you already have it installed at /opt/homebrew/bin/stripe)
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/stripe/webhook

# This will output a webhook signing secret (whsec_...)
# Use this secret in your .env.local for STRIPE_WEBHOOK_SECRET during local testing
\`\`\`

Keep this terminal running while testing locally!

## Step 3: Environment Variables Check

Verify all environment variables in `.env.local`:

\`\`\`bash
# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=https://jmvgnrwqcjtrudadxttq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# Stripe (configured)
STRIPE_SECRET_KEY=sk_test_51S1rayFBheWcIExC...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51S1rayFBheWcIExC...
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
STRIPE_FEATURED_PRICE_ID=price_1SQc2MFBheWcIExC91i01WCW

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
\`\`\`

## Step 4: Set Up Admin User

To access the admin dashboard, you need to set your user as admin:

1. Sign up for an account at http://localhost:3000/signup
2. Verify your email in Supabase Dashboard → Authentication → Users
3. Go to SQL Editor in Supabase
4. Run this query (replace with your email):

\`\`\`sql
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'your-email@example.com';
\`\`\`

5. Log out and log back in to see the admin role take effect

## Step 5: Start the Development Server

\`\`\`bash
# Make sure you're in the project directory
cd /Users/mahendrabalal/Desktop/scraper

# Install dependencies (already done)
npm install

# Start the development server
npm run dev
\`\`\`

The app will be available at: http://localhost:3000

## Step 6: Testing the Complete Flow

### 6.1 Test Free Listing Submission

1. Navigate to http://localhost:3000
2. Click "Sign up" if you haven't already created an account
3. After logging in, click "List your park" in the header
4. Fill out the 6-step form:
   - **Step 1**: Basic Info (name, type, description)
   - **Step 2**: Location (address, city, state, coordinates)
   - **Step 3**: Contact & Hours (phone, email, website, social media, hours)
   - **Step 4**: Amenities (select applicable amenities)
   - **Step 5**: Photos & Pricing (add photo URLs, pricing info)
   - **Step 6**: Review & Submit (select "Free" plan)
5. Click "Submit Listing for Review"
6. You should be redirected to your dashboard
7. The listing will show status as "PENDING"

### 6.2 Test Featured Listing with Stripe

1. Click "List your park" again
2. Fill out the form with different data
3. On Step 6, select "Featured" plan ($9.99/month)
4. Click "Submit & Continue to Payment"
5. You'll be redirected to Stripe Checkout
6. Use a Stripe test card:
   - Card number: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/34)
   - CVC: Any 3 digits (e.g., 123)
   - ZIP: Any 5 digits (e.g., 12345)
7. Complete the payment
8. You'll be redirected back to your dashboard
9. The listing will show "FEATURED" badge and status "PENDING"

### 6.3 Test Admin Approval

1. Log out and log in with your admin account
2. Navigate to http://localhost:3000/admin
3. You should see all pending submissions
4. Click "Approve" on a submission
5. The submission will move to "APPROVED" status
6. Navigate to the homepage
7. If it's a featured listing, it will appear in the "Featured Dog Parks" section

### 6.4 Test Admin Rejection

1. In the admin dashboard, click "Reject" on a pending submission
2. Enter a rejection reason (e.g., "Incomplete information")
3. Click "Reject"
4. The user will see the rejection reason in their dashboard

### 6.5 Test Dashboard Features

1. Log in as a regular user
2. Navigate to http://localhost:3000/dashboard
3. You should see all your submissions
4. For approved free listings, you'll see "Upgrade to Featured" button
5. Click "Upgrade to Featured" and complete the payment flow
6. For featured listings, you'll see "Manage Subscription" button
7. Click "Manage Subscription" to access Stripe Customer Portal
8. In the portal, you can:
   - Update payment method
   - Cancel subscription
   - View billing history

### 6.6 Test Webhook Events

With Stripe CLI running (`stripe listen --forward-to localhost:3000/api/stripe/webhook`):

1. Complete a featured listing purchase
2. Watch the Stripe CLI terminal for webhook events
3. Check the database to verify subscription data was saved
4. Test subscription cancellation from Customer Portal
5. Verify the listing downgrades from "featured" to "free"

## Step 7: Testing Stripe Webhooks in Production

When deploying to production:

1. Update the webhook endpoint URL in Stripe Dashboard to your production URL
2. Use the production webhook secret in your environment variables
3. Test the complete flow in production with test mode enabled
4. Once tested, switch Stripe to live mode and update API keys

## Common Test Scenarios

### Test Card Numbers

Stripe provides test cards for different scenarios:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Insufficient funds**: `4000 0000 0000 9995`
- **3D Secure required**: `4000 0027 6000 3184`

### Expected Behaviors

1. **Free listing submission**:
   - Status: Pending → Approved (after admin approval)
   - No Stripe subscription created
   - Appears in regular search results when approved

2. **Featured listing submission**:
   - Redirects to Stripe Checkout
   - After payment: Status = Pending, Type = Featured
   - After admin approval: Appears in "Featured Dog Parks" section
   - Subscription auto-renews monthly

3. **Upgrade from free to featured**:
   - Creates new Stripe subscription
   - Updates listing type to "featured"
   - Shows in featured section after next approval (if needed)

4. **Subscription cancellation**:
   - Subscription canceled at period end
   - Listing stays featured until period ends
   - After period: listing type changes to "free"
   - Listing removed from featured section

## Troubleshooting

### Issue: Webhooks not received locally

**Solution**: Make sure Stripe CLI is running:
\`\`\`bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
\`\`\`

### Issue: "Unauthorized" errors

**Solution**:
- Make sure you're logged in
- Check that JWT token is valid (try logging out and back in)
- Verify Supabase URL and anon key in .env.local

### Issue: Database errors

**Solution**:
- Check that migration ran successfully
- Verify RLS policies are enabled
- Check Supabase logs in Dashboard → Logs

### Issue: Admin dashboard shows "Forbidden"

**Solution**:
- Verify admin role is set in user metadata:
\`\`\`sql
SELECT raw_user_meta_data FROM auth.users WHERE email = 'your-email@example.com';
\`\`\`

### Issue: Featured parks not showing on homepage

**Solution**:
- Verify listings are approved
- Check listing_type is 'featured'
- Check browser console for API errors

## Next Steps

After successful testing:

1. **Deploy to production**:
   - Update environment variables with production Stripe keys
   - Update webhook URL in Stripe Dashboard
   - Deploy database migration to production Supabase

2. **Add email notifications** (optional):
   - Submission confirmation emails
   - Approval/rejection emails
   - Payment confirmation emails
   - Renewal reminder emails

3. **Enhance features** (optional):
   - Add image upload to Supabase Storage
   - Add park ratings and reviews
   - Add analytics dashboard
   - Add search/filter in admin dashboard

## Support

For issues or questions:
- Check Stripe logs: https://dashboard.stripe.com/logs
- Check Supabase logs: Supabase Dashboard → Logs
- Review browser console for frontend errors
- Check server logs for API route errors

## Summary of URLs

- **Homepage**: http://localhost:3000
- **List Property**: http://localhost:3000/list-property
- **User Dashboard**: http://localhost:3000/dashboard
- **Admin Dashboard**: http://localhost:3000/admin (admin role required)
- **Stripe Dashboard**: https://dashboard.stripe.com (test mode)
- **Supabase Dashboard**: https://supabase.com/dashboard

Happy testing! 🐕🎉

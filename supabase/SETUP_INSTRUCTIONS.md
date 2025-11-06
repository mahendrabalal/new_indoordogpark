# Supabase Database Setup Instructions

## Option 1: Using Supabase Dashboard (Recommended for beginners)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to the SQL Editor
3. Create a new query
4. Copy and paste the contents of `migrations/create_park_listings_tables.sql`
5. Click "Run" to execute the migration

## Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Link to your project (if not already linked)
supabase link --project-ref jmvgnrwqcjtrudadxttq

# Run the migration
supabase db push
```

## Verify Installation

After running the migration, verify the tables were created:

1. Go to Table Editor in Supabase Dashboard
2. You should see two new tables:
   - `park_submissions`
   - `subscriptions`

## Setting up Admin Role (Optional)

To create an admin user for the admin dashboard:

1. Go to SQL Editor in Supabase Dashboard
2. Run this query to add a custom claim to your user:

```sql
-- First, get your user ID from the Authentication tab
-- Then run this to add admin role metadata
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'your-admin-email@example.com';
```

## Next Steps

1. Configure your Stripe account
2. Create a product in Stripe Dashboard for "Featured Park Listing" at $9.99/month
3. Copy the Price ID to your `.env.local` as `STRIPE_FEATURED_PRICE_ID`

-- Script to find and fix listings that were incorrectly upgraded to featured
-- without valid payment (subscription status not active/trialing)

-- Step 1: Find incorrectly upgraded listings
SELECT 
  id,
  name,
  city,
  listing_type,
  stripe_subscription_id,
  subscription_status,
  created_at,
  updated_at
FROM park_submissions
WHERE listing_type = 'featured'
  AND (
    stripe_subscription_id IS NULL 
    OR stripe_subscription_id = ''
    OR subscription_status IS NULL
    OR subscription_status NOT IN ('active', 'trialing')
  )
ORDER BY created_at DESC;

-- Step 2: Verify the count
SELECT 
  COUNT(*) as incorrectly_upgraded_count
FROM park_submissions
WHERE listing_type = 'featured'
  AND (
    stripe_subscription_id IS NULL 
    OR stripe_subscription_id = ''
    OR subscription_status IS NULL
    OR subscription_status NOT IN ('active', 'trialing')
  );

-- Step 3: Downgrade incorrectly upgraded listings to free
-- UNCOMMENT THE FOLLOWING TO EXECUTE:
/*
UPDATE park_submissions
SET 
  listing_type = 'free',
  updated_at = NOW()
WHERE listing_type = 'featured'
  AND (
    stripe_subscription_id IS NULL 
    OR stripe_subscription_id = ''
    OR subscription_status IS NULL
    OR subscription_status NOT IN ('active', 'trialing')
  );
*/

-- Step 4: Verify the fix
-- UNCOMMENT TO VERIFY:
/*
SELECT 
  COUNT(*) as remaining_incorrect_count
FROM park_submissions
WHERE listing_type = 'featured'
  AND (
    stripe_subscription_id IS NULL 
    OR stripe_subscription_id = ''
    OR subscription_status IS NULL
    OR subscription_status NOT IN ('active', 'trialing')
  );
-- Should return 0
*/


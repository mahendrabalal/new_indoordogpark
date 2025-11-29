-- Script to fix existing unpaid featured listings
-- This downgrades submissions that have listing_type = 'featured' but no payment

-- First, let's see what we're dealing with
SELECT 
  id,
  name,
  city,
  listing_type,
  stripe_subscription_id,
  stripe_customer_id,
  subscription_status,
  created_at
FROM park_submissions
WHERE listing_type = 'featured'
  AND (stripe_subscription_id IS NULL OR stripe_subscription_id = '');

-- Downgrade unpaid featured listings to free
-- Uncomment the line below to execute the fix:
-- UPDATE park_submissions
-- SET listing_type = 'free',
--     updated_at = NOW()
-- WHERE listing_type = 'featured'
--   AND (stripe_subscription_id IS NULL OR stripe_subscription_id = '');

-- Verify the fix
-- SELECT 
--   COUNT(*) as unpaid_featured_count
-- FROM park_submissions
-- WHERE listing_type = 'featured'
--   AND (stripe_subscription_id IS NULL OR stripe_subscription_id = '');


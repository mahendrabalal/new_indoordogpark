-- =============================================
-- Add 'partner' type to subscribers table
-- Run this in your Supabase SQL Editor
-- =============================================

-- 1. Drop the existing check constraint
ALTER TABLE subscribers DROP CONSTRAINT IF EXISTS subscribers_type_check;

-- 2. Add the new check constraint allowing 'owner', 'consumer', and 'partner'
ALTER TABLE subscribers ADD CONSTRAINT subscribers_type_check CHECK (type IN ('owner', 'consumer', 'partner'));

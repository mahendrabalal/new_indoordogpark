-- Fix foreign key constraint for reviews table
-- The constraint should reference auth.users(id), not users(id)

-- Drop the existing foreign key constraint if it exists
ALTER TABLE IF EXISTS public.reviews 
  DROP CONSTRAINT IF EXISTS reviews_user_id_fkey;

-- Recreate the foreign key constraint with the correct reference
ALTER TABLE IF EXISTS public.reviews
  ADD CONSTRAINT reviews_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;


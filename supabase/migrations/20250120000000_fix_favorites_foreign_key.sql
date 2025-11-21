-- Fix foreign key constraint on favorites table
-- The constraint should reference auth.users(id), not users(id)

-- Drop the existing constraint if it exists
ALTER TABLE public.favorites 
DROP CONSTRAINT IF EXISTS favorites_user_id_fkey;

-- Recreate the constraint to reference auth.users(id)
ALTER TABLE public.favorites
ADD CONSTRAINT favorites_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- Verify the constraint
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'favorites_user_id_fkey'
    AND table_schema = 'public'
    AND table_name = 'favorites'
  ) THEN
    RAISE NOTICE 'Foreign key constraint fixed successfully';
  ELSE
    RAISE EXCEPTION 'Failed to create foreign key constraint';
  END IF;
END $$;











-- Add status column to reviews table
ALTER TABLE IF EXISTS public.reviews
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending' 
  CHECK (status IN ('pending', 'approved', 'rejected'));

-- Update existing reviews to 'approved' if they don't have a status
UPDATE public.reviews
SET status = 'approved'
WHERE status IS NULL;

-- Make status NOT NULL after setting defaults
ALTER TABLE IF EXISTS public.reviews
  ALTER COLUMN status SET NOT NULL;

-- Create index for faster status filtering
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);


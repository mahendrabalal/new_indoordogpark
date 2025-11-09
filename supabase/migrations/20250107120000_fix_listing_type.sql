-- Add listing_type column if it doesn't exist
ALTER TABLE park_submissions
ADD COLUMN IF NOT EXISTS listing_type VARCHAR(20) DEFAULT 'free';

-- Set default for existing rows
UPDATE park_submissions
SET listing_type = 'free'
WHERE listing_type IS NULL;

-- Make it NOT NULL
ALTER TABLE park_submissions
ALTER COLUMN listing_type SET NOT NULL;

-- Add constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'park_submissions_listing_type_check'
  ) THEN
    ALTER TABLE park_submissions
    ADD CONSTRAINT park_submissions_listing_type_check
    CHECK (listing_type IN ('free', 'featured'));
  END IF;
END $$;

-- Create index
CREATE INDEX IF NOT EXISTS idx_park_submissions_listing_type
ON park_submissions(listing_type);

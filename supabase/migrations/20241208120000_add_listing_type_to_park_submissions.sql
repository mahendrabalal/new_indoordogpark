-- Migration: Ensure park_submissions has listing_type support for featured listings

DO $$
BEGIN
  ALTER TABLE park_submissions
    ADD COLUMN listing_type VARCHAR(20);
EXCEPTION
  WHEN duplicate_column THEN
    RAISE NOTICE 'column "listing_type" already exists on park_submissions';
END;
$$;

UPDATE park_submissions
SET listing_type = COALESCE(listing_type, 'free');

ALTER TABLE park_submissions
  ALTER COLUMN listing_type SET DEFAULT 'free';

ALTER TABLE park_submissions
  ALTER COLUMN listing_type SET NOT NULL;

DO $$
BEGIN
  ALTER TABLE park_submissions
    ADD CONSTRAINT park_submissions_listing_type_check
    CHECK (listing_type IN ('free', 'featured'));
EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'constraint park_submissions_listing_type_check already exists';
END;
$$;

CREATE INDEX IF NOT EXISTS idx_park_submissions_listing_type
  ON park_submissions(listing_type);

COMMENT ON COLUMN park_submissions.listing_type IS
  'Labels a submission as free or featured (paid) for homepage filtering.';

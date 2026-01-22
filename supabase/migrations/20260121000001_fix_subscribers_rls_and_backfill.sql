-- 1. Backfill existing subscribers to 'pending' outreach status if they are NULL
UPDATE subscribers 
SET outreach_status = 'pending' 
WHERE outreach_status IS NULL;

-- 2. Add RLS policy for admins to view all subscribers
-- We check for 'admin' role in user_metadata which is where the app stores it
CREATE POLICY "Admins can view all subscribers"
  ON subscribers
  FOR SELECT
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- 3. Also allow admins to update subscribers (for outreach tracking)
CREATE POLICY "Admins can update subscribers"
  ON subscribers
  FOR UPDATE
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

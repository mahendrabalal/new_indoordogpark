-- Add outreach tracking columns to park_submissions
ALTER TABLE park_submissions 
ADD COLUMN IF NOT EXISTS last_outreach_sent_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS outreach_status VARCHAR(20) DEFAULT 'pending' CHECK (outreach_status IN ('pending', 'sent', 'responded'));

-- Create index for filtering by outreach status
CREATE INDEX IF NOT EXISTS idx_park_submissions_outreach_status ON park_submissions(outreach_status);
CREATE INDEX IF NOT EXISTS idx_park_submissions_last_outreach_sent_at ON park_submissions(last_outreach_sent_at);

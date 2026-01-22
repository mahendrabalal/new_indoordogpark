-- Add outreach tracking columns to subscribers table
ALTER TABLE subscribers 
ADD COLUMN IF NOT EXISTS last_outreach_sent_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS outreach_status VARCHAR(20) DEFAULT 'pending' CHECK (outreach_status IN ('pending', 'sent', 'responded'));

-- Create index for filtering by outreach status
CREATE INDEX IF NOT EXISTS idx_subscribers_outreach_status ON subscribers(outreach_status);
CREATE INDEX IF NOT EXISTS idx_subscribers_last_outreach_sent_at ON subscribers(last_outreach_sent_at);

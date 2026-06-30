-- Add status, subject, and body_content to email_campaign_logs
ALTER TABLE email_campaign_logs
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'draft', 'failed')),
ADD COLUMN IF NOT EXISTS subject TEXT,
ADD COLUMN IF NOT EXISTS body_content TEXT;

-- Index the status for faster queries
CREATE INDEX IF NOT EXISTS idx_email_campaign_logs_status ON email_campaign_logs(status);

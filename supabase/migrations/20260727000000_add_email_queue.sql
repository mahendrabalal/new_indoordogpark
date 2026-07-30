-- Create email queue table for batching emails and respecting daily limits
CREATE TABLE IF NOT EXISTS email_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_email VARCHAR(255) NOT NULL,
    campaign_name VARCHAR(255) NOT NULL,
    subject TEXT NOT NULL,
    html_content TEXT NOT NULL,
    scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for querying pending emails that are ready to send
CREATE INDEX IF NOT EXISTS idx_email_queue_pending_scheduled 
ON email_queue(status, scheduled_for) 
WHERE status = 'pending';

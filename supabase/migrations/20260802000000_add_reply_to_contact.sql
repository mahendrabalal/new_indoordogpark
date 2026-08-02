-- Add reply_message and replied_at columns to contact_submissions
ALTER TABLE contact_submissions
ADD COLUMN IF NOT EXISTS reply_message TEXT,
ADD COLUMN IF NOT EXISTS replied_at TIMESTAMPTZ;

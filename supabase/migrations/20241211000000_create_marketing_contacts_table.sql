-- Create marketing_contacts table for email campaigns
CREATE TABLE IF NOT EXISTS marketing_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  park_id UUID REFERENCES park_submissions(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  city VARCHAR(100),
  state VARCHAR(50),
  phone VARCHAR(50),
  website VARCHAR(500),
  source VARCHAR(50) DEFAULT 'imported',
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced', 'invalid')),
  email_sent BOOLEAN DEFAULT FALSE,
  last_email_sent TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(email)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_marketing_contacts_email ON marketing_contacts(email);
CREATE INDEX IF NOT EXISTS idx_marketing_contacts_status ON marketing_contacts(status);
CREATE INDEX IF NOT EXISTS idx_marketing_contacts_email_sent ON marketing_contacts(email_sent);
CREATE INDEX IF NOT EXISTS idx_marketing_contacts_source ON marketing_contacts(source);

-- Create or replace updated_at trigger function
CREATE OR REPLACE FUNCTION update_marketing_contacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS update_marketing_contacts_updated_at_trigger ON marketing_contacts;

-- Create trigger
CREATE TRIGGER update_marketing_contacts_updated_at_trigger
  BEFORE UPDATE ON marketing_contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_marketing_contacts_updated_at();

-- Row Level Security (RLS)
ALTER TABLE marketing_contacts ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything (for scripts)
CREATE POLICY "Service role full access" ON marketing_contacts
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Policy: Anonymous can read (for public view if needed)
-- CREATE POLICY "Anonymous read access" ON marketing_contacts
--   FOR SELECT
--   USING (auth.role() = 'anon');
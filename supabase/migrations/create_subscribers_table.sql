-- ============================================
-- EMAIL SUBSCRIBERS TABLE
-- ============================================
-- This table stores email subscribers segmented by type (owner/consumer)
-- ============================================

-- Create subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('owner', 'consumer')),
  source TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_type ON subscribers(type);
CREATE INDEX IF NOT EXISTS idx_subscribers_status ON subscribers(status);
CREATE INDEX IF NOT EXISTS idx_subscribers_created_at ON subscribers(created_at DESC);

-- Create updated_at trigger (reuse existing function)
CREATE TRIGGER update_subscribers_updated_at
  BEFORE UPDATE ON subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Allow public to insert (for signup forms)
CREATE POLICY "Anyone can subscribe"
  ON subscribers
  FOR INSERT
  WITH CHECK (true);

-- Only allow reading your own subscription (by email)
CREATE POLICY "Users can view own subscription"
  ON subscribers
  FOR SELECT
  USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Admin users can view all (you'll need to adjust this based on your admin setup)
-- For now, we'll allow service role to manage everything
-- This is handled by Supabase service role key in backend

-- ============================================
-- SETUP COMPLETE!
-- ============================================

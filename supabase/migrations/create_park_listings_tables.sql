-- Create park_submissions table
CREATE TABLE IF NOT EXISTS park_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Basic Information
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  business_type VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,

  -- Location
  address VARCHAR(500),
  street VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  zip_code VARCHAR(20),
  full_address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Contact Information
  phone VARCHAR(50),
  email VARCHAR(255),
  website VARCHAR(500),

  -- Social Media
  social_media JSONB DEFAULT '{}'::jsonb,

  -- Photos (array of photo objects)
  photos JSONB DEFAULT '[]'::jsonb,

  -- Operating Hours
  opening_hours JSONB DEFAULT '{}'::jsonb,
  hours_24x7 BOOLEAN DEFAULT false,
  hours_note TEXT,

  -- Pricing
  pricing_info JSONB DEFAULT '{}'::jsonb,

  -- Amenities
  amenities JSONB DEFAULT '{}'::jsonb,

  -- Features
  indoor_outdoor VARCHAR(50),
  size_category VARCHAR(50),
  surface_type VARCHAR(100),
  pet_friendly_features JSONB DEFAULT '[]'::jsonb,

  -- Listing Management
  listing_type VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (listing_type IN ('free', 'featured')),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,

  -- Subscription (for featured listings)
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  subscription_status VARCHAR(50),
  subscription_current_period_end TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id)
);

-- Create subscriptions tracking table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  park_submission_id UUID NOT NULL REFERENCES park_submissions(id) ON DELETE CASCADE,

  -- Stripe Details
  stripe_subscription_id VARCHAR(255) UNIQUE NOT NULL,
  stripe_customer_id VARCHAR(255) NOT NULL,
  stripe_price_id VARCHAR(255) NOT NULL,

  -- Subscription Info
  status VARCHAR(50) NOT NULL,
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_park_submissions_user_id ON park_submissions(user_id);
CREATE INDEX idx_park_submissions_status ON park_submissions(status);
CREATE INDEX idx_park_submissions_listing_type ON park_submissions(listing_type);
CREATE INDEX idx_park_submissions_city ON park_submissions(city);
CREATE INDEX idx_park_submissions_created_at ON park_submissions(created_at DESC);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_park_id ON subscriptions(park_submission_id);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_park_submissions_updated_at
  BEFORE UPDATE ON park_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE park_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Park Submissions Policies
-- Users can view their own submissions
CREATE POLICY "Users can view own submissions"
  ON park_submissions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own submissions
CREATE POLICY "Users can create submissions"
  ON park_submissions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending submissions
CREATE POLICY "Users can update own pending submissions"
  ON park_submissions
  FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own pending submissions
CREATE POLICY "Users can delete own pending submissions"
  ON park_submissions
  FOR DELETE
  USING (auth.uid() = user_id AND status = 'pending');

-- Public can view approved submissions (for display on site)
CREATE POLICY "Anyone can view approved submissions"
  ON park_submissions
  FOR SELECT
  USING (status = 'approved');

-- Subscriptions Policies
-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can manage all (for webhook handlers)
-- Note: This requires using the service role key in API routes

-- Create a function to generate slugs
CREATE OR REPLACE FUNCTION generate_slug(park_name TEXT, park_city TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(park_name || '-' || park_city, '[^a-zA-Z0-9\s-]', '', 'g'),
      '\s+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate slug
CREATE OR REPLACE FUNCTION set_park_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL THEN
    NEW.slug := generate_slug(NEW.name, NEW.city);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_generate_slug
  BEFORE INSERT ON park_submissions
  FOR EACH ROW
  EXECUTE FUNCTION set_park_slug();

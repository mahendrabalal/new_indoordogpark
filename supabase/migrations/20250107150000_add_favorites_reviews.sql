-- Create favorites table for user park favorites
CREATE TABLE IF NOT EXISTS park_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  park_id VARCHAR NOT NULL,
  park_slug VARCHAR,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, park_id)
);

-- Add indexes for performance
CREATE INDEX idx_park_favorites_user_id ON park_favorites(user_id);
CREATE INDEX idx_park_favorites_park_id ON park_favorites(park_id);
CREATE INDEX idx_park_favorites_created_at ON park_favorites(created_at);

-- Create reviews table
CREATE TABLE IF NOT EXISTS park_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  park_id VARCHAR NOT NULL,
  park_slug VARCHAR,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, park_id)
);

-- Add indexes for reviews
CREATE INDEX idx_park_reviews_user_id ON park_reviews(user_id);
CREATE INDEX idx_park_reviews_park_id ON park_reviews(park_id);
CREATE INDEX idx_park_reviews_rating ON park_reviews(rating);
CREATE INDEX idx_park_reviews_created_at ON park_reviews(created_at);

-- Create review helpful votes table
CREATE TABLE IF NOT EXISTS review_helpful_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  review_id UUID NOT NULL REFERENCES park_reviews(id) ON DELETE CASCADE,
  is_helpful BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, review_id)
);

-- Add indexes for helpful votes
CREATE INDEX idx_review_helpful_votes_user_id ON review_helpful_votes(user_id);
CREATE INDEX idx_review_helpful_votes_review_id ON review_helpful_votes(review_id);

-- Enable Row Level Security (RLS)
ALTER TABLE park_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE park_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_helpful_votes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for park_favorites
CREATE POLICY "Users can view their own favorites" ON park_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" ON park_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON park_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for park_reviews
CREATE POLICY "Users can view all reviews" ON park_reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own reviews" ON park_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON park_reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON park_reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for review_helpful_votes
CREATE POLICY "Users can view all helpful votes" ON review_helpful_votes
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own helpful votes" ON review_helpful_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own helpful votes" ON review_helpful_votes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own helpful votes" ON review_helpful_votes
  FOR DELETE USING (auth.uid() = user_id);

-- Create functions to update helpful counts
CREATE OR REPLACE FUNCTION update_review_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE park_reviews
    SET helpful_count = (
      SELECT COUNT(*)
      FROM review_helpful_votes
      WHERE review_id = NEW.review_id AND is_helpful = TRUE
    )
    WHERE id = NEW.review_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE park_reviews
    SET helpful_count = (
      SELECT COUNT(*)
      FROM review_helpful_votes
      WHERE review_id = OLD.review_id AND is_helpful = TRUE
    )
    WHERE id = OLD.review_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_review_helpful_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON review_helpful_votes
  FOR EACH ROW EXECUTE FUNCTION update_review_helpful_count();

-- Update updated_at timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_park_favorites_updated_at
  BEFORE UPDATE ON park_favorites
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_park_reviews_updated_at
  BEFORE UPDATE ON park_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
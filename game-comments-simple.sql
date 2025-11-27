-- Simple comments table for anonymous users
-- No authentication required, username is stored as text

CREATE TABLE IF NOT EXISTS game_comments_simple (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_slug TEXT NOT NULL,
  username TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_game_comments_simple_game_slug ON game_comments_simple(game_slug);
CREATE INDEX IF NOT EXISTS idx_game_comments_simple_created_at ON game_comments_simple(created_at DESC);

-- Enable Row Level Security
ALTER TABLE game_comments_simple ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read comments
CREATE POLICY "Anyone can view comments"
  ON game_comments_simple
  FOR SELECT
  USING (true);

-- Policy: Anyone can insert comments (no auth required)
CREATE POLICY "Anyone can post comments"
  ON game_comments_simple
  FOR INSERT
  WITH CHECK (true);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_game_comments_simple_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER game_comments_simple_updated_at
  BEFORE UPDATE ON game_comments_simple
  FOR EACH ROW
  EXECUTE FUNCTION update_game_comments_simple_updated_at();

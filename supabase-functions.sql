-- Database functions for game reactions and stats

-- Function to increment like count
CREATE OR REPLACE FUNCTION increment_like(p_game_slug TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO game_stats (game_slug, game_name, likes, dislikes)
  VALUES (p_game_slug, p_game_slug, 1, 0)
  ON CONFLICT (game_slug)
  DO UPDATE SET 
    likes = game_stats.likes + 1,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement like count
CREATE OR REPLACE FUNCTION decrement_like(p_game_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE game_stats
  SET 
    likes = GREATEST(0, likes - 1),
    updated_at = NOW()
  WHERE game_slug = p_game_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment dislike count
CREATE OR REPLACE FUNCTION increment_dislike(p_game_slug TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO game_stats (game_slug, game_name, likes, dislikes)
  VALUES (p_game_slug, p_game_slug, 0, 1)
  ON CONFLICT (game_slug)
  DO UPDATE SET 
    dislikes = game_stats.dislikes + 1,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement dislike count
CREATE OR REPLACE FUNCTION decrement_dislike(p_game_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE game_stats
  SET 
    dislikes = GREATEST(0, dislikes - 1),
    updated_at = NOW()
  WHERE game_slug = p_game_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update reaction (switching from like to dislike or vice versa)
CREATE OR REPLACE FUNCTION update_game_reaction(
  p_game_slug TEXT,
  p_old_reaction TEXT,
  p_new_reaction TEXT
)
RETURNS void AS $$
BEGIN
  IF p_old_reaction = 'like' AND p_new_reaction = 'dislike' THEN
    UPDATE game_stats
    SET 
      likes = GREATEST(0, likes - 1),
      dislikes = dislikes + 1,
      updated_at = NOW()
    WHERE game_slug = p_game_slug;
  ELSIF p_old_reaction = 'dislike' AND p_new_reaction = 'like' THEN
    UPDATE game_stats
    SET 
      dislikes = GREATEST(0, dislikes - 1),
      likes = likes + 1,
      updated_at = NOW()
    WHERE game_slug = p_game_slug;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment play count with seeding logic
CREATE OR REPLACE FUNCTION increment_play_count(p_game_slug TEXT)
RETURNS void AS $$
DECLARE
  v_exists BOOLEAN;
BEGIN
  -- Check if the game exists in stats
  SELECT EXISTS(SELECT 1 FROM game_stats WHERE game_slug = p_game_slug) INTO v_exists;

  IF v_exists THEN
    -- Just increment play count
    UPDATE game_stats
    SET 
      plays = COALESCE(plays, 0) + 1,
      updated_at = NOW()
    WHERE game_slug = p_game_slug;
  ELSE
    -- Seed new game with random values
    -- Likes: 1 to 4
    -- Plays: 100 to 500
    INSERT INTO game_stats (game_slug, game_name, likes, dislikes, plays)
    VALUES (
      p_game_slug, 
      p_game_slug, 
      floor(random() * 4 + 1)::int, 
      0, 
      floor(random() * 401 + 100)::int
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

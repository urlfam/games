-- Database functions for game reactions and stats

-- Function to increment like count
CREATE OR REPLACE FUNCTION increment_like(game_slug_param TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO game_stats (game_slug, game_name, likes, dislikes)
  VALUES (game_slug_param, game_slug_param, 1, 0)
  ON CONFLICT (game_slug)
  DO UPDATE SET 
    likes = game_stats.likes + 1,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement like count
CREATE OR REPLACE FUNCTION decrement_like(game_slug_param TEXT)
RETURNS void AS $$
BEGIN
  UPDATE game_stats
  SET 
    likes = GREATEST(0, likes - 1),
    updated_at = NOW()
  WHERE game_slug = game_slug_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment dislike count
CREATE OR REPLACE FUNCTION increment_dislike(game_slug_param TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO game_stats (game_slug, game_name, likes, dislikes)
  VALUES (game_slug_param, game_slug_param, 0, 1)
  ON CONFLICT (game_slug)
  DO UPDATE SET 
    dislikes = game_stats.dislikes + 1,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement dislike count
CREATE OR REPLACE FUNCTION decrement_dislike(game_slug_param TEXT)
RETURNS void AS $$
BEGIN
  UPDATE game_stats
  SET 
    dislikes = GREATEST(0, dislikes - 1),
    updated_at = NOW()
  WHERE game_slug = game_slug_param;
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

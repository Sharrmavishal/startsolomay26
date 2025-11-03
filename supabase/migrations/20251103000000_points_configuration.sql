-- Points Configuration System
-- Allows admins to configure points awarded for different actions

CREATE TABLE IF NOT EXISTS points_config (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  action_key text UNIQUE NOT NULL, -- e.g., 'create_post', 'create_comment', 'register_event'
  action_name text NOT NULL, -- Display name: 'Create Post', 'Create Comment'
  action_description text,
  points integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  category text DEFAULT 'engagement', -- engagement, achievement, milestone, etc.
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default point configurations
INSERT INTO points_config (action_key, action_name, action_description, points, category) VALUES
  ('create_post', 'Create Post', 'Points awarded for creating a forum post', 10, 'engagement'),
  ('create_comment', 'Create Comment', 'Points awarded for commenting on a post', 5, 'engagement'),
  ('register_event', 'Register for Event', 'Points awarded for registering for an event', 15, 'engagement'),
  ('complete_course', 'Complete Course', 'Points awarded for completing a course', 50, 'achievement'),
  ('enroll_course', 'Enroll in Course', 'Points awarded for enrolling in a course', 20, 'engagement'),
  ('create_course', 'Create Course', 'Points awarded for mentors creating a course', 100, 'achievement'),
  ('book_session', 'Book Mentor Session', 'Points awarded for booking a mentor session', 25, 'engagement'),
  ('get_upvote', 'Receive Upvote', 'Points awarded when someone upvotes your post', 2, 'engagement'),
  ('profile_complete', 'Complete Profile', 'Points awarded for completing profile (100%)', 30, 'milestone'),
  ('first_post', 'First Post', 'Bonus points for first post', 20, 'milestone')
ON CONFLICT (action_key) DO NOTHING;

-- Create function to update points based on action
CREATE OR REPLACE FUNCTION award_points_for_action(
  p_member_id uuid,
  p_action_key text
)
RETURNS integer AS $$
DECLARE
  v_points integer;
BEGIN
  -- Get points for this action
  SELECT points INTO v_points
  FROM points_config
  WHERE action_key = p_action_key
    AND is_active = true;

  -- If points found, award them
  IF v_points IS NOT NULL AND v_points > 0 THEN
    UPDATE community_members
    SET points = points + v_points
    WHERE id = p_member_id;
    
    RETURN v_points;
  END IF;

  RETURN 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update existing triggers to use points_config
-- Drop old trigger
DROP TRIGGER IF EXISTS award_points_on_post ON community_posts;

-- Create new trigger function that uses points_config
CREATE OR REPLACE FUNCTION award_points_for_post()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM award_points_for_action(NEW.author_id, 'create_post');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger
CREATE TRIGGER award_points_on_post
AFTER INSERT ON community_posts
FOR EACH ROW
EXECUTE FUNCTION award_points_for_post();

-- RLS policies
ALTER TABLE points_config ENABLE ROW LEVEL SECURITY;

-- Admins can read and write
CREATE POLICY "Admins can manage points config"
  ON points_config
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM community_members
      WHERE user_id = auth.uid()
        AND role = 'admin'
    )
  );

-- Everyone can read (for display purposes)
CREATE POLICY "Everyone can read points config"
  ON points_config
  FOR SELECT
  USING (is_active = true);

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_points_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_points_config_timestamp
BEFORE UPDATE ON points_config
FOR EACH ROW
EXECUTE FUNCTION update_points_config_updated_at();


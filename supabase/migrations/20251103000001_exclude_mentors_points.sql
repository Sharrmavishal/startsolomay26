-- Exclude mentors from points system
-- Mentors have special status recognition and don't need points

-- Update award_points_for_action to exclude mentors
CREATE OR REPLACE FUNCTION award_points_for_action(
  p_member_id uuid,
  p_action_key text
)
RETURNS integer AS $$
DECLARE
  v_points integer;
  v_is_mentor boolean;
BEGIN
  -- Check if member is a mentor
  SELECT role = 'mentor' INTO v_is_mentor
  FROM community_members
  WHERE id = p_member_id;

  -- Skip points for mentors
  IF v_is_mentor THEN
    RETURN 0;
  END IF;

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

-- Add mentor achievements/education/awards fields
ALTER TABLE community_members ADD COLUMN IF NOT EXISTS mentor_achievements jsonb DEFAULT '[]'::jsonb;
ALTER TABLE community_members ADD COLUMN IF NOT EXISTS mentor_education jsonb DEFAULT '[]'::jsonb;
ALTER TABLE community_members ADD COLUMN IF NOT EXISTS mentor_awards jsonb DEFAULT '[]'::jsonb;

-- Add comments to explain structure
COMMENT ON COLUMN community_members.mentor_achievements IS 'Array of achievements: [{title: string, description: string, year: number, url?: string}]';
COMMENT ON COLUMN community_members.mentor_education IS 'Array of education: [{degree: string, institution: string, year: number, field?: string}]';
COMMENT ON COLUMN community_members.mentor_awards IS 'Array of awards: [{name: string, organization: string, year: number, description?: string}]';


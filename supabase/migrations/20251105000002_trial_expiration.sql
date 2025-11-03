-- ============================================
-- Trial Period Expiration
-- ============================================
-- Adds trial period expiration tracking and admin extension capability

-- ============================================
-- 1. Add Trial Period Fields to community_members
-- ============================================
ALTER TABLE community_members
ADD COLUMN IF NOT EXISTS membership_expires_at timestamptz,
ADD COLUMN IF NOT EXISTS trial_extension_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS trial_extension_expires_at timestamptz;

-- Add index for efficient expiration queries
CREATE INDEX IF NOT EXISTS idx_community_members_expires_at 
ON community_members(membership_expires_at) 
WHERE membership_expires_at IS NOT NULL;

-- ============================================
-- 2. Add Trial Duration Setting to admin_settings
-- ============================================
INSERT INTO admin_settings (key, value, description) VALUES
  ('trial_duration_days', '14', 'Number of days for trial period'),
  ('trial_grace_period_days', '7', 'Days of grace period after trial expires (view-only access)')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- 3. Function: Set Trial Expiration on Signup
-- ============================================
CREATE OR REPLACE FUNCTION set_trial_expiration()
RETURNS TRIGGER AS $$
DECLARE
  trial_days integer;
BEGIN
  -- Only set expiration for non-vetted members
  IF NEW.vetting_status NOT IN ('vetted', 'admin') THEN
    -- Get trial duration from admin settings (default: 14 days)
    SELECT COALESCE((value::text)::integer, 14) INTO trial_days
    FROM admin_settings
    WHERE key = 'trial_duration_days'
    LIMIT 1;
    
    -- Set expiration date if not already set
    IF NEW.membership_expires_at IS NULL THEN
      NEW.membership_expires_at := NEW.created_at + (trial_days || ' days')::interval;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set expiration on insert
DROP TRIGGER IF EXISTS trigger_set_trial_expiration ON community_members;
CREATE TRIGGER trigger_set_trial_expiration
BEFORE INSERT ON community_members
FOR EACH ROW EXECUTE FUNCTION set_trial_expiration();

-- ============================================
-- 4. Function: Check Trial Expiration Status
-- ============================================
CREATE OR REPLACE FUNCTION is_trial_expired(p_member_id uuid)
RETURNS boolean AS $$
DECLARE
  member_record RECORD;
  grace_days integer;
BEGIN
  SELECT membership_expires_at, vetting_status INTO member_record
  FROM community_members
  WHERE id = p_member_id;
  
  -- Vetted members and admins never expire
  IF member_record.vetting_status IN ('vetted', 'admin') THEN
    RETURN false;
  END IF;
  
  -- No expiration set means active
  IF member_record.membership_expires_at IS NULL THEN
    RETURN false;
  END IF;
  
  -- Get grace period (default: 7 days)
  SELECT COALESCE((value::text)::integer, 7) INTO grace_days
  FROM admin_settings
  WHERE key = 'trial_grace_period_days'
  LIMIT 1;
  
  -- Expired if past expiration + grace period
  RETURN member_record.membership_expires_at + (grace_days || ' days')::interval < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================
-- 5. Function: Check if in Grace Period
-- ============================================
CREATE OR REPLACE FUNCTION is_in_grace_period(p_member_id uuid)
RETURNS boolean AS $$
DECLARE
  member_record RECORD;
  grace_days integer;
BEGIN
  SELECT membership_expires_at, vetting_status INTO member_record
  FROM community_members
  WHERE id = p_member_id;
  
  -- Vetted members and admins never expire
  IF member_record.vetting_status IN ('vetted', 'admin') THEN
    RETURN false;
  END IF;
  
  -- No expiration set means active
  IF member_record.membership_expires_at IS NULL THEN
    RETURN false;
  END IF;
  
  -- Get grace period (default: 7 days)
  SELECT COALESCE((value::text)::integer, 7) INTO grace_days
  FROM admin_settings
  WHERE key = 'trial_grace_period_days'
  LIMIT 1;
  
  -- In grace period if expired but within grace period
  RETURN member_record.membership_expires_at < NOW() 
    AND member_record.membership_expires_at + (grace_days || ' days')::interval >= NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION is_trial_expired(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION is_in_grace_period(uuid) TO authenticated;

-- ============================================
-- 6. Update Existing Non-Vetted Members
-- ============================================
-- Set expiration for existing non-vetted members (if not already set)
UPDATE community_members
SET membership_expires_at = created_at + (14 || ' days')::interval
WHERE vetting_status NOT IN ('vetted', 'admin')
  AND membership_expires_at IS NULL;

-- ============================================
-- 7. Update RLS Policies to Check Trial Expiration
-- ============================================
-- Note: RLS policies for posts/comments/events already check vetting_status
-- We need to add expiration checks to prevent expired members from interacting

-- Update community_posts INSERT policy to check expiration
DROP POLICY IF EXISTS "Vetted members can create posts" ON community_posts;
CREATE POLICY "Vetted members can create posts" ON community_posts
  FOR INSERT
  WITH CHECK (
    author_id IN (
      SELECT id FROM community_members 
      WHERE user_id = auth.uid()
      AND vetting_status = 'vetted'
      AND NOT is_trial_expired(id)
    )
  );

-- Update community_comments INSERT policy to check expiration
DROP POLICY IF EXISTS "Vetted members can create comments" ON community_comments;
CREATE POLICY "Vetted members can create comments" ON community_comments
  FOR INSERT
  WITH CHECK (
    author_id IN (
      SELECT id FROM community_members 
      WHERE user_id = auth.uid()
      AND vetting_status = 'vetted'
      AND NOT is_trial_expired(id)
    )
  );

-- Update event_registrations INSERT policy to check expiration
DROP POLICY IF EXISTS "Vetted members can register for events" ON event_registrations;
CREATE POLICY "Vetted members can register for events" ON event_registrations
  FOR INSERT
  WITH CHECK (
    member_id IN (
      SELECT id FROM community_members 
      WHERE user_id = auth.uid() 
      AND vetting_status = 'vetted'
      AND NOT is_trial_expired(id)
    )
  );

-- Update course_enrollments INSERT policy to check expiration
DROP POLICY IF EXISTS "Vetted members can enroll in courses" ON course_enrollments;
CREATE POLICY "Vetted members can enroll in courses" ON course_enrollments
  FOR INSERT
  WITH CHECK (
    student_id IN (
      SELECT id FROM community_members 
      WHERE user_id = auth.uid() 
      AND vetting_status = 'vetted'
      AND NOT is_trial_expired(id)
    )
  );

-- Update mentor_sessions INSERT policy to check expiration
DROP POLICY IF EXISTS "Vetted members can request sessions" ON mentor_sessions;
CREATE POLICY "Vetted members can request sessions" ON mentor_sessions
  FOR INSERT
  WITH CHECK (
    mentee_id IN (
      SELECT id FROM community_members 
      WHERE user_id = auth.uid() 
      AND vetting_status = 'vetted'
      AND NOT is_trial_expired(id)
    )
  );


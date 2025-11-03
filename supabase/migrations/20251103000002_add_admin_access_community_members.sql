-- Add admin access to community_members SELECT policy
-- Admins need to see all members (including pending) for vetting

-- Create a helper function to check admin role (avoids recursion)
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM community_members
    WHERE user_id = auth.uid()
    AND role = 'admin'
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Drop existing policy
DROP POLICY IF EXISTS "Members can view vetted profiles" ON community_members;

-- Recreate with admin access using the helper function
CREATE POLICY "Members can view vetted profiles" ON community_members
  FOR SELECT
  USING (
    vetting_status = 'vetted' OR 
    auth.uid() = user_id OR
    is_admin_user()  -- Admins can see all members
  );

-- Also ensure admin UPDATE policy exists
DROP POLICY IF EXISTS "Users can update their own profile" ON community_members;
CREATE POLICY "Users can update their own profile" ON community_members
  FOR UPDATE
  USING (
    auth.uid() = user_id OR
    is_admin_user()  -- Admins can update any member
  );


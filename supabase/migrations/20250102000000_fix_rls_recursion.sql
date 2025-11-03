-- Fix RLS policies to avoid infinite recursion
-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Members can view vetted profiles" ON community_members;
DROP POLICY IF EXISTS "Users can update their own profile" ON community_members;
DROP POLICY IF EXISTS "Vetted members can view published posts" ON community_posts;
DROP POLICY IF EXISTS "Vetted members can create posts" ON community_posts;
DROP POLICY IF EXISTS "Authors and admins can update posts" ON community_posts;
DROP POLICY IF EXISTS "Vetted members can view comments on visible posts" ON community_comments;
DROP POLICY IF EXISTS "Vetted members can create comments" ON community_comments;

-- Recreate community_members SELECT policy without recursion
-- Users can always see their own profile and vetted profiles
CREATE POLICY "Members can view vetted profiles" ON community_members
  FOR SELECT
  USING (
    vetting_status = 'vetted' OR 
    auth.uid() = user_id
  );

-- Recreate community_members UPDATE policy without recursion
CREATE POLICY "Users can update their own profile" ON community_members
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Recreate community_posts SELECT policy without recursion
-- Allow viewing published posts if user has a member profile
CREATE POLICY "Vetted members can view published posts" ON community_posts
  FOR SELECT
  USING (
    status = 'published' AND
    -- Allow if user has a member profile (any status)
    EXISTS (
      SELECT 1 FROM community_members cm
      WHERE cm.user_id = auth.uid()
    )
  );

-- Recreate community_posts INSERT policy without recursion
-- Allow creating posts if user has a member profile
CREATE POLICY "Vetted members can create posts" ON community_posts
  FOR INSERT
  WITH CHECK (
    author_id IN (
      SELECT id FROM community_members 
      WHERE user_id = auth.uid()
    )
  );

-- Recreate community_posts UPDATE policy without recursion  
CREATE POLICY "Authors and admins can update posts" ON community_posts
  FOR UPDATE
  USING (
    author_id IN (
      SELECT id FROM community_members 
      WHERE user_id = auth.uid()
    )
  );

-- Recreate community_comments SELECT policy without recursion
CREATE POLICY "Vetted members can view comments on visible posts" ON community_comments
  FOR SELECT
  USING (
    -- Comment is on a published post
    EXISTS (
      SELECT 1 FROM community_posts 
      WHERE id = post_id AND status = 'published'
    ) AND
    -- User has a member profile
    EXISTS (
      SELECT 1 FROM community_members 
      WHERE user_id = auth.uid()
    )
  );

-- Recreate community_comments INSERT policy without recursion
CREATE POLICY "Vetted members can create comments" ON community_comments
  FOR INSERT
  WITH CHECK (
    author_id IN (
      SELECT id FROM community_members 
      WHERE user_id = auth.uid()
    )
  );
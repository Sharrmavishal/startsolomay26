-- Fix RLS policies to enforce vetted-only access for posts and comments
-- Non-vetted members can view but not create/interact

-- Drop existing policies that were too permissive
DROP POLICY IF EXISTS "Vetted members can view published posts" ON community_posts;
DROP POLICY IF EXISTS "Vetted members can create posts" ON community_posts;
DROP POLICY IF EXISTS "Vetted members can view comments on visible posts" ON community_comments;
DROP POLICY IF EXISTS "Vetted members can create comments" ON community_comments;

-- Recreate posts SELECT policy - allow viewing if user has member profile (any status)
-- But posts must be published
CREATE POLICY "Members can view published posts" ON community_posts
  FOR SELECT
  USING (
    status = 'published' AND
    -- Allow if user has a member profile (any status for viewing)
    EXISTS (
      SELECT 1 FROM community_members cm
      WHERE cm.user_id = auth.uid()
    )
  );

-- Recreate posts INSERT policy - ONLY vetted members can create posts
CREATE POLICY "Vetted members can create posts" ON community_posts
  FOR INSERT
  WITH CHECK (
    author_id IN (
      SELECT id FROM community_members 
      WHERE user_id = auth.uid() AND vetting_status = 'vetted'
    )
  );

-- Recreate comments SELECT policy - allow viewing if user has member profile
CREATE POLICY "Members can view comments on visible posts" ON community_comments
  FOR SELECT
  USING (
    -- Comment is on a published post
    EXISTS (
      SELECT 1 FROM community_posts 
      WHERE id = post_id AND status = 'published'
    ) AND
    -- User has a member profile (any status for viewing)
    EXISTS (
      SELECT 1 FROM community_members 
      WHERE user_id = auth.uid()
    )
  );

-- Recreate comments INSERT policy - ONLY vetted members can create comments
CREATE POLICY "Vetted members can create comments" ON community_comments
  FOR INSERT
  WITH CHECK (
    author_id IN (
      SELECT id FROM community_members 
      WHERE user_id = auth.uid() AND vetting_status = 'vetted'
    )
  );

-- Allow approved members to view content (view-only access)
-- Only vetted members can create posts/comments/register for events

-- Update posts SELECT policy - approved and vetted can view
DROP POLICY IF EXISTS "Members can view published posts" ON community_posts;
CREATE POLICY "Members can view published posts" ON community_posts
  FOR SELECT
  USING (
    status = 'published' AND
    EXISTS (
      SELECT 1 FROM community_members cm
      WHERE cm.user_id = auth.uid()
      AND cm.vetting_status IN ('approved', 'vetted')
    )
  );

-- Comments SELECT policy - approved and vetted can view
DROP POLICY IF EXISTS "Members can view comments on visible posts" ON community_comments;
CREATE POLICY "Members can view comments on visible posts" ON community_comments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM community_posts 
      WHERE id = post_id AND status = 'published'
    ) AND
    EXISTS (
      SELECT 1 FROM community_members 
      WHERE user_id = auth.uid()
      AND vetting_status IN ('approved', 'vetted')
    )
  );

-- Posts and comments INSERT policies remain vetted-only (no change needed)
-- Event registration INSERT policy remains vetted-only (no change needed)
-- Member directory SELECT policy should allow approved and vetted to view profiles


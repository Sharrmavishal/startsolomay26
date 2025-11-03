-- Fix RLS policy for event_registrations to avoid recursion and ensure it works correctly
-- Restrict registration to vetted members only (non-vetted members can view but not register)
-- Drop existing policies
DROP POLICY IF EXISTS "Members can view their own registrations" ON event_registrations;
DROP POLICY IF EXISTS "Vetted members can register for events" ON event_registrations;
DROP POLICY IF EXISTS "Members can update their own registrations" ON event_registrations;

-- Recreate SELECT policy without recursion
-- Allow members to view their own registrations and admins to view all
CREATE POLICY "Members can view their own registrations" ON event_registrations
  FOR SELECT
  USING (
    member_id IN (
      SELECT id FROM community_members 
      WHERE user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM community_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Recreate INSERT policy without recursion
-- Only vetted members can register for events
CREATE POLICY "Vetted members can register for events" ON event_registrations
  FOR INSERT
  WITH CHECK (
    member_id IN (
      SELECT id FROM community_members 
      WHERE user_id = auth.uid() AND vetting_status = 'vetted'
    )
  );

-- Allow members to update their own registrations (e.g., cancel)
CREATE POLICY "Members can update their own registrations" ON event_registrations
  FOR UPDATE
  USING (
    member_id IN (
      SELECT id FROM community_members 
      WHERE user_id = auth.uid()
    )
  );

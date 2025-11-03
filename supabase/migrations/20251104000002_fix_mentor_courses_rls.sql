-- Fix RLS policy for mentor_courses INSERT
-- This ensures mentors can create courses using their own member ID

-- Drop existing INSERT policy if it exists
DROP POLICY IF EXISTS "Mentors can create courses" ON mentor_courses;

-- Recreate with improved logic that explicitly checks for match
CREATE POLICY "Mentors can create courses" ON mentor_courses
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM community_members 
      WHERE id = mentor_id
      AND user_id = auth.uid() 
      AND role IN ('mentor', 'admin')
    )
  );


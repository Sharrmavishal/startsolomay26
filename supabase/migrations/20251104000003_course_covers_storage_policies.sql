-- Storage RLS Policies for course-covers bucket
-- Run this after creating the course-covers bucket in Supabase Dashboard

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Mentors can upload course cover images" ON storage.objects;
DROP POLICY IF EXISTS "Mentors can update own cover images" ON storage.objects;
DROP POLICY IF EXISTS "Mentors can delete own cover images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view course cover images" ON storage.objects;

-- Allow mentors to upload cover images
CREATE POLICY "Mentors can upload course cover images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'course-covers'
  AND EXISTS (
    SELECT 1 FROM community_members
    WHERE user_id = auth.uid()
    AND role IN ('mentor', 'admin')
  )
);

-- Allow mentors to update their own cover images
CREATE POLICY "Mentors can update own cover images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'course-covers'
  AND EXISTS (
    SELECT 1 FROM community_members
    WHERE user_id = auth.uid()
    AND role IN ('mentor', 'admin')
  )
);

-- Allow mentors to delete their own cover images
CREATE POLICY "Mentors can delete own cover images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'course-covers'
  AND EXISTS (
    SELECT 1 FROM community_members
    WHERE user_id = auth.uid()
    AND role IN ('mentor', 'admin')
  )
);

-- Public read access (since bucket is public)
CREATE POLICY "Public can view course cover images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'course-covers');


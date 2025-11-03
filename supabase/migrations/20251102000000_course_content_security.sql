-- ============================================
-- Course Content Security & IP Protection
-- ============================================
-- Adds secure storage support, access logging, and watermarking metadata
-- Migration: 20251102000000_course_content_security.sql

-- ============================================
-- 1. Add Storage Columns to course_lessons
-- ============================================
ALTER TABLE course_lessons
ADD COLUMN IF NOT EXISTS storage_path text,
ADD COLUMN IF NOT EXISTS storage_bucket text CHECK (storage_bucket IN ('course-pdfs', 'course-audio', 'course-videos', 'course-files')),
ADD COLUMN IF NOT EXISTS is_uploaded_content boolean DEFAULT false;

-- Add comment for clarity
COMMENT ON COLUMN course_lessons.storage_path IS 'Path to file in Supabase Storage (if uploaded)';
COMMENT ON COLUMN course_lessons.storage_bucket IS 'Storage bucket name (course-pdfs, course-audio, course-videos, course-files)';
COMMENT ON COLUMN course_lessons.is_uploaded_content IS 'true = Supabase Storage, false = external URL';

-- ============================================
-- 2. Content Access Logs Table
-- ============================================
CREATE TABLE IF NOT EXISTS content_access_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- References
  lesson_id uuid NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
  enrollment_id uuid NOT NULL REFERENCES course_enrollments(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  
  -- Access details
  access_type text NOT NULL CHECK (access_type IN ('view', 'download', 'stream')),
  signed_url_used boolean DEFAULT false,
  
  -- Tracking
  ip_address text,
  user_agent text,
  
  -- Timestamps
  accessed_at timestamptz DEFAULT now(),
  
  created_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_access_logs_lesson_id ON content_access_logs(lesson_id);
CREATE INDEX IF NOT EXISTS idx_content_access_logs_student_id ON content_access_logs(student_id);
CREATE INDEX IF NOT EXISTS idx_content_access_logs_enrollment_id ON content_access_logs(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_content_access_logs_accessed_at ON content_access_logs(accessed_at);
CREATE INDEX IF NOT EXISTS idx_content_access_logs_lesson_student ON content_access_logs(lesson_id, student_id, accessed_at);

-- ============================================
-- 3. RLS Policies for Content Access Logs
-- ============================================
ALTER TABLE content_access_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own access logs
CREATE POLICY "Users can view own access logs"
ON content_access_logs FOR SELECT
TO authenticated
USING (
  student_id IN (
    SELECT id FROM community_members WHERE user_id = auth.uid()
  )
);

-- System can insert access logs (via Edge Function with service role)
-- Note: Edge Functions use service role key, bypassing RLS
-- This policy is for direct client access if needed
CREATE POLICY "System can insert access logs"
ON content_access_logs FOR INSERT
TO authenticated
WITH CHECK (
  student_id IN (
    SELECT id FROM community_members WHERE user_id = auth.uid()
  )
);

-- Admins can view all access logs
CREATE POLICY "Admins can view all access logs"
ON content_access_logs FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM community_members
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- Mentors can view access logs for their courses
CREATE POLICY "Mentors can view access logs for their courses"
ON content_access_logs FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM course_lessons cl
    JOIN mentor_courses mc ON cl.course_id = mc.id
    JOIN community_members cm ON mc.mentor_id = cm.id
    WHERE cl.id = content_access_logs.lesson_id
    AND cm.user_id = auth.uid()
  )
);

-- ============================================
-- 4. Storage Bucket RLS Policies
-- ============================================
-- Note: These policies will be applied when buckets are created
-- Storage policies are created via Supabase Dashboard or Storage API
-- Below is SQL reference for the policies that need to be created

-- IMPORTANT: Create these policies manually in Supabase Dashboard → Storage → Policies
-- Or use Supabase Management API

-- Policy 1: Upload - Only mentors creating courses can upload
-- CREATE POLICY "Mentors can upload course content"
-- ON storage.objects FOR INSERT
-- TO authenticated
-- WITH CHECK (
--   bucket_id IN ('course-pdfs', 'course-audio', 'course-videos', 'course-files')
--   AND EXISTS (
--     SELECT 1 FROM mentor_courses mc
--     JOIN community_members cm ON mc.mentor_id = cm.id
--     WHERE cm.user_id = auth.uid()
--     AND (storage.foldername(name))[1] = mc.id::text
--   )
-- );

-- Policy 2: Download - Only enrolled students can access
-- CREATE POLICY "Enrolled students can access content"
-- ON storage.objects FOR SELECT
-- TO authenticated
-- USING (
--   bucket_id IN ('course-pdfs', 'course-audio', 'course-videos', 'course-files')
--   AND EXISTS (
--     SELECT 1 FROM course_enrollments ce
--     JOIN course_lessons cl ON (storage.foldername(name))[1] = cl.course_id::text
--     WHERE ce.student_id IN (
--       SELECT id FROM community_members WHERE user_id = auth.uid()
--     )
--     AND ce.enrollment_status = 'active'
--     AND cl.id::text = (storage.foldername(name))[3]
--   )
-- );

-- Policy 3: Delete - Only mentors can delete their own content
-- CREATE POLICY "Mentors can delete own course content"
-- ON storage.objects FOR DELETE
-- TO authenticated
-- USING (
--   bucket_id IN ('course-pdfs', 'course-audio', 'course-videos', 'course-files')
--   AND EXISTS (
--     SELECT 1 FROM mentor_courses mc
--     JOIN community_members cm ON mc.mentor_id = cm.id
--     WHERE cm.user_id = auth.uid()
--     AND (storage.foldername(name))[1] = mc.id::text
--   )
-- );

-- Policy 4: Admin - Full access
-- CREATE POLICY "Admins have full access to course content"
-- ON storage.objects FOR ALL
-- TO authenticated
-- USING (
--   bucket_id IN ('course-pdfs', 'course-audio', 'course-videos', 'course-files')
--   AND EXISTS (
--     SELECT 1 FROM community_members
--     WHERE user_id = auth.uid()
--     AND role = 'admin'
--   )
-- );

-- ============================================
-- 5. Helper Function: Check Enrollment for Content Access
-- ============================================
CREATE OR REPLACE FUNCTION check_content_access_permission(
  p_lesson_id uuid,
  p_user_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_enrollment_exists boolean;
BEGIN
  -- Check if user is enrolled in the course
  SELECT EXISTS (
    SELECT 1
    FROM course_enrollments ce
    JOIN course_lessons cl ON ce.course_id = cl.course_id
    JOIN community_members cm ON ce.student_id = cm.id
    WHERE cl.id = p_lesson_id
    AND cm.user_id = p_user_id
    AND ce.enrollment_status = 'active'
  ) INTO v_enrollment_exists;
  
  RETURN v_enrollment_exists;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION check_content_access_permission(uuid, uuid) TO authenticated;

-- ============================================
-- 6. Helper Function: Log Content Access
-- ============================================
CREATE OR REPLACE FUNCTION log_content_access(
  p_lesson_id uuid,
  p_enrollment_id uuid,
  p_student_id uuid,
  p_access_type text,
  p_signed_url_used boolean DEFAULT true,
  p_ip_address text DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_log_id uuid;
BEGIN
  INSERT INTO content_access_logs (
    lesson_id,
    enrollment_id,
    student_id,
    access_type,
    signed_url_used,
    ip_address,
    user_agent
  )
  VALUES (
    p_lesson_id,
    p_enrollment_id,
    p_student_id,
    p_access_type,
    p_signed_url_used,
    p_ip_address,
    p_user_agent
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION log_content_access(uuid, uuid, uuid, text, boolean, text, text) TO authenticated;

-- ============================================
-- 7. Comments and Documentation
-- ============================================
COMMENT ON TABLE content_access_logs IS 'Tracks all content access attempts for audit trail and piracy detection';
COMMENT ON FUNCTION check_content_access_permission IS 'Verifies if a user has permission to access course content';
COMMENT ON FUNCTION log_content_access IS 'Logs content access for audit trail';

-- ============================================
-- Migration Complete
-- ============================================
-- Next steps:
-- 1. Create storage buckets in Supabase Dashboard:
--    - course-pdfs (private)
--    - course-audio (private)
--    - course-videos (private)
--    - course-files (private)
-- 2. Create storage RLS policies (see comments above)
-- 3. Deploy Edge Functions: get-course-content-url, watermark-pdf
-- 4. Update frontend components to use signed URLs


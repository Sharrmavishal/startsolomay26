-- ============================================
-- Security Fixes: Function Search Path & RLS Policies
-- ============================================
-- Fixes security warnings from Supabase linter:
-- 1. Sets search_path for all functions to prevent injection attacks
-- 2. Adds missing RLS policies for tables with RLS enabled

-- ============================================
-- 1. Fix Function Search Path (Security)
-- ============================================
-- Setting search_path prevents search_path injection attacks
-- Using ALTER FUNCTION to set search_path without recreating functions

-- Content Access Functions
ALTER FUNCTION check_content_access_permission(uuid, uuid) SET search_path = public;
ALTER FUNCTION log_content_access(uuid, uuid, uuid, text, boolean, text, text) SET search_path = public;

-- Admin Functions
ALTER FUNCTION is_admin_user() SET search_path = public;

-- Points Functions
ALTER FUNCTION award_points_for_action(uuid, text) SET search_path = public;
ALTER FUNCTION update_points_config_updated_at() SET search_path = public;
ALTER FUNCTION award_points_for_post() SET search_path = public;

-- Course Functions
ALTER FUNCTION calculate_quiz_score() SET search_path = public;
ALTER FUNCTION auto_complete_lesson_on_quiz_pass() SET search_path = public;
ALTER FUNCTION update_course_rating() SET search_path = public;
ALTER FUNCTION can_review_course(uuid, uuid) SET search_path = public;
ALTER FUNCTION update_course_enrollment_count() SET search_path = public;
ALTER FUNCTION update_course_progress() SET search_path = public;

-- Bundle Functions
ALTER FUNCTION calculate_bundle_price(uuid) SET search_path = public;
ALTER FUNCTION calculate_bundle_discount(uuid) SET search_path = public;
ALTER FUNCTION get_bundle_final_price(uuid) SET search_path = public;

-- Trial Expiration Functions
ALTER FUNCTION set_trial_expiration() SET search_path = public;
ALTER FUNCTION is_trial_expired(uuid) SET search_path = public;
ALTER FUNCTION is_in_grace_period(uuid) SET search_path = public;

-- Event Functions
ALTER FUNCTION update_event_attendee_count() SET search_path = public;
ALTER FUNCTION update_event_product_purchase_count() SET search_path = public;

-- Commission Functions
ALTER FUNCTION get_course_commission_rate() SET search_path = public;
ALTER FUNCTION get_session_commission_rate() SET search_path = public;
ALTER FUNCTION calculate_commission(decimal, decimal) SET search_path = public;

-- Certificate Functions
ALTER FUNCTION generate_certificate_number() SET search_path = public;

-- Session Functions
ALTER FUNCTION reset_monthly_free_sessions() SET search_path = public;

-- Notification Functions
ALTER FUNCTION process_scheduled_notifications() SET search_path = public;
ALTER FUNCTION check_and_send_scheduled_notifications() SET search_path = public;

-- Utility Functions
ALTER FUNCTION update_updated_at_column() SET search_path = public;
ALTER FUNCTION update_post_reply_count() SET search_path = public;
ALTER FUNCTION increment_post_views() SET search_path = public;
ALTER FUNCTION update_member_activity() SET search_path = public;

-- ============================================
-- 2. Add Missing RLS Policies
-- ============================================

-- community_courses table (if it exists and has RLS enabled)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'community_courses'
  ) THEN
    -- Allow public read access to active courses
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE schemaname = 'public' 
      AND tablename = 'community_courses' 
      AND policyname = 'Public can view active courses'
    ) THEN
      CREATE POLICY "Public can view active courses" ON community_courses
        FOR SELECT
        USING (is_active = true);
    END IF;

    -- Admins can manage all courses
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE schemaname = 'public' 
      AND tablename = 'community_courses' 
      AND policyname = 'Admins can manage courses'
    ) THEN
      CREATE POLICY "Admins can manage courses" ON community_courses
        FOR ALL
        USING (
          EXISTS (
            SELECT 1 FROM community_members 
            WHERE user_id = auth.uid() AND role = 'admin'
          )
        );
    END IF;
  END IF;
END $$;

-- mentor_availability table (if it exists and has RLS enabled)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'mentor_availability'
  ) THEN
    -- Mentors can view their own availability
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE schemaname = 'public' 
      AND tablename = 'mentor_availability' 
      AND policyname = 'Mentors can view own availability'
    ) THEN
      CREATE POLICY "Mentors can view own availability" ON mentor_availability
        FOR SELECT
        USING (
          mentor_id IN (
            SELECT id FROM community_members WHERE user_id = auth.uid()
          )
        );
    END IF;

    -- Mentors can manage their own availability
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE schemaname = 'public' 
      AND tablename = 'mentor_availability' 
      AND policyname = 'Mentors can manage own availability'
    ) THEN
      CREATE POLICY "Mentors can manage own availability" ON mentor_availability
        FOR ALL
        USING (
          mentor_id IN (
            SELECT id FROM community_members WHERE user_id = auth.uid()
          ) OR
          EXISTS (
            SELECT 1 FROM community_members 
            WHERE user_id = auth.uid() AND role = 'admin'
          )
        );
    END IF;

    -- Public can view availability for booking
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE schemaname = 'public' 
      AND tablename = 'mentor_availability' 
      AND policyname = 'Public can view available slots'
    ) THEN
      CREATE POLICY "Public can view available slots" ON mentor_availability
        FOR SELECT
        USING (
          is_booked = false AND
          available_date >= CURRENT_DATE
        );
    END IF;
  END IF;
END $$;

-- ============================================
-- Notes:
-- ============================================
-- 1. Leaked Password Protection must be enabled manually:
--    Supabase Dashboard → Authentication → Password Security → 
--    Enable "Leaked Password Protection"
--
-- 2. This migration uses DO blocks to safely check if tables exist
--    before creating policies, preventing errors if tables don't exist
--
-- 3. All functions now have SET search_path = public to prevent
--    search_path injection attacks while maintaining functionality

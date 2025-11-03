/*
  # Fix RLS Performance - Auth InitPlan Warnings
  
  Wraps all auth.uid() calls in (select auth.uid()) to prevent
  re-evaluation for each row, improving query performance significantly.
  
  This addresses the "auth_rls_initplan" warnings from Supabase linter.
*/

-- Helper function to safely recreate policies with optimized auth.uid() calls
-- We'll use ALTER POLICY where possible, and recreate where needed

-- ============================================
-- 1. community_members policies
-- ============================================

-- Drop and recreate "Users can create their own profile"
DROP POLICY IF EXISTS "Users can create their own profile" ON community_members;
CREATE POLICY "Users can create their own profile" ON community_members
  FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

-- Drop and recreate "Members can view vetted profiles"
DROP POLICY IF EXISTS "Members can view vetted profiles" ON community_members;
CREATE POLICY "Members can view vetted profiles" ON community_members
  FOR SELECT
  USING (
    vetting_status = 'vetted' OR 
    (select auth.uid()) = user_id
  );

-- Drop and recreate "Users can update their own profile"
DROP POLICY IF EXISTS "Users can update their own profile" ON community_members;
CREATE POLICY "Users can update their own profile" ON community_members
  FOR UPDATE
  USING ((select auth.uid()) = user_id);

-- ============================================
-- 2. community_posts policies
-- ============================================

-- Drop and recreate "Members can view published posts"
DROP POLICY IF EXISTS "Members can view published posts" ON community_posts;
CREATE POLICY "Members can view published posts" ON community_posts
  FOR SELECT
  USING (
    status = 'published' AND
    EXISTS (
      SELECT 1 FROM community_members cm
      WHERE cm.user_id = (select auth.uid())
    )
  );

-- Drop and recreate "Vetted members can create posts"
DROP POLICY IF EXISTS "Vetted members can create posts" ON community_posts;
CREATE POLICY "Vetted members can create posts" ON community_posts
  FOR INSERT
  WITH CHECK (
    author_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid()) AND vetting_status = 'vetted'
    )
  );

-- Drop and recreate "Authors and admins can update posts"
DROP POLICY IF EXISTS "Authors and admins can update posts" ON community_posts;
CREATE POLICY "Authors and admins can update posts" ON community_posts
  FOR UPDATE
  USING (
    author_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid())
    ) OR
    EXISTS (
      SELECT 1 FROM community_members 
      WHERE user_id = (select auth.uid()) AND role = 'admin'
    )
  );

-- ============================================
-- 3. community_comments policies
-- ============================================

-- Drop and recreate "Members can view comments on visible posts"
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
      WHERE user_id = (select auth.uid())
    )
  );

-- Drop and recreate "Vetted members can create comments"
DROP POLICY IF EXISTS "Vetted members can create comments" ON community_comments;
CREATE POLICY "Vetted members can create comments" ON community_comments
  FOR INSERT
  WITH CHECK (
    author_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid()) AND vetting_status = 'vetted'
    )
  );

-- Drop and recreate "Authors and admins can update comments"
DROP POLICY IF EXISTS "Authors and admins can update comments" ON community_comments;
CREATE POLICY "Authors and admins can update comments" ON community_comments
  FOR UPDATE
  USING (
    author_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid())
    ) OR
    EXISTS (
      SELECT 1 FROM community_members 
      WHERE user_id = (select auth.uid()) AND role = 'admin'
    )
  );

-- ============================================
-- 4. community_events policies
-- ============================================

-- Drop and recreate "Vetted members can view upcoming events"
DROP POLICY IF EXISTS "Vetted members can view upcoming events" ON community_events;
CREATE POLICY "Vetted members can view upcoming events" ON community_events
  FOR SELECT
  USING (
    status IN ('upcoming', 'live') AND
    EXISTS (
      SELECT 1 FROM community_members 
      WHERE user_id = (select auth.uid()) AND vetting_status = 'vetted'
    )
  );

-- Drop and recreate "Admins and organizers can create events"
DROP POLICY IF EXISTS "Admins and organizers can create events" ON community_events;
CREATE POLICY "Admins and organizers can create events" ON community_events
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM community_members 
      WHERE user_id = (select auth.uid()) AND role = 'admin'
    ) OR
    organizer_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- ============================================
-- 5. event_registrations policies
-- ============================================

-- Drop and recreate "Members can view their own registrations"
DROP POLICY IF EXISTS "Members can view their own registrations" ON event_registrations;
CREATE POLICY "Members can view their own registrations" ON event_registrations
  FOR SELECT
  USING (
    member_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid())
    ) OR
    EXISTS (
      SELECT 1 FROM community_members 
      WHERE user_id = (select auth.uid()) AND role = 'admin'
    )
  );

-- Drop and recreate "Vetted members can register for events"
DROP POLICY IF EXISTS "Vetted members can register for events" ON event_registrations;
CREATE POLICY "Vetted members can register for events" ON event_registrations
  FOR INSERT
  WITH CHECK (
    member_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid()) AND vetting_status = 'vetted'
    )
  );

-- Drop and recreate "Members can register for events"
DROP POLICY IF EXISTS "Members can register for events" ON event_registrations;
CREATE POLICY "Members can register for events" ON event_registrations
  FOR INSERT
  WITH CHECK (
    member_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- Drop and recreate "Members can update their own registrations"
DROP POLICY IF EXISTS "Members can update their own registrations" ON event_registrations;
CREATE POLICY "Members can update their own registrations" ON event_registrations
  FOR UPDATE
  USING (
    member_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- ============================================
-- 6. course_progress policies
-- ============================================

-- Drop and recreate "Members can view their own progress"
DROP POLICY IF EXISTS "Members can view their own progress" ON course_progress;
CREATE POLICY "Members can view their own progress" ON course_progress
  FOR SELECT
  USING (
    member_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- Drop and recreate "Members can update their own progress"
DROP POLICY IF EXISTS "Members can update their own progress" ON course_progress;
CREATE POLICY "Members can update their own progress" ON course_progress
  FOR UPDATE
  USING (
    member_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- ============================================
-- 7. mentor_matches policies
-- ============================================

-- Drop and recreate "Members can view their own matches"
DROP POLICY IF EXISTS "Members can view their own matches" ON mentor_matches;
CREATE POLICY "Members can view their own matches" ON mentor_matches
  FOR SELECT
  USING (
    mentor_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid())
    ) OR
    mentee_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- Drop and recreate "Members can create match requests"
DROP POLICY IF EXISTS "Members can create match requests" ON mentor_matches;
CREATE POLICY "Members can create match requests" ON mentor_matches
  FOR INSERT
  WITH CHECK (
    requested_by IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- ============================================
-- 8. admin_vetting policies
-- ============================================

-- Drop and recreate "Admins can view all vetting applications"
DROP POLICY IF EXISTS "Admins can view all vetting applications" ON admin_vetting;
CREATE POLICY "Admins can view all vetting applications" ON admin_vetting
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM community_members 
      WHERE user_id = (select auth.uid()) AND role = 'admin'
    )
  );

-- Drop and recreate "Admins can update vetting status"
DROP POLICY IF EXISTS "Admins can update vetting status" ON admin_vetting;
CREATE POLICY "Admins can update vetting status" ON admin_vetting
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM community_members 
      WHERE user_id = (select auth.uid()) AND role = 'admin'
    )
  );

-- ============================================
-- 9. post_engagements policies
-- ============================================

-- Drop and recreate "Vetted members can engage with posts"
DROP POLICY IF EXISTS "Vetted members can engage with posts" ON post_engagements;
CREATE POLICY "Vetted members can engage with posts" ON post_engagements
  FOR ALL
  USING (
    member_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid()) AND vetting_status = 'vetted'
    )
  );

-- ============================================
-- 10. comment_engagements policies
-- ============================================

-- Drop and recreate "Vetted members can engage with comments"
DROP POLICY IF EXISTS "Vetted members can engage with comments" ON comment_engagements;
CREATE POLICY "Vetted members can engage with comments" ON comment_engagements
  FOR ALL
  USING (
    member_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid()) AND vetting_status = 'vetted'
    )
  );

-- ============================================
-- 11. admin_settings policies
-- ============================================

-- Drop and recreate "Admins can view all settings"
DROP POLICY IF EXISTS "Admins can view all settings" ON admin_settings;
CREATE POLICY "Admins can view all settings" ON admin_settings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM community_members 
      WHERE user_id = (select auth.uid()) AND role = 'admin'
    )
  );

-- Drop and recreate "Admins can update settings"
DROP POLICY IF EXISTS "Admins can update settings" ON admin_settings;
CREATE POLICY "Admins can update settings" ON admin_settings
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM community_members 
      WHERE user_id = (select auth.uid()) AND role = 'admin'
    )
  );

-- Drop and recreate "Admins can insert settings"
DROP POLICY IF EXISTS "Admins can insert settings" ON admin_settings;
CREATE POLICY "Admins can insert settings" ON admin_settings
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM community_members 
      WHERE user_id = (select auth.uid()) AND role = 'admin'
    )
  );

-- ============================================
-- 12. mentor_courses policies
-- ============================================

-- Drop and recreate "Anyone can view published courses"
DROP POLICY IF EXISTS "Anyone can view published courses" ON mentor_courses;
CREATE POLICY "Anyone can view published courses" ON mentor_courses
  FOR SELECT
  USING (
    status = 'published' OR
    EXISTS (
      SELECT 1 FROM community_members 
      WHERE user_id = (select auth.uid()) AND role = 'admin'
    )
  );

-- Drop and recreate "Mentors can create courses"
DROP POLICY IF EXISTS "Mentors can create courses" ON mentor_courses;
CREATE POLICY "Mentors can create courses" ON mentor_courses
  FOR INSERT
  WITH CHECK (
    mentor_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid()) AND role = 'mentor'
    ) OR
    EXISTS (
      SELECT 1 FROM community_members 
      WHERE user_id = (select auth.uid()) AND role = 'admin'
    )
  );

-- Drop and recreate "Mentors can update their own courses"
DROP POLICY IF EXISTS "Mentors can update their own courses" ON mentor_courses;
CREATE POLICY "Mentors can update their own courses" ON mentor_courses
  FOR UPDATE
  USING (
    mentor_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid())
    ) OR
    EXISTS (
      SELECT 1 FROM community_members 
      WHERE user_id = (select auth.uid()) AND role = 'admin'
    )
  );

-- Drop and recreate "Admins can approve/reject courses"
DROP POLICY IF EXISTS "Admins can approve/reject courses" ON mentor_courses;
CREATE POLICY "Admins can approve/reject courses" ON mentor_courses
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM community_members 
      WHERE user_id = (select auth.uid()) AND role = 'admin'
    )
  );

-- ============================================
-- 13. course_enrollments policies
-- ============================================

-- Drop and recreate "Students can view their own enrollments"
DROP POLICY IF EXISTS "Students can view their own enrollments" ON course_enrollments;
CREATE POLICY "Students can view their own enrollments" ON course_enrollments
  FOR SELECT
  USING (
    student_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- Drop and recreate "Vetted members can enroll in courses"
DROP POLICY IF EXISTS "Vetted members can enroll in courses" ON course_enrollments;
CREATE POLICY "Vetted members can enroll in courses" ON course_enrollments
  FOR INSERT
  WITH CHECK (
    student_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid()) AND vetting_status = 'vetted'
    )
  );

-- Drop and recreate "Students can update their own enrollments"
DROP POLICY IF EXISTS "Students can update their own enrollments" ON course_enrollments;
CREATE POLICY "Students can update their own enrollments" ON course_enrollments
  FOR UPDATE
  USING (
    student_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- ============================================
-- 14. mentor_sessions policies
-- ============================================

-- Drop and recreate "Members can view their own sessions"
DROP POLICY IF EXISTS "Members can view their own sessions" ON mentor_sessions;
CREATE POLICY "Members can view their own sessions" ON mentor_sessions
  FOR SELECT
  USING (
    mentor_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid())
    ) OR
    mentee_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- Drop and recreate "Vetted members can request sessions"
DROP POLICY IF EXISTS "Vetted members can request sessions" ON mentor_sessions;
CREATE POLICY "Vetted members can request sessions" ON mentor_sessions
  FOR INSERT
  WITH CHECK (
    mentee_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid()) AND vetting_status = 'vetted'
    )
  );

-- Drop and recreate "Mentors and mentees can update their sessions"
DROP POLICY IF EXISTS "Mentors and mentees can update their sessions" ON mentor_sessions;
CREATE POLICY "Mentors and mentees can update their sessions" ON mentor_sessions
  FOR UPDATE
  USING (
    mentor_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid())
    ) OR
    mentee_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- ============================================
-- 15. mentor_rate_cards policies
-- ============================================

-- Drop and recreate "Anyone can view active rate cards"
DROP POLICY IF EXISTS "Anyone can view active rate cards" ON mentor_rate_cards;
CREATE POLICY "Anyone can view active rate cards" ON mentor_rate_cards
  FOR SELECT
  USING (is_active = true);

-- Drop and recreate "Mentors can manage their own rate cards"
DROP POLICY IF EXISTS "Mentors can manage their own rate cards" ON mentor_rate_cards;
CREATE POLICY "Mentors can manage their own rate cards" ON mentor_rate_cards
  FOR ALL
  USING (
    mentor_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- ============================================
-- 16. notifications policies
-- ============================================

-- Drop and recreate "Users can view their own notifications"
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT
  USING ((select auth.uid()) = user_id);

-- ============================================
-- 17. course_modules policies
-- ============================================

-- Drop and recreate "Anyone can view published course modules"
DROP POLICY IF EXISTS "Anyone can view published course modules" ON course_modules;
CREATE POLICY "Anyone can view published course modules" ON course_modules
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM mentor_courses 
      WHERE id = course_id AND status = 'published'
    )
  );

-- Drop and recreate "Mentors can manage their course modules"
DROP POLICY IF EXISTS "Mentors can manage their course modules" ON course_modules;
CREATE POLICY "Mentors can manage their course modules" ON course_modules
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM mentor_courses mc
      JOIN community_members cm ON mc.mentor_id = cm.id
      WHERE mc.id = course_id AND cm.user_id = (select auth.uid())
    ) OR
    EXISTS (
      SELECT 1 FROM community_members 
      WHERE user_id = (select auth.uid()) AND role = 'admin'
    )
  );

-- ============================================
-- 18. course_lessons policies
-- ============================================

-- Drop and recreate "Anyone can view published course lessons"
DROP POLICY IF EXISTS "Anyone can view published course lessons" ON course_lessons;
CREATE POLICY "Anyone can view published course lessons" ON course_lessons
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM course_modules cm
      JOIN mentor_courses mc ON cm.course_id = mc.id
      WHERE cm.id = module_id AND mc.status = 'published'
    )
  );

-- Drop and recreate "Mentors can manage their course lessons"
DROP POLICY IF EXISTS "Mentors can manage their course lessons" ON course_lessons;
CREATE POLICY "Mentors can manage their course lessons" ON course_lessons
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM course_modules cm
      JOIN mentor_courses mc ON cm.course_id = mc.id
      JOIN community_members ment ON mc.mentor_id = ment.id
      WHERE cm.id = module_id AND ment.user_id = (select auth.uid())
    ) OR
    EXISTS (
      SELECT 1 FROM community_members 
      WHERE user_id = (select auth.uid()) AND role = 'admin'
    )
  );

-- ============================================
-- 19. lesson_progress policies
-- ============================================

-- Drop and recreate "Students can view their own progress"
DROP POLICY IF EXISTS "Students can view their own progress" ON lesson_progress;
CREATE POLICY "Students can view their own progress" ON lesson_progress
  FOR SELECT
  USING (
    student_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- Drop and recreate "Students can update their own progress"
DROP POLICY IF EXISTS "Students can update their own progress" ON lesson_progress;
CREATE POLICY "Students can update their own progress" ON lesson_progress
  FOR UPDATE
  USING (
    student_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- ============================================
-- 20. course_certificates policies
-- ============================================

-- Drop and recreate "Students can view their own certificates"
DROP POLICY IF EXISTS "Students can view their own certificates" ON course_certificates;
CREATE POLICY "Students can view their own certificates" ON course_certificates
  FOR SELECT
  USING (
    student_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- ============================================
-- 21. certificate_templates policies
-- ============================================

-- Drop and recreate "Mentors can manage their certificate templates"
DROP POLICY IF EXISTS "Mentors can manage their certificate templates" ON certificate_templates;
CREATE POLICY "Mentors can manage their certificate templates" ON certificate_templates
  FOR ALL
  USING (
    mentor_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- ============================================
-- 22. content_access_logs policies
-- ============================================

-- Drop and recreate "Users can view own access logs"
DROP POLICY IF EXISTS "Users can view own access logs" ON content_access_logs;
CREATE POLICY "Users can view own access logs" ON content_access_logs
  FOR SELECT
  USING (
    student_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- Drop and recreate "System can insert access logs"
DROP POLICY IF EXISTS "System can insert access logs" ON content_access_logs;
CREATE POLICY "System can insert access logs" ON content_access_logs
  FOR INSERT
  WITH CHECK (true);

-- Drop and recreate "Admins can view all access logs"
DROP POLICY IF EXISTS "Admins can view all access logs" ON content_access_logs;
CREATE POLICY "Admins can view all access logs" ON content_access_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM community_members 
      WHERE user_id = (select auth.uid()) AND role = 'admin'
    )
  );

-- Drop and recreate "Mentors can view access logs for their courses"
DROP POLICY IF EXISTS "Mentors can view access logs for their courses" ON content_access_logs;
CREATE POLICY "Mentors can view access logs for their courses" ON content_access_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM mentor_courses mc
      JOIN community_members cm ON mc.mentor_id = cm.id
      WHERE mc.id = (SELECT course_id FROM course_lessons WHERE id = lesson_id)
      AND cm.user_id = (select auth.uid())
    )
  );

-- ============================================
-- 23. points_config policies
-- ============================================

-- Drop and recreate "Admins can manage points config"
DROP POLICY IF EXISTS "Admins can manage points config" ON points_config;
CREATE POLICY "Admins can manage points config" ON points_config
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM community_members 
      WHERE user_id = (select auth.uid()) AND role = 'admin'
    )
  );

-- ============================================
-- 24. course_quiz_questions policies
-- ============================================

-- Drop and recreate "Students can view quiz questions for enrolled courses"
DROP POLICY IF EXISTS "Students can view quiz questions for enrolled courses" ON course_quiz_questions;
CREATE POLICY "Students can view quiz questions for enrolled courses" ON course_quiz_questions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM course_enrollments ce
      JOIN community_members cm ON ce.student_id = cm.id
      WHERE ce.course_id = (SELECT course_id FROM course_lessons WHERE id = lesson_id)
      AND cm.user_id = (select auth.uid())
      AND ce.enrollment_status = 'active'
    )
  );

-- Drop and recreate "Mentors can manage quiz questions"
DROP POLICY IF EXISTS "Mentors can manage quiz questions" ON course_quiz_questions;
CREATE POLICY "Mentors can manage quiz questions" ON course_quiz_questions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM course_lessons cl
      JOIN course_modules cm ON cl.module_id = cm.id
      JOIN mentor_courses mc ON cm.course_id = mc.id
      JOIN community_members ment ON mc.mentor_id = ment.id
      WHERE cl.id = lesson_id AND ment.user_id = (select auth.uid())
    ) OR
    EXISTS (
      SELECT 1 FROM community_members 
      WHERE user_id = (select auth.uid()) AND role = 'admin'
    )
  );

-- ============================================
-- 25. course_quiz_submissions policies
-- ============================================

-- Drop and recreate "Students can view their own quiz submissions"
DROP POLICY IF EXISTS "Students can view their own quiz submissions" ON course_quiz_submissions;
CREATE POLICY "Students can view their own quiz submissions" ON course_quiz_submissions
  FOR SELECT
  USING (
    student_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- Drop and recreate "Students can submit quizzes"
DROP POLICY IF EXISTS "Students can submit quizzes" ON course_quiz_submissions;
CREATE POLICY "Students can submit quizzes" ON course_quiz_submissions
  FOR INSERT
  WITH CHECK (
    student_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- Drop and recreate "Students can update their own quiz submissions"
DROP POLICY IF EXISTS "Students can update their own quiz submissions" ON course_quiz_submissions;
CREATE POLICY "Students can update their own quiz submissions" ON course_quiz_submissions
  FOR UPDATE
  USING (
    student_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- ============================================
-- 26. event_products policies
-- ============================================

-- Drop and recreate "Mentors can manage their own event products"
DROP POLICY IF EXISTS "Mentors can manage their own event products" ON event_products;
CREATE POLICY "Mentors can manage their own event products" ON event_products
  FOR ALL
  USING (
    mentor_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- Drop and recreate "Admins can manage all event products"
DROP POLICY IF EXISTS "Admins can manage all event products" ON event_products;
CREATE POLICY "Admins can manage all event products" ON event_products
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM community_members 
      WHERE user_id = (select auth.uid()) AND role = 'admin'
    )
  );

-- ============================================
-- 27. event_product_purchases policies
-- ============================================

-- Drop and recreate "Users can view their own purchases"
DROP POLICY IF EXISTS "Users can view their own purchases" ON event_product_purchases;
CREATE POLICY "Users can view their own purchases" ON event_product_purchases
  FOR SELECT
  USING (
    buyer_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- Drop and recreate "Users can create purchases"
DROP POLICY IF EXISTS "Users can create purchases" ON event_product_purchases;
CREATE POLICY "Users can create purchases" ON event_product_purchases
  FOR INSERT
  WITH CHECK (
    buyer_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- Drop and recreate "Users can update their own purchases"
DROP POLICY IF EXISTS "Users can update their own purchases" ON event_product_purchases;
CREATE POLICY "Users can update their own purchases" ON event_product_purchases
  FOR UPDATE
  USING (
    buyer_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- Drop and recreate "Mentors can view purchases for their products"
DROP POLICY IF EXISTS "Mentors can view purchases for their products" ON event_product_purchases;
CREATE POLICY "Mentors can view purchases for their products" ON event_product_purchases
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM event_products ep
      JOIN community_members cm ON ep.mentor_id = cm.id
      WHERE ep.id = product_id AND cm.user_id = (select auth.uid())
    )
  );

-- Drop and recreate "Admins can view all purchases"
DROP POLICY IF EXISTS "Admins can view all purchases" ON event_product_purchases;
CREATE POLICY "Admins can view all purchases" ON event_product_purchases
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM community_members 
      WHERE user_id = (select auth.uid()) AND role = 'admin'
    )
  );

-- ============================================
-- 28. course_reviews policies
-- ============================================

-- Drop and recreate "Students can create reviews"
DROP POLICY IF EXISTS "Students can create reviews" ON course_reviews;
CREATE POLICY "Students can create reviews" ON course_reviews
  FOR INSERT
  WITH CHECK (
    student_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- Drop and recreate "Students can update their own reviews"
DROP POLICY IF EXISTS "Students can update their own reviews" ON course_reviews;
CREATE POLICY "Students can update their own reviews" ON course_reviews
  FOR UPDATE
  USING (
    student_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- Drop and recreate "Students can delete their own reviews"
DROP POLICY IF EXISTS "Students can delete their own reviews" ON course_reviews;
CREATE POLICY "Students can delete their own reviews" ON course_reviews
  FOR DELETE
  USING (
    student_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- ============================================
-- 29. course_bundles policies
-- ============================================

-- Drop and recreate "Anyone can view active bundles"
DROP POLICY IF EXISTS "Anyone can view active bundles" ON course_bundles;
CREATE POLICY "Anyone can view active bundles" ON course_bundles
  FOR SELECT
  USING (is_active = true);

-- Drop and recreate "Mentors can create bundles"
DROP POLICY IF EXISTS "Mentors can create bundles" ON course_bundles;
CREATE POLICY "Mentors can create bundles" ON course_bundles
  FOR INSERT
  WITH CHECK (
    creator_type = 'mentor' AND
    creator_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid()) AND role = 'mentor'
    )
  );

-- Drop and recreate "Admins can create bundles"
DROP POLICY IF EXISTS "Admins can create bundles" ON course_bundles;
CREATE POLICY "Admins can create bundles" ON course_bundles
  FOR INSERT
  WITH CHECK (
    creator_type = 'admin' AND
    EXISTS (
      SELECT 1 FROM community_members 
      WHERE user_id = (select auth.uid()) AND role = 'admin'
    )
  );

-- Drop and recreate "Creators can update their own bundles"
DROP POLICY IF EXISTS "Creators can update their own bundles" ON course_bundles;
CREATE POLICY "Creators can update their own bundles" ON course_bundles
  FOR UPDATE
  USING (
    (creator_type = 'mentor' AND creator_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid()) AND role = 'mentor'
    )) OR
    (creator_type = 'admin' AND EXISTS (
      SELECT 1 FROM community_members 
      WHERE user_id = (select auth.uid()) AND role = 'admin'
    ))
  );

-- Drop and recreate "Creators can delete their own bundles"
DROP POLICY IF EXISTS "Creators can delete their own bundles" ON course_bundles;
CREATE POLICY "Creators can delete their own bundles" ON course_bundles
  FOR DELETE
  USING (
    (creator_type = 'mentor' AND creator_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid()) AND role = 'mentor'
    )) OR
    (creator_type = 'admin' AND EXISTS (
      SELECT 1 FROM community_members 
      WHERE user_id = (select auth.uid()) AND role = 'admin'
    ))
  );

-- ============================================
-- 30. course_bundle_items policies
-- ============================================

-- Drop and recreate "Anyone can view bundle items"
DROP POLICY IF EXISTS "Anyone can view bundle items" ON course_bundle_items;
CREATE POLICY "Anyone can view bundle items" ON course_bundle_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM course_bundles 
      WHERE id = bundle_id AND is_active = true
    )
  );

-- Drop and recreate "Bundle creators can manage items"
DROP POLICY IF EXISTS "Bundle creators can manage items" ON course_bundle_items;
CREATE POLICY "Bundle creators can manage items" ON course_bundle_items
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM course_bundles cb
      WHERE cb.id = bundle_id AND (
        (cb.creator_type = 'mentor' AND cb.creator_id IN (
          SELECT id FROM community_members 
          WHERE user_id = (select auth.uid()) AND role = 'mentor'
        )) OR
        (cb.creator_type = 'admin' AND EXISTS (
          SELECT 1 FROM community_members 
          WHERE user_id = (select auth.uid()) AND role = 'admin'
        ))
      )
    )
  );

-- ============================================
-- 31. community_courses policies
-- ============================================

-- Drop and recreate "Admins can manage courses"
DROP POLICY IF EXISTS "Admins can manage courses" ON community_courses;
CREATE POLICY "Admins can manage courses" ON community_courses
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM community_members 
      WHERE user_id = (select auth.uid()) AND role = 'admin'
    )
  );

-- ============================================
-- 32. mentor_availability policies
-- ============================================

-- Drop and recreate "Mentors can view own availability"
DROP POLICY IF EXISTS "Mentors can view own availability" ON mentor_availability;
CREATE POLICY "Mentors can view own availability" ON mentor_availability
  FOR SELECT
  USING (
    mentor_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid())
    )
  );

-- Drop and recreate "Mentors can manage own availability"
DROP POLICY IF EXISTS "Mentors can manage own availability" ON mentor_availability;
CREATE POLICY "Mentors can manage own availability" ON mentor_availability
  FOR ALL
  USING (
    mentor_id IN (
      SELECT id FROM community_members 
      WHERE user_id = (select auth.uid())
    ) OR
    EXISTS (
      SELECT 1 FROM community_members 
      WHERE user_id = (select auth.uid()) AND role = 'admin'
    )
  );


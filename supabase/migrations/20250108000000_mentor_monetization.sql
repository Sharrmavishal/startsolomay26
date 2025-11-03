-- ============================================
-- Mentor Monetization & Course Hosting
-- ============================================
-- This migration adds:
-- 1. Mentor courses (separate from events)
-- 2. Mentor sessions (free and paid 1:1 sessions)
-- 3. Mentor rate cards
-- 4. Admin settings for commission rates
-- 5. Notifications system
-- 6. Course enrollments and payments

-- ============================================
-- 1. Admin Settings Table
-- ============================================
CREATE TABLE IF NOT EXISTS admin_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  key text UNIQUE NOT NULL, -- e.g., 'course_commission_rate', 'session_commission_rate'
  value jsonb NOT NULL, -- Store different types: numbers, strings, booleans
  description text,
  updated_by uuid REFERENCES auth.users(id),
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Insert default settings
INSERT INTO admin_settings (key, value, description) VALUES
  ('course_commission_rate', '15', 'Commission percentage for mentor courses'),
  ('session_commission_rate', '20', 'Commission percentage for paid mentor sessions'),
  ('monthly_free_sessions_limit', '5', 'Default number of free sessions per mentor per month'),
  ('course_hosting_points_threshold', '500', 'Points required for mentors to host courses without admin approval'),
  ('email_notifications_enabled', 'true', 'Enable email notifications'),
  ('whatsapp_notifications_enabled', 'true', 'Enable WhatsApp notifications'),
  ('max_notifications_per_day', '3', 'Maximum notifications per user per day')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- 2. Mentor Courses Table
-- ============================================
CREATE TABLE IF NOT EXISTS mentor_courses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id uuid NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  
  -- Course details
  title text NOT NULL,
  description text,
  short_description text, -- For listings
  category text, -- e.g., 'business-strategy', 'marketing', 'funding'
  
  -- Pricing
  price decimal(10, 2) NOT NULL CHECK (price >= 0),
  commission_rate decimal(5, 2) DEFAULT 15, -- Percentage (can be overridden by admin)
  
  -- Approval & Status
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'published', 'rejected', 'archived')),
  approval_status text DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  admin_approved_by uuid REFERENCES auth.users(id),
  admin_approved_at timestamptz,
  rejection_reason text,
  
  -- Enrollment
  max_students integer,
  enrollment_count integer DEFAULT 0,
  current_students integer DEFAULT 0,
  
  -- Course hosting eligibility
  requires_admin_approval boolean DEFAULT true, -- If false, mentor can publish directly (points-based)
  points_threshold_met boolean DEFAULT false,
  
  -- Course structure
  total_duration_hours integer, -- Estimated total course duration
  number_of_modules integer,
  course_materials jsonb DEFAULT '[]'::jsonb, -- Links, resources, etc.
  
  -- Metadata
  featured boolean DEFAULT false, -- For featured courses (like Launchpad)
  tags text[],
  cover_image_url text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Constraints
  CONSTRAINT valid_enrollment CHECK (current_students <= enrollment_count),
  CONSTRAINT valid_students CHECK (enrollment_count <= COALESCE(max_students, 999999))
);

-- ============================================
-- 3. Course Enrollments
-- ============================================
CREATE TABLE IF NOT EXISTS course_enrollments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id uuid NOT NULL REFERENCES mentor_courses(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  
  -- Payment details
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_amount decimal(10, 2) NOT NULL,
  commission_amount decimal(10, 2) NOT NULL, -- Platform commission
  mentor_payout decimal(10, 2) NOT NULL, -- Amount mentor receives
  
  -- Razorpay integration
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  
  -- Enrollment status
  enrollment_status text NOT NULL DEFAULT 'active' CHECK (enrollment_status IN ('active', 'completed', 'cancelled', 'expired')),
  enrolled_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  cancelled_at timestamptz,
  
  -- Progress tracking (future)
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(course_id, student_id)
);

-- ============================================
-- 4. Mentor Sessions (1:1 Sessions)
-- ============================================
CREATE TABLE IF NOT EXISTS mentor_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id uuid NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  mentee_id uuid NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  
  -- Session type
  session_type text NOT NULL CHECK (session_type IN ('free', 'paid')),
  
  -- Scheduling
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 60 CHECK (duration_minutes > 0),
  timezone text DEFAULT 'Asia/Kolkata',
  
  -- Pricing (for paid sessions)
  price decimal(10, 2) CHECK (price >= 0),
  commission_rate decimal(5, 2) DEFAULT 20, -- Percentage
  commission_amount decimal(10, 2) DEFAULT 0,
  mentor_payout decimal(10, 2) DEFAULT 0,
  
  -- Razorpay integration (for paid sessions)
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  
  -- Session status
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no-show')),
  confirmed_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,
  
  -- Meeting details
  meeting_link text,
  meeting_password text,
  meeting_platform text, -- 'zoom', 'google-meet', 'custom'
  
  -- Notes
  mentee_notes text, -- Request notes from mentee
  mentor_notes text, -- Post-session notes from mentor
  session_feedback jsonb DEFAULT '{}'::jsonb,
  
  -- Related event (for calendar integration)
  related_event_id uuid REFERENCES community_events(id),
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT different_people CHECK (mentor_id != mentee_id),
  CONSTRAINT free_session_no_price CHECK (
    (session_type = 'free' AND price IS NULL) OR 
    (session_type = 'paid' AND price IS NOT NULL)
  )
);

-- ============================================
-- 5. Mentor Rate Cards
-- ============================================
CREATE TABLE IF NOT EXISTS mentor_rate_cards (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id uuid NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  
  -- Rate details
  session_type text NOT NULL, -- e.g., 'strategy', 'technical', 'business', 'general'
  session_type_label text NOT NULL, -- Display name
  price_per_hour decimal(10, 2) NOT NULL CHECK (price_per_hour >= 0),
  min_duration_minutes integer DEFAULT 30 CHECK (min_duration_minutes >= 15),
  max_duration_minutes integer DEFAULT 120 CHECK (max_duration_minutes >= min_duration_minutes),
  
  -- Availability
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  
  -- Description
  description text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(mentor_id, session_type)
);

-- ============================================
-- 6. Notifications Table
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Notification details
  type text NOT NULL, -- e.g., 'welcome', 'course_enrollment', 'session_scheduled', 'payment_confirmation'
  title text NOT NULL,
  message text NOT NULL,
  
  -- Channel
  channel text NOT NULL CHECK (channel IN ('email', 'whatsapp', 'both')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  
  -- Metadata
  metadata jsonb DEFAULT '{}'::jsonb, -- Store related IDs, links, etc.
  
  -- Timing
  scheduled_for timestamptz DEFAULT now(),
  sent_at timestamptz,
  failed_at timestamptz,
  failure_reason text,
  
  -- Rate limiting
  notification_date date DEFAULT CURRENT_DATE, -- For rate limiting per day
  
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- 7. Update community_members table
-- ============================================
ALTER TABLE community_members
ADD COLUMN IF NOT EXISTS free_sessions_per_month integer DEFAULT 5,
ADD COLUMN IF NOT EXISTS free_sessions_used_this_month integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS free_sessions_reset_date date DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS can_host_courses boolean DEFAULT false;

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_mentor_courses_mentor ON mentor_courses(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentor_courses_status ON mentor_courses(status);
CREATE INDEX IF NOT EXISTS idx_mentor_courses_approved ON mentor_courses(approval_status);
CREATE INDEX IF NOT EXISTS idx_mentor_courses_featured ON mentor_courses(featured) WHERE featured = true;

CREATE INDEX IF NOT EXISTS idx_course_enrollments_course ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_student ON course_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_payment ON course_enrollments(payment_status);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_razorpay ON course_enrollments(razorpay_order_id);

CREATE INDEX IF NOT EXISTS idx_mentor_sessions_mentor ON mentor_sessions(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentor_sessions_mentee ON mentor_sessions(mentee_id);
CREATE INDEX IF NOT EXISTS idx_mentor_sessions_scheduled ON mentor_sessions(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_mentor_sessions_status ON mentor_sessions(status);
CREATE INDEX IF NOT EXISTS idx_mentor_sessions_type ON mentor_sessions(session_type);
CREATE INDEX IF NOT EXISTS idx_mentor_sessions_razorpay ON mentor_sessions(razorpay_order_id);

CREATE INDEX IF NOT EXISTS idx_mentor_rate_cards_mentor ON mentor_rate_cards(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentor_rate_cards_active ON mentor_rate_cards(is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_date ON notifications(notification_date);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled ON notifications(scheduled_for) WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_members_free_sessions_reset ON community_members(free_sessions_reset_date);

-- ============================================
-- Triggers
-- ============================================

-- Update updated_at timestamps
CREATE TRIGGER update_mentor_courses_updated_at BEFORE UPDATE ON mentor_courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_course_enrollments_updated_at BEFORE UPDATE ON course_enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mentor_sessions_updated_at BEFORE UPDATE ON mentor_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mentor_rate_cards_updated_at BEFORE UPDATE ON mentor_rate_cards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_settings_updated_at BEFORE UPDATE ON admin_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-update enrollment count
CREATE OR REPLACE FUNCTION update_course_enrollment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE mentor_courses 
    SET enrollment_count = enrollment_count + 1,
        current_students = current_students + 1
    WHERE id = NEW.course_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE mentor_courses 
    SET enrollment_count = enrollment_count - 1,
        current_students = current_students - 1
    WHERE id = OLD.course_id;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle status changes
    IF OLD.enrollment_status != NEW.enrollment_status THEN
      IF NEW.enrollment_status = 'active' AND OLD.enrollment_status != 'active' THEN
        UPDATE mentor_courses 
        SET current_students = current_students + 1
        WHERE id = NEW.course_id;
      ELSIF OLD.enrollment_status = 'active' AND NEW.enrollment_status != 'active' THEN
        UPDATE mentor_courses 
        SET current_students = current_students - 1
        WHERE id = NEW.course_id;
      END IF;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_course_enrollment_count
AFTER INSERT OR UPDATE OR DELETE ON course_enrollments
FOR EACH ROW EXECUTE FUNCTION update_course_enrollment_count();

-- Auto-reset free sessions monthly
CREATE OR REPLACE FUNCTION reset_monthly_free_sessions()
RETURNS void AS $$
BEGIN
  UPDATE community_members
  SET free_sessions_used_this_month = 0,
      free_sessions_reset_date = CURRENT_DATE
  WHERE free_sessions_reset_date < CURRENT_DATE
    AND role = 'mentor'
    AND free_sessions_used_this_month > 0;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Row Level Security Policies
-- ============================================

-- Admin Settings
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all settings" ON admin_settings
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM community_members WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update settings" ON admin_settings
  FOR UPDATE
  USING (EXISTS (SELECT 1 FROM community_members WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can insert settings" ON admin_settings
  FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM community_members WHERE user_id = auth.uid() AND role = 'admin'));

-- Mentor Courses
ALTER TABLE mentor_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published courses" ON mentor_courses
  FOR SELECT
  USING (status = 'published' OR 
         mentor_id IN (SELECT id FROM community_members WHERE user_id = auth.uid()) OR
         EXISTS (SELECT 1 FROM community_members WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Mentors can create courses" ON mentor_courses
  FOR INSERT
  WITH CHECK (
    mentor_id IN (
      SELECT id FROM community_members 
      WHERE user_id = auth.uid() 
      AND role IN ('mentor', 'admin')
    )
  );

CREATE POLICY "Mentors can update their own courses" ON mentor_courses
  FOR UPDATE
  USING (
    mentor_id IN (SELECT id FROM community_members WHERE user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM community_members WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can approve/reject courses" ON mentor_courses
  FOR UPDATE
  USING (EXISTS (SELECT 1 FROM community_members WHERE user_id = auth.uid() AND role = 'admin'));

-- Course Enrollments
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own enrollments" ON course_enrollments
  FOR SELECT
  USING (
    student_id IN (SELECT id FROM community_members WHERE user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM mentor_courses WHERE id = course_id AND mentor_id IN (SELECT id FROM community_members WHERE user_id = auth.uid())) OR
    EXISTS (SELECT 1 FROM community_members WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Vetted members can enroll in courses" ON course_enrollments
  FOR INSERT
  WITH CHECK (
    student_id IN (
      SELECT id FROM community_members 
      WHERE user_id = auth.uid() 
      AND vetting_status = 'vetted'
    )
  );

CREATE POLICY "Students can update their own enrollments" ON course_enrollments
  FOR UPDATE
  USING (
    student_id IN (SELECT id FROM community_members WHERE user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM community_members WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Mentor Sessions
ALTER TABLE mentor_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view their own sessions" ON mentor_sessions
  FOR SELECT
  USING (
    mentor_id IN (SELECT id FROM community_members WHERE user_id = auth.uid()) OR
    mentee_id IN (SELECT id FROM community_members WHERE user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM community_members WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Vetted members can request sessions" ON mentor_sessions
  FOR INSERT
  WITH CHECK (
    mentee_id IN (
      SELECT id FROM community_members 
      WHERE user_id = auth.uid() 
      AND vetting_status = 'vetted'
    )
  );

CREATE POLICY "Mentors and mentees can update their sessions" ON mentor_sessions
  FOR UPDATE
  USING (
    mentor_id IN (SELECT id FROM community_members WHERE user_id = auth.uid()) OR
    mentee_id IN (SELECT id FROM community_members WHERE user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM community_members WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Mentor Rate Cards
ALTER TABLE mentor_rate_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active rate cards" ON mentor_rate_cards
  FOR SELECT
  USING (is_active = true OR mentor_id IN (SELECT id FROM community_members WHERE user_id = auth.uid()));

CREATE POLICY "Mentors can manage their own rate cards" ON mentor_rate_cards
  FOR ALL
  USING (
    mentor_id IN (SELECT id FROM community_members WHERE user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM community_members WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT
  WITH CHECK (true); -- Notifications are created server-side

-- ============================================
-- Helper Functions
-- ============================================

-- Get commission rate for courses
CREATE OR REPLACE FUNCTION get_course_commission_rate()
RETURNS decimal(5, 2) AS $$
DECLARE
  rate decimal(5, 2);
BEGIN
  SELECT (value::text)::decimal INTO rate
  FROM admin_settings
  WHERE key = 'course_commission_rate';
  
  RETURN COALESCE(rate, 15.00);
END;
$$ LANGUAGE plpgsql;

-- Get commission rate for sessions
CREATE OR REPLACE FUNCTION get_session_commission_rate()
RETURNS decimal(5, 2) AS $$
DECLARE
  rate decimal(5, 2);
BEGIN
  SELECT (value::text)::decimal INTO rate
  FROM admin_settings
  WHERE key = 'session_commission_rate';
  
  RETURN COALESCE(rate, 20.00);
END;
$$ LANGUAGE plpgsql;

-- Calculate commission and payout
CREATE OR REPLACE FUNCTION calculate_commission(amount decimal, commission_rate decimal)
RETURNS TABLE(commission decimal, payout decimal) AS $$
BEGIN
  RETURN QUERY SELECT
    (amount * commission_rate / 100)::decimal(10, 2) as commission,
    (amount - (amount * commission_rate / 100))::decimal(10, 2) as payout;
END;
$$ LANGUAGE plpgsql;


/*
  # Start Solo Community Platform - Database Schema

  This migration creates all tables needed for the community platform:
  - Member profiles and vetting
  - Forum posts and comments
  - Events and registrations
  - Course integration
  - Mentor matching
  - Gamification (badges and points)
*/

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. Community Members Table
-- ============================================
CREATE TABLE IF NOT EXISTS community_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  display_name text,
  bio text,
  avatar_url text,
  role text NOT NULL DEFAULT 'solopreneur' CHECK (role IN ('solopreneur', 'mentor', 'admin')),
  vetting_status text NOT NULL DEFAULT 'pending' CHECK (vetting_status IN ('pending', 'approved', 'rejected', 'vetted')),
  vetting_notes text,
  vetting_date timestamptz,
  vetting_admin_id uuid REFERENCES auth.users(id),
  
  -- Profile details
  industry text,
  business_stage text,
  location text,
  skills text[], -- Array of skills
  social_links jsonb DEFAULT '{}'::jsonb, -- {linkedin, twitter, website, etc}
  
  -- Gamification
  points integer DEFAULT 0,
  badges text[] DEFAULT '{}'::text[],
  
  -- Course access
  has_course_access boolean DEFAULT false,
  course_completed boolean DEFAULT false,
  course_completion_date timestamptz,
  
  -- Metadata
  profile_completeness integer DEFAULT 0 CHECK (profile_completeness >= 0 AND profile_completeness <= 100),
  last_active_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 2. Community Posts (Forum Discussions)
-- ============================================
CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id uuid NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  category text NOT NULL DEFAULT 'general' CHECK (category IN ('getting-started', 'business-strategy', 'marketing', 'funding', 'success-stories', 'general', 'q-and-a')),
  title text NOT NULL,
  content text NOT NULL,
  content_html text, -- Rich text formatted version
  
  -- Engagement metrics
  upvotes integer DEFAULT 0,
  views integer DEFAULT 0,
  reply_count integer DEFAULT 0,
  bookmarked_count integer DEFAULT 0,
  
  -- Features
  tags text[] DEFAULT '{}'::text[],
  is_pinned boolean DEFAULT false,
  is_locked boolean DEFAULT false,
  best_answer_id uuid, -- For Q&A category
  
  -- Metadata
  status text DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT title_length CHECK (char_length(title) >= 5 AND char_length(title) <= 200)
);

-- ============================================
-- 3. Community Comments (Threaded Replies)
-- ============================================
CREATE TABLE IF NOT EXISTS community_comments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id uuid NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  parent_comment_id uuid REFERENCES community_comments(id) ON DELETE CASCADE, -- For threaded replies
  content text NOT NULL,
  content_html text,
  
  -- Engagement
  upvotes integer DEFAULT 0,
  is_best_answer boolean DEFAULT false,
  
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  edited_at timestamptz,
  
  CONSTRAINT content_length CHECK (char_length(content) >= 1)
);

-- ============================================
-- 4. Community Events (Live Events/Webinars)
-- ============================================
CREATE TABLE IF NOT EXISTS community_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organizer_id uuid NOT NULL REFERENCES community_members(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  event_type text NOT NULL DEFAULT 'webinar' CHECK (event_type IN ('webinar', 'workshop', 'networking', 'q-and-a')),
  
  -- Timing
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  timezone text DEFAULT 'Asia/Kolkata',
  
  -- Logistics
  meeting_link text, -- Zoom/Google Meet link
  meeting_id text,
  meeting_password text,
  recording_url text, -- Post-event recording
  
  -- Capacity & Registration
  max_attendees integer,
  current_attendees integer DEFAULT 0,
  registration_open boolean DEFAULT true,
  registration_deadline timestamptz,
  
  -- Metadata
  is_featured boolean DEFAULT false,
  status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_timing CHECK (end_time > start_time)
);

-- ============================================
-- 5. Event Registrations
-- ============================================
CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id uuid NOT NULL REFERENCES community_events(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  status text DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'no-show', 'cancelled')),
  registered_at timestamptz DEFAULT now(),
  reminder_sent boolean DEFAULT false,
  notes text,
  
  UNIQUE(event_id, member_id)
);

-- ============================================
-- 6. Community Courses (Course Integration)
-- ============================================
CREATE TABLE IF NOT EXISTS community_courses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_name text NOT NULL DEFAULT 'Launchpad',
  course_description text,
  external_url text, -- Link to course materials
  
  -- Access control
  is_active boolean DEFAULT true,
  requires_approval boolean DEFAULT true,
  auto_approve_on_completion boolean DEFAULT false,
  
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 7. Course Progress Tracking
-- ============================================
CREATE TABLE IF NOT EXISTS course_progress (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id uuid NOT NULL REFERENCES community_courses(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  
  -- Progress
  modules_completed text[] DEFAULT '{}'::text[],
  completion_percentage integer DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  is_completed boolean DEFAULT false,
  completed_at timestamptz,
  
  -- Certificate
  certificate_url text,
  certificate_issued_at timestamptz,
  
  -- Metadata
  started_at timestamptz DEFAULT now(),
  last_accessed_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(course_id, member_id)
);

-- ============================================
-- 8. Mentor Matching
-- ============================================
CREATE TABLE IF NOT EXISTS mentor_matches (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id uuid NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  mentee_id uuid NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  
  -- Match details
  match_status text NOT NULL DEFAULT 'pending' CHECK (match_status IN ('pending', 'accepted', 'active', 'completed', 'declined')),
  match_reason text, -- Why they were matched (skills, industry, etc)
  
  -- Request details
  requested_at timestamptz DEFAULT now(),
  requested_by uuid NOT NULL, -- member_id who initiated
  message text, -- Initial request message
  
  -- Response
  responded_at timestamptz,
  response_message text,
  
  -- Active relationship
  sessions_completed integer DEFAULT 0,
  last_session_date timestamptz,
  relationship_notes text,
  
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT different_people CHECK (mentor_id != mentee_id)
);

-- ============================================
-- 9. Mentor Availability (Calendar)
-- ============================================
CREATE TABLE IF NOT EXISTS mentor_availability (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id uuid NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  available_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  timezone text DEFAULT 'Asia/Kolkata',
  is_booked boolean DEFAULT false,
  booked_by uuid REFERENCES community_members(id),
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_time_slot CHECK (end_time > start_time)
);

-- ============================================
-- 10. Community Badges (Gamification)
-- ============================================
CREATE TABLE IF NOT EXISTS community_badges (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  badge_key text UNIQUE NOT NULL, -- e.g., 'first-post', 'helpful-mentor'
  badge_name text NOT NULL,
  badge_description text,
  badge_icon_url text,
  category text DEFAULT 'general' CHECK (category IN ('engagement', 'achievement', 'milestone', 'special')),
  
  -- Unlock criteria
  unlock_condition text, -- Description of how to earn
  points_required integer DEFAULT 0,
  
  -- Metadata
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- 11. Member Badges (Junction Table)
-- ============================================
CREATE TABLE IF NOT EXISTS member_badges (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id uuid NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  badge_id uuid NOT NULL REFERENCES community_badges(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  
  UNIQUE(member_id, badge_id)
);

-- ============================================
-- 12. Admin Vetting Queue
-- ============================================
CREATE TABLE IF NOT EXISTS admin_vetting (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  applicant_email text NOT NULL,
  applicant_name text NOT NULL,
  applicant_phone text,
  application_source text DEFAULT 'discovery-call', -- discovery-call, course, direct
  
  -- Application details
  application_data jsonb DEFAULT '{}'::jsonb, -- Store full form submission
  role_requested text CHECK (role_requested IN ('solopreneur', 'mentor')),
  
  -- Vetting workflow
  status text NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewed', 'call-scheduled', 'approved', 'rejected')),
  admin_notes text,
  vetting_call_scheduled_at timestamptz,
  vetting_call_completed_at timestamptz,
  vetting_call_notes text,
  calendly_event_id text,
  
  -- Assignment
  assigned_admin_id uuid REFERENCES auth.users(id),
  reviewed_by uuid REFERENCES auth.users(id),
  
  -- Result
  decision_date timestamptz,
  rejection_reason text,
  invite_sent boolean DEFAULT false,
  invite_sent_at timestamptz,
  
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 13. Engagement Tracking (Post Interactions)
-- ============================================
CREATE TABLE IF NOT EXISTS post_engagements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id uuid NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  engagement_type text NOT NULL CHECK (engagement_type IN ('upvote', 'bookmark', 'view')),
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(post_id, member_id, engagement_type)
);

-- ============================================
-- 14. Comment Engagements
-- ============================================
CREATE TABLE IF NOT EXISTS comment_engagements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  comment_id uuid NOT NULL REFERENCES community_comments(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  engagement_type text NOT NULL CHECK (engagement_type IN ('upvote')),
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(comment_id, member_id, engagement_type)
);

-- ============================================
-- INDEXES for Performance
-- ============================================

-- Community Members
CREATE INDEX IF NOT EXISTS idx_members_user_id ON community_members(user_id);
CREATE INDEX IF NOT EXISTS idx_members_vetting_status ON community_members(vetting_status);
CREATE INDEX IF NOT EXISTS idx_members_role ON community_members(role);
CREATE INDEX IF NOT EXISTS idx_members_email ON community_members(email);

-- Posts
CREATE INDEX IF NOT EXISTS idx_posts_author ON community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_category ON community_posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_created ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_status ON community_posts(status);

-- Comments
CREATE INDEX IF NOT EXISTS idx_comments_post ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_author ON community_comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON community_comments(parent_comment_id);

-- Events
CREATE INDEX IF NOT EXISTS idx_events_start_time ON community_events(start_time);
CREATE INDEX IF NOT EXISTS idx_events_status ON community_events(status);
CREATE INDEX IF NOT EXISTS idx_events_organizer ON community_events(organizer_id);

-- Event Registrations
CREATE INDEX IF NOT EXISTS idx_event_reg_member ON event_registrations(member_id);
CREATE INDEX IF NOT EXISTS idx_event_reg_event ON event_registrations(event_id);

-- Mentor Matches
CREATE INDEX IF NOT EXISTS idx_matches_mentor ON mentor_matches(mentor_id);
CREATE INDEX IF NOT EXISTS idx_matches_mentee ON mentor_matches(mentee_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON mentor_matches(match_status);

-- Vetting
CREATE INDEX IF NOT EXISTS idx_vetting_status ON admin_vetting(status);
CREATE INDEX IF NOT EXISTS idx_vetting_email ON admin_vetting(applicant_email);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON community_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON community_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON community_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON community_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_course_progress_updated_at BEFORE UPDATE ON course_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mentor_matches_updated_at BEFORE UPDATE ON mentor_matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update post reply count
CREATE OR REPLACE FUNCTION update_post_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE community_posts 
  SET reply_count = (
    SELECT COUNT(*) FROM community_comments WHERE post_id = NEW.post_id
  )
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_reply_count_on_comment 
AFTER INSERT OR DELETE ON community_comments 
FOR EACH ROW EXECUTE FUNCTION update_post_reply_count();

-- Function to update post views
CREATE OR REPLACE FUNCTION increment_post_views()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE community_posts SET views = views + 1 WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_views_on_engagement
AFTER INSERT ON post_engagements
FOR EACH ROW WHEN (NEW.engagement_type = 'view')
EXECUTE FUNCTION increment_post_views();

-- Function to update member points (example: +10 for posting)
CREATE OR REPLACE FUNCTION award_points_for_post()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE community_members SET points = points + 10 WHERE id = NEW.author_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER award_points_on_post
AFTER INSERT ON community_posts
FOR EACH ROW
EXECUTE FUNCTION award_points_for_post();

-- Function to update member last_active_at
CREATE OR REPLACE FUNCTION update_member_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE community_members SET last_active_at = now() WHERE id = NEW.author_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_activity_on_post
AFTER INSERT ON community_posts
FOR EACH ROW
EXECUTE FUNCTION update_member_activity();

CREATE TRIGGER update_activity_on_comment
AFTER INSERT ON community_comments
FOR EACH ROW
EXECUTE FUNCTION update_member_activity();

-- ============================================
-- INITIAL DATA: Default Badges
-- ============================================
INSERT INTO community_badges (badge_key, badge_name, badge_description, category, points_required) VALUES
('first-post', 'First Post', 'Welcome to the community! You made your first post.', 'milestone', 10),
('helpful-mentor', 'Helpful Mentor', 'You provided valuable guidance to fellow solopreneurs.', 'achievement', 100),
('course-graduate', 'Course Graduate', 'You completed the Launchpad course!', 'achievement', 50),
('community-champion', 'Community Champion', 'Top contributor this month.', 'special', 500),
('early-adopter', 'Early Adopter', 'You joined the community during its early days.', 'special', 0),
('engaged-member', 'Engaged Member', 'Active participant with consistent engagement.', 'engagement', 200)
ON CONFLICT DO NOTHING;

-- ============================================
-- INITIAL DATA: Default Course
-- ============================================
INSERT INTO community_courses (course_name, course_description, external_url, is_active) VALUES
('Launchpad', 'Start Solo Business Starter Course', '/course', true)
ON CONFLICT DO NOTHING;

-- ============================================
-- ROW LEVEL SECURITY (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_vetting ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_engagements ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_engagements ENABLE ROW LEVEL SECURITY;

-- Community Members Policies
CREATE POLICY "Members can view vetted profiles" ON community_members
  FOR SELECT
  USING (
    vetting_status = 'vetted' OR 
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM community_members WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can create their own profile" ON community_members
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON community_members
  FOR UPDATE
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM community_members WHERE user_id = auth.uid() AND role = 'admin'));

-- Posts Policies
CREATE POLICY "Vetted members can view published posts" ON community_posts
  FOR SELECT
  USING (
    status = 'published' AND
    EXISTS (SELECT 1 FROM community_members WHERE id = author_id AND vetting_status = 'vetted') OR
    EXISTS (SELECT 1 FROM community_members WHERE user_id = auth.uid() AND vetting_status = 'vetted') OR
    EXISTS (SELECT 1 FROM community_members WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Vetted members can create posts" ON community_posts
  FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM community_members WHERE user_id = auth.uid() AND vetting_status = 'vetted')
  );

CREATE POLICY "Authors and admins can update posts" ON community_posts
  FOR UPDATE
  USING (
    author_id IN (SELECT id FROM community_members WHERE user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM community_members WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Comments Policies
CREATE POLICY "Vetted members can view comments on visible posts" ON community_comments
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM community_posts WHERE id = post_id AND status = 'published') AND
    (EXISTS (SELECT 1 FROM community_members WHERE id = author_id AND vetting_status = 'vetted') OR
     EXISTS (SELECT 1 FROM community_members WHERE user_id = auth.uid() AND vetting_status = 'vetted') OR
     EXISTS (SELECT 1 FROM community_members WHERE user_id = auth.uid() AND role = 'admin'))
  );

CREATE POLICY "Vetted members can create comments" ON community_comments
  FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM community_members WHERE user_id = auth.uid() AND vetting_status = 'vetted')
  );

CREATE POLICY "Authors and admins can update comments" ON community_comments
  FOR UPDATE
  USING (
    author_id IN (SELECT id FROM community_members WHERE user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM community_members WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Events Policies
CREATE POLICY "Vetted members can view upcoming events" ON community_events
  FOR SELECT
  USING (
    status IN ('upcoming', 'live') OR
    EXISTS (SELECT 1 FROM community_members WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins and organizers can create events" ON community_events
  FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM community_members WHERE user_id = auth.uid() AND role IN ('admin', 'mentor'))
  );

-- Event Registrations Policies
CREATE POLICY "Members can view their own registrations" ON event_registrations
  FOR SELECT
  USING (
    member_id IN (SELECT id FROM community_members WHERE user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM community_members WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Vetted members can register for events" ON event_registrations
  FOR INSERT
  WITH CHECK (
    member_id IN (SELECT id FROM community_members WHERE user_id = auth.uid() AND vetting_status = 'vetted')
  );

-- Course Progress Policies
CREATE POLICY "Members can view their own progress" ON course_progress
  FOR SELECT
  USING (
    member_id IN (SELECT id FROM community_members WHERE user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM community_members WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Members can update their own progress" ON course_progress
  FOR ALL
  USING (
    member_id IN (SELECT id FROM community_members WHERE user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM community_members WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Mentor Matches Policies
CREATE POLICY "Members can view their own matches" ON mentor_matches
  FOR SELECT
  USING (
    mentor_id IN (SELECT id FROM community_members WHERE user_id = auth.uid()) OR
    mentee_id IN (SELECT id FROM community_members WHERE user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM community_members WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Members can create match requests" ON mentor_matches
  FOR INSERT
  WITH CHECK (
    requested_by IN (SELECT id FROM community_members WHERE user_id = auth.uid() AND vetting_status = 'vetted')
  );

-- Admin Vetting Policies (Admins only)
CREATE POLICY "Admins can view all vetting applications" ON admin_vetting
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM community_members WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Anyone can submit vetting application" ON admin_vetting
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update vetting status" ON admin_vetting
  FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM community_members WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Badges Policies (Public read, admin write)
CREATE POLICY "Everyone can view badges" ON community_badges
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Members can view member badges" ON member_badges
  FOR SELECT
  USING (true);

-- Engagement Policies
CREATE POLICY "Vetted members can engage with posts" ON post_engagements
  FOR ALL
  USING (
    member_id IN (SELECT id FROM community_members WHERE user_id = auth.uid() AND vetting_status = 'vetted')
  );

CREATE POLICY "Vetted members can engage with comments" ON comment_engagements
  FOR ALL
  USING (
    member_id IN (SELECT id FROM community_members WHERE user_id = auth.uid() AND vetting_status = 'vetted')
  );

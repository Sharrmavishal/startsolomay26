-- ============================================
-- Course Structure (Modules, Lessons, Progress, Certificates)
-- ============================================
-- Adds detailed course structure for multimedia courses with certificates

-- ============================================
-- 1. Course Modules
-- ============================================
CREATE TABLE IF NOT EXISTS course_modules (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id uuid NOT NULL REFERENCES mentor_courses(id) ON DELETE CASCADE,
  
  -- Module details
  title text NOT NULL,
  description text,
  order_index integer NOT NULL DEFAULT 0,
  
  -- Completion requirements
  is_required boolean DEFAULT true,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(course_id, order_index)
);

-- ============================================
-- 2. Course Lessons
-- ============================================
CREATE TABLE IF NOT EXISTS course_lessons (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id uuid NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES mentor_courses(id) ON DELETE CASCADE, -- Denormalized for easier queries
  
  -- Lesson details
  title text NOT NULL,
  description text,
  content_type text NOT NULL DEFAULT 'video' CHECK (content_type IN ('video', 'pdf', 'text', 'audio', 'link', 'quiz')),
  content_url text, -- YouTube/Vimeo embed URL, PDF link, or text content
  content_text text, -- Rich text content for text-type lessons
  duration_minutes integer DEFAULT 0,
  
  -- Resources
  resources jsonb DEFAULT '[]'::jsonb, -- Array of {type, url, title} for downloads
  
  -- Ordering
  order_index integer NOT NULL DEFAULT 0,
  
  -- Completion requirements
  is_required boolean DEFAULT true,
  must_complete_to_proceed boolean DEFAULT false,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(module_id, order_index)
);

-- ============================================
-- 3. Lesson Progress
-- ============================================
CREATE TABLE IF NOT EXISTS lesson_progress (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id uuid NOT NULL REFERENCES course_enrollments(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  
  -- Progress tracking
  is_completed boolean DEFAULT false,
  completed_at timestamptz,
  time_spent_minutes integer DEFAULT 0,
  last_accessed_at timestamptz DEFAULT now(),
  
  -- Notes
  student_notes text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(enrollment_id, lesson_id)
);

-- ============================================
-- 4. Course Certificates
-- ============================================
CREATE TABLE IF NOT EXISTS course_certificates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id uuid NOT NULL REFERENCES mentor_courses(id) ON DELETE CASCADE,
  enrollment_id uuid NOT NULL REFERENCES course_enrollments(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  
  -- Certificate details
  certificate_number text UNIQUE NOT NULL, -- Unique certificate ID
  certificate_url text, -- URL to generated PDF certificate
  issued_at timestamptz DEFAULT now(),
  
  -- Certificate template (stored from mentor customization)
  template_data jsonb DEFAULT '{}'::jsonb, -- Logo, colors, text, signature
  
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- 5. Certificate Templates (Mentor Customization)
-- ============================================
CREATE TABLE IF NOT EXISTS certificate_templates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id uuid NOT NULL REFERENCES mentor_courses(id) ON DELETE CASCADE UNIQUE,
  mentor_id uuid NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  
  -- Template customization
  template_name text DEFAULT 'Certificate of Completion',
  logo_url text,
  background_color text DEFAULT '#FFFFFF',
  text_color text DEFAULT '#000000',
  border_color text DEFAULT '#1D3A6B',
  
  -- Certificate text
  header_text text DEFAULT 'Certificate of Completion',
  body_text text DEFAULT 'This is to certify that {{student_name}} has successfully completed the course {{course_name}}.',
  footer_text text DEFAULT 'Issued on {{issue_date}}',
  
  -- Signature
  signature_url text,
  signature_name text,
  signature_title text,
  
  -- Requirements
  completion_percentage integer DEFAULT 100 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  require_all_modules boolean DEFAULT true,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_course_modules_course ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_course_modules_order ON course_modules(course_id, order_index);

CREATE INDEX IF NOT EXISTS idx_course_lessons_module ON course_lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_course ON course_lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_order ON course_lessons(module_id, order_index);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_enrollment ON lesson_progress(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson ON lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_student ON lesson_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_completed ON lesson_progress(is_completed) WHERE is_completed = true;

CREATE INDEX IF NOT EXISTS idx_course_certificates_course ON course_certificates(course_id);
CREATE INDEX IF NOT EXISTS idx_course_certificates_enrollment ON course_certificates(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_course_certificates_student ON course_certificates(student_id);
CREATE INDEX IF NOT EXISTS idx_course_certificates_number ON course_certificates(certificate_number);

CREATE INDEX IF NOT EXISTS idx_certificate_templates_course ON certificate_templates(course_id);
CREATE INDEX IF NOT EXISTS idx_certificate_templates_mentor ON certificate_templates(mentor_id);

-- ============================================
-- Triggers
-- ============================================
DROP TRIGGER IF EXISTS update_course_modules_updated_at ON course_modules;
CREATE TRIGGER update_course_modules_updated_at BEFORE UPDATE ON course_modules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_course_lessons_updated_at ON course_lessons;
CREATE TRIGGER update_course_lessons_updated_at BEFORE UPDATE ON course_lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_lesson_progress_updated_at ON lesson_progress;
CREATE TRIGGER update_lesson_progress_updated_at BEFORE UPDATE ON lesson_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_certificate_templates_updated_at ON certificate_templates;
CREATE TRIGGER update_certificate_templates_updated_at BEFORE UPDATE ON certificate_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-update course progress percentage
CREATE OR REPLACE FUNCTION update_course_progress()
RETURNS TRIGGER AS $$
DECLARE
  total_lessons integer;
  completed_lessons integer;
  progress_pct integer;
BEGIN
  -- Get total lessons for the course
  SELECT COUNT(*) INTO total_lessons
  FROM course_lessons
  WHERE course_id = (
    SELECT course_id FROM course_enrollments WHERE id = NEW.enrollment_id
  );
  
  -- Get completed lessons
  SELECT COUNT(*) INTO completed_lessons
  FROM lesson_progress
  WHERE enrollment_id = NEW.enrollment_id AND is_completed = true;
  
  -- Calculate percentage
  IF total_lessons > 0 THEN
    progress_pct := (completed_lessons * 100) / total_lessons;
  ELSE
    progress_pct := 0;
  END IF;
  
  -- Update enrollment progress
  UPDATE course_enrollments
  SET progress_percentage = progress_pct,
      updated_at = now()
  WHERE id = NEW.enrollment_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_course_progress ON lesson_progress;
CREATE TRIGGER trigger_update_course_progress
AFTER INSERT OR UPDATE ON lesson_progress
FOR EACH ROW EXECUTE FUNCTION update_course_progress();

-- Auto-generate certificate number
CREATE OR REPLACE FUNCTION generate_certificate_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.certificate_number IS NULL OR NEW.certificate_number = '' THEN
    NEW.certificate_number := 'CERT-' || UPPER(SUBSTRING(MD5(RANDOM()::text || NEW.id::text) FROM 1 FOR 8)) || '-' || TO_CHAR(NOW(), 'YYYYMMDD');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_generate_certificate_number ON course_certificates;
CREATE TRIGGER trigger_generate_certificate_number
BEFORE INSERT ON course_certificates
FOR EACH ROW EXECUTE FUNCTION generate_certificate_number();

-- ============================================
-- Row Level Security Policies
-- ============================================

-- Course Modules
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published course modules" ON course_modules;
CREATE POLICY "Anyone can view published course modules" ON course_modules
  FOR SELECT
  USING (
    course_id IN (
      SELECT id FROM mentor_courses 
      WHERE status = 'published' OR 
      mentor_id IN (SELECT id FROM community_members WHERE user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Mentors can manage their course modules" ON course_modules;
CREATE POLICY "Mentors can manage their course modules" ON course_modules
  FOR ALL
  USING (
    course_id IN (
      SELECT id FROM mentor_courses 
      WHERE mentor_id IN (SELECT id FROM community_members WHERE user_id = auth.uid())
    )
  );

-- Course Lessons
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published course lessons" ON course_lessons;
CREATE POLICY "Anyone can view published course lessons" ON course_lessons
  FOR SELECT
  USING (
    course_id IN (
      SELECT id FROM mentor_courses 
      WHERE status = 'published' OR 
      mentor_id IN (SELECT id FROM community_members WHERE user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Mentors can manage their course lessons" ON course_lessons;
CREATE POLICY "Mentors can manage their course lessons" ON course_lessons
  FOR ALL
  USING (
    course_id IN (
      SELECT id FROM mentor_courses 
      WHERE mentor_id IN (SELECT id FROM community_members WHERE user_id = auth.uid())
    )
  );

-- Lesson Progress
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can view their own progress" ON lesson_progress;
CREATE POLICY "Students can view their own progress" ON lesson_progress
  FOR SELECT
  USING (
    student_id IN (SELECT id FROM community_members WHERE user_id = auth.uid()) OR
    enrollment_id IN (
      SELECT id FROM course_enrollments 
      WHERE course_id IN (
        SELECT id FROM mentor_courses 
        WHERE mentor_id IN (SELECT id FROM community_members WHERE user_id = auth.uid())
      )
    )
  );

DROP POLICY IF EXISTS "Students can update their own progress" ON lesson_progress;
CREATE POLICY "Students can update their own progress" ON lesson_progress
  FOR ALL
  USING (
    student_id IN (SELECT id FROM community_members WHERE user_id = auth.uid())
  );

-- Course Certificates
ALTER TABLE course_certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can view their own certificates" ON course_certificates;
CREATE POLICY "Students can view their own certificates" ON course_certificates
  FOR SELECT
  USING (
    student_id IN (SELECT id FROM community_members WHERE user_id = auth.uid()) OR
    course_id IN (
      SELECT id FROM mentor_courses 
      WHERE mentor_id IN (SELECT id FROM community_members WHERE user_id = auth.uid())
    )
  );

-- Certificate Templates
ALTER TABLE certificate_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Mentors can manage their certificate templates" ON certificate_templates;
CREATE POLICY "Mentors can manage their certificate templates" ON certificate_templates
  FOR ALL
  USING (
    mentor_id IN (SELECT id FROM community_members WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Anyone can view published course certificate templates" ON certificate_templates;
CREATE POLICY "Anyone can view published course certificate templates" ON certificate_templates
  FOR SELECT
  USING (
    course_id IN (
      SELECT id FROM mentor_courses WHERE status = 'published'
    )
  );


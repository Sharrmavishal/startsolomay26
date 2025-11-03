-- ============================================
-- Course Quizzes
-- ============================================
-- Adds quiz functionality to course lessons

-- ============================================
-- 1. Quiz Questions
-- ============================================
CREATE TABLE IF NOT EXISTS course_quiz_questions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id uuid NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES mentor_courses(id) ON DELETE CASCADE,
  
  -- Question details
  question_text text NOT NULL,
  question_type text NOT NULL DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer')),
  order_index integer NOT NULL DEFAULT 0,
  
  -- Options (for multiple choice/true-false)
  options jsonb DEFAULT '[]'::jsonb, -- Array of {id, text, is_correct}
  
  -- Answer (for short answer questions)
  correct_answer text, -- Exact match or keywords for short answer
  
  -- Scoring
  points integer DEFAULT 1,
  
  -- Requirements
  is_required boolean DEFAULT true,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(lesson_id, order_index)
);

-- ============================================
-- 2. Quiz Submissions
-- ============================================
CREATE TABLE IF NOT EXISTS course_quiz_submissions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id uuid NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
  enrollment_id uuid NOT NULL REFERENCES course_enrollments(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  
  -- Submission details
  answers jsonb NOT NULL DEFAULT '{}'::jsonb, -- {question_id: answer/option_id}
  total_questions integer NOT NULL,
  correct_answers integer NOT NULL DEFAULT 0,
  total_points integer NOT NULL DEFAULT 0,
  score_percentage decimal(5, 2) NOT NULL DEFAULT 0,
  
  -- Passing criteria
  passing_score_percentage decimal(5, 2) DEFAULT 70.00,
  is_passed boolean DEFAULT false,
  
  -- Timestamps
  submitted_at timestamptz DEFAULT now(),
  time_taken_seconds integer DEFAULT 0,
  
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(enrollment_id, lesson_id)
);

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_quiz_questions_lesson ON course_quiz_questions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_course ON course_quiz_questions(course_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_order ON course_quiz_questions(lesson_id, order_index);

CREATE INDEX IF NOT EXISTS idx_quiz_submissions_lesson ON course_quiz_submissions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_quiz_submissions_enrollment ON course_quiz_submissions(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_quiz_submissions_student ON course_quiz_submissions(student_id);

-- ============================================
-- Triggers
-- ============================================
DROP TRIGGER IF EXISTS update_quiz_questions_updated_at ON course_quiz_questions;
CREATE TRIGGER update_quiz_questions_updated_at 
BEFORE UPDATE ON course_quiz_questions 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-update quiz submission score
CREATE OR REPLACE FUNCTION calculate_quiz_score()
RETURNS TRIGGER AS $$
DECLARE
  question_record RECORD;
  question_count integer;
  correct_count integer;
  total_points integer;
  score_pct decimal;
  selected_answer text;
  option_record RECORD;
  is_correct boolean;
BEGIN
  -- Get total questions for this quiz
  SELECT COUNT(*) INTO question_count
  FROM course_quiz_questions
  WHERE lesson_id = NEW.lesson_id;
  
  correct_count := 0;
  total_points := 0;
  
  -- Loop through each question and check answer
  FOR question_record IN 
    SELECT * FROM course_quiz_questions 
    WHERE lesson_id = NEW.lesson_id 
    ORDER BY order_index
  LOOP
    selected_answer := NEW.answers->>question_record.id::text;
    is_correct := false;
    
    IF question_record.question_type IN ('multiple_choice', 'true_false') THEN
      -- Check if selected option is marked as correct
      FOR option_record IN 
        SELECT * FROM jsonb_array_elements(question_record.options) AS opt
      LOOP
        IF (option_record.opt->>'id')::text = selected_answer 
           AND (option_record.opt->>'is_correct')::boolean = true THEN
          is_correct := true;
          EXIT;
        END IF;
      END LOOP;
    ELSIF question_record.question_type = 'short_answer' THEN
      -- Case-insensitive match for short answer
      IF question_record.correct_answer IS NOT NULL THEN
        is_correct := LOWER(TRIM(selected_answer)) = LOWER(TRIM(question_record.correct_answer));
      END IF;
    END IF;
    
    IF is_correct THEN
      correct_count := correct_count + 1;
      total_points := total_points + COALESCE(question_record.points, 1);
    END IF;
  END LOOP;
  
  -- Calculate percentage
  IF question_count > 0 THEN
    score_pct := (correct_count::decimal / question_count::decimal) * 100;
  ELSE
    score_pct := 0;
  END IF;
  
  -- Update submission
  NEW.total_questions := question_count;
  NEW.correct_answers := correct_count;
  NEW.total_points := total_points;
  NEW.score_percentage := score_pct;
  NEW.is_passed := score_pct >= NEW.passing_score_percentage;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_calculate_quiz_score ON course_quiz_submissions;
CREATE TRIGGER trigger_calculate_quiz_score
BEFORE INSERT OR UPDATE ON course_quiz_submissions
FOR EACH ROW EXECUTE FUNCTION calculate_quiz_score();

-- Auto-mark lesson as complete when quiz is passed
CREATE OR REPLACE FUNCTION auto_complete_lesson_on_quiz_pass()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_passed = true THEN
    -- Update lesson progress
    INSERT INTO lesson_progress (enrollment_id, lesson_id, student_id, is_completed, completed_at)
    VALUES (NEW.enrollment_id, NEW.lesson_id, NEW.student_id, true, NOW())
    ON CONFLICT (enrollment_id, lesson_id) 
    DO UPDATE SET 
      is_completed = true,
      completed_at = COALESCE(lesson_progress.completed_at, NOW());
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auto_complete_lesson_on_quiz_pass ON course_quiz_submissions;
CREATE TRIGGER trigger_auto_complete_lesson_on_quiz_pass
AFTER INSERT OR UPDATE ON course_quiz_submissions
FOR EACH ROW 
WHEN (NEW.is_passed = true)
EXECUTE FUNCTION auto_complete_lesson_on_quiz_pass();

-- ============================================
-- Row Level Security Policies
-- ============================================

-- Quiz Questions
ALTER TABLE course_quiz_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can view quiz questions for enrolled courses" ON course_quiz_questions;
CREATE POLICY "Students can view quiz questions for enrolled courses" ON course_quiz_questions
  FOR SELECT
  USING (
    course_id IN (
      SELECT course_id FROM course_enrollments 
      WHERE student_id IN (SELECT id FROM community_members WHERE user_id = auth.uid())
      AND enrollment_status = 'active'
    )
    OR
    course_id IN (
      SELECT id FROM mentor_courses 
      WHERE mentor_id IN (SELECT id FROM community_members WHERE user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Mentors can manage quiz questions" ON course_quiz_questions;
CREATE POLICY "Mentors can manage quiz questions" ON course_quiz_questions
  FOR ALL
  USING (
    course_id IN (
      SELECT id FROM mentor_courses 
      WHERE mentor_id IN (SELECT id FROM community_members WHERE user_id = auth.uid())
    )
  );

-- Quiz Submissions
ALTER TABLE course_quiz_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can view their own quiz submissions" ON course_quiz_submissions;
CREATE POLICY "Students can view their own quiz submissions" ON course_quiz_submissions
  FOR SELECT
  USING (
    student_id IN (SELECT id FROM community_members WHERE user_id = auth.uid())
    OR
    enrollment_id IN (
      SELECT id FROM course_enrollments 
      WHERE course_id IN (
        SELECT id FROM mentor_courses 
        WHERE mentor_id IN (SELECT id FROM community_members WHERE user_id = auth.uid())
      )
    )
  );

DROP POLICY IF EXISTS "Students can submit quizzes" ON course_quiz_submissions;
CREATE POLICY "Students can submit quizzes" ON course_quiz_submissions
  FOR INSERT
  WITH CHECK (
    student_id IN (SELECT id FROM community_members WHERE user_id = auth.uid())
    AND enrollment_id IN (
      SELECT id FROM course_enrollments 
      WHERE student_id IN (SELECT id FROM community_members WHERE user_id = auth.uid())
      AND enrollment_status = 'active'
    )
  );

DROP POLICY IF EXISTS "Students can update their own quiz submissions" ON course_quiz_submissions;
CREATE POLICY "Students can update their own quiz submissions" ON course_quiz_submissions
  FOR UPDATE
  USING (
    student_id IN (SELECT id FROM community_members WHERE user_id = auth.uid())
  );


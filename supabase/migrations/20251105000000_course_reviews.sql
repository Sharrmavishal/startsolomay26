-- ============================================
-- Course Reviews & Ratings
-- ============================================
-- Adds star-based rating system for completed students

-- ============================================
-- 1. Create course_reviews table
-- ============================================
CREATE TABLE IF NOT EXISTS course_reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id uuid NOT NULL REFERENCES mentor_courses(id) ON DELETE CASCADE,
  enrollment_id uuid NOT NULL REFERENCES course_enrollments(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  
  -- Rating (1-5 stars only, no text review)
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- One review per student per course
  UNIQUE(course_id, student_id)
);

-- ============================================
-- 2. Add rating fields to mentor_courses
-- ============================================
ALTER TABLE mentor_courses
ADD COLUMN IF NOT EXISTS average_rating decimal(3, 2) DEFAULT 0.00 CHECK (average_rating >= 0 AND average_rating <= 5),
ADD COLUMN IF NOT EXISTS review_count integer DEFAULT 0 CHECK (review_count >= 0);

-- ============================================
-- 3. Function: Update course rating averages
-- ============================================
CREATE OR REPLACE FUNCTION update_course_rating()
RETURNS TRIGGER AS $$
DECLARE
  avg_rating decimal(3, 2);
  total_reviews integer;
BEGIN
  -- Calculate average rating and count for the course
  SELECT 
    COALESCE(ROUND(AVG(rating)::numeric, 2), 0.00),
    COUNT(*)::integer
  INTO avg_rating, total_reviews
  FROM course_reviews
  WHERE course_id = COALESCE(NEW.course_id, OLD.course_id);
  
  -- Update course with new averages
  UPDATE mentor_courses
  SET 
    average_rating = avg_rating,
    review_count = total_reviews,
    updated_at = NOW()
  WHERE id = COALESCE(NEW.course_id, OLD.course_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update ratings when reviews are added/updated/deleted
DROP TRIGGER IF EXISTS trigger_update_course_rating ON course_reviews;
CREATE TRIGGER trigger_update_course_rating
AFTER INSERT OR UPDATE OR DELETE ON course_reviews
FOR EACH ROW EXECUTE FUNCTION update_course_rating();

-- ============================================
-- 4. Function: Check if student can review
-- ============================================
CREATE OR REPLACE FUNCTION can_review_course(p_course_id uuid, p_student_id uuid)
RETURNS boolean AS $$
DECLARE
  enrollment_record RECORD;
BEGIN
  -- Check if student is enrolled and completed
  SELECT enrollment_status, progress_percentage, completed_at
  INTO enrollment_record
  FROM course_enrollments
  WHERE course_id = p_course_id
    AND student_id = p_student_id
  LIMIT 1;
  
  -- Must be enrolled, completed (100% progress), and have completed_at timestamp
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  IF enrollment_record.enrollment_status != 'completed' OR 
     enrollment_record.progress_percentage != 100 OR
     enrollment_record.completed_at IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if already reviewed
  IF EXISTS (
    SELECT 1 FROM course_reviews
    WHERE course_id = p_course_id AND student_id = p_student_id
  ) THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION can_review_course(uuid, uuid) TO authenticated;

-- ============================================
-- 5. Indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_course_reviews_course ON course_reviews(course_id);
CREATE INDEX IF NOT EXISTS idx_course_reviews_student ON course_reviews(student_id);
CREATE INDEX IF NOT EXISTS idx_course_reviews_enrollment ON course_reviews(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_mentor_courses_rating ON mentor_courses(average_rating DESC, review_count DESC);

-- ============================================
-- 6. RLS Policies
-- ============================================
ALTER TABLE course_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can view reviews
CREATE POLICY "Anyone can view course reviews" ON course_reviews
  FOR SELECT
  USING (true);

-- Students can create reviews (enforced by trigger/function)
CREATE POLICY "Students can create reviews" ON course_reviews
  FOR INSERT
  WITH CHECK (
    student_id IN (
      SELECT id FROM community_members WHERE user_id = auth.uid()
    )
    AND can_review_course(course_id, student_id)
  );

-- Students can update their own reviews
CREATE POLICY "Students can update their own reviews" ON course_reviews
  FOR UPDATE
  USING (
    student_id IN (
      SELECT id FROM community_members WHERE user_id = auth.uid()
    )
  );

-- Students can delete their own reviews
CREATE POLICY "Students can delete their own reviews" ON course_reviews
  FOR DELETE
  USING (
    student_id IN (
      SELECT id FROM community_members WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- 7. Update trigger for updated_at
-- ============================================
DROP TRIGGER IF EXISTS update_course_reviews_updated_at ON course_reviews;
CREATE TRIGGER update_course_reviews_updated_at
BEFORE UPDATE ON course_reviews
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- Add feedback fields to mentor_sessions table
ALTER TABLE mentor_sessions
ADD COLUMN IF NOT EXISTS mentee_feedback_rating integer CHECK (mentee_feedback_rating >= 1 AND mentee_feedback_rating <= 5),
ADD COLUMN IF NOT EXISTS mentee_feedback_text text,
ADD COLUMN IF NOT EXISTS mentee_feedback_submitted_at timestamptz,
ADD COLUMN IF NOT EXISTS mentor_feedback_rating integer CHECK (mentor_feedback_rating >= 1 AND mentor_feedback_rating <= 5),
ADD COLUMN IF NOT EXISTS mentor_feedback_text text,
ADD COLUMN IF NOT EXISTS mentor_feedback_submitted_at timestamptz;

-- Add index for completed sessions without feedback
CREATE INDEX IF NOT EXISTS idx_sessions_completed_no_feedback 
ON mentor_sessions(status, mentee_feedback_submitted_at) 
WHERE status = 'completed' AND mentee_feedback_submitted_at IS NULL;

COMMENT ON COLUMN mentor_sessions.mentee_feedback_rating IS 'Mentee rating (1-5 stars)';
COMMENT ON COLUMN mentor_sessions.mentee_feedback_text IS 'Mentee feedback text';
COMMENT ON COLUMN mentor_sessions.mentor_feedback_rating IS 'Mentor rating (1-5 stars)';
COMMENT ON COLUMN mentor_sessions.mentor_feedback_text IS 'Mentor feedback text';


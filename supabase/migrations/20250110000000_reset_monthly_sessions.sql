-- ============================================
-- Auto-reset Monthly Free Sessions
-- ============================================
-- Trigger to automatically reset free_sessions_used_this_month on the 1st of each month

CREATE OR REPLACE FUNCTION reset_monthly_free_sessions()
RETURNS void AS $$
DECLARE
  mentor_record RECORD;
  first_of_month date;
BEGIN
  first_of_month := DATE_TRUNC('month', CURRENT_DATE)::date;
  
  -- Reset sessions for all mentors whose reset_date has passed
  FOR mentor_record IN 
    SELECT id, free_sessions_reset_date
    FROM community_members
    WHERE role = 'mentor' 
    AND (free_sessions_reset_date IS NULL OR free_sessions_reset_date < first_of_month)
  LOOP
    UPDATE community_members
    SET 
      free_sessions_used_this_month = 0,
      free_sessions_reset_date = first_of_month
    WHERE id = mentor_record.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Call this function manually or via cron job on the 1st of each month
-- For now, we'll call it whenever a mentor's sessions are checked (in the application)


-- Function to process scheduled notifications (called by cron/Edge Function)
-- This finds notifications that are due and need to be sent

CREATE OR REPLACE FUNCTION process_scheduled_notifications()
RETURNS TABLE (
  notification_id uuid,
  user_id uuid,
  notification_type text,
  title text,
  message text,
  channel text,
  metadata jsonb
) AS $$
BEGIN
  -- Return notifications that are scheduled for now or in the past
  -- Status will be updated to 'processing' to prevent double-processing
  RETURN QUERY
  UPDATE notifications
  SET status = 'processing'
  WHERE id IN (
    SELECT id
    FROM notifications
    WHERE status = 'pending'
    AND scheduled_for <= NOW()
    ORDER BY scheduled_for ASC
    LIMIT 100
  )
  RETURNING 
    id,
    notifications.user_id,
    notifications.type,
    notifications.title,
    notifications.message,
    notifications.channel,
    notifications.metadata;
END;
$$ LANGUAGE plpgsql;

-- Function to check and process scheduled notifications
-- This can be called periodically (every 5-15 minutes) to process reminders
CREATE OR REPLACE FUNCTION check_and_send_scheduled_notifications()
RETURNS integer AS $$
DECLARE
  processed_count integer := 0;
  notification_record RECORD;
BEGIN
  -- Process notifications scheduled for now or in the past
  FOR notification_record IN
    SELECT id, user_id, type, title, message, channel, metadata
    FROM notifications
    WHERE status = 'pending'
    AND scheduled_for <= NOW()
    ORDER BY scheduled_for ASC
    LIMIT 100
  LOOP
    -- Mark as processing (actual sending happens in application/Edge Function)
    UPDATE notifications
    SET status = 'processing'
    WHERE id = notification_record.id;
    
    processed_count := processed_count + 1;
  END LOOP;
  
  RETURN processed_count;
END;
$$ LANGUAGE plpgsql;

-- Add index for faster scheduled notification queries
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled_pending 
ON notifications(scheduled_for, status) 
WHERE status = 'pending';

COMMENT ON FUNCTION process_scheduled_notifications() IS 'Returns notifications ready to be sent. Should be called by cron job or Edge Function every 5-15 minutes.';
COMMENT ON FUNCTION check_and_send_scheduled_notifications() IS 'Checks and marks scheduled notifications as ready for processing. Returns count of notifications processed.';


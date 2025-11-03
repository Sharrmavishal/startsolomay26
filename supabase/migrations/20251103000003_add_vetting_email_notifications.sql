-- Auto-notify users when vetting status changes
-- Uses Mailgun (via process-notifications Edge Function)

-- Function to queue vetting status notification
CREATE OR REPLACE FUNCTION notify_vetting_status_change()
RETURNS TRIGGER AS $$
DECLARE
  member_email text;
  member_name text;
  member_user_id uuid;
  notification_type text;
  notification_title text;
  notification_message text;
BEGIN
  -- Only trigger if vetting_status actually changed
  IF OLD.vetting_status = NEW.vetting_status THEN
    RETURN NEW;
  END IF;

  -- Get member details
  member_email := NEW.email;
  member_name := COALESCE(NEW.display_name, NEW.full_name, 'Member');
  member_user_id := NEW.user_id;

  -- Skip if no user_id (shouldn't happen, but safety check)
  IF member_user_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Determine notification type and content based on new status
  CASE NEW.vetting_status
    WHEN 'approved' THEN
      notification_type := 'vetting_approved';
      notification_title := 'Welcome to Start Solo Community! 🎉';
      notification_message := format(
        'Hi %s,<br><br>Great news! Your application has been approved. You now have view-only access to the Start Solo community.<br><br>Explore courses, connect with mentors, and engage with fellow solopreneurs.<br><br><a href="%s/community">Visit Community</a><br><br>Welcome aboard!',
        member_name,
        COALESCE(current_setting('app.settings.app_url', true), 'https://startsolo.in')
      );
    
    WHEN 'vetted' THEN
      notification_type := 'vetting_complete';
      notification_title := 'Full Access Granted! 🚀';
      notification_message := format(
        'Hi %s,<br><br>Congratulations! Your vetting is complete and you now have full access to the Start Solo community.<br><br>You can now:<br>• Create posts and engage with the community<br>• Register for events<br>• Book mentor sessions<br>• Enroll in courses<br><br><a href="%s/community">Get Started</a><br><br>Welcome to the community!',
        member_name,
        COALESCE(current_setting('app.settings.app_url', true), 'https://startsolo.in')
      );
    
    WHEN 'rejected' THEN
      notification_type := 'vetting_rejected';
      notification_title := 'Application Status Update';
      notification_message := format(
        'Hi %s,<br><br>Thank you for your interest in the Start Solo community. Unfortunately, we are unable to approve your application at this time.<br><br>If you have questions, please reach out to our support team.<br><br>We appreciate your understanding.',
        member_name
      );
    
    ELSE
      -- Unknown status, don't send notification
      RETURN NEW;
  END CASE;

  -- Queue notification in notifications table
  INSERT INTO notifications (
    user_id,
    type,
    title,
    message,
    channel,
    status,
    metadata,
    scheduled_for
  ) VALUES (
    member_user_id,
    notification_type,
    notification_title,
    notification_message,
    'email', -- Start with email only, can expand to 'both' later
    'pending',
    jsonb_build_object(
      'member_id', NEW.id,
      'vetting_status', NEW.vetting_status,
      'previous_status', OLD.vetting_status
    ),
    now() -- Send immediately
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_notify_vetting_status_change ON community_members;
CREATE TRIGGER trigger_notify_vetting_status_change
  AFTER UPDATE OF vetting_status ON community_members
  FOR EACH ROW
  WHEN (OLD.vetting_status IS DISTINCT FROM NEW.vetting_status)
  EXECUTE FUNCTION notify_vetting_status_change();

-- Also handle status changes from admin_vetting table
-- When admin approves/rejects an application, it updates community_members
-- So the trigger above will handle it automatically

-- Add comment
COMMENT ON FUNCTION notify_vetting_status_change() IS 'Automatically queues email notifications when member vetting status changes (approved/vetted/rejected). Uses Mailgun via process-notifications Edge Function.';


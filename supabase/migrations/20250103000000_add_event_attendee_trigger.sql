-- Trigger to update event attendee count automatically
CREATE OR REPLACE FUNCTION update_event_attendee_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'registered' THEN
    UPDATE community_events
    SET current_attendees = COALESCE(current_attendees, 0) + 1
    WHERE id = NEW.event_id;
  ELSIF TG_OP = 'UPDATE' THEN
    -- If status changed from registered to cancelled
    IF OLD.status = 'registered' AND NEW.status = 'cancelled' THEN
      UPDATE community_events
      SET current_attendees = GREATEST(COALESCE(current_attendees, 0) - 1, 0)
      WHERE id = NEW.event_id;
    -- If status changed from cancelled to registered
    ELSIF OLD.status = 'cancelled' AND NEW.status = 'registered' THEN
      UPDATE community_events
      SET current_attendees = COALESCE(current_attendees, 0) + 1
      WHERE id = NEW.event_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'registered' THEN
    UPDATE community_events
    SET current_attendees = GREATEST(COALESCE(current_attendees, 0) - 1, 0)
    WHERE id = OLD.event_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for event registrations
DROP TRIGGER IF EXISTS trigger_update_event_attendee_count ON event_registrations;
CREATE TRIGGER trigger_update_event_attendee_count
  AFTER INSERT OR UPDATE OR DELETE ON event_registrations
  FOR EACH ROW EXECUTE FUNCTION update_event_attendee_count();

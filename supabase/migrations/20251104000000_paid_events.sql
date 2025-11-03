-- Migration: Add Paid Events Support
-- Adds payment fields to events and event registrations

-- Add payment fields to community_events
ALTER TABLE community_events
ADD COLUMN IF NOT EXISTS ticket_price decimal(10, 2) DEFAULT 0 CHECK (ticket_price >= 0),
ADD COLUMN IF NOT EXISTS commission_rate decimal(5, 2) DEFAULT 10 CHECK (commission_rate >= 0 AND commission_rate <= 100);

-- Add payment fields to event_registrations
ALTER TABLE event_registrations
ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
ADD COLUMN IF NOT EXISTS payment_amount decimal(10, 2),
ADD COLUMN IF NOT EXISTS commission_amount decimal(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS organizer_payout decimal(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS razorpay_order_id text,
ADD COLUMN IF NOT EXISTS razorpay_payment_id text,
ADD COLUMN IF NOT EXISTS razorpay_signature text;

-- Set default payment_status based on ticket_price
UPDATE event_registrations
SET payment_status = CASE 
  WHEN EXISTS (
    SELECT 1 FROM community_events 
    WHERE community_events.id = event_registrations.event_id 
    AND community_events.ticket_price > 0
  ) THEN 'pending'
  ELSE 'paid'  -- Free events are automatically paid
END
WHERE payment_status IS NULL;

-- Update existing free events to have payment_status = 'paid'
UPDATE event_registrations
SET payment_status = 'paid'
WHERE payment_status = 'pending'
AND EXISTS (
  SELECT 1 FROM community_events 
  WHERE community_events.id = event_registrations.event_id 
  AND (community_events.ticket_price IS NULL OR community_events.ticket_price = 0)
);

-- Create index for payment queries
CREATE INDEX IF NOT EXISTS idx_event_reg_payment_status ON event_registrations(payment_status);
CREATE INDEX IF NOT EXISTS idx_event_reg_razorpay_payment_id ON event_registrations(razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_event_reg_razorpay_order_id ON event_registrations(razorpay_order_id);

-- Add RLS policy for event registrations payment fields
-- (Existing policies should cover this, but ensuring access)
COMMENT ON COLUMN community_events.ticket_price IS 'Ticket price in INR. 0 = free event';
COMMENT ON COLUMN community_events.commission_rate IS 'Platform commission rate as percentage (0-100)';
COMMENT ON COLUMN event_registrations.payment_status IS 'Payment status: pending, paid, failed, refunded';
COMMENT ON COLUMN event_registrations.payment_amount IS 'Amount paid for event ticket';
COMMENT ON COLUMN event_registrations.commission_amount IS 'Platform commission amount';
COMMENT ON COLUMN event_registrations.organizer_payout IS 'Amount organizer receives after commission';


-- Add phone number field to community_members for WhatsApp notifications
ALTER TABLE community_members
ADD COLUMN IF NOT EXISTS phone text;

-- Add index for phone lookups
CREATE INDEX IF NOT EXISTS idx_members_phone ON community_members(phone) WHERE phone IS NOT NULL;

-- Add comment
COMMENT ON COLUMN community_members.phone IS 'Phone number for WhatsApp notifications (format: +91XXXXXXXXXX)';


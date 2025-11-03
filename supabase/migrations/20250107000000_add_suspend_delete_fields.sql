-- Add suspend and delete functionality for member management
-- Add suspended status to vetting_status enum
-- Add deleted_at timestamp for soft deletes
-- Add is_suspended boolean for temporary suspensions

-- First, add 'suspended' to the vetting_status check constraint
ALTER TABLE community_members 
DROP CONSTRAINT IF EXISTS community_members_vetting_status_check;

ALTER TABLE community_members 
ADD CONSTRAINT community_members_vetting_status_check 
CHECK (vetting_status IN ('pending', 'approved', 'rejected', 'vetted', 'suspended'));

-- Add deleted_at for soft deletes
ALTER TABLE community_members 
ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

-- Add is_suspended boolean (separate from vetting_status for temporary suspensions)
ALTER TABLE community_members 
ADD COLUMN IF NOT EXISTS is_suspended boolean DEFAULT false;

-- Add suspended_at and suspended_by for tracking
ALTER TABLE community_members 
ADD COLUMN IF NOT EXISTS suspended_at timestamptz;
ALTER TABLE community_members 
ADD COLUMN IF NOT EXISTS suspended_by uuid REFERENCES auth.users(id);

-- Add deleted_by for tracking deletions
ALTER TABLE community_members 
ADD COLUMN IF NOT EXISTS deleted_by uuid REFERENCES auth.users(id);

-- Create index for filtering active (non-deleted) members
CREATE INDEX IF NOT EXISTS idx_community_members_deleted_at ON community_members(deleted_at) WHERE deleted_at IS NULL;

-- Create index for filtering non-suspended members
CREATE INDEX IF NOT EXISTS idx_community_members_is_suspended ON community_members(is_suspended) WHERE is_suspended = false;


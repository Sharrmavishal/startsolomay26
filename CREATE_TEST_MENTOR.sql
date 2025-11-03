-- Quick SQL to create a test mentor (replace user_id with actual auth user ID)
-- Get your user_id from: SELECT id FROM auth.users WHERE email = 'your-email@example.com';

-- Update an existing member to be a mentor:
UPDATE community_members 
SET 
  role = 'mentor',
  vetting_status = 'vetted',
  free_sessions_per_month = 5,
  free_sessions_used_this_month = 0,
  free_sessions_reset_date = CURRENT_DATE
WHERE id = 'YOUR_MEMBER_ID_HERE';

-- Or if you need to create a new member first:
-- Make sure you're logged in first, then run:
-- SELECT id FROM community_members WHERE user_id = auth.uid();

-- Then update that member with the UPDATE above.


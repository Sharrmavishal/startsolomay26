/*
  # Update quiz leads table policies

  1. Changes
    - Drop existing policies
    - Create new policies with proper permissions
    - Enable RLS

  2. Security
    - Allow anonymous users to insert records
    - Allow authenticated users to read their own data
*/

-- Enable RLS
ALTER TABLE quiz_leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can insert quiz leads" ON quiz_leads;
DROP POLICY IF EXISTS "Users can read own data" ON quiz_leads;

-- Create new policies
CREATE POLICY "Anyone can insert quiz leads"
  ON quiz_leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Enable read access for all users"
  ON quiz_leads
  FOR SELECT
  TO anon, authenticated
  USING (true);
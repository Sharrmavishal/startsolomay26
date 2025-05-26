/*
  # Update quiz leads table and policies

  1. Changes
    - Create quiz_leads table if it doesn't exist
    - Add anonymous insert policy
    - Drop existing policies to avoid conflicts
    - Recreate necessary policies

  2. Security
    - Enable RLS
    - Allow anonymous inserts
    - Allow authenticated users to read their own data
*/

-- Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS quiz_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  quiz_stage text NOT NULL,
  quiz_persona text NOT NULL,
  quiz_score integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  opt_in boolean DEFAULT false
);

-- Enable RLS
ALTER TABLE quiz_leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can insert quiz leads" ON quiz_leads;
DROP POLICY IF EXISTS "Users can read own data" ON quiz_leads;

-- Create new policies
CREATE POLICY "Anyone can insert quiz leads"
  ON quiz_leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can read own data"
  ON quiz_leads
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);
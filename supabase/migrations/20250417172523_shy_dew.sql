/*
  # Update quiz leads table and policies

  1. Changes
    - Create quiz_leads table if it doesn't exist
    - Enable RLS
    - Add policies for insert and select operations

  2. Security
    - Allow anonymous users to insert records
    - Allow authenticated users to read their own data
*/

-- Create the table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'quiz_leads') THEN
    CREATE TABLE quiz_leads (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      email text NOT NULL,
      quiz_stage text NOT NULL,
      quiz_persona text NOT NULL,
      quiz_score integer NOT NULL,
      created_at timestamptz DEFAULT now(),
      opt_in boolean DEFAULT false
    );
  END IF;
END
$$;

-- Enable RLS
ALTER TABLE quiz_leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'quiz_leads' AND policyname = 'Anyone can insert quiz leads'
  ) THEN
    DROP POLICY "Anyone can insert quiz leads" ON quiz_leads;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'quiz_leads' AND policyname = 'Users can read own data'
  ) THEN
    DROP POLICY "Users can read own data" ON quiz_leads;
  END IF;
END
$$;

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
/*
  # Create quiz leads table

  1. New Tables
    - `quiz_leads`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `quiz_stage` (text)
      - `quiz_persona` (text)
      - `quiz_score` (integer)
      - `created_at` (timestamp)
      - `opt_in` (boolean)

  2. Security
    - Enable RLS on `quiz_leads` table
    - Add policy for authenticated users to read their own data
*/

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

ALTER TABLE quiz_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON quiz_leads
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);
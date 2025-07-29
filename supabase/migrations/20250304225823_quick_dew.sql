/*
  # Fix RLS policies for chat threads

  1. Changes
    - Drop existing RLS policies for chat_threads
    - Add new RLS policies that properly handle thread creation and access
    
  2. Security
    - Enable RLS on chat_threads table
    - Add policies for:
      - Creating threads (authenticated users can create their own threads)
      - Viewing threads (users can only view their own threads)
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own threads" ON chat_threads;
DROP POLICY IF EXISTS "Users can create threads" ON chat_threads;

-- Create new policies with correct permissions
CREATE POLICY "Enable read access to own threads"
  ON chat_threads
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable insert access for authenticated users"
  ON chat_threads
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Ensure RLS is enabled
ALTER TABLE chat_threads ENABLE ROW LEVEL SECURITY;
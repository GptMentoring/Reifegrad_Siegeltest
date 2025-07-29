/*
  # Fix chat thread policies

  1. Changes
    - Drop and recreate policies with correct permissions
    - Add explicit policy for authenticated users
    - Ensure proper RLS configuration

  2. Security
    - Maintain RLS enabled
    - Add proper authentication checks
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable read access to own threads" ON chat_threads;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON chat_threads;
DROP POLICY IF EXISTS "Users can view own threads" ON chat_threads;
DROP POLICY IF EXISTS "Users can create threads" ON chat_threads;

-- Create new comprehensive policies
CREATE POLICY "Enable all access to own threads"
  ON chat_threads
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Ensure RLS is enabled
ALTER TABLE chat_threads ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions to authenticated users
GRANT ALL ON chat_threads TO authenticated;
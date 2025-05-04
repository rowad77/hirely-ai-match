-- Create saved_searches table for storing user's saved job search filters
CREATE TABLE IF NOT EXISTS saved_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  filters JSONB NOT NULL,
  notify_new_matches BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster lookups by user_id
CREATE INDEX IF NOT EXISTS saved_searches_user_id_idx ON saved_searches(user_id);

-- Add RLS policies for saved_searches table
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view only their own saved searches
CREATE POLICY "Users can view their own saved searches" 
  ON saved_searches FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy to allow users to insert their own saved searches
CREATE POLICY "Users can insert their own saved searches" 
  ON saved_searches FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own saved searches
CREATE POLICY "Users can update their own saved searches" 
  ON saved_searches FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy to allow users to delete their own saved searches
CREATE POLICY "Users can delete their own saved searches" 
  ON saved_searches FOR DELETE 
  USING (auth.uid() = user_id);
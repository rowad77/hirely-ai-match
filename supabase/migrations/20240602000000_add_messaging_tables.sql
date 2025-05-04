-- Create conversations table for storing messaging conversations between users
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create conversation_participants table to track users in each conversation
CREATE TABLE IF NOT EXISTS conversation_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);

-- Create messages table for storing individual messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Create interview_requests table for scheduling interviews
CREATE TABLE IF NOT EXISTS interview_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  proposed_times JSONB NOT NULL, -- Array of proposed datetime options
  status TEXT NOT NULL DEFAULT 'pending', -- pending, accepted, rejected
  selected_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create message_notifications table for tracking notification preferences
CREATE TABLE IF NOT EXISTS message_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  in_app_notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS conversation_participants_user_id_idx ON conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS conversation_participants_conversation_id_idx ON conversation_participants(conversation_id);
CREATE INDEX IF NOT EXISTS messages_conversation_id_idx ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS messages_sender_id_idx ON messages(sender_id);
CREATE INDEX IF NOT EXISTS interview_requests_conversation_id_idx ON interview_requests(conversation_id);
CREATE INDEX IF NOT EXISTS interview_requests_sender_id_idx ON interview_requests(sender_id);
CREATE INDEX IF NOT EXISTS interview_requests_recipient_id_idx ON interview_requests(recipient_id);

-- Add RLS policies for conversations table
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view conversations they are participants in
CREATE POLICY "Users can view their conversations" 
  ON conversations FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM conversation_participants 
    WHERE conversation_id = conversations.id AND user_id = auth.uid()
  ));

-- Policy to allow users to insert conversations
CREATE POLICY "Users can create conversations" 
  ON conversations FOR INSERT 
  WITH CHECK (true);

-- Policy to allow users to update conversations they are participants in
CREATE POLICY "Users can update their conversations" 
  ON conversations FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM conversation_participants 
    WHERE conversation_id = conversations.id AND user_id = auth.uid()
  ));

-- Add RLS policies for conversation_participants table
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view conversation participants for their conversations
CREATE POLICY "Users can view participants of their conversations" 
  ON conversation_participants FOR SELECT 
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM conversation_participants cp 
    WHERE cp.conversation_id = conversation_participants.conversation_id AND cp.user_id = auth.uid()
  ));

-- Policy to allow users to insert conversation participants
CREATE POLICY "Users can add participants to conversations" 
  ON conversation_participants FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM conversation_participants 
    WHERE conversation_id = conversation_participants.conversation_id AND user_id = auth.uid()
  ) OR (
    -- Allow inserting the first two participants when creating a new conversation
    EXISTS (
      SELECT 1 FROM conversation_participants 
      WHERE conversation_id = conversation_participants.conversation_id
      HAVING COUNT(*) < 2
    )
  ));

-- Add RLS policies for messages table
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view messages in conversations they are participants in
CREATE POLICY "Users can view messages in their conversations" 
  ON messages FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM conversation_participants 
    WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()
  ));

-- Policy to allow users to insert messages in conversations they are participants in
CREATE POLICY "Users can send messages in their conversations" 
  ON messages FOR INSERT 
  WITH CHECK (sender_id = auth.uid() AND EXISTS (
    SELECT 1 FROM conversation_participants 
    WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()
  ));

-- Add RLS policies for interview_requests table
ALTER TABLE interview_requests ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view interview requests they are involved in
CREATE POLICY "Users can view their interview requests" 
  ON interview_requests FOR SELECT 
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

-- Policy to allow users to insert interview requests
CREATE POLICY "Users can create interview requests" 
  ON interview_requests FOR INSERT 
  WITH CHECK (sender_id = auth.uid());

-- Policy to allow users to update interview requests they are involved in
CREATE POLICY "Users can update their interview requests" 
  ON interview_requests FOR UPDATE 
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

-- Add RLS policies for message_notifications table
ALTER TABLE message_notifications ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view their notification preferences
CREATE POLICY "Users can view their notification preferences" 
  ON message_notifications FOR SELECT 
  USING (user_id = auth.uid());

-- Policy to allow users to insert their notification preferences
CREATE POLICY "Users can set their notification preferences" 
  ON message_notifications FOR INSERT 
  WITH CHECK (user_id = auth.uid());

-- Policy to allow users to update their notification preferences
CREATE POLICY "Users can update their notification preferences" 
  ON message_notifications FOR UPDATE 
  USING (user_id = auth.uid());

-- Create function to update conversation last_message_at timestamp
CREATE OR REPLACE FUNCTION update_conversation_last_message_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET last_message_at = NEW.created_at,
      updated_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update conversation timestamp when new message is inserted
CREATE TRIGGER update_conversation_timestamp
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_last_message_timestamp();

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
}

export interface ConversationParticipant {
  user_id: string;
  conversation_id: string;
  created_at: string;
  profile?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface Conversation {
  id: string;
  created_at: string;
  last_message_at?: string;
  participants?: ConversationParticipant[];
  last_message?: {
    content: string;
    created_at: string;
    sender_id: string;
  };
  unread_count?: number;
}

export interface ConversationWithParticipants extends Conversation {
  participants: ConversationParticipant[];
}

export interface InterviewRequest {
  id: string;
  conversation_id: string;
  sender_id: string;
  recipient_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  proposed_times: string[];
  selected_time?: string | null;
  created_at: string;
  updated_at?: string;
  sender?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  recipient?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  conversation?: Conversation;
}

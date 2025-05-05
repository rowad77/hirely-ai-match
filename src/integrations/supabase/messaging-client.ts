
import { supabase } from './client';
import { Message, Conversation, InterviewRequest } from '@/types/messaging';

export type SendMessageParams = {
  conversationId: string;
  senderId: string;
  content: string;
};

export type CreateConversationParams = {
  participantIds: string[];
};

// This is a mock implementation for now - we need to create the appropriate tables in Supabase
export const messagingClient = {
  async getConversations(userId: string): Promise<Conversation[]> {
    // Mock conversations for now
    return [];
  },

  async getConversationWithParticipants(conversationId: string): Promise<Conversation> {
    // Mock conversation
    return {
      id: conversationId,
      created_at: new Date().toISOString(),
      participants: []
    };
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    // Mock messages
    return [];
  },

  async sendMessage({ conversationId, senderId, content }: SendMessageParams): Promise<Message> {
    // Mock sending a message
    const message = {
      id: Math.random().toString(),
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      created_at: new Date().toISOString(),
      read_at: null
    };
    
    return message;
  },

  async createConversation({ participantIds }: CreateConversationParams): Promise<string> {
    // Mock creating a conversation
    return "new-conversation-id";
  },

  async markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
    // Mock marking messages as read
  },

  async getUnreadCount(userId: string): Promise<number> {
    // Mock unread count
    return 0;
  },

  async getPendingInterviewRequests(userId: string): Promise<InterviewRequest[]> {
    // Mock pending requests
    return [];
  }
};

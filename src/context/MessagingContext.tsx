
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { messagingClient } from '@/integrations/supabase/messaging-client';
import { Conversation, Message, InterviewRequest } from '@/types/messaging';

// Define the context type
interface MessagingContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  error: Error | null;
  unreadCount: number;
  setCurrentConversationId: (id: string | null) => void;
  sendMessage: (params: { conversationId: string; content: string; senderId: string }) => Promise<void>;
  sendInterviewRequest: (params: {
    conversationId: string;
    senderId: string;
    recipientId: string;
    proposedTimes: string[];
  }) => Promise<void>;
  markMessagesAsRead: (conversationId: string) => Promise<void>;
  createConversation: (participantIds: string[]) => Promise<string>;
  getMessages: (conversationId: string) => Promise<Message[]>;
}

// Create the context with default values
export const MessagingContext = createContext<MessagingContextType>({
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  error: null,
  unreadCount: 0,
  setCurrentConversationId: () => {},
  sendMessage: async () => {},
  sendInterviewRequest: async () => {},
  markMessagesAsRead: async () => {},
  createConversation: async () => '',
  getMessages: async () => []
});

interface MessagingProviderProps {
  children: ReactNode;
}

export const MessagingProvider: React.FC<MessagingProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Load conversations when the user changes
  useEffect(() => {
    if (user) {
      loadConversations();
      loadUnreadCount();
    } else {
      setConversations([]);
      setCurrentConversationId(null);
      setCurrentConversation(null);
      setMessages([]);
      setUnreadCount(0);
    }
  }, [user]);

  // Load messages when the current conversation changes
  useEffect(() => {
    if (currentConversationId) {
      loadMessagesAndMarkAsRead();
      loadConversationDetails();
    } else {
      setMessages([]);
      setCurrentConversation(null);
    }
  }, [currentConversationId]);

  // Load all conversations for the current user
  const loadConversations = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const data = await messagingClient.getConversations(user.id);
      setConversations(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load unread message count
  const loadUnreadCount = async () => {
    if (!user) return;
    
    try {
      const count = await messagingClient.getUnreadCount(user.id);
      setUnreadCount(count);
    } catch (err) {
      console.error('Error loading unread count:', err);
    }
  };

  // Load messages for the current conversation and mark them as read
  const loadMessagesAndMarkAsRead = async () => {
    if (!user || !currentConversationId) return;
    
    setIsLoading(true);
    
    try {
      const messages = await messagingClient.getMessages(currentConversationId);
      setMessages(messages);
      
      // Mark messages as read
      await messagingClient.markMessagesAsRead(currentConversationId, user.id);
      
      // Update unread count
      loadUnreadCount();
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load current conversation details with participants
  const loadConversationDetails = async () => {
    if (!currentConversationId) return;
    
    try {
      const conversation = await messagingClient.getConversationWithParticipants(currentConversationId);
      setCurrentConversation(conversation);
    } catch (err) {
      console.error('Error loading conversation details:', err);
    }
  };

  // Send a message in the current conversation
  const sendMessage = async (params: { conversationId: string; content: string; senderId: string }) => {
    if (!params.content.trim()) return;
    
    try {
      await messagingClient.sendMessage(params);
      // We'll rely on real-time updates to refresh the messages
    } catch (err: any) {
      setError(err);
    }
  };

  // Send an interview request
  const sendInterviewRequest = async (params: {
    conversationId: string;
    senderId: string;
    recipientId: string;
    proposedTimes: string[];
  }) => {
    try {
      // This is a placeholder until we implement this feature
      console.log("Would send interview request:", params);
    } catch (err: any) {
      setError(err);
    }
  };

  // Mark all messages in the current conversation as read
  const markMessagesAsRead = async (conversationId: string) => {
    if (!user) return;
    
    try {
      await messagingClient.markMessagesAsRead(conversationId, user.id);
      loadUnreadCount();
    } catch (err: any) {
      setError(err);
    }
  };

  // Create a new conversation with the specified participants
  const createConversation = async (participantIds: string[]): Promise<string> => {
    if (!user) throw new Error('User must be authenticated');
    
    // Make sure the current user is included in the participants
    if (!participantIds.includes(user.id)) {
      participantIds.push(user.id);
    }
    
    try {
      const conversationId = await messagingClient.createConversation({
        participantIds
      });
      
      // Refresh conversations list
      loadConversations();
      
      return conversationId;
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  // Get messages for a specific conversation
  const getMessages = async (conversationId: string): Promise<Message[]> => {
    try {
      return await messagingClient.getMessages(conversationId);
    } catch (err: any) {
      setError(err);
      return [];
    }
  };

  return (
    <MessagingContext.Provider value={{
      conversations,
      currentConversation,
      messages,
      isLoading,
      error,
      unreadCount,
      setCurrentConversationId,
      sendMessage,
      sendInterviewRequest,
      markMessagesAsRead,
      createConversation,
      getMessages
    }}>
      {children}
    </MessagingContext.Provider>
  );
};

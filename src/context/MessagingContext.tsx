
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { messagingClient } from '@/integrations/supabase/messaging-client';
import { useAuth } from '@/context/AuthContext';
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
  sendMessage: (content: string) => Promise<void>;
  sendInterviewRequest: (params: {
    conversationId: string;
    senderId: string;
    recipientId: string;
    proposedTimes: string[];
  }) => Promise<void>;
  markMessagesAsRead: () => Promise<void>;
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

  // Set up real-time updates for new messages
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('messaging-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, (payload) => {
        const newMessage = payload.new as Message;
        
        // If the message is for the current conversation, add it to the messages list
        if (newMessage.conversation_id === currentConversationId) {
          setMessages(prev => [...prev, newMessage]);
          
          // If the user is viewing the conversation and the message is from someone else, mark it as read
          if (user?.id !== newMessage.sender_id) {
            messagingClient.markMessagesAsRead(newMessage.conversation_id, user!.id);
          }
        }

        // Update unread count
        loadUnreadCount();
        
        // Update conversations list to reflect the new message
        updateConversationWithNewMessage(newMessage);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user, currentConversationId]);

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

  // Update conversations list with a new message
  const updateConversationWithNewMessage = (message: Message) => {
    setConversations(prev => {
      return prev.map(conv => {
        if (conv.id === message.conversation_id) {
          return {
            ...conv,
            last_message: {
              content: message.content,
              created_at: message.created_at,
              sender_id: message.sender_id
            },
            last_message_at: message.created_at
          };
        }
        return conv;
      });
    });
  };

  // Send a message in the current conversation
  const sendMessage = async (content: string) => {
    if (!user || !currentConversationId || !content.trim()) return;
    
    try {
      await messagingClient.sendMessage({
        conversationId: currentConversationId,
        senderId: user.id,
        content
      });
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
      await messagingClient.sendInterviewRequest(params);
    } catch (err: any) {
      setError(err);
    }
  };

  // Mark all messages in the current conversation as read
  const markMessagesAsRead = async () => {
    if (!user || !currentConversationId) return;
    
    try {
      await messagingClient.markMessagesAsRead(currentConversationId, user.id);
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

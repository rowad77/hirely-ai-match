import { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import type { Message, ConversationWithParticipants, InterviewRequest } from '@/types/messaging';

interface MessagingContextType {
  conversations: ConversationWithParticipants[];
  isLoading: boolean;
  getMessages: (conversationId: string) => Promise<Message[]>;
  sendMessage: (params: { conversationId: string; content: string; senderId: string }) => Promise<void>;
  markMessagesAsRead: (conversationId: string) => Promise<void>;
  createConversation: (participantIds: string[]) => Promise<string>;
  sendInterviewRequest: (params: {
    conversationId: string;
    senderId: string;
    recipientId: string;
    proposedTimes: string[];
  }) => Promise<void>;
  getInterviewRequests: () => Promise<InterviewRequest[]>;
  respondToInterviewRequest: (requestId: string, status: 'accepted' | 'rejected', selectedTime?: string) => Promise<void>;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export function MessagingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all conversations for the current user
  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('conversation_participants')
        .select(`
          conversation:conversation_id(*, 
            participants:conversation_participants(*, profile:profiles(*)),
            last_message:messages(content, created_at, sender_id)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        toast.error('Failed to fetch conversations');
        throw error;
      }
      
      // Process the data to get the conversations with unread count
      const conversationsWithUnread = await Promise.all(
        data.map(async (item) => {
          const conversation = item.conversation;
          
          // Get unread count
          const { count, error: countError } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conversation.id)
            .neq('sender_id', user.id)
            .is('read_at', null);
            
          if (countError) {
            console.error('Error getting unread count:', countError);
            return { ...conversation, unread_count: 0 };
          }
          
          // Get the last message if available
          const lastMessage = conversation.last_message?.[0] || null;
          
          return {
            ...conversation,
            last_message: lastMessage,
            unread_count: count || 0
          };
        })
      );
      
      // Sort by last message date
      return conversationsWithUnread.sort((a, b) => {
        const dateA = a.last_message_at || a.created_at;
        const dateB = b.last_message_at || b.created_at;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });
    },
    enabled: !!user
  });

  // Get messages for a specific conversation
  const getMessages = async (conversationId: string): Promise<Message[]> => {
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
      
    if (error) {
      toast.error('Failed to fetch messages');
      throw error;
    }
    
    return data as Message[];
  };

  // Send a new message
  const sendMessage = async ({ conversationId, content, senderId }: {
    conversationId: string;
    content: string;
    senderId: string;
  }): Promise<void> => {
    const { error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        content
      });
      
    if (error) {
      toast.error('Failed to send message');
      throw error;
    }
    
    // Invalidate queries to refresh data
    queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
    queryClient.invalidateQueries({ queryKey: ['conversations'] });
  };

  // Mark messages as read
  const markMessagesAsRead = async (conversationId: string): Promise<void> => {
    if (!user) return;
    
    const { error } = await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .neq('sender_id', user.id)
      .is('read_at', null);
      
    if (error) {
      console.error('Error marking messages as read:', error);
    } else {
      // Invalidate queries to refresh unread count
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  };

  // Create a new conversation
  const createConversation = async (participantIds: string[]): Promise<string> => {
    // Create the conversation
    const { data: conversationData, error: conversationError } = await supabase
      .from('conversations')
      .insert({})
      .select()
      .single();
      
    if (conversationError) {
      toast.error('Failed to create conversation');
      throw conversationError;
    }
    
    const conversationId = conversationData.id;
    
    // Add participants
    const participantPromises = participantIds.map(userId =>
      supabase
        .from('conversation_participants')
        .insert({
          conversation_id: conversationId,
          user_id: userId
        })
    );
    
    await Promise.all(participantPromises);
    
    // Invalidate conversations query
    queryClient.invalidateQueries({ queryKey: ['conversations'] });
    
    return conversationId;
  };

  // Send an interview request
  const sendInterviewRequest = async ({
    conversationId,
    senderId,
    recipientId,
    proposedTimes
  }: {
    conversationId: string;
    senderId: string;
    recipientId: string;
    proposedTimes: string[];
  }): Promise<void> => {
    // Create the interview request
    const { error: requestError } = await supabase
      .from('interview_requests')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        recipient_id: recipientId,
        proposed_times: proposedTimes,
        status: 'pending'
      });
      
    if (requestError) {
      toast.error('Failed to send interview request');
      throw requestError;
    }
    
    // Send a message about the interview request
    await sendMessage({
      conversationId,
      senderId,
      content: `📅 I've sent you an interview request with ${proposedTimes.length} proposed time${proposedTimes.length > 1 ? 's' : ''}.`
    });
    
    toast.success('Interview request sent');
  };

  // Get interview requests for the current user
  const getInterviewRequests = async (): Promise<InterviewRequest[]> => {
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('interview_requests')
      .select(`
        *,
        sender:sender_id(id, full_name, avatar_url),
        recipient:recipient_id(id, full_name, avatar_url),
        conversation:conversation_id(*)
      `)
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order('created_at', { ascending: false });
      
    if (error) {
      toast.error('Failed to fetch interview requests');
      throw error;
    }
    
    return data as InterviewRequest[];
  };

  // Respond to an interview request
  const respondToInterviewRequest = async (
    requestId: string,
    status: 'accepted' | 'rejected',
    selectedTime?: string
  ): Promise<void> => {
    if (!user) return;
    
    // Get the request first to get conversation ID
    const { data: requestData, error: fetchError } = await supabase
      .from('interview_requests')
      .select('*')
      .eq('id', requestId)
      .single();
      
    if (fetchError) {
      toast.error('Failed to fetch interview request');
      throw fetchError;
    }
    
    // Update the request status
    const { error: updateError } = await supabase
      .from('interview_requests')
      .update({
        status,
        selected_time: selectedTime || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);
      
    if (updateError) {
      toast.error(`Failed to ${status} interview request`);
      throw updateError;
    }
    
    // Send a message about the response
    const message = status === 'accepted'
      ? `✅ I've accepted your interview request for ${new Date(selectedTime || '').toLocaleString()}.`
      : `❌ I've declined your interview request.`;
      
    await sendMessage({
      conversationId: requestData.conversation_id,
      senderId: user.id,
      content: message
    });
    
    toast.success(`Interview request ${status}`);
  };

  return (
    <MessagingContext.Provider
      value={{
        conversations,
        isLoading,
        getMessages,
        sendMessage,
        markMessagesAsRead,
        createConversation,
        sendInterviewRequest,
        getInterviewRequests,
        respondToInterviewRequest
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
}

export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (context === undefined) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};
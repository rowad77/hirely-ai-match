
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

export type SendInterviewRequestParams = {
  conversationId: string;
  senderId: string;
  recipientId: string;
  proposedTimes: string[];
};

export type RespondToInterviewRequestParams = {
  requestId: string;
  status: 'accepted' | 'rejected';
  selectedTime?: string;
};

export const messagingClient = {
  async getConversations(userId: string): Promise<Conversation[]> {
    try {
      // Get all conversations the user is part of
      const { data, error } = await supabase
        .from('conversation_participants')
        .select(`
          conversation_id,
          conversation:conversation_id (
            id,
            created_at,
            last_message_at,
            last_message:messages (
              content, 
              created_at,
              sender_id
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data into our conversation model
      return (data || []).map(item => {
        const conversation = item.conversation;
        return {
          id: conversation.id,
          created_at: conversation.created_at,
          last_message_at: conversation.last_message_at,
          last_message: conversation.last_message?.[0],
          participants: [] // We'll load these separately if needed
        };
      });
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  },

  async getConversationWithParticipants(conversationId: string): Promise<Conversation> {
    try {
      // Get the conversation with its participants
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id,
          created_at,
          last_message_at,
          participants:conversation_participants (
            user_id,
            created_at,
            profile:user_id (
              id,
              full_name,
              avatar_url
            )
          ),
          last_message:messages (
            content,
            created_at,
            sender_id
          )
        `)
        .eq('id', conversationId)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        created_at: data.created_at,
        last_message_at: data.last_message_at,
        participants: data.participants,
        last_message: data.last_message?.[0]
      };
    } catch (error) {
      console.error('Error fetching conversation details:', error);
      throw error;
    }
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  async sendMessage({ conversationId, senderId, content }: SendMessageParams): Promise<Message> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: senderId,
          content
        })
        .select()
        .single();

      if (error) throw error;

      // Update the conversation's last_message_at timestamp
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversationId);

      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  async createConversation({ participantIds }: CreateConversationParams): Promise<string> {
    try {
      // Create a new conversation
      const { data: conversationData, error: conversationError } = await supabase
        .from('conversations')
        .insert({})
        .select()
        .single();

      if (conversationError) throw conversationError;

      // Add participants to the conversation
      const participants = participantIds.map(userId => ({
        conversation_id: conversationData.id,
        user_id: userId
      }));

      const { error: participantsError } = await supabase
        .from('conversation_participants')
        .insert(participants);

      if (participantsError) throw participantsError;

      return conversationData.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  },

  async markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
    try {
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .neq('sender_id', userId)
        .is('read_at', null);
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  },

  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .neq('sender_id', userId)
        .is('read_at', null)
        .in('conversation_id', supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', userId)
        );

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  },

  async sendInterviewRequest({ 
    conversationId, 
    senderId, 
    recipientId, 
    proposedTimes 
  }: SendInterviewRequestParams): Promise<InterviewRequest> {
    try {
      const { data, error } = await supabase
        .from('interview_requests')
        .insert({
          conversation_id: conversationId,
          sender_id: senderId,
          recipient_id: recipientId,
          status: 'pending',
          proposed_times: proposedTimes
        })
        .select(`
          *,
          sender:sender_id (
            id,
            full_name,
            avatar_url
          ),
          recipient:recipient_id (
            id,
            full_name,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;

      // Also send a message in the conversation about this request
      await this.sendMessage({
        conversationId,
        senderId,
        content: `📅 I've sent you an interview request with ${proposedTimes.length} proposed times.`
      });

      return data;
    } catch (error) {
      console.error('Error sending interview request:', error);
      throw error;
    }
  },

  async respondToInterviewRequest({ 
    requestId, 
    status, 
    selectedTime 
  }: RespondToInterviewRequestParams): Promise<InterviewRequest> {
    try {
      // First get the request details to get the conversation ID
      const { data: requestData, error: requestError } = await supabase
        .from('interview_requests')
        .select('conversation_id, sender_id, recipient_id')
        .eq('id', requestId)
        .single();

      if (requestError) throw requestError;

      // Update the interview request status
      const updateData: any = { 
        status, 
        updated_at: new Date().toISOString() 
      };
      
      if (status === 'accepted' && selectedTime) {
        updateData.selected_time = selectedTime;
      }

      const { data, error } = await supabase
        .from('interview_requests')
        .update(updateData)
        .eq('id', requestId)
        .select(`
          *,
          sender:sender_id (
            id,
            full_name,
            avatar_url
          ),
          recipient:recipient_id (
            id,
            full_name,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;

      // Send a message in the conversation about the response
      const message = status === 'accepted'
        ? `✅ I've accepted your interview request for ${new Date(selectedTime!).toLocaleString()}.`
        : `❌ I've declined your interview request.`;

      await this.sendMessage({
        conversationId: requestData.conversation_id,
        senderId: requestData.recipient_id,
        content: message
      });

      return data;
    } catch (error) {
      console.error('Error responding to interview request:', error);
      throw error;
    }
  },

  async getPendingInterviewRequests(userId: string): Promise<InterviewRequest[]> {
    try {
      const { data, error } = await supabase
        .from('interview_requests')
        .select(`
          *,
          sender:sender_id (
            id,
            full_name,
            avatar_url
          ),
          recipient:recipient_id (
            id,
            full_name,
            avatar_url
          ),
          conversation:conversation_id (
            id,
            created_at
          )
        `)
        .eq('recipient_id', userId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching pending interview requests:', error);
      return [];
    }
  }
};

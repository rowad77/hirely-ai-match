
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useMessaging } from '@/hooks/use-messaging';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Send, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { InterviewRequestDialog } from './InterviewRequestDialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery } from '@tanstack/react-query';
import { messagingClient } from '@/integrations/supabase/messaging-client';
import type { Conversation, Message, ConversationParticipant } from '@/types/messaging';

export function ConversationView() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { user } = useAuth();
  const { sendMessage, markMessagesAsRead } = useMessaging();
  const [newMessageText, setNewMessageText] = useState('');
  const [isInterviewDialogOpen, setIsInterviewDialogOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch the current conversation
  const { data: conversation, isLoading: conversationLoading } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      if (!conversationId) return null;
      return messagingClient.getConversationWithParticipants(conversationId);
    },
    enabled: !!conversationId
  });
  
  // Fetch messages for the conversation
  const { data: messages = [], isLoading: messagesLoading, refetch: refetchMessages } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      return messagingClient.getMessages(conversationId);
    },
    enabled: !!conversationId
  });
  
  // Get the other participant in the conversation
  const otherParticipant = conversation?.participants?.find(
    (p: ConversationParticipant) => p.user_id !== user?.id
  );
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Mark messages as read when conversation is opened
  useEffect(() => {
    if (conversationId && user?.id) {
      messagingClient.markMessagesAsRead(conversationId, user.id);
    }
  }, [conversationId, user]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !conversationId || !user) return;
    
    try {
      await messagingClient.sendMessage({
        conversationId,
        senderId: user.id,
        content: newMessageText
      });
      
      refetchMessages();
      setNewMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  if (conversationLoading || messagesLoading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-12 w-2/3 ml-auto" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-12 w-1/2 ml-auto" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!conversation || !conversationId) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>No conversation selected</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Select a conversation to start messaging</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-2">
            <AvatarImage src={otherParticipant?.profile?.avatar_url || ''} />
            <AvatarFallback>
              {otherParticipant?.profile?.full_name?.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>
          <CardTitle>{otherParticipant?.profile?.full_name || 'Unknown User'}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {messages?.map((message: Message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${message.sender_id === user?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'}`}
                >
                  <p>{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {format(new Date(message.created_at), 'p')}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessageText}
            onChange={(e) => setNewMessageText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="button" variant="outline" onClick={() => setIsInterviewDialogOpen(true)}>
            <Calendar className="h-4 w-4" />
          </Button>
          <Button type="submit" disabled={!newMessageText.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
      
      {otherParticipant && (
        <InterviewRequestDialog
          open={isInterviewDialogOpen}
          onOpenChange={setIsInterviewDialogOpen}
          conversationId={conversationId}
          recipientId={otherParticipant.user_id}
        />
      )}
    </Card>
  );
}

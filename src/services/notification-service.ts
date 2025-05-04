
import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
  metadata?: Record<string, any>;
  user_id: string;
}

export async function getNotifications(userId: string) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
}

export async function getUnreadCount(userId: string) {
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);
      
    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return 0;
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

export async function markAllNotificationsAsRead(userId: string) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
}

export async function createNotification({
  userId,
  title,
  message,
  type,
  metadata
}: {
  userId: string;
  title: string;
  message: string;
  type: string;
  metadata?: Record<string, any>;
}) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type,
        metadata,
        read: false
      })
      .select();
      
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

// Subscribe to notifications for a specific user
export function subscribeToNotifications(
  userId: string,
  onNewNotification: (notification: Notification) => void
) {
  const channel = supabase
    .channel(`user-notifications-${userId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${userId}`
    }, (payload) => {
      onNewNotification(payload.new as Notification);
    })
    .subscribe();

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
}

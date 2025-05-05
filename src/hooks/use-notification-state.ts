
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  subscribeToNotifications,
  Notification
} from '@/services/notification-service';
import { toast } from 'sonner';

export function useNotificationState() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const [notificationsData, count] = await Promise.all([
        getNotifications(user.id),
        getUnreadCount(user.id)
      ]);
      
      // Type assertion to match the expected Notification[] type
      const typedNotifications = notificationsData.map(item => ({
        id: item.id,
        title: item.title,
        message: item.message,
        type: item.type,
        read: item.read,
        created_at: item.created_at,
        metadata: item.metadata as Record<string, any>,
        user_id: item.user_id
      })) as Notification[];
      
      setNotifications(typedNotifications);
      setUnreadCount(count);
    } catch (err: any) {
      setError(err);
      console.error('Error loading notifications:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!user) return;
    
    try {
      await markNotificationAsRead(notificationId);
      
      // Update the local notifications state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
      
      // Decrement unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }, [user]);
  
  const markAllAsRead = useCallback(async () => {
    if (!user) return;
    
    try {
      await markAllNotificationsAsRead(user.id);
      
      // Update all notifications in state to read
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, read: true }))
      );
      
      // Reset unread count
      setUnreadCount(0);
      
      toast.success('All notifications marked as read');
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      toast.error('Failed to mark all notifications as read');
    }
  }, [user]);
  
  // Set up real-time notification updates
  useEffect(() => {
    if (!user) return;
    
    // Initial load
    loadNotifications();
    
    // Subscribe to new notifications
    const unsubscribe = subscribeToNotifications(user.id, (newNotification) => {
      // Add to notifications list
      setNotifications(prev => [newNotification, ...prev]);
      
      // Increment unread count
      setUnreadCount(prev => prev + 1);
      
      // Show a toast for the new notification
      toast(newNotification.title, {
        description: newNotification.message,
        action: {
          label: "View",
          onClick: () => markAsRead(newNotification.id)
        }
      });
    });
    
    return () => {
      unsubscribe();
    };
  }, [user, loadNotifications, markAsRead]);
  
  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    loadNotifications,
    markAsRead,
    markAllAsRead
  };
}


import React, { useState } from 'react';
import { useNotificationState } from '@/hooks/use-notification-state';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { NotificationItem } from './NotificationItem';
import { CheckCheck } from 'lucide-react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'message' | 'application_update' | 'job_match' | 'interview_request' | 'alert' | 'saved_search_match';
  read: boolean;
  created_at: string;
  metadata?: Record<string, any>;
  user_id: string;
}

export const NotificationCenter: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead, isLoading } = useNotificationState();
  const [activeTab, setActiveTab] = useState('all');
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : activeTab === 'unread'
      ? notifications.filter(n => !n.read)
      : notifications.filter(n => n.type === activeTab);
  
  return (
    <Command className="rounded-lg border shadow-md">
      <div className="flex items-center border-b px-3">
        <h2 className="flex-1 font-semibold text-sm p-2">Notifications</h2>
        {unreadCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-xs gap-1"
            onClick={markAllAsRead}
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all as read
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b">
          <TabsList className="p-1 w-full justify-start gap-1 bg-transparent">
            <TabsTrigger
              value="all"
              className="text-xs data-[state=active]:bg-muted rounded-md"
            >
              All
              {notifications.length > 0 && (
                <span className="ml-1 text-xs rounded-full text-muted-foreground">
                  ({notifications.length})
                </span>
              )}
            </TabsTrigger>
            
            <TabsTrigger
              value="unread"
              className="text-xs data-[state=active]:bg-muted rounded-md"
              disabled={unreadCount === 0}
            >
              Unread
              {unreadCount > 0 && (
                <span className="ml-1 text-xs rounded-full text-muted-foreground">
                  ({unreadCount})
                </span>
              )}
            </TabsTrigger>
            
            <TabsTrigger
              value="message"
              className="text-xs data-[state=active]:bg-muted rounded-md"
              disabled={!notifications.some(n => n.type === 'message')}
            >
              Messages
            </TabsTrigger>
            
            <TabsTrigger
              value="job_match"
              className="text-xs data-[state=active]:bg-muted rounded-md"
              disabled={!notifications.some(n => n.type === 'job_match')}
            >
              Job Matches
            </TabsTrigger>
            
            <TabsTrigger
              value="saved_search_match"
              className="text-xs data-[state=active]:bg-muted rounded-md"
              disabled={!notifications.some(n => n.type === 'saved_search_match')}
            >
              Saved Searches
            </TabsTrigger>
          </TabsList>
        </div>
        
        <CommandInput placeholder="Search notifications..." />
        
        <TabsContent value={activeTab} className="mt-0 p-0">
          <CommandList>
            {isLoading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Loading notifications...
              </div>
            ) : filteredNotifications.length === 0 ? (
              <CommandEmpty>No notifications found.</CommandEmpty>
            ) : (
              <CommandGroup>
                <ScrollArea className="h-[300px]">
                  {filteredNotifications.map((notification) => (
                    <CommandItem key={notification.id} className="p-0">
                      <NotificationItem 
                        notification={notification} 
                        onRead={() => markAsRead(notification.id)} 
                      />
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandGroup>
            )}
          </CommandList>
        </TabsContent>
      </Tabs>
    </Command>
  );
};

export default NotificationCenter;

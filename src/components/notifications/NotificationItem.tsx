
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { 
  BellRing,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Calendar,
  Briefcase,
  Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Notification } from '@/services/notification-service';

interface NotificationItemProps {
  notification: Notification;
  onRead: () => void;
}

export function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    // Mark as read
    if (!notification.read) {
      onRead();
    }
    
    // Handle navigation based on notification type and metadata
    if (notification.metadata?.url) {
      navigate(notification.metadata.url);
    } else {
      // Handle different notification types
      switch (notification.type) {
        case 'message':
          if (notification.metadata?.conversationId) {
            navigate(`/messages/${notification.metadata.conversationId}`);
          }
          break;
        case 'application_update':
          if (notification.metadata?.applicationId) {
            navigate(`/applications/${notification.metadata.applicationId}`);
          }
          break;
        case 'job_match':
          if (notification.metadata?.jobId) {
            navigate(`/jobs/${notification.metadata.jobId}`);
          }
          break;
        case 'interview_request':
          if (notification.metadata?.conversationId) {
            navigate(`/messages/${notification.metadata.conversationId}`);
          }
          break;
        default:
          // By default, notifications don't navigate anywhere when clicked
          break;
      }
    }
  };
  
  // Get the appropriate icon based on notification type
  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'message':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'application_update':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'interview_request':
        return <Calendar className="h-4 w-4 text-purple-500" />;
      case 'job_match':
        return <Briefcase className="h-4 w-4 text-amber-500" />;
      case 'alert':
        return <AlertCircle className="h-4 w-4 text-rose-500" />;
      default:
        return <BellRing className="h-4 w-4 text-gray-500" />;
    }
  };
  
  return (
    <div 
      className={cn(
        "flex items-start gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors",
        !notification.read && "bg-muted/30"
      )}
      onClick={handleClick}
    >
      <div className="mt-0.5 flex-shrink-0">
        {getNotificationIcon()}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{notification.title}</p>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{notification.message}</p>
        
        {!notification.read && (
          <div className="flex justify-end">
            <Badge variant="outline" className="text-[10px] h-5 px-1 bg-blue-50 text-blue-700 border-blue-200">
              New
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}

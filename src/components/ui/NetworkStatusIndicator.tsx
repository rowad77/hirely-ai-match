import { Wifi, WifiOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { offlineQueue } from '@/utils/network-status';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { useEffect, useState } from 'react';

interface NetworkStatusIndicatorProps {
  className?: string;
  showQueueCount?: boolean;
}

export function NetworkStatusIndicator({ 
  className, 
  showQueueCount = true 
}: NetworkStatusIndicatorProps) {
  const { isOnline, syncingQueue } = useNetworkStatus();
  const [queueSize, setQueueSize] = useState(0);
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (!isOnline || syncingQueue) {
      setVisible(true);
    } else {
      // Keep visible for a short time when coming back online
      const timeout = setTimeout(() => {
        if (queueSize === 0) {
          setVisible(false);
        }
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [isOnline, syncingQueue, queueSize]);

  useEffect(() => {
    // Update queue size periodically
    if (showQueueCount) {
      setQueueSize(offlineQueue.getQueueSize());
      
      const interval = setInterval(() => {
        const size = offlineQueue.getQueueSize();
        setQueueSize(size);
        
        // Hide indicator if we're online and queue is empty
        if (isOnline && size === 0 && !syncingQueue) {
          setVisible(false);
        }
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [isOnline, showQueueCount, syncingQueue]);

  if (!visible) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant={isOnline ? "outline" : "destructive"} 
            className={`flex items-center gap-1 transition-all ${className} ${syncingQueue ? 'bg-amber-100' : ''}`}
          >
            {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {isOnline ? (syncingQueue ? 'Syncing' : 'Online') : 'Offline'}
            {queueSize > 0 && (
              <span className={`ml-1 text-xs ${isOnline ? 'bg-amber-200 text-amber-800' : 'bg-gray-200 text-gray-800'} rounded-full px-1.5`}>
                {queueSize}
              </span>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          {!isOnline 
            ? 'You are currently offline. Some features may be limited.' 
            : queueSize > 0 
              ? `Syncing ${queueSize} pending ${queueSize === 1 ? 'action' : 'actions'}` 
              : syncingQueue 
                ? 'Reconnected. Syncing data...'
                : 'Connected'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

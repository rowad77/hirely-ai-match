
import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { subscribeToNetworkStatus } from '@/utils/network-status';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { offlineQueue } from '@/utils/network-status';

interface NetworkStatusIndicatorProps {
  className?: string;
  showQueueCount?: boolean;
}

export function NetworkStatusIndicator({ className, showQueueCount = true }: NetworkStatusIndicatorProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queueSize, setQueueSize] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeToNetworkStatus((online) => {
      setIsOnline(online);
      // Check queue size when network status changes
      if (showQueueCount) {
        setQueueSize(offlineQueue.getQueueSize());
      }
    });
    
    // Update queue size periodically
    if (showQueueCount) {
      const interval = setInterval(() => {
        setQueueSize(offlineQueue.getQueueSize());
      }, 5000);
      
      return () => {
        unsubscribe();
        clearInterval(interval);
      };
    }
    
    return unsubscribe;
  }, [showQueueCount]);

  if (isOnline && queueSize === 0) {
    return null; // Don't show anything when online and no pending actions
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant={isOnline ? "outline" : "destructive"} 
            className={`flex items-center gap-1 ${className}`}
          >
            {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {isOnline ? 'Online' : 'Offline'}
            {queueSize > 0 && isOnline && (
              <span className="ml-1 text-xs bg-amber-200 text-amber-800 rounded-full px-1.5">
                {queueSize}
              </span>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          {isOnline 
            ? (queueSize > 0 ? `Syncing ${queueSize} pending ${queueSize === 1 ? 'action' : 'actions'}` : 'Connected') 
            : 'You are currently offline. Some features may be limited.'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

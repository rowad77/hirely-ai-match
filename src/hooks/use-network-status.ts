
import { useEffect, useState } from 'react';
import { subscribeToNetworkStatus, isOnline as getIsOnline } from '@/utils/network-status';

/**
 * Hook for tracking network connectivity status
 * 
 * @returns Object containing online status and related utilities
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(getIsOnline());
  const [wasOffline, setWasOffline] = useState(false);
  const [syncingQueue, setSyncingQueue] = useState(false);

  useEffect(() => {
    // Subscribe to network status changes
    const unsubscribe = subscribeToNetworkStatus((online) => {
      if (!online) {
        setWasOffline(true);
      } else if (wasOffline) {
        setSyncingQueue(true);
        // Reset syncing status after a delay
        setTimeout(() => setSyncingQueue(false), 3000);
      }
      setIsOnline(online);
    });
    
    return unsubscribe;
  }, [wasOffline]);

  return {
    isOnline,
    wasOffline,
    syncingQueue,
    /**
     * Reset the offline status tracking
     */
    resetOfflineStatus: () => setWasOffline(false),
  };
}

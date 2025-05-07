
/**
 * Utility functions for handling network connectivity status
 */

// Subscribers to network status changes
const subscribers: Array<(online: boolean) => void> = [];

// Check if the browser has navigator.onLine support
const hasOnlineSupport = typeof navigator !== 'undefined' && 'onLine' in navigator;

// Initialize network status monitoring
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => notifySubscribers(true));
  window.addEventListener('offline', () => notifySubscribers(false));
}

/**
 * Notify all subscribers of a network status change
 */
function notifySubscribers(online: boolean): void {
  subscribers.forEach(callback => callback(online));
}

/**
 * Check if the browser is currently online
 */
export function isOnline(): boolean {
  return hasOnlineSupport ? navigator.onLine : true; // Default to true if we can't detect
}

/**
 * Subscribe to network status changes
 * @param callback Function to call when network status changes
 * @returns Unsubscribe function
 */
export function subscribeToNetworkStatus(callback: (online: boolean) => void): () => void {
  subscribers.push(callback);
  
  // Immediately call with current network status
  callback(isOnline());
  
  // Return unsubscribe function
  return () => {
    const index = subscribers.indexOf(callback);
    if (index !== -1) {
      subscribers.splice(index, 1);
    }
  };
}

/**
 * Detect if an error is likely a network connectivity issue
 */
export function isNetworkError(error: unknown): boolean {
  if (!error) return false;
  
  const errorMessage = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  
  return (
    errorMessage.includes('failed to fetch') ||
    errorMessage.includes('network') || 
    errorMessage.includes('connection') ||
    errorMessage.includes('offline') ||
    errorMessage.includes('internet') ||
    errorMessage.includes('timeout') ||
    !isOnline()
  );
}

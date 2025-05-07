
/**
 * Network status utility - Enhanced version with queue support and better detection
 */

// Subscribers to network status changes
const subscribers: Array<(online: boolean) => void> = [];

// Check if the browser has navigator.onLine support
const hasOnlineSupport = typeof navigator !== 'undefined' && 'onLine' in navigator;

// Initialize network status monitoring
if (typeof window !== 'undefined') {
  // Set up base online/offline event listeners
  window.addEventListener('online', () => notifySubscribers(true));
  window.addEventListener('offline', () => notifySubscribers(false));
  
  // Additional network error detection through fetch interception
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    return originalFetch.apply(this, args)
      .catch(error => {
        if (isNetworkError(error) && navigator.onLine) {
          // We're actually offline despite browser reporting online
          notifySubscribers(false);
        }
        throw error;
      });
  };
  
  // Set up periodic connectivity checks if the page is active
  let connectivityCheckInterval: number | null = null;
  
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      // Start periodic checks when the page is visible
      if (!connectivityCheckInterval) {
        connectivityCheckInterval = window.setInterval(checkConnectivity, 30000); // Check every 30 seconds
      }
    } else {
      // Stop checks when the page is hidden
      if (connectivityCheckInterval) {
        window.clearInterval(connectivityCheckInterval);
        connectivityCheckInterval = null;
      }
    }
  });
  
  // Initial connectivity check
  checkConnectivity();
}

/**
 * Perform a lightweight connectivity check
 * This helps detect cases where the browser thinks it's online but can't actually reach the network
 */
async function checkConnectivity() {
  if (!navigator.onLine) return; // Already known to be offline
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    // Use a reliable endpoint that returns a small 204 response
    // Google's connectivity check endpoint is widely used for this purpose
    await fetch('https://www.gstatic.com/generate_204', { 
      method: 'HEAD',
      cache: 'no-store',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    // Successfully fetched, we're definitely online
    notifySubscribers(true);
  } catch (error) {
    // Failed to fetch despite navigator.onLine reporting true
    if (navigator.onLine) {
      console.warn('Connectivity check failed despite browser reporting online status');
      notifySubscribers(false);
    }
  }
}

/**
 * Notify all subscribers of a network status change
 */
function notifySubscribers(online: boolean): void {
  console.log(`Network status changed: ${online ? 'online' : 'offline'}`);
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
    errorMessage.includes('cors') ||
    !isOnline()
  );
}

// Queue for storing failed API requests during offline periods
interface QueuedRequest {
  id: string;
  url: string;
  method: string;
  body?: any;
  headers?: HeadersInit;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

class OfflineQueue {
  private storageKey = 'hirely_offline_queue';
  private queue: QueuedRequest[] = [];
  private isSyncing = false;
  
  constructor() {
    this.loadQueue();
    
    // Process queue when we come back online
    subscribeToNetworkStatus((online) => {
      if (online && this.queue.length > 0 && !this.isSyncing) {
        this.processQueue();
      }
    });
  }
  
  private loadQueue(): void {
    try {
      const storedQueue = localStorage.getItem(this.storageKey);
      if (storedQueue) {
        this.queue = JSON.parse(storedQueue);
      }
    } catch (error) {
      console.error('Failed to load offline queue', error);
      this.queue = [];
    }
  }
  
  private saveQueue(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.queue));
  }
  
  addToQueue(request: Omit<QueuedRequest, 'id' | 'timestamp' | 'retryCount'>): string {
    const id = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const queueItem: QueuedRequest = {
      ...request,
      id,
      timestamp: Date.now(),
      retryCount: 0
    };
    
    this.queue.push(queueItem);
    this.saveQueue();
    
    return id;
  }
  
  async processQueue(): Promise<void> {
    if (this.queue.length === 0 || this.isSyncing) return;
    
    this.isSyncing = true;
    console.log(`Processing offline queue: ${this.queue.length} items`);
    
    // Process each item in the queue
    const currentQueue = [...this.queue];
    const successfulIds: string[] = [];
    
    for (const request of currentQueue) {
      try {
        const response = await fetch(request.url, {
          method: request.method,
          headers: request.headers,
          body: request.body ? JSON.stringify(request.body) : undefined
        });
        
        if (response.ok) {
          successfulIds.push(request.id);
        } else {
          // Increment retry count
          const index = this.queue.findIndex(item => item.id === request.id);
          if (index >= 0) {
            this.queue[index].retryCount++;
            
            // Remove if max retries exceeded
            if (this.queue[index].retryCount >= request.maxRetries) {
              successfulIds.push(request.id);
            }
          }
        }
      } catch (error) {
        console.error(`Failed to process queued request: ${request.id}`, error);
      }
    }
    
    // Remove successful requests from queue
    this.queue = this.queue.filter(item => !successfulIds.includes(item.id));
    this.saveQueue();
    this.isSyncing = false;
  }
  
  getQueueSize(): number {
    return this.queue.length;
  }
  
  clearQueue(): void {
    this.queue = [];
    this.saveQueue();
  }
  
  isProcessing(): boolean {
    return this.isSyncing;
  }
}

// Export singleton instance
export const offlineQueue = new OfflineQueue();

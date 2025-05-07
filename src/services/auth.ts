
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { isNetworkError, subscribeToNetworkStatus } from "@/utils/network-status";

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'candidate' | 'company' | 'owner';
  companyId?: string;
};

// Queue for storing failed auth-related actions during offline periods
interface QueuedAction {
  type: 'login' | 'logout';
  payload?: any;
  timestamp: number;
}

class AuthService {
  private storageKey = 'hirely_user';
  private queueStorageKey = 'hirely_auth_queue';
  private isOnline = navigator.onLine;
  private actionQueue: QueuedAction[] = [];
  
  constructor() {
    // Initialize the queue from localStorage if exists
    try {
      const queueData = localStorage.getItem(this.queueStorageKey);
      if (queueData) {
        this.actionQueue = JSON.parse(queueData);
      }
    } catch (error) {
      console.error('Failed to parse queued actions', error);
      this.actionQueue = [];
    }
    
    // Subscribe to network status changes
    subscribeToNetworkStatus((online) => {
      const wasOffline = !this.isOnline;
      this.isOnline = online;
      
      // If we're coming back online and have queued actions, process them
      if (online && wasOffline && this.actionQueue.length > 0) {
        this.processQueue();
      }
    });
  }
  
  // Process queued actions when coming back online
  private async processQueue(): Promise<void> {
    console.log('Processing queued actions:', this.actionQueue);
    
    if (this.actionQueue.length === 0) return;
    
    // Sort by timestamp (oldest first)
    const sortedQueue = [...this.actionQueue].sort((a, b) => a.timestamp - b.timestamp);
    
    // Process each action
    for (const action of sortedQueue) {
      try {
        if (action.type === 'logout') {
          await this.performLogout();
          toast.success('Completed pending logout');
        }
        // Add other action types as needed
      } catch (error) {
        console.error(`Failed to process queued action: ${action.type}`, error);
      }
    }
    
    // Clear the queue
    this.actionQueue = [];
    localStorage.removeItem(this.queueStorageKey);
  }
  
  // Add an action to the queue
  private queueAction(action: QueuedAction): void {
    this.actionQueue.push(action);
    localStorage.setItem(this.queueStorageKey, JSON.stringify(this.actionQueue));
  }
  
  async getCurrentUser(): Promise<User | null> {
    try {
      // Try to get user from Supabase first
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      
      if (session?.user) {
        const role = session.user.user_metadata.role || 'candidate';
        return {
          id: session.user.id,
          name: session.user.user_metadata.full_name || session.user.email || 'User',
          email: session.user.email || '',
          role: role as 'candidate' | 'company' | 'owner',
          companyId: session.user.user_metadata.company_id
        };
      }
      
      // If Supabase session not found, fall back to local storage
      const userData = localStorage.getItem(this.storageKey);
      if (!userData) return null;
      
      try {
        return JSON.parse(userData) as User;
      } catch (e) {
        console.error('Failed to parse user data', e);
        return null;
      }
    } catch (error) {
      console.error('Error getting current user:', error);
      
      // Fall back to local storage if network error
      if (isNetworkError(error)) {
        const userData = localStorage.getItem(this.storageKey);
        if (userData) {
          try {
            return JSON.parse(userData) as User;
          } catch (e) {
            console.error('Failed to parse user data', e);
          }
        }
      }
      
      return null;
    }
  }

  // This method delegates to Supabase auth, but supports offline-first approach
  async login(email: string, password: string): Promise<User> {
    if (!this.isOnline) {
      throw new Error('You appear to be offline. Please check your internet connection and try again.');
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      if (!data.user) {
        throw new Error('User not found');
      }
      
      const role = data.user.user_metadata.role || 'candidate';
      const user: User = {
        id: data.user.id,
        name: data.user.user_metadata.full_name || data.user.email || 'User',
        email: data.user.email || '',
        role: role as 'candidate' | 'company' | 'owner',
        companyId: data.user.user_metadata.company_id
      };
      
      // Store in localStorage as backup for offline access
      localStorage.setItem(this.storageKey, JSON.stringify(user));
      
      return user;
    } catch (error) {
      // Check for network error
      if (isNetworkError(error)) {
        throw new Error('Network connection issue. Please check your internet connection and try again.');
      }
      throw error;
    }
  }

  // Performs the actual logout operation
  private async performLogout(): Promise<void> {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem(this.storageKey);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // Public logout method with offline support
  logout(): void {
    // Clear local storage immediately for better UX
    localStorage.removeItem(this.storageKey);
    
    // If we're online, perform the logout
    if (this.isOnline) {
      this.performLogout()
        .then(() => {
          toast.success('Logged out successfully');
        })
        .catch(error => {
          console.error('Error during logout:', error);
          toast.error('Error during logout');
        });
    } else {
      // If offline, queue the action
      this.queueAction({
        type: 'logout',
        timestamp: Date.now()
      });
      
      toast.info('You are currently offline. Logout will complete when you reconnect.');
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return !!user;
  }

  async isCompany(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.role === 'company';
  }

  async isCandidate(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.role === 'candidate';
  }

  async isOwner(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.role === 'owner';
  }
}

// Create and export a singleton instance
export const authService = new AuthService();

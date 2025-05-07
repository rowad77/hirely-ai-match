
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { isNetworkError } from "@/utils/network-status";

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'candidate' | 'company' | 'owner';
  companyId?: string;
};

// This service now acts as a backup/fallback for the Supabase auth
// It's kept for backward compatibility but primarily delegates to Supabase
class AuthService {
  private storageKey = 'hirely_user';
  
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

  // This is now a fallback method that primarily delegates to Supabase auth
  // but maintains the same interface for backward compatibility
  login(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      if (!navigator.onLine) {
        reject(new Error('You appear to be offline. Please check your internet connection and try again.'));
        return;
      }
      
      // Delegate to Supabase auth
      supabase.auth.signInWithPassword({
        email,
        password
      }).then(({ data, error }) => {
        if (error) {
          reject(error);
        } else if (data.user) {
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
          resolve(user);
        } else {
          reject(new Error('User not found'));
        }
      }).catch(error => {
        // Check for network error
        if (isNetworkError(error)) {
          reject(new Error('Network connection issue. Please check your internet connection and try again.'));
        } else {
          reject(error);
        }
      });
    });
  }

  logout(): void {
    // Clear local storage
    localStorage.removeItem(this.storageKey);
    
    // Logout from Supabase (this will trigger the auth state change in AuthContext)
    supabase.auth.signOut().then(() => {
      toast.success('Logged out successfully');
    }).catch(error => {
      console.error('Error during logout:', error);
      
      // If we're offline, show appropriate message
      if (isNetworkError(error)) {
        toast.info('You are currently offline. Full logout will occur when you reconnect.');
      } else {
        toast.error('Error during logout');
      }
    });
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

export const authService = new AuthService();

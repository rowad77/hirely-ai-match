
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  
  getCurrentUser(): User | null {
    // Try to get user from Supabase first
    const supabaseUser = supabase.auth.getSession()
      .then(({ data }) => data.session?.user)
      .catch(() => null);
    
    // If Supabase fails, fall back to local storage
    if (!supabaseUser) {
      const userData = localStorage.getItem(this.storageKey);
      if (!userData) return null;
      try {
        return JSON.parse(userData) as User;
      } catch (e) {
        console.error('Failed to parse user data', e);
        return null;
      }
    }
    
    return null;
  }

  // This is now a fallback method that primarily delegates to Supabase auth
  // but maintains the same interface for backward compatibility
  login(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
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
          
          // Store in localStorage as backup
          localStorage.setItem(this.storageKey, JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error('User not found'));
        }
      }).catch(error => {
        reject(error);
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
    });
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  isCompany(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'company';
  }

  isCandidate(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'candidate';
  }

  isOwner(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'owner';
  }
}

export const authService = new AuthService();

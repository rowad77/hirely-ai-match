import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

export type UserProfile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'owner' | 'company' | 'candidate';
  company_id?: string | null;
  approval_status?: 'pending' | 'approved' | 'rejected';
};

type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signOut: () => void; // Added signOut as alias to logout
  isAuthenticated: boolean;
  isCompany: boolean;
  isCandidate: boolean;
  isOwner: boolean;
  isApproved: boolean; 
  isPending: boolean;
  isRejected: boolean;
  userRole: 'owner' | 'company' | 'candidate' | null; // Added userRole
  session: Session | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Fetch user profile data if user is logged in
        if (newSession?.user) {
          // Use setTimeout to prevent potential infinite recursion with Supabase onAuthStateChange
          setTimeout(() => {
            fetchUserProfile(newSession.user.id);
          }, 0);
        } else {
          setProfile(null);
        }

        if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id);
      }
      
      setIsLoading(false);
    }).catch(error => {
      console.error("Error getting session:", error);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (!data) {
        console.error('User profile not found');
        return;
      }

      const userProfile = {
        ...data,
        approval_status: user?.user_metadata?.approval_status || 'approved'
      } as UserProfile;
      
      setProfile(userProfile);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Try to handle network connectivity issues
      if (!navigator.onLine) {
        throw new Error('You appear to be offline. Please check your internet connection and try again.');
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      // Check approval status for company users
      if (data.user?.user_metadata?.role === 'company' && 
          data.user?.user_metadata?.approval_status === 'pending') {
        await logout(); // Log out the user
        throw new Error('Your company account is pending approval. You will be notified when your account is approved.');
      }

      if (data.user?.user_metadata?.role === 'company' && 
          data.user?.user_metadata?.approval_status === 'rejected') {
        await logout(); // Log out the user
        throw new Error('Your company account has been rejected. Please contact support for more information.');
      }

      // Log activity
      if (data.user) {
        try {
          await supabase.rpc('track_activity', {
            p_user_id: data.user.id,
            p_activity_type: 'login',
            p_activity_data: { method: 'email' }
          });
        } catch (activityError) {
          console.error('Failed to track login activity:', activityError);
        }
      }

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Log activity before logout
      if (user) {
        await supabase.rpc('track_activity', {
          p_user_id: user.id,
          p_activity_type: 'logout',
          p_activity_data: {}
        });
      }
      
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Error during logout');
    }
  };
  
  // Determine approval status
  const isApproved = profile?.approval_status === 'approved' || user?.user_metadata?.approval_status === 'approved';
  const isPending = profile?.approval_status === 'pending' || user?.user_metadata?.approval_status === 'pending';
  const isRejected = profile?.approval_status === 'rejected' || user?.user_metadata?.approval_status === 'rejected';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        login,
        logout,
        signOut: logout, // Add signOut as alias to logout
        isAuthenticated: !!user,
        isCompany: profile?.role === 'company',
        isCandidate: profile?.role === 'candidate',
        isOwner: profile?.role === 'owner',
        isApproved,
        isPending,
        isRejected,
        userRole: profile?.role || null, // Add userRole property
        session,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

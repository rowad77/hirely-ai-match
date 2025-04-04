
import { toast } from "sonner";

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'candidate' | 'company';
  companyId?: string;
};

// Mock user data, in a real app this would come from your backend/Supabase
const MOCK_USERS = {
  'company@example.com': {
    id: 'c1',
    name: 'Acme Inc',
    email: 'company@example.com',
    password: 'password',
    role: 'company' as const,
    companyId: 'c1',
  },
  'candidate@example.com': {
    id: 'u1',
    name: 'John Doe',
    email: 'candidate@example.com',
    password: 'password',
    role: 'candidate' as const,
  }
};

class AuthService {
  private storageKey = 'hirely_user';
  
  getCurrentUser(): User | null {
    const userData = localStorage.getItem(this.storageKey);
    if (!userData) return null;
    try {
      return JSON.parse(userData) as User;
    } catch (e) {
      console.error('Failed to parse user data', e);
      return null;
    }
  }

  login(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      // Simulate API call delay
      setTimeout(() => {
        const user = MOCK_USERS[email as keyof typeof MOCK_USERS];
        if (user && user.password === password) {
          // Remove password before storing
          const { password: _, ...userWithoutPassword } = user;
          localStorage.setItem(this.storageKey, JSON.stringify(userWithoutPassword));
          resolve(userWithoutPassword);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 800);
    });
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    // In a real app, you might want to redirect here
    window.location.href = '/login';
    toast.success('Logged out successfully');
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
}

export const authService = new AuthService();


/**
 * Test utilities for component and function testing
 */

// Mock implementations for browser APIs
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string): string => store[key] || null),
    setItem: jest.fn((key: string, value: string): void => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string): void => {
      delete store[key];
    }),
    clear: jest.fn(): void => {
      Object.keys(store).forEach(key => delete store[key]);
    },
    key: jest.fn((index: number): string => Object.keys(store)[index] || null),
    length: jest.fn((): number => Object.keys(store).length)
  };
};

export const mockNavigator = (online = true) => {
  return {
    onLine: online
  };
};

export const mockFetch = (response = {}, options = { ok: true, status: 200 }) => {
  return jest.fn().mockImplementation(() => 
    Promise.resolve({
      ok: options.ok,
      status: options.status,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response))
    })
  );
};

// Mock Supabase client for testing
export const mockSupabase = () => {
  const mockData = { data: null, error: null };
  
  return {
    auth: {
      getSession: jest.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      signInWithPassword: jest.fn(() => Promise.resolve(mockData)),
      signOut: jest.fn(() => Promise.resolve(mockData)),
      onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } }))
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve(mockData)),
          order: jest.fn(() => Promise.resolve(mockData)),
          limit: jest.fn(() => Promise.resolve(mockData))
        })),
        order: jest.fn(() => Promise.resolve(mockData)),
        limit: jest.fn(() => Promise.resolve(mockData))
      })),
      insert: jest.fn(() => Promise.resolve(mockData)),
      update: jest.fn(() => Promise.resolve(mockData)),
      delete: jest.fn(() => Promise.resolve(mockData))
    })),
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(() => Promise.resolve(mockData)),
        download: jest.fn(() => Promise.resolve(mockData))
      }))
    },
    functions: {
      invoke: jest.fn(() => Promise.resolve(mockData))
    }
  };
};

// Helper for waiting in tests
export const waitFor = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

// React Testing Library wrapper types (if needed)
export interface RenderOptions {
  initialRoute?: string;
  mockUser?: any;
  mockJobs?: any[];
}

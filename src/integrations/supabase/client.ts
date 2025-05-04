
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use environment variables for Supabase credentials
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://lckyfjxdnmwhmruvgpwn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxja3lmanhkbm13aG1ydXZncHduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MzY1NzIsImV4cCI6MjA1OTMxMjU3Mn0.wzqFbyCnj0UtQu8085V4Akep4ilTo7hB_acx0sezZuU";

// Create client with better error handling and auth persistence configuration
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage
  }
});

// Error handling wrapper for Supabase queries
export async function handleSupabaseError<T>(
  operation: () => Promise<{ data: T | null; error: any }>
): Promise<T> {
  try {
    const { data, error } = await operation();
    if (error) throw error;
    if (!data) throw new Error('No data returned from Supabase');
    return data;
  } catch (error: any) {
    console.error('Supabase operation failed:', error.message);
    throw new Error(
      `Database operation failed: ${error.message || 'Unknown error'}`
    );
  }
}

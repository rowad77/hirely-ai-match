import { supabase } from '@/integrations/supabase/client';
import { apiCall, ErrorType, ErrorResponse } from './error-handling';

// Generic type for Supabase responses
export interface SupabaseResponse<T> {
  data: T | null;
  error: ErrorResponse | null;
}

// Database query wrapper with proper type handling for dynamic tables
export async function query<T>(
  table: string,
  queryFn: (query: any) => any
): Promise<SupabaseResponse<T>> {
  try {
    const result = await apiCall(async () => {
      // Use any type for the query to allow dynamic table names
      const query = supabase.from(table as any);
      const { data, error } = await queryFn(query);
      
      if (error) throw error;
      return data;
    });
    
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error: error as ErrorResponse };
  }
}

// Function invocation wrapper
export async function invokeFunction<T>(
  functionName: string,
  payload: any
): Promise<SupabaseResponse<T>> {
  try {
    const result = await apiCall(async () => {
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: payload
      });
      
      if (error) throw error;
      return data;
    });
    
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error: error as ErrorResponse };
  }
}

// Storage operations wrapper
export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<SupabaseResponse<{ path: string }>> {
  try {
    const result = await apiCall(async () => {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: true });
      
      if (error) throw error;
      return data;
    });
    
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error: error as ErrorResponse };
  }
}

// Fetch wrapper for data tables with error handling
export async function fetchData<T>(
  table: string,
  options: {
    columns?: string;
    filter?: Record<string, any>;
    order?: { column: string; ascending?: boolean };
    limit?: number;
    page?: number;
  } = {}
): Promise<SupabaseResponse<T[]>> {
  return query<T[]>(table, (query) => {
    let queryBuilder = query.select(options.columns || '*');
    
    // Apply filters
    if (options.filter) {
      Object.entries(options.filter).forEach(([column, value]) => {
        queryBuilder = queryBuilder.eq(column, value);
      });
    }
    
    // Apply ordering
    if (options.order) {
      queryBuilder = queryBuilder.order(
        options.order.column, 
        { ascending: options.order.ascending ?? true }
      );
    }
    
    // Apply pagination
    if (options.limit) {
      queryBuilder = queryBuilder.limit(options.limit);
      
      if (options.page && options.page > 1) {
        const offset = (options.page - 1) * options.limit;
        queryBuilder = queryBuilder.range(offset, offset + options.limit - 1);
      }
    }
    
    return queryBuilder;
  });
}

// Connection status monitoring
let isOffline = false;
const connectionListeners: Array<(online: boolean) => void> = [];

// Initialize connection monitoring
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    isOffline = false;
    notifyConnectionListeners();
  });
  
  window.addEventListener('offline', () => {
    isOffline = true;
    notifyConnectionListeners();
  });
}

function notifyConnectionListeners() {
  connectionListeners.forEach(listener => listener(!isOffline));
}

export function onConnectionChange(listener: (online: boolean) => void) {
  connectionListeners.push(listener);
  
  // Immediately call with current state
  listener(!isOffline);
  
  // Return unsubscribe function
  return () => {
    const index = connectionListeners.indexOf(listener);
    if (index !== -1) {
      connectionListeners.splice(index, 1);
    }
  };
}

export function isOnline(): boolean {
  return !isOffline;
}

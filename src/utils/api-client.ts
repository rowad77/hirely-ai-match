
import { offlineQueue, isNetworkError } from './network-status';
import { ErrorType, processError } from './error-handling';
import { supabase } from '@/integrations/supabase/client';

interface ApiRequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

interface ApiResponse<T> {
  data: T | null;
  error: any | null;
  status: number;
}

const DEFAULT_TIMEOUT = 30000; // 30 seconds
const DEFAULT_RETRIES = 3;
const DEFAULT_RETRY_DELAY = 1000; // 1 second

// Create a timeout promise
const createTimeoutPromise = (ms: number): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request timed out after ${ms}ms`));
    }, ms);
  });
};

// Wait function for retries
const wait = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Main API client function
export async function apiRequest<T = any>(
  url: string,
  config: ApiRequestConfig = {}
): Promise<ApiResponse<T>> {
  const { 
    timeout = DEFAULT_TIMEOUT,
    retries = DEFAULT_RETRIES,
    retryDelay = DEFAULT_RETRY_DELAY,
    ...fetchConfig 
  } = config;

  // Ensure headers object exists
  const headers = new Headers(fetchConfig.headers || {});
  
  // Add common headers
  if (!headers.has('Content-Type') && fetchConfig.method !== 'GET') {
    headers.set('Content-Type', 'application/json');
  }
  
  // Add auth token if logged in
  const { data: sessionData } = await supabase.auth.getSession();
  if (sessionData.session?.access_token) {
    headers.set('Authorization', `Bearer ${sessionData.session.access_token}`);
  }
  
  // Create the final request config
  const requestConfig: RequestInit = {
    ...fetchConfig,
    headers
  };

  // Queue the request if offline
  if (!navigator.onLine) {
    if (fetchConfig.method !== 'GET') {
      const queueId = offlineQueue.addToQueue({
        url,
        method: fetchConfig.method || 'GET',
        body: fetchConfig.body,
        headers: Object.fromEntries(headers.entries()),
        maxRetries: retries
      });
      
      return {
        data: null,
        error: {
          type: ErrorType.NETWORK,
          message: 'You are offline. Request queued for later.',
          userMessage: 'You are offline. We\'ll try again when your connection is restored.',
          retryable: true,
          queueId
        },
        status: 0
      };
    } else {
      return {
        data: null,
        error: {
          type: ErrorType.NETWORK,
          message: 'You are offline',
          userMessage: 'You appear to be offline. Please check your connection and try again.',
          retryable: true
        },
        status: 0
      };
    }
  }

  // Retry logic
  let lastError: any;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Race against timeout
      const fetchPromise = fetch(url, requestConfig);
      const response: Response = await Promise.race([
        fetchPromise,
        createTimeoutPromise(timeout)
      ]);
      
      // Parse response
      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else if (contentType?.includes('text/')) {
        data = await response.text();
      } else {
        data = await response.blob();
      }
      
      // Return the formatted response
      if (response.ok) {
        return {
          data,
          error: null,
          status: response.status
        };
      } else {
        const error = processError({
          status: response.status,
          error: data || response.statusText,
        });
        
        return {
          data: null,
          error,
          status: response.status
        };
      }
    } catch (error) {
      lastError = error;
      
      // Check if we should retry
      const shouldRetry = attempt < retries && (
        error instanceof Error && isNetworkError(error) || 
        (error instanceof Error && error.message.includes('timeout'))
      );
      
      if (shouldRetry) {
        await wait(retryDelay * Math.pow(2, attempt)); // Exponential backoff
        continue;
      }
      
      break;
    }
  }
  
  // If we got here, all retries failed
  const processedError = processError(lastError);
  
  return {
    data: null,
    error: processedError,
    status: 0
  };
}

// Convenience methods
export const api = {
  get: <T = any>(url: string, config?: Omit<ApiRequestConfig, 'method' | 'body'>) => 
    apiRequest<T>(url, { ...config, method: 'GET' }),
    
  post: <T = any>(url: string, body: any, config?: Omit<ApiRequestConfig, 'method' | 'body'>) =>
    apiRequest<T>(url, { ...config, method: 'POST', body: JSON.stringify(body) }),
    
  put: <T = any>(url: string, body: any, config?: Omit<ApiRequestConfig, 'method' | 'body'>) =>
    apiRequest<T>(url, { ...config, method: 'PUT', body: JSON.stringify(body) }),
    
  patch: <T = any>(url: string, body: any, config?: Omit<ApiRequestConfig, 'method' | 'body'>) =>
    apiRequest<T>(url, { ...config, method: 'PATCH', body: JSON.stringify(body) }),
    
  delete: <T = any>(url: string, config?: Omit<ApiRequestConfig, 'method'>) =>
    apiRequest<T>(url, { ...config, method: 'DELETE' }),
};

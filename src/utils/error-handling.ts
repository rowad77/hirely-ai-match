
// Error types for classification
export enum ErrorType {
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  NOT_FOUND = 'not_found',
  SERVER = 'server',
  UNKNOWN = 'unknown'
}

// Error response structure
export interface ErrorResponse {
  type: ErrorType;
  message: string;
  userMessage: string;
  originalError?: any;
  retryable: boolean;
}

// Configuration for API calls
export interface ApiCallConfig {
  maxRetries?: number;
  retryDelay?: number;
  retryStatusCodes?: number[];
  timeout?: number;
}

// Default configuration
const defaultConfig: ApiCallConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  retryStatusCodes: [408, 429, 500, 502, 503, 504],
  timeout: 30000
};

// Main API wrapper function
export async function apiCall<T>(
  fn: () => Promise<T>,
  config: ApiCallConfig = {}
): Promise<T> {
  const finalConfig = { ...defaultConfig, ...config };
  let lastError: any;
  
  for (let attempt = 0; attempt <= finalConfig.maxRetries; attempt++) {
    try {
      // Add timeout to the promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Request timeout'));
        }, finalConfig.timeout);
      });
      
      // Race the actual call against the timeout
      return await Promise.race([fn(), timeoutPromise]);
    } catch (error) {
      lastError = error;
      
      // Determine if we should retry
      const shouldRetry = attempt < finalConfig.maxRetries && isRetryable(error, finalConfig.retryStatusCodes);
      
      if (shouldRetry) {
        // Log retry attempt
        console.warn(`API call failed, retrying (${attempt + 1}/${finalConfig.maxRetries})`, error);
        
        // Wait before retrying (with exponential backoff)
        await new Promise(resolve => setTimeout(resolve, finalConfig.retryDelay * Math.pow(2, attempt)));
        continue;
      }
      
      // If we shouldn't retry, or we've exhausted retries, process the error
      throw processError(error);
    }
  }
  
  // This should never be reached due to the throw in the catch block
  throw processError(lastError);
}

// Helper to determine if an error is retryable
function isRetryable(error: any, retryStatusCodes: number[]): boolean {
  // Network errors are generally retryable
  if (error.message === 'Network Error' || error.message === 'Request timeout') {
    return true;
  }
  
  // Check status code if available
  const statusCode = error.status || (error.response && error.response.status);
  if (statusCode && retryStatusCodes.includes(statusCode)) {
    return true;
  }
  
  return false;
}

// Process and standardize errors
export function processError(error: any): ErrorResponse {
  // Default error response
  const errorResponse: ErrorResponse = {
    type: ErrorType.UNKNOWN,
    message: 'An unexpected error occurred',
    userMessage: 'Something went wrong. Please try again later.',
    originalError: error,
    retryable: false
  };
  
  // Handle Edge Functions errors
  if (error.name === 'FunctionsFetchError' || (error.message && error.message.includes('Edge Function'))) {
    errorResponse.type = ErrorType.NETWORK;
    errorResponse.message = error.message || 'Failed to connect to Edge Function';
    errorResponse.userMessage = 'Unable to connect to the service. Please check your connection and try again.';
    errorResponse.retryable = true;
    return errorResponse;
  }
  
  // Handle Supabase errors
  if (error.error && error.status) {
    errorResponse.message = error.error.message || error.error;
    
    // Classify based on status code
    if (error.status === 401) {
      errorResponse.type = ErrorType.AUTHENTICATION;
      errorResponse.userMessage = 'Your session has expired. Please sign in again.';
    } else if (error.status === 403) {
      errorResponse.type = ErrorType.AUTHORIZATION;
      errorResponse.userMessage = 'You don\'t have permission to perform this action.';
    } else if (error.status === 404) {
      errorResponse.type = ErrorType.NOT_FOUND;
      errorResponse.userMessage = 'The requested resource was not found.';
    } else if (error.status === 422) {
      errorResponse.type = ErrorType.VALIDATION;
      errorResponse.userMessage = 'Please check your input and try again.';
    } else if (error.status >= 500) {
      errorResponse.type = ErrorType.SERVER;
      errorResponse.userMessage = 'We\'re experiencing technical difficulties. Please try again later.';
      errorResponse.retryable = true;
    }
  }
  
  // Handle network errors
  if (error.message === 'Network Error' || error.message === 'Failed to fetch') {
    errorResponse.type = ErrorType.NETWORK;
    errorResponse.message = 'Network connectivity issue';
    errorResponse.userMessage = 'Please check your internet connection and try again.';
    errorResponse.retryable = true;
  }
  
  // Log the error for monitoring
  logError(errorResponse);
  
  return errorResponse;
}

// Log errors for monitoring
function logError(errorResponse: ErrorResponse): void {
  // Basic console logging
  console.error(`[${errorResponse.type}] ${errorResponse.message}`, errorResponse.originalError);
  
  // In a production environment, this could be extended to send errors to a monitoring service
}

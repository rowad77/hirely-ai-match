# Technical Specification: API Error Handling Enhancement

## Overview

This document provides detailed technical specifications for implementing robust API error handling in the Hairly application. This enhancement will standardize error handling across all API calls, improve user experience during failures, and provide better monitoring capabilities.

## Current Implementation

The current error handling in the application is inconsistent across components. For example, in the `ResumeAnalyzer` component:

```typescript
try {
  const { data, error } = await supabase.functions.invoke('analyze-resume', {
    body: { resumeText, userId },
  });

  if (error) throw error;
  
  setAnalysis(data.analysis);
  // Additional logic...
} catch (err) {
  console.error('Error analyzing resume:', err);
  setError('Failed to analyze resume. Please try again later.');
} finally {
  setLoading(false);
}
```

Issues with the current approach:
- No retry mechanism for transient failures
- Generic error messages that don't help users resolve issues
- Inconsistent error handling patterns across components
- Limited error logging for monitoring and debugging

## Proposed Enhancements

### 1. Centralized Error Handling Utility

#### Technical Requirements

- Create a utility that standardizes error handling across all API calls
- Implement retry mechanisms for transient failures
- Provide consistent error classification and messaging
- Include comprehensive logging

#### Implementation Details

Create a new utility file `/src/utils/error-handling.ts` with the following structure:

```typescript
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
function processError(error: any): ErrorResponse {
  // Default error response
  const errorResponse: ErrorResponse = {
    type: ErrorType.UNKNOWN,
    message: 'An unexpected error occurred',
    userMessage: 'Something went wrong. Please try again later.',
    originalError: error,
    retryable: false
  };
  
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
  if (error.message === 'Network Error') {
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
  
  // TODO: Implement more sophisticated logging (e.g., to a monitoring service)
  // This could be extended to send errors to a service like Sentry
}
```

### 2. Supabase API Wrapper

#### Technical Requirements

- Create a wrapper for Supabase API calls that uses the centralized error handling
- Standardize response handling
- Add proper TypeScript typing

#### Implementation Details

Create a new utility file `/src/utils/supabase-api.ts`:

```typescript
import { supabase } from '@/integrations/supabase/client';
import { apiCall, ErrorType, ErrorResponse } from './error-handling';

// Generic type for Supabase responses
export interface SupabaseResponse<T> {
  data: T | null;
  error: ErrorResponse | null;
}

// Database query wrapper
export async function query<T>(
  table: string,
  queryFn: (query: any) => any
): Promise<SupabaseResponse<T>> {
  try {
    const result = await apiCall(async () => {
      const query = supabase.from(table);
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
```

### 3. Error Display Components

#### Technical Requirements

- Create reusable components for displaying errors to users
- Support different error types with appropriate messaging
- Include recovery actions where applicable

#### Implementation Details

Create a new component file `/src/components/ui/ApiErrorMessage.tsx`:

```typescript
import { AlertCircle, WifiOff, Lock, FileQuestion, ServerCrash, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ErrorType, ErrorResponse } from '@/utils/error-handling';

interface ApiErrorMessageProps {
  error: ErrorResponse;
  onRetry?: () => void;
  className?: string;
}

export function ApiErrorMessage({ error, onRetry, className }: ApiErrorMessageProps) {
  // Map error types to icons
  const getIcon = () => {
    switch (error.type) {
      case ErrorType.NETWORK:
        return <WifiOff className="h-4 w-4" />;
      case ErrorType.AUTHENTICATION:
      case ErrorType.AUTHORIZATION:
        return <Lock className="h-4 w-4" />;
      case ErrorType.NOT_FOUND:
        return <FileQuestion className="h-4 w-4" />;
      case ErrorType.SERVER:
        return <ServerCrash className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <Alert variant="destructive" className={className}>
      {getIcon()}
      <AlertTitle>
        {error.type === ErrorType.NETWORK ? 'Connection Error' :
         error.type === ErrorType.AUTHENTICATION ? 'Authentication Error' :
         error.type === ErrorType.AUTHORIZATION ? 'Permission Error' :
         error.type === ErrorType.NOT_FOUND ? 'Not Found' :
         error.type === ErrorType.SERVER ? 'Server Error' :
         error.type === ErrorType.VALIDATION ? 'Validation Error' : 'Error'}
      </AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>{error.userMessage}</p>
        {error.retryable && onRetry && (
          <Button 
            variant="outline" 
            size="sm" 
            className="self-start mt-2 flex items-center gap-1"
            onClick={onRetry}
          >
            <RefreshCw className="h-3 w-3" /> Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
```

## Example Usage

### Refactored ResumeAnalyzer Component

```typescript
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { SimpleBadge } from '@/components/ui/SimpleBadge';
import { useToast } from "@/hooks/use-toast";
import { invokeFunction } from '@/utils/supabase-api';
import { ApiErrorMessage } from '@/components/ui/ApiErrorMessage';
import { ErrorResponse } from '@/utils/error-handling';

interface ResumeAnalyzerProps {
  resumeText: string;
  userId?: string;
}

const ResumeAnalyzer = ({ resumeText, userId }: ResumeAnalyzerProps) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [savedToProfile, setSavedToProfile] = useState(false);
  const { toast } = useToast();

  const analyzeResume = async () => {
    if (!resumeText.trim()) {
      toast({
        title: "No Content",
        description: "Please provide resume content to analyze.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setError(null);
    setSavedToProfile(false);

    const { data, error } = await invokeFunction('analyze-resume', {
      resumeText, 
      userId
    });

    setLoading(false);
    
    if (error) {
      setError(error);
      return;
    }
    
    setAnalysis(data.analysis);

    // If we have structured data and a userId, save to the database
    if (data.structuredData && userId) {
      await saveResumeData(data.structuredData);
      setSavedToProfile(true);
      
      // Track the CV upload activity
      await trackResumeUpload(userId, data.structuredData);
    }
  };

  // Other methods remain the same...

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Resume Analysis
          <SimpleBadge variant="secondary" className="ml-2">AI Powered</SimpleBadge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <ApiErrorMessage 
            error={error} 
            onRetry={analyzeResume} 
            className="mb-4" 
          />
        )}

        {/* Rest of the component remains the same */}
      </CardContent>
    </Card>
  );
};

export default ResumeAnalyzer;
```

## Implementation Plan

### Phase 1: Core Error Handling Utilities

1. Create the error handling utility
2. Implement the Supabase API wrapper
3. Build the error display components

### Phase 2: Component Refactoring

1. Identify and prioritize components with API calls
2. Refactor high-priority components to use the new error handling
3. Update remaining components

### Phase 3: Monitoring and Logging

1. Enhance error logging with additional context
2. Implement error tracking and reporting
3. Add analytics for error frequency and patterns

## Testing Strategy

### Unit Tests

- Test retry mechanism with mock failures
- Test error classification logic
- Test error display components

### Integration Tests

- Test API calls with simulated failures
- Verify error handling in key user flows
- Test recovery mechanisms

## Conclusion

Implementing this standardized API error handling system will significantly improve the reliability and user experience of the Hairly application. By providing consistent error handling, retry mechanisms, and user-friendly error messages, we can reduce user frustration during API failures and improve the overall robustness of the application.
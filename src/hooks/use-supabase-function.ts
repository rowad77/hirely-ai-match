
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ErrorResponse, ErrorType, processError } from '@/utils/error-handling';

// Custom hook for invoking Supabase Edge Functions with better error handling
export function useSupabaseFunction() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorResponse | null>(null);
  
  const invokeFunction = async <T,>(
    functionName: string, 
    payload: any, 
    options?: {
      onSuccess?: (data: T) => void;
      onError?: (error: ErrorResponse) => void;
      showToast?: boolean;
    }
  ): Promise<{ data: T | null; error: ErrorResponse | null }> => {
    const { showToast = true } = options || {};
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Invoking edge function: ${functionName}`, payload);
      
      const { data, error } = await supabase.functions.invoke<T>(functionName, {
        body: payload
      });
      
      if (error) {
        console.error(`Error invoking ${functionName}:`, error);
        const processedError = {
          type: ErrorType.SERVER,
          message: `Failed to invoke ${functionName}`,
          userMessage: `There was a problem connecting to the service. Please try again later.`,
          originalError: error,
          retryable: true
        };
        
        setError(processedError);
        if (options?.onError) options.onError(processedError);
        if (showToast) toast.error(`Error: ${processedError.userMessage}`);
        
        return { data: null, error: processedError };
      }
      
      console.log(`Edge function ${functionName} response:`, data);
      
      if (options?.onSuccess) options.onSuccess(data as T);
      return { data: data as T, error: null };
    } catch (err) {
      console.error(`Exception invoking ${functionName}:`, err);
      
      const processedError = {
        type: ErrorType.NETWORK,
        message: `Failed to send a request to the Edge Function ${functionName}`,
        userMessage: "Couldn't connect to the service. Please check your internet connection and try again.",
        originalError: err,
        retryable: true
      };
      
      setError(processedError);
      if (options?.onError) options.onError(processedError);
      if (showToast) toast.error(`Connection error: ${processedError.userMessage}`);
      
      return { data: null, error: processedError };
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    invokeFunction,
    isLoading,
    error,
    clearError: () => setError(null)
  };
}


import React from 'react';
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

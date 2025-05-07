
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorDisplay } from './error-display';
import { isNetworkError } from '@/utils/network-status';
import { errorTracker } from '@/utils/error-tracking';
import { toast } from 'sonner';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  showToast?: boolean;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

/**
 * A component that catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a graceful fallback UI.
 */
class ErrorBoundary extends Component<Props, State> {
  static defaultProps = {
    showToast: true
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render shows the fallback UI
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Generate a unique error ID for reference
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    this.setState({ errorInfo, errorId });
    
    // Track the error with our error utility
    errorTracker.trackError({
      type: 'render',
      message: error.message || 'Rendering Error',
      stack: error.stack,
      context: {
        componentStack: errorInfo.componentStack,
        errorId
      }
    });
    
    // Show error toast if enabled
    if (this.props.showToast) {
      const isOfflineError = isNetworkError(error);
      
      if (isOfflineError) {
        toast.error('Network connection issue', { 
          description: 'Please check your internet connection and try again.'
        });
      } else {
        toast.error('An unexpected error occurred', { 
          description: errorId ? `Error ID: ${errorId}` : error.message || 'Please try again or contact support if the issue persists.'
        });
      }
    }
    
    // Call the optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  render(): ReactNode {
    const { hasError, error, errorId } = this.state;
    const { children, fallback } = this.props;
    
    if (hasError) {
      if (fallback) {
        return fallback;
      }
      
      // Check if it's a network error
      const isOfflineError = error && isNetworkError(error);
      
      return (
        <ErrorDisplay
          title={isOfflineError ? "Network Connection Issue" : "Something went wrong"}
          description={
            isOfflineError 
              ? "It looks like you're offline or having connection problems." 
              : errorId 
                ? `We've logged this error with ID: ${errorId}` 
                : "The application encountered an unexpected error."
          }
          error={error}
          errorId={errorId}
          retryAction={this.resetError}
        />
      );
    }

    return children;
  }
}

export default ErrorBoundary;

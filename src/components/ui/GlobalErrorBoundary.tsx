
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { toast } from 'sonner';
import { isNetworkError } from '@/utils/network-status';
import { errorTracker } from '@/utils/error-tracking';
import { ErrorDisplay } from './error-boundary/error-display';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

/**
 * Global Error Boundary - catches errors at the application root level
 */
class GlobalErrorBoundary extends Component<Props, State> {
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
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const errorId = `global_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    this.setState({ errorInfo, errorId });
    
    console.error('GlobalErrorBoundary caught an error:', error, errorInfo);
    
    // Track with our error utility
    errorTracker.trackError({
      type: 'render',
      message: `Global Error: ${error.message || 'Unknown error'}`,
      stack: error.stack,
      context: {
        componentStack: errorInfo.componentStack,
        errorId,
        isGlobal: true
      }
    });
    
    // Show toast for better visibility
    const isOfflineError = isNetworkError(error);
    
    if (isOfflineError) {
      toast.error('Network connection issue', { 
        description: 'Please check your internet connection and try again.'
      });
    } else {
      toast.error('An unexpected error occurred', { 
        description: errorId ? 
          `We've logged this error (ID: ${errorId})` : 
          error.message || 'Please try again or contact support if the issue persists.'
      });
    }
    
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
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Check if it's a network error
      const isOfflineError = this.state.error && isNetworkError(this.state.error);
      
      return (
        <ErrorDisplay
          title={isOfflineError ? "Network Connection Issue" : "Something went wrong"}
          description={
            isOfflineError 
              ? "It looks like you're offline or having connection problems." 
              : "The application encountered an unexpected error."
          }
          error={this.state.error}
          errorId={this.state.errorId}
          retryAction={() => {
            this.resetError();
            window.location.href = '/';
          }}
          className="max-w-md mx-auto mt-10"
        />
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;

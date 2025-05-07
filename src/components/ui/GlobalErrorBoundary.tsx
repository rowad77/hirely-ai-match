
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorDisplay } from './error-display';
import { toast } from 'sonner';
import { isNetworkError } from '@/utils/network-status';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    console.error('GlobalErrorBoundary caught an error:', error, errorInfo);
    
    // Show toast for better visibility
    const isOfflineError = isNetworkError(error);
    
    if (isOfflineError) {
      toast.error('Network connection issue', { 
        description: 'Please check your internet connection and try again.'
      });
    } else {
      toast.error('An unexpected error occurred', { 
        description: error.message || 'Please try again or contact support if the issue persists.'
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
      errorInfo: null
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
          retryAction={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;

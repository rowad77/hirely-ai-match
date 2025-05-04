
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="flex flex-col items-center justify-center p-6 bg-destructive/10 rounded-lg border border-destructive/30 text-destructive">
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="mb-4">The application encountered an unexpected error.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-destructive/20 hover:bg-destructive/30 text-destructive rounded-md transition-colors"
          >
            Retry
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div className="mt-4 p-4 bg-destructive/5 rounded-md overflow-auto max-w-full">
              <pre className="text-sm text-destructive whitespace-pre-wrap break-words">
                {this.state.error.toString()}
              </pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

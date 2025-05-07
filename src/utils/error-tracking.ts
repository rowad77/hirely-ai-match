
/**
 * Error tracking utility for monitoring and reporting client-side errors
 */
import { CustomErrorEvent, ErrorTrackingEvent } from '../types/error-types';

class ErrorTracker {
  private errors: ErrorTrackingEvent[] = [];
  private maxErrors = 50;
  private storageKey = 'hirely_error_log';
  
  constructor() {
    this.loadErrors();
    
    // Automatically track unhandled errors
    if (typeof window !== 'undefined') {
      window.addEventListener('error', this.handleGlobalError as EventListener);
      window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
    }
  }
  
  private loadErrors(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.errors = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load stored errors', e);
      this.errors = [];
    }
  }
  
  private saveErrors(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.errors.slice(-this.maxErrors)));
    } catch (e) {
      console.error('Failed to save errors', e);
    }
  }
  
  private handleGlobalError = (event: Event): void => {
    const errorEvent = event as CustomErrorEvent;
    this.trackError({
      type: 'runtime',
      message: errorEvent.message || 'Unknown error',
      stack: errorEvent.error?.stack,
      context: {
        fileName: errorEvent.filename,
        lineNumber: errorEvent.lineno,
        columnNumber: errorEvent.colno
      }
    });
  };
  
  private handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
    const error = event.reason;
    this.trackError({
      type: 'runtime',
      message: error?.message || 'Unhandled Promise rejection',
      stack: error?.stack,
      context: { unhandledRejection: true }
    });
  };
  
  /**
   * Track an error
   */
  trackError({ 
    type, 
    message, 
    stack, 
    context = {} 
  }: {
    type: ErrorTrackingEvent['type'];
    message: string;
    stack?: string;
    context?: Record<string, any>;
  }): void {
    const errorEvent: ErrorTrackingEvent = {
      type,
      message,
      stack,
      context,
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      userId: this.getUserId()
    };
    
    // Add to local array and persist
    this.errors.push(errorEvent);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }
    
    this.saveErrors();
    
    // Also log to console for development/debugging
    console.error(`[${type}] ${message}`, context || '');
    
    // In production, this would send to a monitoring service
    this.reportToMonitoring(errorEvent);
  }
  
  /**
   * Get all tracked errors
   */
  getErrors(): ErrorTrackingEvent[] {
    return [...this.errors];
  }
  
  /**
   * Clear tracked errors
   */
  clearErrors(): void {
    this.errors = [];
    this.saveErrors();
  }
  
  /**
   * Get the current user ID if available
   */
  private getUserId(): string | null {
    try {
      const userData = localStorage.getItem('hirely_user');
      if (userData) {
        const user = JSON.parse(userData);
        return user?.id || null;
      }
    } catch (e) {
      console.error('Failed to get user ID for error tracking', e);
    }
    return null;
  }
  
  /**
   * Report error to monitoring service (placeholder)
   */
  private reportToMonitoring(errorEvent: ErrorTrackingEvent): void {
    // This would send to a monitoring service like Sentry in production
    if (process.env.NODE_ENV === 'production') {
      // Example: send to your monitoring service
      // sendToMonitoringService(errorEvent);
    }
  }
}

// Export singleton instance
export const errorTracker = new ErrorTracker();

/**
 * Track an API error
 */
export function trackApiError(endpoint: string, error: any): void {
  errorTracker.trackError({
    type: 'api',
    message: `API Error: ${endpoint}`,
    context: {
      endpoint,
      status: error.status || 'unknown',
      statusText: error.statusText || 'unknown',
      data: error.data || error.message || error
    }
  });
}

/**
 * Track an authentication error
 */
export function trackAuthError(action: string, error: any): void {
  errorTracker.trackError({
    type: 'auth',
    message: `Auth Error: ${action}`,
    context: {
      action,
      error: error.message || error
    }
  });
}

export function trackNetworkError(context: string, error: any): void {
  errorTracker.trackError({
    type: 'network',
    message: `Network Error: ${context}`,
    context: {
      context,
      error: error.message || error
    }
  });
}

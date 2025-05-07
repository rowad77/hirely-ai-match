
/**
 * Custom error event interface that extends the standard ErrorEvent 
 * with additional properties we need for error tracking
 */
export interface CustomErrorEvent extends Omit<ErrorEvent, 'filename' | 'lineno' | 'colno'> {
  error?: Error;
  filename?: string;
  lineno?: number;
  colno?: number;
  timestamp: number;
  url: string;
}

/**
 * Error tracking event types
 */
export interface ErrorTrackingEvent {
  type: 'api' | 'runtime' | 'render' | 'auth' | 'network' | 'other';
  message: string;
  context?: Record<string, any>;
  stack?: string;
  timestamp: number;
  url: string;
  userId?: string | null;
}


import { ReactNode } from 'react';
import { AlertTriangle, WifiOff, Lock, FileQuestion, ServerCrash, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ErrorDisplayProps {
  title?: string;
  description?: string;
  error?: Error | string | null;
  errorId?: string | null;
  retryAction?: () => void;
  className?: string;
  children?: ReactNode;
  icon?: ReactNode;
}

export function ErrorDisplay({
  title = "Something went wrong",
  description,
  error,
  errorId,
  retryAction,
  className,
  children,
  icon,
}: ErrorDisplayProps) {
  // Determine the appropriate icon based on the error
  const errorIcon = icon || (() => {
    if (!error) return <AlertTriangle className="h-10 w-10" />;
    
    const errorMessage = typeof error === 'string' ? error : error.message;
    const lowerMessage = errorMessage.toLowerCase();
    
    if (lowerMessage.includes('network') || lowerMessage.includes('offline') || lowerMessage.includes('fetch')) {
      return <WifiOff className="h-10 w-10" />;
    } else if (lowerMessage.includes('permission') || lowerMessage.includes('unauthorized') || lowerMessage.includes('auth')) {
      return <Lock className="h-10 w-10" />;
    } else if (lowerMessage.includes('not found')) {
      return <FileQuestion className="h-10 w-10" />;
    } else if (lowerMessage.includes('server')) {
      return <ServerCrash className="h-10 w-10" />;
    }
    
    return <AlertTriangle className="h-10 w-10" />;
  })();

  // Format error message
  let errorMessage = '';
  if (error) {
    errorMessage = typeof error === 'string' ? error : error.message || 'An unexpected error occurred';
  }

  return (
    <motion.div 
      className={cn(
        "rounded-lg border border-red-100 bg-red-50 p-6",
        "shadow-sm dark:border-red-900/50 dark:bg-red-950/30",
        className
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center text-center">
        <motion.div 
          className="text-red-500 mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20 
          }}
        >
          {errorIcon}
        </motion.div>
        
        <motion.h3 
          className="text-lg font-medium text-gray-900 dark:text-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {title}
        </motion.h3>
        
        {description && (
          <motion.p 
            className="mt-2 text-sm text-gray-600 dark:text-gray-300 max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {description}
          </motion.p>
        )}
        
        {errorId && (
          <motion.div 
            className="mt-2 text-xs text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            Error ID: <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">{errorId}</code>
          </motion.div>
        )}
        
        {process.env.NODE_ENV === 'development' && errorMessage && (
          <motion.div 
            className="mt-3 text-sm bg-white dark:bg-gray-800 p-3 rounded border border-red-200 dark:border-red-900/30 max-w-full overflow-auto text-left"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: 0.3 }}
          >
            <code className="text-red-600 dark:text-red-400 whitespace-pre-wrap break-all">{errorMessage}</code>
          </motion.div>
        )}
        
        {children && (
          <motion.div 
            className="mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {children}
          </motion.div>
        )}
        
        {retryAction && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4"
          >
            <Button 
              onClick={retryAction}
              variant="outline"
              className="group"
            >
              <RefreshCw className="h-4 w-4 mr-2 group-hover:animate-spin" />
              Try again
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

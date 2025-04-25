
import { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorDisplayProps {
  title?: string;
  description?: string;
  error?: Error | string;
  retryAction?: () => void;
  className?: string;
  children?: ReactNode;
  icon?: ReactNode;
}

export function ErrorDisplay({
  title = "Something went wrong",
  description,
  error,
  retryAction,
  className,
  children,
  icon = <AlertTriangle className="h-10 w-10" />,
}: ErrorDisplayProps) {
  // Format error message
  let errorMessage = '';
  if (error) {
    errorMessage = typeof error === 'string' ? error : error.message || 'An unexpected error occurred';
  }

  return (
    <div className={cn("rounded-lg border border-red-100 bg-red-50 p-6", className)}>
      <div className="flex flex-col items-center text-center">
        <div className="text-red-500 mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        
        {description && (
          <p className="mt-2 text-sm text-gray-600 max-w-md">
            {description}
          </p>
        )}
        
        {errorMessage && (
          <div className="mt-3 text-sm bg-white p-3 rounded border border-red-200 max-w-full overflow-auto text-left">
            <code className="text-red-600 whitespace-pre-wrap break-all">{errorMessage}</code>
          </div>
        )}
        
        {children && <div className="mt-4">{children}</div>}
        
        {retryAction && (
          <Button 
            onClick={retryAction}
            className="mt-4"
            variant="outline"
          >
            Try again
          </Button>
        )}
      </div>
    </div>
  );
}

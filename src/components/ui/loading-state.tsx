
import { Loader } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = "Loading...", className = "h-64" }: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className} space-y-4`}>
      <Loader className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

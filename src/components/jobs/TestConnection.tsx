
import React, { useState } from 'react';
import { useSupabaseFunction } from '@/hooks/use-supabase-function';
import { Button } from '@/components/ui/button';
import { ApiErrorMessage } from '@/components/ui/ApiErrorMessage';
import { toast } from 'sonner';

interface TestConnectionProps {
  searchQuery: string;
  location: string;
  jobType: string;
  isRemote: boolean;
}

const TestConnection: React.FC<TestConnectionProps> = ({
  searchQuery,
  location,
  jobType,
  isRemote
}) => {
  const { invokeFunction, isLoading, error, clearError } = useSupabaseFunction();
  const [lastTestResult, setLastTestResult] = useState<any>(null);

  const handleTestConnection = async () => {
    if (!searchQuery) {
      toast.error('Please enter a search term to test');
      return;
    }

    clearError();
    setLastTestResult(null);
    
    const payload = {
      search: searchQuery,
      location: location || '',
      job_type: jobType || '',
      remote: isRemote,
      limit: 25,
      is_test: true
    };

    const { data, error } = await invokeFunction('jobspy-bridge', payload, {
      onSuccess: (result) => {
        setLastTestResult(result);
        toast.success('Connection test successful!');
      }
    });
    
    if (!error && data) {
      console.log('Test connection result:', data);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button 
          onClick={handleTestConnection}
          disabled={isLoading || !searchQuery}
          className="bg-green-600 hover:bg-green-700"
        >
          {isLoading ? 'Testing...' : 'Test Connection'}
        </Button>
        {lastTestResult && !error && (
          <span className="text-sm text-green-600">✓ Connection successful</span>
        )}
      </div>
      
      {error && (
        <ApiErrorMessage 
          error={error} 
          onRetry={handleTestConnection}
          className="mt-4"
        />
      )}
      
      {lastTestResult && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <h3 className="text-sm font-medium">Test Results:</h3>
          <pre className="mt-2 text-xs overflow-auto p-2 bg-gray-100 rounded">
            {JSON.stringify(lastTestResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestConnection;

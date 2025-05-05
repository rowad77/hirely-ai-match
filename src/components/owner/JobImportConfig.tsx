
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

const JobImportConfig = () => {
  const { user } = useAuth();
  const [apiUrl, setApiUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  
  useEffect(() => {
    loadConfig();
  }, []);
  
  const loadConfig = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('system_config')
        .select('*')
        .eq('key', 'jobspy_api_config')
        .single();
      
      if (error) throw error;
      
      if (data?.value) {
        setApiUrl(data.value.api_url || '');
        // For security, we don't show the full API key, only a masked version if it exists
        if (data.value.api_key) {
          const maskedKey = data.value.api_key.substring(0, 4) + '**********';
          setApiKey(maskedKey);
        }
      }
    } catch (error) {
      console.error('Error loading config:', error);
      toast.error('Failed to load JobSpy API configuration');
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveConfig = async () => {
    setIsLoading(true);
    try {
      // Only update the API key if it's not masked (i.e., the user has changed it)
      const valueToSave = {
        api_url: apiUrl,
        api_key: apiKey.includes('*') ? undefined : apiKey
      };
      
      const { error } = await supabase
        .from('system_config')
        .update({ 
          value: valueToSave,
          updated_at: new Date().toISOString()
        })
        .eq('key', 'jobspy_api_config');
      
      if (error) throw error;
      
      toast.success('JobSpy API configuration saved successfully');
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('Failed to save JobSpy API configuration');
    } finally {
      setIsLoading(false);
    }
  };
  
  const testConnection = async () => {
    setIsTesting(true);
    try {
      const { data, error } = await supabase.functions.invoke('import-jobspy-jobs', {
        body: {
          test: true,
          search: 'test',
          limit: 1
        },
      });
      
      if (error) throw error;
      
      if (data?.success) {
        toast.success('Successfully connected to JobSpy API');
      } else {
        throw new Error(data?.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      toast.error(`Failed to connect to JobSpy API: ${error.message || 'Unknown error'}`);
    } finally {
      setIsTesting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>JobSpy API Configuration</CardTitle>
        <CardDescription>
          Configure the JobSpy API integration for automated job imports
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-url">API URL</Label>
          <Input 
            id="api-url"
            placeholder="https://api.jobspy.com/v1"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <Input 
            id="api-key"
            type="password"
            placeholder="Enter your JobSpy API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500">
            If you change this field, the API key will be updated. Leave as is to keep the existing key.
          </p>
        </div>
        
        <div className="flex space-x-2 pt-4">
          <Button 
            variant="outline"
            onClick={testConnection}
            disabled={isLoading || isTesting || !apiUrl}
          >
            {isTesting ? 'Testing...' : 'Test Connection'}
          </Button>
          <Button 
            onClick={saveConfig}
            disabled={isLoading || isTesting || !apiUrl}
          >
            {isLoading ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobImportConfig;

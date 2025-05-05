import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, Plus, RefreshCw, Settings } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface JobImportConfigProps {
  onImportComplete?: () => void;
}

type JobSpySource = 'linkedin' | 'indeed' | 'glassdoor';

interface JobSpyConfig {
  api_url: string;
  api_key: string;
  last_update?: string | null;
  active_sources?: JobSpySource[];
}

const JobImportConfig: React.FC<JobImportConfigProps> = ({ onImportComplete }) => {
  const { user } = useAuth();
  const [apiUrl, setApiUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [activeSources, setActiveSources] = useState<JobSpySource[]>(['linkedin', 'indeed', 'glassdoor']);
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('config');
  
  // Import form state
  const [searchTerm, setSearchTerm] = useState('software developer');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [isRemote, setIsRemote] = useState(false);
  const [limit, setLimit] = useState(25);
  const [scheduleName, setScheduleName] = useState('');
  const [cronSchedule, setCronSchedule] = useState('0 0 * * *'); // Default: daily at midnight
  const [scheduleEnabled, setScheduleEnabled] = useState(true);
  
  // Fetch job import schedules
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  
  useEffect(() => {
    loadConfig();
    loadSchedules();
  }, []);
  
  const loadConfig = async () => {
    setIsLoading(true);
    try {
      // Use a direct query with any type to avoid TypeScript errors until the types are updated
      const { data, error } = await supabase
        .from('system_config')
        .select('*')
        .eq('key', 'jobspy_api_config')
        .single();
      
      if (error) throw error;
      
      if (data && data.value) {
        // Fix TypeScript error by casting to the correct type
        const config = data.value as unknown as JobSpyConfig;
        setApiUrl(config.api_url || '');
        setLastUpdate(config.last_update || null);
        
        // For security, we don't show the full API key, only a masked version if it exists
        if (config.api_key) {
          const maskedKey = config.api_key.substring(0, 4) + '**********';
          setApiKey(maskedKey);
        }
        
        if (config.active_sources && Array.isArray(config.active_sources)) {
          setActiveSources(config.active_sources);
        }
      }
    } catch (error) {
      console.error('Error loading config:', error);
      toast.error('Failed to load JobSpy API configuration');
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadSchedules = async () => {
    setLoadingSchedules(true);
    try {
      // Fetch job import schedules
      const { data, error } = await supabase
        .from('job_import_schedules')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setSchedules(data || []);
    } catch (error) {
      console.error('Error loading schedules:', error);
      toast.error('Failed to load job import schedules');
    } finally {
      setLoadingSchedules(false);
    }
  };
  
  const saveConfig = async () => {
    setIsLoading(true);
    try {
      // Only update the API key if it's not masked (i.e., the user has changed it)
      const valueToSave: JobSpyConfig = {
        api_url: apiUrl,
        api_key: apiKey.includes('*') ? undefined : apiKey,
        active_sources: activeSources,
        last_update: lastUpdate
      };
      
      // Remove undefined values
      Object.keys(valueToSave).forEach(key => {
        if (valueToSave[key as keyof JobSpyConfig] === undefined) {
          delete valueToSave[key as keyof JobSpyConfig];
        }
      });
      
      // Use a direct query with any type to avoid TypeScript errors
      const { error } = await supabase
        .from('system_config')
        .update({ 
          value: valueToSave as any, // Cast to any to avoid TypeScript errors
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
          search: searchTerm,
          is_test: true,
          limit: 1
        },
      });
      
      if (error) throw error;
      
      if (data?.success) {
        toast.success('Successfully connected to JobSpy API');
        if (onImportComplete) {
          onImportComplete();
        }
      } else {
        throw new Error(data?.message || 'Unknown error');
      }
    } catch (error: any) {
      console.error('Error testing connection:', error);
      toast.error(`Failed to connect to JobSpy API: ${error.message || 'Unknown error'}`);
    } finally {
      setIsTesting(false);
    }
  };
  
  const handleRunImport = async () => {
    if (!searchTerm) {
      toast.error('Search term is required');
      return;
    }
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('import-jobspy-jobs', {
        body: {
          search: searchTerm,
          location: location || undefined,
          job_type: jobType || undefined,
          remote: isRemote,
          limit: Number(limit)
        },
      });
      
      if (error) throw error;
      
      if (data?.success) {
        toast.success(`Successfully imported ${data.jobsImported} jobs`);
        if (onImportComplete) {
          onImportComplete();
        }
      } else {
        throw new Error(data?.message || 'Unknown error');
      }
    } catch (error: any) {
      console.error('Error importing jobs:', error);
      toast.error(`Failed to import jobs: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSourceToggle = (source: JobSpySource) => {
    setActiveSources(current => {
      if (current.includes(source)) {
        return current.filter(s => s !== source);
      } else {
        return [...current, source];
      }
    });
  };
  
  const handleCreateSchedule = async () => {
    if (!scheduleName) {
      toast.error('Schedule name is required');
      return;
    }
    
    if (!searchTerm) {
      toast.error('Search term is required');
      return;
    }
    
    setIsLoading(true);
    try {
      // Create a new import config first
      const configData = {
        name: scheduleName,
        source_id: 'jobspy', // This should match an ID in job_sources
        parameters: {
          search: searchTerm,
          location: location || undefined,
          job_type: jobType || undefined,
          remote: isRemote,
          limit: Number(limit)
        },
        is_active: true
      };
      
      const { data: configResult, error: configError } = await supabase
        .from('job_import_configs')
        .insert(configData)
        .select('id');
      
      if (configError) throw configError;
      
      if (!configResult || configResult.length === 0) {
        throw new Error('Failed to create job import config');
      }
      
      const configId = configResult[0].id;
      
      // Create the schedule
      const scheduleData = {
        name: scheduleName,
        schedule: cronSchedule,
        job_import_config_id: configId,
        parameters: {
          search: searchTerm,
          location: location || undefined,
          job_type: jobType || undefined,
          remote: isRemote,
          limit: Number(limit)
        },
        is_active: scheduleEnabled,
        created_by: user?.id
      };
      
      const { error: scheduleError } = await supabase
        .from('job_import_schedules')
        .insert(scheduleData);
      
      if (scheduleError) throw scheduleError;
      
      toast.success('Job import schedule created successfully');
      loadSchedules();
      
      // Clear form
      setScheduleName('');
    } catch (error: any) {
      console.error('Error creating schedule:', error);
      toast.error(`Failed to create schedule: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleToggleSchedule = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('job_import_schedules')
        .update({ is_active: !isActive })
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success(`Schedule ${isActive ? 'disabled' : 'enabled'}`);
      loadSchedules();
    } catch (error: any) {
      console.error('Error toggling schedule:', error);
      toast.error(`Failed to update schedule: ${error.message || 'Unknown error'}`);
    }
  };
  
  const handleDeleteSchedule = async (id: string) => {
    try {
      const { error } = await supabase
        .from('job_import_schedules')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Schedule deleted successfully');
      loadSchedules();
    } catch (error: any) {
      console.error('Error deleting schedule:', error);
      toast.error(`Failed to delete schedule: ${error.message || 'Unknown error'}`);
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
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="config">API Configuration</TabsTrigger>
            <TabsTrigger value="import">Run Import</TabsTrigger>
            <TabsTrigger value="schedules">Scheduled Imports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="config">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-url">API URL (Optional)</Label>
                <Input 
                  id="api-url"
                  placeholder="Leave empty for default API URL"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">
                  You can leave this empty to use the default JobSpy API endpoint.
                </p>
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
                  {apiKey.includes('*') 
                    ? "API key is stored. Enter a new key to update." 
                    : "Enter your JobSpy API key. You can get one from https://github.com/speedyapply/JobSpy"}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="data-sources">Data Sources</Label>
                <div className="flex flex-col gap-2">
                  {['linkedin', 'indeed', 'glassdoor'].map((source) => (
                    <div key={source} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`source-${source}`}
                        checked={activeSources.includes(source as JobSpySource)}
                        onCheckedChange={() => handleSourceToggle(source as JobSpySource)}
                        disabled={isLoading}
                      />
                      <Label htmlFor={`source-${source}`} className="capitalize">
                        {source}
                      </Label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Select which job sources to include in imports
                </p>
              </div>
              
              {lastUpdate && (
                <div className="text-sm text-gray-500">
                  Last updated: {new Date(lastUpdate).toLocaleString()}
                </div>
              )}
              
              <div className="flex space-x-2 pt-4">
                <Button 
                  variant="outline"
                  onClick={testConnection}
                  disabled={isLoading || isTesting || (!apiKey && !apiKey.includes('*'))}
                >
                  {isTesting ? 'Testing...' : 'Test Connection'}
                </Button>
                <Button 
                  onClick={saveConfig}
                  disabled={isLoading || isTesting}
                >
                  {isLoading ? 'Saving...' : 'Save Configuration'}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="import">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search-term">Search Term</Label>
                <Input 
                  id="search-term"
                  placeholder="e.g. React Developer"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location (Optional)</Label>
                <Input 
                  id="location"
                  placeholder="e.g. New York or Remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="job-type">Job Type (Optional)</Label>
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="remote-only"
                  checked={isRemote}
                  onCheckedChange={setIsRemote}
                  disabled={isLoading}
                />
                <Label htmlFor="remote-only">Remote Only</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="limit">Results Limit</Label>
                <Input 
                  id="limit"
                  type="number"
                  min={1}
                  max={100}
                  value={limit}
                  onChange={(e) => setLimit(parseInt(e.target.value) || 25)}
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">
                  Maximum number of results to import (1-100)
                </p>
              </div>
              
              <Button 
                onClick={handleRunImport}
                disabled={isLoading || !searchTerm}
                className="w-full"
              >
                {isLoading ? 'Importing...' : 'Run Import Now'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="schedules">
            <div className="space-y-6">
              <div className="border rounded-md p-4 space-y-4">
                <h3 className="font-medium text-lg">Create New Schedule</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="schedule-name">Schedule Name</Label>
                    <Input 
                      id="schedule-name"
                      placeholder="e.g. Daily Developer Jobs"
                      value={scheduleName}
                      onChange={(e) => setScheduleName(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cron-schedule">Schedule (Cron Expression)</Label>
                    <Select value={cronSchedule} onValueChange={setCronSchedule}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select schedule" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0 0 * * *">Daily at midnight</SelectItem>
                        <SelectItem value="0 9 * * *">Daily at 9 AM</SelectItem>
                        <SelectItem value="0 0 * * 1">Weekly on Monday</SelectItem>
                        <SelectItem value="0 0 1 * *">Monthly (1st day)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="enabled"
                      checked={scheduleEnabled}
                      onCheckedChange={setScheduleEnabled}
                      disabled={isLoading}
                    />
                    <Label htmlFor="enabled">Enable Schedule</Label>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      onClick={handleCreateSchedule}
                      disabled={isLoading || !scheduleName || !searchTerm}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Schedule
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2">Existing Schedules</h3>
                {loadingSchedules ? (
                  <div className="text-center py-4">Loading schedules...</div>
                ) : schedules.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No schedules found. Create your first schedule above.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {schedules.map(schedule => (
                      <div 
                        key={schedule.id} 
                        className={`border rounded-md p-3 ${schedule.is_active ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{schedule.name}</h4>
                            <p className="text-sm text-gray-500">
                              {schedule.schedule} {schedule.is_active ? '(Active)' : '(Disabled)'}
                            </p>
                            {schedule.last_run_at && (
                              <p className="text-xs text-gray-500">
                                Last run: {new Date(schedule.last_run_at).toLocaleString()}
                              </p>
                            )}
                          </div>
                          <div className="flex space-x-1">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleToggleSchedule(schedule.id, schedule.is_active)}
                            >
                              {schedule.is_active ? (
                                <X className="h-4 w-4" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDeleteSchedule(schedule.id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-xs mt-1 text-gray-600">
                          Search: {schedule.parameters?.search || 'N/A'}
                          {schedule.parameters?.location && `, Location: ${schedule.parameters.location}`}
                          {schedule.parameters?.job_type && `, Type: ${schedule.parameters.job_type}`}
                          {schedule.parameters?.limit && `, Limit: ${schedule.parameters.limit}`}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export { JobImportConfig };
export default JobImportConfig;

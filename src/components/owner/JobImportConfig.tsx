
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface JobImportConfigProps {
  onImportComplete?: () => void;
}

const JobImportConfig: React.FC<JobImportConfigProps> = ({ onImportComplete }) => {
  const [activeTab, setActiveTab] = useState('manual');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('full-time');
  const [limit, setLimit] = useState(25);
  const [isRemote, setIsRemote] = useState(false);
  const [apiStatus, setApiStatus] = useState<'untested' | 'success' | 'error'>('untested');
  const [apiMessage, setApiMessage] = useState('');

  // Fields for scheduled imports
  const [scheduleName, setScheduleName] = useState('');
  const [cronSchedule, setCronSchedule] = useState('0 0 * * *'); // Default: daily at midnight
  const [scheduleIsActive, setScheduleIsActive] = useState(true);
  
  // Get jobspy config from system_config
  const [apiConfig, setApiConfig] = useState<{
    api_key?: string;
    active_sources?: string[];
    last_update?: string;
  }>({});
  
  // Fetch the API config
  useEffect(() => {
    const fetchApiConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('system_config')
          .select('value')
          .eq('key', 'jobspy_api_config')
          .single();
          
        if (error) {
          console.error('Error fetching API config:', error);
        } else if (data) {
          setApiConfig(data.value);
        }
      } catch (err) {
        console.error('Error fetching API config:', err);
      }
    };
    
    fetchApiConfig();
  }, []);

  const validateForm = () => {
    if (!searchTerm.trim()) {
      toast.error('Search term is required');
      return false;
    }
    
    if (limit < 1 || limit > 100) {
      toast.error('Limit must be between 1 and 100');
      return false;
    }
    
    return true;
  };
  
  const validateScheduleForm = () => {
    if (!scheduleName.trim()) {
      toast.error('Schedule name is required');
      return false;
    }
    
    if (!cronSchedule.trim()) {
      toast.error('Schedule is required');
      return false;
    }
    
    if (!searchTerm.trim()) {
      toast.error('Search term is required');
      return false;
    }
    
    return true;
  };

  const testApiConnection = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    setApiStatus('untested');
    setApiMessage('');
    
    try {
      const { data, error } = await supabase.functions.invoke('jobspy-bridge', {
        body: { 
          search: searchTerm,
          location,
          job_type: jobType,
          remote: isRemote,
          limit,
          is_test: true
        }
      });

      if (error) {
        console.error('Error testing API:', error);
        setApiStatus('error');
        setApiMessage(`Error: ${error.message}`);
        toast.error('API test failed', { description: error.message });
        return;
      }
      
      setApiStatus('success');
      setApiMessage('API connection test successful');
      toast.success('JobSpy API connection test successful');
    } catch (error: any) {
      console.error('Error testing API:', error);
      setApiStatus('error');
      setApiMessage(`Error: ${error.message}`);
      toast.error('API test failed', { description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const runManualImport = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    toast.loading('Starting job import...');
    
    try {
      const { data, error } = await supabase.functions.invoke('jobspy-bridge', {
        body: { 
          search: searchTerm,
          location,
          job_type: jobType,
          remote: isRemote,
          limit
        }
      });

      if (error) {
        console.error('Error running import:', error);
        toast.error('Job import failed', { description: error.message });
        return;
      }
      
      toast.success(`Successfully imported ${data?.jobs?.length || 0} jobs`);
      
      // Call the callback if provided
      if (onImportComplete) {
        onImportComplete();
      }
    } catch (error: any) {
      console.error('Error running import:', error);
      toast.error('Job import failed', { description: error.message });
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveSchedule = async () => {
    if (!validateScheduleForm()) return;
    
    setIsLoading(true);
    
    try {
      // First, create or get the job_import_config
      const configData = {
        name: `JobSpy: ${searchTerm}`,
        source_id: '00000000-0000-0000-0000-000000000000', // Default ID for built-in source
        parameters: {
          search: searchTerm,
          location,
          job_type: jobType,
          remote: isRemote,
          limit
        }
      };
      
      const { data: configInsertData, error: configInsertError } = await supabase
        .from('job_import_configs')
        .insert(configData)
        .select()
        .single();
        
      if (configInsertError) {
        console.error('Error creating job import config:', configInsertError);
        toast.error('Failed to create import configuration');
        return;
      }
      
      // Then create the schedule
      const scheduleData = {
        name: scheduleName,
        schedule: cronSchedule,
        job_import_config_id: configInsertData.id,
        parameters: {
          search: searchTerm,
          location,
          job_type: jobType,
          remote: isRemote,
          limit
        },
        is_active: scheduleIsActive
      };
      
      const { error: scheduleInsertError } = await supabase
        .from('job_import_schedules')
        .insert(scheduleData);
        
      if (scheduleInsertError) {
        console.error('Error creating job import schedule:', scheduleInsertError);
        toast.error('Failed to create import schedule');
        return;
      }
      
      toast.success('Import schedule created successfully');
      
      // Reset form fields
      setScheduleName('');
      
      // Call the callback if provided
      if (onImportComplete) {
        onImportComplete();
      }
    } catch (error: any) {
      console.error('Error saving schedule:', error);
      toast.error('Failed to save schedule', { description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs defaultValue="manual" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="manual">Manual Import</TabsTrigger>
        <TabsTrigger value="schedule">Scheduled Import</TabsTrigger>
      </TabsList>
      
      <TabsContent value="manual" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Import Jobs from JobSpy</CardTitle>
            <CardDescription>
              Manually import jobs from multiple platforms including LinkedIn, Indeed, and more.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Term</Label>
              <Input 
                id="search"
                placeholder="e.g., Software Developer"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location"
                  placeholder="e.g., New York, NY"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="job-type">Job Type</Label>
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger id="job-type">
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-Time</SelectItem>
                    <SelectItem value="part-time">Part-Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="limit">Maximum Jobs to Import</Label>
                <Input 
                  id="limit" 
                  type="number" 
                  min="1" 
                  max="100"
                  value={limit}
                  onChange={(e) => setLimit(parseInt(e.target.value) || 25)}
                />
              </div>
              
              <div className="flex items-center space-x-2 pt-8">
                <Switch 
                  id="remote" 
                  checked={isRemote}
                  onCheckedChange={setIsRemote}
                />
                <Label htmlFor="remote">Remote Only</Label>
              </div>
            </div>
            
            {apiStatus !== 'untested' && (
              <div className={`p-4 rounded-md ${
                apiStatus === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                {apiMessage}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={testApiConnection} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                'Test Connection'
              )}
            </Button>
            
            <Button onClick={runManualImport} disabled={isLoading || apiStatus !== 'success'}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                'Import Jobs'
              )}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="schedule" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Schedule Job Imports</CardTitle>
            <CardDescription>
              Set up recurring job imports based on your search criteria.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="schedule-name">Schedule Name</Label>
              <Input 
                id="schedule-name"
                placeholder="e.g., Daily Software Developer Jobs"
                value={scheduleName}
                onChange={(e) => setScheduleName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cron-schedule">Schedule (Cron Expression)</Label>
              <Select value={cronSchedule} onValueChange={setCronSchedule}>
                <SelectTrigger id="cron-schedule">
                  <SelectValue placeholder="Select schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0 0 * * *">Daily at midnight</SelectItem>
                  <SelectItem value="0 0 * * 1">Weekly (Mondays)</SelectItem>
                  <SelectItem value="0 0 1 * *">Monthly (1st day)</SelectItem>
                  <SelectItem value="0 12 * * *">Daily at noon</SelectItem>
                  <SelectItem value="0 */6 * * *">Every 6 hours</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                Custom cron expressions are supported in format: minute hour day(month) month day(week)
              </p>
            </div>
            
            <div className="space-y-2 pt-4">
              <h3 className="text-lg font-medium">Search Criteria</h3>
              
              <div className="space-y-2">
                <Label htmlFor="schedule-search">Search Term</Label>
                <Input 
                  id="schedule-search"
                  placeholder="e.g., Software Developer"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="schedule-location">Location</Label>
                  <Input 
                    id="schedule-location"
                    placeholder="e.g., New York, NY"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="schedule-job-type">Job Type</Label>
                  <Select value={jobType} onValueChange={setJobType}>
                    <SelectTrigger id="schedule-job-type">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-Time</SelectItem>
                      <SelectItem value="part-time">Part-Time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="schedule-limit">Maximum Jobs to Import</Label>
                  <Input 
                    id="schedule-limit" 
                    type="number" 
                    min="1" 
                    max="100"
                    value={limit}
                    onChange={(e) => setLimit(parseInt(e.target.value) || 25)}
                  />
                </div>
                
                <div className="flex items-center space-x-2 pt-8">
                  <Switch 
                    id="schedule-remote" 
                    checked={isRemote}
                    onCheckedChange={setIsRemote}
                  />
                  <Label htmlFor="schedule-remote">Remote Only</Label>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-4">
                <Switch 
                  id="schedule-active" 
                  checked={scheduleIsActive}
                  onCheckedChange={setScheduleIsActive}
                />
                <Label htmlFor="schedule-active">Active</Label>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={saveSchedule} disabled={isLoading} className="ml-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Schedule'
              )}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default JobImportConfig;

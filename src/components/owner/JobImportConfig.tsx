
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";

interface JobImportConfigProps {
  onImportComplete?: () => void;
}

export const JobImportConfig = ({ onImportComplete }: JobImportConfigProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState({
    site: 'linkedin',
    country: 'united states',
    location: '',
    search_term: '',
    experienceLevel: 'entry level',
    job_type: 'full-time',
    remote: false,
    limit: 10
  });

  const handleImport = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('import-jobspy-jobs', {
        body: config
      });

      if (error) throw error;

      toast({
        title: "Import Successful",
        description: `Successfully imported ${data.jobsImported} jobs`
      });

      if (onImportComplete) {
        onImportComplete();
      }
    } catch (error) {
      console.error('Import failed:', error);
      toast({
        title: "Import Failed",
        description: "There was an error importing jobs. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Jobs Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Job Site</label>
          <Select 
            value={config.site}
            onValueChange={(value) => setConfig(prev => ({ ...prev, site: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a job site" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="indeed">Indeed</SelectItem>
              <SelectItem value="glassdoor">Glassdoor</SelectItem>
              <SelectItem value="ziprecruiter">ZipRecruiter</SelectItem>
              <SelectItem value="monster">Monster</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Search Term</label>
          <Input
            placeholder="Enter job search keywords (e.g., Software Engineer, Data Scientist)"
            value={config.search_term}
            onChange={(e) => setConfig(prev => ({ ...prev, search_term: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Location</label>
          <Input
            placeholder="Enter location (e.g., New York, Remote)"
            value={config.location}
            onChange={(e) => setConfig(prev => ({ ...prev, location: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Experience Level</label>
          <Select 
            value={config.experienceLevel}
            onValueChange={(value) => setConfig(prev => ({ ...prev, experienceLevel: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="entry level">Entry Level</SelectItem>
              <SelectItem value="mid level">Mid Level</SelectItem>
              <SelectItem value="senior level">Senior Level</SelectItem>
              <SelectItem value="director">Director</SelectItem>
              <SelectItem value="executive">Executive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Job Type</label>
          <Select 
            value={config.job_type}
            onValueChange={(value) => setConfig(prev => ({ ...prev, job_type: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select job type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full-Time</SelectItem>
              <SelectItem value="part-time">Part-Time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
              <SelectItem value="temporary">Temporary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Checkbox 
            id="remote" 
            checked={config.remote}
            onCheckedChange={(checked) => 
              setConfig(prev => ({ ...prev, remote: checked === true }))
            }
          />
          <label 
            htmlFor="remote" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Remote jobs only
          </label>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Result Limit</label>
          <Input
            type="number"
            min="1"
            max="100"
            placeholder="Number of jobs to import"
            value={config.limit}
            onChange={(e) => setConfig(prev => ({ ...prev, limit: parseInt(e.target.value) || 10 }))}
          />
        </div>

        <Button 
          onClick={handleImport} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Importing..." : "Import Jobs"}
        </Button>
      </CardContent>
    </Card>
  );
};

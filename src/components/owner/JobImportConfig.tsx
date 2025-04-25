
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    experienceLevel: 'entry level'
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
            </SelectContent>
          </Select>
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
            </SelectContent>
          </Select>
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

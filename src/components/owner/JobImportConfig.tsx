
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from '@/context/LanguageContext';
import { useRtlTextAlign } from '@/lib/rtl-utils';

interface JobImportConfigProps {
  onImportComplete?: () => void;
}

export const JobImportConfig = ({ onImportComplete }: JobImportConfigProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { t, language } = useLanguage();
  const rtlTextAlign = useRtlTextAlign();
  
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
        title: t('success'),
        description: t('import_successful').replace('{count}', data.jobsImported)
      });

      if (onImportComplete) {
        onImportComplete();
      }
    } catch (error) {
      console.error('Import failed:', error);
      toast({
        title: t('error'),
        description: t('import_failed'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className={rtlTextAlign}>{t('import_jobs_config') || 'Import Jobs Configuration'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className={`text-sm font-medium ${rtlTextAlign}`}>{t('job_site') || 'Job Site'}</label>
          <Select 
            value={config.site}
            onValueChange={(value) => setConfig(prev => ({ ...prev, site: value }))}
          >
            <SelectTrigger className={rtlTextAlign}>
              <SelectValue placeholder={t('select_job_site') || "Select a job site"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="indeed">Indeed</SelectItem>
              <SelectItem value="glassdoor">Glassdoor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className={`text-sm font-medium ${rtlTextAlign}`}>{t('location') || 'Location'}</label>
          <Input
            placeholder={t('enter_location') || "Enter location (e.g., New York, Remote)"}
            value={config.location}
            onChange={(e) => setConfig(prev => ({ ...prev, location: e.target.value }))}
            className={rtlTextAlign}
          />
        </div>

        <div className="space-y-2">
          <label className={`text-sm font-medium ${rtlTextAlign}`}>{t('experience_level') || 'Experience Level'}</label>
          <Select 
            value={config.experienceLevel}
            onValueChange={(value) => setConfig(prev => ({ ...prev, experienceLevel: value }))}
          >
            <SelectTrigger className={rtlTextAlign}>
              <SelectValue placeholder={t('select_experience') || "Select experience level"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="entry level">{t('entry_level') || 'Entry Level'}</SelectItem>
              <SelectItem value="mid level">{t('mid_level') || 'Mid Level'}</SelectItem>
              <SelectItem value="senior level">{t('senior_level') || 'Senior Level'}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleImport} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? t('importing') || "Importing..." : t('import_jobs')}
        </Button>
      </CardContent>
    </Card>
  );
};

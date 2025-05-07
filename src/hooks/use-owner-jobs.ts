import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';
import { trackApiError } from '@/utils/error-tracking';

export interface Job extends Omit<Tables<'jobs'>, 'companies'> {
  company_name?: string;
  companies?: {
    name: string;
    [key: string]: any;
  };
}

export const useOwnerJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch jobs with company information
      const { data, error: jobsError } = await supabase
        .from('jobs')
        .select('*, companies(name)')
        .order('posted_date', { ascending: false });

      if (jobsError) {
        throw new Error(jobsError.message);
      }

      // Process the data to flatten the company name
      const processedJobs: Job[] = data?.map(job => {
        const jobWithCompany = { ...job } as Job;
        
        // Extract company name from the nested companies object
        if (jobWithCompany.companies) {
          jobWithCompany.company_name = jobWithCompany.companies.name;
          // Keep the companies property as TypeScript expects it
        }
        
        return jobWithCompany;
      }) || [];
      
      setJobs(processedJobs);
    } catch (err) {
      const error = err as Error;
      setError(error);
      trackApiError('fetchOwnerJobs', error);
      toast.error('Error fetching jobs', { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return { 
    jobs, 
    isLoading: loading, 
    error, 
    refresh: fetchJobs,
    refetchJobs: fetchJobs 
  };
};


import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

export interface Job extends Tables<'jobs'> {
  company_name?: string;
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
        const jobWithCompany = { ...job } as any; // Using any here to allow company_name extraction
        
        // Extract company name from the nested companies object
        if (jobWithCompany.companies) {
          const companiesData = jobWithCompany.companies;
          jobWithCompany.company_name = companiesData.name;
          delete jobWithCompany.companies; // Remove the nested structure
        }
        
        return jobWithCompany as Job;
      }) || [];
      
      setJobs(processedJobs);
    } catch (err) {
      const error = err as Error;
      setError(error);
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

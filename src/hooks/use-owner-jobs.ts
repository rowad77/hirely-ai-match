
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

export const useOwnerJobs = () => {
  const [jobs, setJobs] = useState<Tables<'jobs'>[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('posted_date', { ascending: false });

      if (error) {
        toast.error('Error fetching jobs', { description: error.message });
        setJobs([]);
      } else {
        setJobs(data || []);
      }
    } catch (err) {
      toast.error('Unexpected error', { description: String(err) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const refetchJobs = () => fetchJobs();

  return { jobs, loading, refetchJobs };
};

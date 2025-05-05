
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Job } from '@/pages/Jobs';

export const useJobs = (searchQuery: string | null, currentPage: number, jobsPerPage: number) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);

  // Fetch total job count
  useEffect(() => {
    const fetchTotalJobs = async () => {
      try {
        const { count, error } = await supabase
          .from('jobs')
          .select('*', { count: 'exact', head: true });

        if (error) {
          toast.error('Error fetching total jobs', { description: error.message });
        } else {
          setTotalJobs(count || 0);
        }
      } catch (err) {
        toast.error('Unexpected error', { description: String(err) });
      }
    };

    fetchTotalJobs();
  }, []);

  // Fetch jobs based on current filters and pagination
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from('jobs')
          .select('*')
          .order('posted_date', { ascending: false });

        if (searchQuery) {
          query = query.ilike('title', `%${searchQuery}%`);
        }

        const startIndex = (currentPage - 1) * jobsPerPage;
        const endIndex = startIndex + jobsPerPage - 1;

        const { data, error } = await query.range(startIndex, endIndex);

        if (error) {
          toast.error('Error fetching jobs', { description: error.message });
          setJobs([]);
        } else if (data) {
          // Convert Supabase jobs to our Job interface
          const formattedJobs: Job[] = data.map(job => ({
            id: String(job.id),
            title: job.title,
            company: job.company_id || 'Unknown Company',
            location: job.location || 'Remote',
            type: job.type || 'Full-time',
            salary: job.salary,
            postedDate: new Date(job.posted_date).toLocaleDateString(),
            description: job.description,
            category: job.category || 'Uncategorized'
          }));
          
          setJobs(formattedJobs);
        }
      } catch (err) {
        toast.error('Unexpected error', { description: String(err) });
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [currentPage, jobsPerPage, searchQuery]);

  return { jobs, isLoading, totalJobs };
};

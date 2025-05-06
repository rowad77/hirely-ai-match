
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Job } from '@/pages/Jobs';

export const useJobs = (searchQuery: string | null, currentPage: number, jobsPerPage: number) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Job[]>([]);

  // Fetch total job count
  useEffect(() => {
    const fetchTotalJobs = async () => {
      try {
        const { count, error } = await supabase
          .from('jobs')
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.error('Error fetching total jobs:', error);
          toast.error('Error fetching total jobs', { description: error.message });
        } else {
          setTotalJobs(count || 0);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        toast.error('Unexpected error', { description: String(err) });
      }
    };

    fetchTotalJobs();
  }, []);

  // Fetch available job categories for filtering
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('category')
          .not('category', 'is', null);

        if (error) {
          console.error('Error fetching categories:', error);
        } else if (data) {
          // Extract unique categories
          const uniqueCategories = [...new Set(data.map(job => job.category).filter(Boolean))];
          setCategoryOptions(uniqueCategories as string[]);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // Load recently viewed jobs from local storage
  useEffect(() => {
    const loadRecentlyViewed = () => {
      try {
        const savedItems = localStorage.getItem('recentlyViewedJobs');
        if (savedItems) {
          setRecentlyViewed(JSON.parse(savedItems));
        }
      } catch (err) {
        console.error('Error loading recently viewed jobs:', err);
      }
    };
    
    loadRecentlyViewed();
  }, []);

  // Save job to recently viewed
  const saveToRecentlyViewed = useCallback((job: Job) => {
    try {
      // Get current list
      const current = JSON.parse(localStorage.getItem('recentlyViewedJobs') || '[]');
      
      // Remove if already exists (to move to top)
      const filtered = current.filter((item: Job) => item.id !== job.id);
      
      // Add to beginning of array and limit to 5 items
      const updated = [job, ...filtered].slice(0, 5);
      
      // Save to localStorage
      localStorage.setItem('recentlyViewedJobs', JSON.stringify(updated));
      
      // Update state
      setRecentlyViewed(updated);
    } catch (err) {
      console.error('Error saving recently viewed job:', err);
    }
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
          console.error('Error fetching jobs:', error);
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
          
          // If we have no jobs and this is the first page and we have a search query
          // try to trigger a job import from our simplified JobSpy API
          if (formattedJobs.length === 0 && currentPage === 1 && searchQuery) {
            importJobsFromJobSpy(searchQuery);
          }
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        toast.error('Unexpected error', { description: String(err) });
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [currentPage, jobsPerPage, searchQuery]);
  
  // Function to import jobs from JobSpy API when no results found
  const importJobsFromJobSpy = async (search: string) => {
    try {
      setIsImporting(true);
      toast.info('No jobs found. Searching external sources...', {
        duration: 3000
      });
      
      const { data, error } = await supabase.functions.invoke('jobspy-bridge', {
        body: {
          search: search,
          limit: 10
        }
      });
      
      if (error) {
        console.error('Error importing jobs:', error);
        return;
      }
      
      if (data?.jobs?.length > 0) {
        toast.success(`Found ${data.jobs.length} jobs from external sources!`, {
          description: 'Refresh to see the imported jobs.',
          action: {
            label: 'Refresh Now',
            onClick: () => window.location.reload(),
          },
        });
      } else {
        toast.info('No jobs found from external sources.');
      }
    } catch (err) {
      console.error('Error importing jobs:', err);
    } finally {
      setIsImporting(false);
    }
  };

  return { 
    jobs, 
    isLoading, 
    totalJobs, 
    isImporting,
    categoryOptions,
    recentlyViewed,
    saveToRecentlyViewed
  };
};

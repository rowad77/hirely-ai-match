
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CategoryCount {
  name: string;
  value: number;
}

interface LocationCount {
  name: string;
  value: number;
}

export const useJobMetrics = () => {
  const [categoryCounts, setCategoryCounts] = useState<CategoryCount[]>([]);
  const [locationCounts, setLocationCounts] = useState<LocationCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch all jobs to calculate metrics
        const { data: jobs, error: jobsError } = await supabase
          .from('jobs')
          .select('category, location');
        
        if (jobsError) {
          throw new Error(jobsError.message);
        }
        
        if (jobs) {
          // Process category counts
          const categoryMap = new Map<string, number>();
          jobs.forEach(job => {
            const category = job.category || 'Uncategorized';
            categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
          });
          
          // Sort by count and take top 5
          const sortedCategories = Array.from(categoryMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, value]) => ({ name, value }));
          
          setCategoryCounts(sortedCategories);
          
          // Process location counts
          const locationMap = new Map<string, number>();
          jobs.forEach(job => {
            const location = job.location || 'Remote';
            locationMap.set(location, (locationMap.get(location) || 0) + 1);
          });
          
          // Sort by count and take top 5
          const sortedLocations = Array.from(locationMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, value]) => ({ name, value }));
          
          setLocationCounts(sortedLocations);
        }
      } catch (err: any) {
        console.error('Error fetching job metrics:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMetrics();
  }, []);

  return {
    categoryCounts,
    locationCounts,
    isLoading,
    error
  };
};

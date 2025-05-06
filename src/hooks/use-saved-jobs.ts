
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export function useSavedJobs() {
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  
  // Load saved jobs from Supabase on initial mount
  useEffect(() => {
    async function fetchSavedJobs() {
      if (!isAuthenticated || !user) {
        // If not authenticated, try to get from localStorage as fallback
        const savedJobsString = localStorage.getItem('savedJobs');
        if (savedJobsString) {
          try {
            const parsedJobs = JSON.parse(savedJobsString);
            setSavedJobs(Array.isArray(parsedJobs) ? parsedJobs : []);
          } catch (e) {
            console.error('Error parsing saved jobs:', e);
            setSavedJobs([]);
          }
        }
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('saved_jobs')
          .select('job_id')
          .eq('profile_id', user.id);
          
        if (error) {
          throw error;
        }
        
        const jobIds = data.map(item => item.job_id);
        setSavedJobs(jobIds);
      } catch (error) {
        console.error('Error fetching saved jobs:', error);
        toast.error('Failed to load saved jobs');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchSavedJobs();
  }, [isAuthenticated, user]);
  
  const toggleSavedJob = useCallback(async (jobId: string) => {
    setIsLoading(true);
    
    try {
      if (!isAuthenticated || !user) {
        // If not authenticated, use localStorage
        setSavedJobs(prev => 
          prev.includes(jobId) 
            ? prev.filter(id => id !== jobId) 
            : [...prev, jobId]
        );
        
        // Save to localStorage for non-authenticated users
        const updatedJobs = savedJobs.includes(jobId) 
          ? savedJobs.filter(id => id !== jobId)
          : [...savedJobs, jobId];
        localStorage.setItem('savedJobs', JSON.stringify(updatedJobs));
        
        toast.info('Sign in to save your bookmarks across devices');
        setIsLoading(false);
        return;
      }
      
      if (savedJobs.includes(jobId)) {
        // Remove from saved jobs
        const { error } = await supabase
          .from('saved_jobs')
          .delete()
          .eq('profile_id', user.id)
          .eq('job_id', jobId);
          
        if (error) throw error;
        
        setSavedJobs(prev => prev.filter(id => id !== jobId));
        toast.success('Job removed from saved jobs');
      } else {
        // Add to saved jobs
        const { error } = await supabase
          .from('saved_jobs')
          .insert({
            profile_id: user.id,
            job_id: jobId
          });
          
        if (error) throw error;
        
        setSavedJobs(prev => [...prev, jobId]);
        toast.success('Job saved successfully');
      }
    } catch (error) {
      console.error('Error toggling saved job:', error);
      toast.error('Failed to update saved jobs');
    } finally {
      setIsLoading(false);
    }
  }, [savedJobs, isAuthenticated, user]);
  
  const removeSavedJob = useCallback(async (jobId: string) => {
    setIsLoading(true);
    
    try {
      if (!isAuthenticated || !user) {
        // If not authenticated, use localStorage
        setSavedJobs(prev => prev.filter(id => id !== jobId));
        const updatedJobs = savedJobs.filter(id => id !== jobId);
        localStorage.setItem('savedJobs', JSON.stringify(updatedJobs));
        setIsLoading(false);
        return;
      }
      
      const { error } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('profile_id', user.id)
        .eq('job_id', jobId);
        
      if (error) throw error;
      
      setSavedJobs(prev => prev.filter(id => id !== jobId));
      toast.success('Job removed from saved jobs');
    } catch (error) {
      console.error('Error removing saved job:', error);
      toast.error('Failed to remove saved job');
    } finally {
      setIsLoading(false);
    }
  }, [savedJobs, isAuthenticated, user]);
  
  const isSaved = useCallback((jobId: string) => {
    return savedJobs.includes(jobId);
  }, [savedJobs]);
  
  return {
    savedJobs,
    toggleSavedJob,
    removeSavedJob,
    isSaved,
    isLoading
  };
}

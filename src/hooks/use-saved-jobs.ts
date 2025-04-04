
import { useState, useEffect, useCallback } from 'react';

export function useSavedJobs() {
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  
  // Load saved jobs from localStorage on initial mount
  useEffect(() => {
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
  }, []);
  
  // Save to localStorage whenever savedJobs changes
  useEffect(() => {
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
  }, [savedJobs]);
  
  const toggleSavedJob = useCallback((jobId: number) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId) 
        : [...prev, jobId]
    );
  }, []);
  
  const removeSavedJob = useCallback((jobId: number) => {
    setSavedJobs(prev => prev.filter(id => id !== jobId));
  }, []);
  
  const isSaved = useCallback((jobId: number) => {
    return savedJobs.includes(jobId);
  }, [savedJobs]);
  
  return {
    savedJobs,
    toggleSavedJob,
    removeSavedJob,
    isSaved
  };
}


import { useState, useEffect } from 'react';
import SavedJobsList from '../SavedJobsList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  
  useEffect(() => {
    // Load saved jobs from localStorage
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
  
  useEffect(() => {
    // Save to localStorage whenever savedJobs changes
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
  }, [savedJobs]);
  
  const handleRemoveJob = (id: number) => {
    setSavedJobs(prev => prev.filter(jobId => jobId !== id));
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        <SavedJobsList savedJobIds={savedJobs} onRemove={handleRemoveJob} />
      </CardContent>
    </Card>
  );
};

export default SavedJobs;

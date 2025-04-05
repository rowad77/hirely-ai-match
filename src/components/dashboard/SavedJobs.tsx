
import { useState, useEffect } from 'react';
import SavedJobsList from '../SavedJobsList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSavedJobs } from '@/hooks/use-saved-jobs';

const SavedJobs = () => {
  const { savedJobs, removeSavedJob, isLoading } = useSavedJobs();
  
  const handleRemoveJob = (id: string) => {
    removeSavedJob(id);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        <SavedJobsList 
          savedJobIds={savedJobs} 
          onRemove={handleRemoveJob} 
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};

export default SavedJobs;

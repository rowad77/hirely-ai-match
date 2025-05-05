
import React from 'react';
import JobsGrid from '@/components/jobs/JobsGrid';
import { Job } from '@/pages/Jobs';

interface JobsContainerProps {
  jobs: Job[];
  isLoading: boolean;
  viewMode: 'grid' | 'list';
}

const JobsContainer: React.FC<JobsContainerProps> = ({ jobs, isLoading, viewMode }) => {
  return (
    <div className="lg:col-span-3">
      <JobsGrid 
        jobs={jobs} 
        isLoading={isLoading} 
        viewMode={viewMode} 
        favoriteJobs={[]}
        onFavorite={() => {}}
      />
    </div>
  );
};

export default JobsContainer;

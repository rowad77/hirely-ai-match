
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Job } from '@/pages/Jobs';
import AnimatedJobCard from './AnimatedJobCard';
import JobSearchMetrics from './JobSearchMetrics';
import { LoadingState } from '../ui/loading-state';
import { Button } from '../ui/button';
import { useJobMetrics } from '@/hooks/use-job-metrics';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';

interface EnhancedJobsContainerProps {
  jobs: Job[];
  isLoading: boolean;
  viewMode: 'grid' | 'list';
  recentlyViewed: Job[];
  saveToRecentlyViewed: (job: Job) => void;
}

const EnhancedJobsContainer: React.FC<EnhancedJobsContainerProps> = ({ 
  jobs, 
  isLoading, 
  viewMode,
  recentlyViewed,
  saveToRecentlyViewed
}) => {
  const { categoryCounts, locationCounts, isLoading: metricsLoading } = useJobMetrics();
  const [showMetrics, setShowMetrics] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  if (isLoading) {
    return (
      <div className="col-span-1 lg:col-span-3">
        <LoadingState message="Searching for jobs..." />
      </div>
    );
  }

  return (
    <div className="col-span-1 lg:col-span-3 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">
          {jobs.length === 0 ? 'No jobs found' : 'Available Positions'}
        </h2>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowMetrics(!showMetrics)}
          className="flex items-center gap-1"
        >
          {showMetrics ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Hide Metrics
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              Show Metrics
            </>
          )}
        </Button>
      </div>
      
      <AnimatePresence>
        {showMetrics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <JobSearchMetrics 
              totalJobs={jobs.length}
              categoryCounts={categoryCounts}
              locationCounts={locationCounts}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {recentlyViewed.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-2">Recently Viewed</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentlyViewed.slice(0, isMobile ? 1 : 3).map(job => (
              <AnimatedJobCard 
                key={`recent-${job.id}`} 
                job={job} 
                onSaveToRecentlyViewed={saveToRecentlyViewed}
              />
            ))}
          </div>
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-600">No jobs match your search criteria.</p>
          <Button className="mt-4">Clear Filters</Button>
        </div>
      ) : (
        <div className={`grid ${viewMode === 'grid' ? 
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 
          'grid-cols-1'} gap-4`}
        >
          <AnimatePresence>
            {jobs.map((job) => (
              <motion.div 
                key={job.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AnimatedJobCard job={job} onSaveToRecentlyViewed={saveToRecentlyViewed} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default EnhancedJobsContainer;

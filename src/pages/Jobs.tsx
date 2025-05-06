
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';

// Import components
import SearchHeader from '@/components/jobs/SearchHeader';
import FilterPanel from '@/components/jobs/FilterPanel';
import EnhancedJobsContainer from '@/components/jobs/EnhancedJobsContainer';
import { useJobs } from '@/hooks/use-jobs';

// Define job type for JobsGrid
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string | null;
  postedDate: string;
  description: string;
  category: string;
}

// Define job filter types
export interface JobFilters {
  jobTypes: string[];
  locations: string[];
  salaryRanges: string[];
  categories: string[];
  skills: string[];
  experienceLevels: string[];
  query?: string;
}

export type FilterCounts = {
  jobTypes: number;
  locations: number;
  salaryRanges: number;
  categories: number;
  skills: number;
  experienceLevels: number;
};

const Jobs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(12);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');

  // Filter state for the job search
  const [filters, setFilters] = useState<JobFilters>({
    jobTypes: [],
    locations: [],
    salaryRanges: [],
    categories: [],
    skills: [],
    experienceLevels: [],
    query: searchQuery || ''
  });

  // Fetch jobs using our custom hook
  const { 
    jobs, 
    isLoading, 
    totalJobs, 
    recentlyViewed, 
    saveToRecentlyViewed 
  } = useJobs(searchQuery, currentPage, jobsPerPage);

  useEffect(() => {
    document.title = "Job Listings | SpeedyApply";
  }, []);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleFilterChange = (newFilters: JobFilters) => {
    setFilters(newFilters);
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    const params = new URLSearchParams();
    if (newFilters.query) params.set('q', newFilters.query);
    setSearchParams(params);
  };

  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-white">
              Find Your Dream Job
            </h1>
            <p className="mt-2 text-lg text-white/90">
              Explore thousands of job opportunities and find the perfect fit for your skills and experience.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <SearchHeader 
          query={filters.query} 
          onQueryChange={(query) => setFilters({...filters, query})}
          totalJobs={totalJobs}
          isLoading={isLoading}
        />
        
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <FilterPanel 
            filters={filters}
            onApplyFilters={handleFilterChange}
          />
          
          <EnhancedJobsContainer 
            jobs={jobs}
            isLoading={isLoading}
            viewMode={viewMode}
            recentlyViewed={recentlyViewed}
            saveToRecentlyViewed={saveToRecentlyViewed}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Jobs;

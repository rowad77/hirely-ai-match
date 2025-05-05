
import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import JobFilters, { JobFilters as JobFiltersType } from '@/components/JobFilters';
import JobCard from '@/components/jobs/JobCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Loader2, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

// Import components
import SearchHeader from '@/components/jobs/SearchHeader';
import JobsGrid from '@/components/jobs/JobsGrid';
import ViewModeToggle from '@/components/jobs/ViewModeToggle';
import SavedSearches from '@/components/jobs/SavedSearches';

// Define job type for JobsGrid
export interface Job {
  id: number | string;
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
  query: string;
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
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(12);
  const [totalJobs, setTotalJobs] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');

  useEffect(() => {
    document.title = "Job Listings | SpeedyApply";
  }, []);

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
            id: job.id,
            title: job.title,
            company: job.company_id || 'Unknown Company', // You might want to fetch company names separately
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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

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

  const handleFilterChange = (newFilters: JobFilters) => {
    setFilters(newFilters);
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    const params = new URLSearchParams();
    if (newFilters.query) params.set('q', newFilters.query);
    setSearchParams(params);
  };

  // Calculate counts for active filters
  const filterCounts: FilterCounts = {
    jobTypes: filters.jobTypes.length,
    locations: filters.locations.length,
    salaryRanges: filters.salaryRanges.length,
    categories: filters.categories.length,
    skills: filters.skills.length,
    experienceLevels: filters.experienceLevels.length
  };

  // Add up all filters to get total count
  const totalFilterCount = Object.values(filterCounts).reduce((a, b) => a + b, 0);

  return (
    <MainLayout>
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-gray-900">
              Find Your Dream Job
            </h1>
            <p className="mt-2 text-lg text-gray-600">
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
          <div className="lg:col-span-1 space-y-6">
            <JobFilters
              initialFilters={filters}
              onApplyFilters={handleFilterChange}
              onFilterChange={handleFilterChange}
            />
            
            <div className="hidden lg:block">
              <SavedSearches 
                currentFilters={filters} 
                onApplySearch={handleFilterChange}
              />
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <JobsGrid jobs={jobs} isLoading={isLoading} viewMode={viewMode} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Jobs;

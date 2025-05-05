import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { JobFiltersComponent, JobFilters } from '@/components/JobFilters';
import JobCard from '@/components/jobs/JobCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchData } from '@/utils/supabase-api';
import { ApiErrorMessage } from '@/components/ui/ApiErrorMessage';
import { ErrorResponse, ErrorType } from '@/utils/error-handling';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Define the Job type
interface Job {
  id: string;
  title: string;
  company_id: string;
  location: string;
  type: string;
  description: string;
  posted_date: string;
  is_approved: boolean;
  is_featured: boolean;
  salary: string;
  url: string;
}

// Update only the filters handling section to include skills and experience levels
const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [totalJobs, setTotalJobs] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [filters, setFilters] = useState<JobFilters>({
    jobTypes: [],
    locations: [],
    salaryRanges: [],
    categories: [],
    skills: [], // Initialize skills array
    experienceLevels: [] // Initialize experience levels array
  });

  const [filterCounts, setFilterCounts] = useState({
    jobTypes: 0,
    locations: 0,
    salaryRanges: 0,
    categories: 0,
    skills: 0,
    experienceLevels: 0
  });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Build the filter object based on the current state
      const filter: Record<string, any> = {};
      if (filters.jobTypes && filters.jobTypes.length > 0) {
        filter.type = `in.(${filters.jobTypes.join(',')})`;
      }
      if (filters.locations && filters.locations.length > 0) {
        filter.location = `in.(${filters.locations.join(',')})`;
      }
      if (filters.salaryRanges && filters.salaryRanges.length > 0) {
        // Assuming salaryRanges are strings like '50000-75000'
        const salaryFilters = filters.salaryRanges.map(range => {
          const [min, max] = range.split('-').map(Number);
          return `salary.gte.${min},salary.lte.${max}`;
        }).join(',');
        filter.salary = `or.(${salaryFilters})`;
      }
      if (filters.categories && filters.categories.length > 0) {
        filter.category = `in.(${filters.categories.join(',')})`;
      }
      if (searchTerm) {
        filter.title = `ilike.*${searchTerm}*`;
      }

      // Fetch jobs with filters and pagination
      const { data, error } = await fetchData<Job>('jobs', {
        filter: filter,
        order: { column: 'posted_date', ascending: false },
        limit: limit,
        page: page
      });

      if (error) {
        throw error;
      }

      if (data) {
        setJobs(data);
        // Fetch total count separately (efficiently if your API supports it)
        const { data: allJobs, error: countError } = await fetchData<Job>('jobs', {
          columns: 'id',
          filter: filter
        });

        if (countError) {
          console.error('Error fetching total job count:', countError);
          setTotalJobs(0); // Fallback to 0 if count fails
        } else {
          setTotalJobs(allJobs?.length || 0);
        }
      } else {
        setJobs([]);
        setTotalJobs(0);
      }
    } catch (err: any) {
      setError({
        type: ErrorType.SERVER,
        message: err.message,
        userMessage: 'Failed to fetch jobs. Please try again.',
        retryable: true,
        originalError: err
      });
    } finally {
      setLoading(false);
    }
  }, [filters, limit, page, searchTerm]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleRetry = () => {
    fetchJobs();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    // Update URL with search term
    setSearchParams(params => {
      if (term) {
        params.set('search', term);
      } else {
        params.delete('search');
      }
      return params;
    }, { replace: true });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const totalPages = Math.ceil(totalJobs / limit);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search jobs..."
            className="pl-10"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              Filters
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Filters</DialogTitle>
              <DialogDescription>
                Apply filters to narrow down your job search.
              </DialogDescription>
            </DialogHeader>
            <JobFiltersComponent 
              initialFilters={filters}
              inModal={isFilterModalOpen}
              filterCounts={filterCounts}
              onFilterChange={(newFilters) => setFilters(newFilters)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <ApiErrorMessage
          error={error}
          onRetry={handleRetry}
          className="mb-4"
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: limit }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-40 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          ))
        ) : jobs.length > 0 ? (
          jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No jobs found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalJobs > limit && (
        <div className="flex justify-center mt-8">
          <div className="join">
            <Button
              className="join-item"
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
            >
              «
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <Button
                key={pageNumber}
                className="join-item"
                disabled={page === pageNumber}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </Button>
            ))}
            <Button
              className="join-item"
              disabled={page === totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              »
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;

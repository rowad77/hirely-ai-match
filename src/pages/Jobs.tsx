
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Filter, Briefcase, SearchX, Loader, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import MainLayout from '../components/layout/MainLayout';
import JobFilters, { JobFilters as JobFiltersType } from '@/components/JobFilters';
import { fetchJobs } from '@/data/jobs';
import JobListItem from '@/components/JobListItem';
import SearchHeader from '@/components/jobs/SearchHeader';
import ActiveFilters from '@/components/jobs/ActiveFilters';
import JobsGrid from '@/components/jobs/JobsGrid';
import JobSourceSelector from '@/components/jobs/JobSourceSelector';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import RecentlyViewed from '@/components/jobs/RecentlyViewed';
import ViewModeToggle from '@/components/jobs/ViewModeToggle';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorDisplay } from '@/components/ui/error-display';

const ITEMS_PER_PAGE = 6;

const Jobs = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<JobFiltersType>({
    jobTypes: [],
    locations: [],
    salaryRanges: [],
    categories: [],
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favoriteJobs, setFavoriteJobs] = useState<string[]>([]);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [dataSources, setDataSources] = useState<string[]>(['theirstack', 'firecrawl']);

  const { data: jobs = [], isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['jobs', currentPage, filters, searchTerm, dataSources],
    queryFn: async () => {
      const result = await fetchJobs(currentPage, {
        ...filters,
        search: searchTerm,
        sources: dataSources
      });
      
      if (result.length > 0 && result.some(job => job.source === 'fallback')) {
        setIsUsingFallback(true);
      } else {
        setIsUsingFallback(false);
      }
      
      return result;
    },
    meta: {
      onSettled: (data, error) => {
        if (error) {
          toast({
            title: "Error fetching jobs",
            description: "There was an issue loading jobs. Using fallback data instead.",
            variant: "destructive"
          });
          setIsUsingFallback(true);
        }
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2
  });

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = searchTerm === '' || 
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.description && job.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesJobType = filters.jobTypes.length === 0 || 
        filters.jobTypes.some(type => job.type === type);
      
      const matchesLocation = filters.locations.length === 0 || 
        filters.locations.some(location => job.location?.includes(location));
      
      const matchesCategory = filters.categories.length === 0 ||
        filters.categories.some(category => job.category === category);
      
      const matchesSalary = filters.salaryRanges.length === 0 || 
        filters.salaryRanges.some(range => {
          const jobSalary = job.salary ? parseInt(job.salary.replace(/[^0-9]/g, '')) : 0;
          if (range === "Under $50k") return jobSalary < 50000;
          if (range === "$50k - $100k") return jobSalary >= 50000 && jobSalary < 100000;
          if (range === "$100k - $150k") return jobSalary >= 100000 && jobSalary < 150000;
          if (range === "$150k+") return jobSalary >= 150000;
          return true;
        });
      
      return matchesSearch && matchesJobType && matchesLocation && matchesSalary && matchesCategory;
    });
  }, [searchTerm, filters, jobs]);

  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);

  const currentJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredJobs, currentPage]);

  const handleFilterChange = (newFilters: JobFiltersType) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const toggleFavorite = (jobId: string) => {
    setFavoriteJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId) 
        : [...prev, jobId]
    );

    // Show appropriate toast message
    const isFavorited = !favoriteJobs.includes(jobId);
    toast({
      title: isFavorited ? "Job saved" : "Job removed",
      description: isFavorited ? "Job added to your saved list" : "Job removed from your saved list",
      duration: 2000
    });
  };

  const handleRefetch = () => {
    refetch();
    toast({
      title: "Refreshing jobs",
      description: "Fetching the latest job listings..."
    });
  };

  const jobsBySource = useMemo(() => {
    const grouped = {
      all: filteredJobs,
      recent: filteredJobs.filter(job => {
        const date = job.postedDate?.toLowerCase();
        return date?.includes('today') || date?.includes('yesterday') || date?.includes('day ago');
      }),
      remote: filteredJobs.filter(job => job.remote === true || job.type?.toLowerCase().includes('remote')),
      featured: filteredJobs.filter(job => job.category === 'Engineering' || job.category === 'Design'),
      theirstack: filteredJobs.filter(job => job.source === 'theirstack'),
      firecrawl: filteredJobs.filter(job => job.source === 'firecrawl'),
      fallback: filteredJobs.filter(job => job.source === 'fallback'),
      favorites: filteredJobs.filter(job => favoriteJobs.includes(job.id))
    };
    return grouped;
  }, [filteredJobs, favoriteJobs]);

  // Function to suggest search terms for empty results
  const getSuggestedSearches = () => {
    // Based on filtered conditions, suggest more generic terms
    const suggestions = [];
    
    if (filters.jobTypes.length > 0 || filters.locations.length > 0) {
      suggestions.push("Try removing some filters");
    }
    
    if (searchTerm) {
      suggestions.push("Try using more general keywords");
      // Suggest similar terms or corrections
      if (searchTerm.toLowerCase().includes('develop')) {
        suggestions.push("Try searching for 'engineer' instead");
      }
    }
    
    return suggestions.length > 0 ? suggestions : ["Try different search terms"];
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SearchHeader searchTerm={searchTerm} onSearchChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }} />
        
        <RecentlyViewed />
        
        {isUsingFallback && (
          <Alert className="mb-6 bg-yellow-50 border-yellow-200">
            <AlertTitle className="text-yellow-800">Using Demo Data</AlertTitle>
            <AlertDescription className="text-yellow-700">
              We're currently showing demo job listings because the job API is unavailable. 
              <Button 
                variant="outline" 
                size="sm"
                className="ml-4 bg-white" 
                onClick={() => refetch()}
              >
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
          <JobSourceSelector 
            selectedSources={dataSources}
            onSourceChange={(sources) => {
              setDataSources(sources);
              refetch();
            }}
            onRefresh={handleRefetch}
            isRefreshing={isRefetching}
          />
          
          <div className="flex gap-2 ml-auto">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Filter Jobs</SheetTitle>
                  <SheetDescription>
                    Refine your job search using the filters below
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  <JobFilters onFilterChange={handleFilterChange} inModal={true} />
                </div>
              </SheetContent>
            </Sheet>
            
            <ViewModeToggle 
              viewMode={viewMode} 
              onViewModeChange={setViewMode} 
            />
          </div>
        </div>
        
        <ActiveFilters filters={filters} onFilterChange={handleFilterChange} />
        
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center p-12 bg-gray-50 rounded-lg">
            <div className="text-center">
              <Loader className="animate-spin h-8 w-8 mx-auto text-hirely mb-4" />
              <p className="text-gray-600">Loading jobs...</p>
              <p className="text-sm text-gray-500">This may take a moment</p>
            </div>
          </div>
        ) : error ? (
          <ErrorDisplay
            title="Error loading jobs"
            description="We encountered a problem while fetching job listings."
            error={error instanceof Error ? error : "Unknown error occurred"}
            retryAction={() => refetch()}
            icon={<AlertTriangle className="h-10 w-10" />}
          >
            <p className="text-sm text-gray-600">
              We're showing demo job listings instead. You can try again or browse our sample listings.
            </p>
          </ErrorDisplay>
        ) : (
          <>
            <Tabs defaultValue="all" className="mb-6">
              <TabsList className="mb-4 flex overflow-x-auto hide-scrollbar">
                <TabsTrigger value="all">All Jobs</TabsTrigger>
                <TabsTrigger value="recent">Recently Added</TabsTrigger>
                <TabsTrigger value="remote">Remote Jobs</TabsTrigger>
                <TabsTrigger value="featured">Featured</TabsTrigger>
                {jobsBySource.theirstack.length > 0 && (
                  <TabsTrigger value="theirstack">API Jobs</TabsTrigger>
                )}
                {jobsBySource.firecrawl.length > 0 && (
                  <TabsTrigger value="firecrawl">Web Scraped</TabsTrigger>
                )}
                {favoriteJobs.length > 0 && (
                  <TabsTrigger value="favorites">Saved Jobs ({favoriteJobs.length})</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="all">
                {renderJobList(jobsBySource.all)}
              </TabsContent>
              <TabsContent value="recent">
                {renderJobList(jobsBySource.recent)}
              </TabsContent>
              <TabsContent value="remote">
                {renderJobList(jobsBySource.remote)}
              </TabsContent>
              <TabsContent value="featured">
                {renderJobList(jobsBySource.featured)}
              </TabsContent>
              {jobsBySource.theirstack.length > 0 && (
                <TabsContent value="theirstack">
                  {renderJobList(jobsBySource.theirstack)}
                </TabsContent>
              )}
              {jobsBySource.firecrawl.length > 0 && (
                <TabsContent value="firecrawl">
                  {renderJobList(jobsBySource.firecrawl)}
                </TabsContent>
              )}
              {favoriteJobs.length > 0 && (
                <TabsContent value="favorites">
                  {renderJobList(jobsBySource.favorites)}
                </TabsContent>
              )}
            </Tabs>
          </>
        )}
      </div>
    </MainLayout>
  );
  
  function renderJobList(jobs: any[]) {
    if (jobs.length === 0) {
      return (
        <EmptyState
          icon={<SearchX className="h-12 w-12" />}
          title="No jobs found"
          description={
            searchTerm || Object.values(filters).some(f => Array.isArray(f) && f.length > 0)
              ? "Try adjusting your search terms or filters"
              : "There are currently no jobs in this category"
          }
          action={
            (searchTerm || Object.values(filters).some(f => Array.isArray(f) && f.length > 0))
              ? {
                  label: "Clear filters",
                  onClick: () => {
                    setSearchTerm("");
                    setFilters({
                      jobTypes: [],
                      locations: [],
                      salaryRanges: [],
                      categories: [],
                    });
                  },
                }
              : undefined
          }
        >
          <div className="mt-4 text-sm text-gray-500">
            <p>Suggestions:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              {getSuggestedSearches().map((suggestion, i) => (
                <li key={i}>{suggestion}</li>
              ))}
            </ul>
          </div>
        </EmptyState>
      );
    }
    
    const displayJobs = jobs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    
    return (
      <>
        {viewMode === 'grid' ? (
          <JobsGrid 
            jobs={displayJobs}
            favoriteJobs={favoriteJobs}
            onFavorite={toggleFavorite}
          />
        ) : (
          <div className="space-y-4">
            {displayJobs.map(job => (
              <JobListItem 
                key={job.id} 
                job={job} 
                onFavorite={toggleFavorite}
                isFavorite={favoriteJobs.includes(job.id)} 
              />
            ))}
          </div>
        )}
        
        {Math.ceil(jobs.length / ITEMS_PER_PAGE) > 1 && (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.ceil(jobs.length / ITEMS_PER_PAGE) }).map((_, index) => {
                const pageNumber = index + 1;
                if (
                  pageNumber === 1 || 
                  pageNumber === Math.ceil(jobs.length / ITEMS_PER_PAGE) || 
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink 
                        onClick={() => setCurrentPage(pageNumber)}
                        isActive={currentPage === pageNumber}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                
                if (
                  (pageNumber === 2 && currentPage > 3) ||
                  (pageNumber === Math.ceil(jobs.length / ITEMS_PER_PAGE) - 1 && currentPage < Math.ceil(jobs.length / ITEMS_PER_PAGE) - 2)
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                
                return null;
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(jobs.length / ITEMS_PER_PAGE)))}
                  className={currentPage >= Math.ceil(jobs.length / ITEMS_PER_PAGE) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </>
    );
  }
};

export default Jobs;

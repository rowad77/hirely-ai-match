import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Filter, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import MainLayout from '../components/layout/MainLayout';
import JobFilters, { JobFilters as JobFiltersType } from '@/components/JobFilters';
import { fetchJobs } from '@/data/jobs';
import JobListItem from '@/components/JobListItem';
import SearchHeader from '@/components/jobs/SearchHeader';
import ActiveFilters from '@/components/jobs/ActiveFilters';
import JobsGrid from '@/components/jobs/JobsGrid';

const ITEMS_PER_PAGE = 6;

const Jobs = () => {
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

  const { data: jobs = [], isLoading, error } = useQuery({
    queryKey: ['jobs', currentPage, filters, searchTerm],
    queryFn: () => fetchJobs(currentPage, {
      ...filters,
      search: searchTerm
    })
  });

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.description && job.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesJobType = filters.jobTypes.length === 0 || 
        filters.jobTypes.some(type => job.type === type);
      
      const matchesLocation = filters.locations.length === 0 || 
        filters.locations.some(location => job.location === location);
      
      const matchesCategory = filters.categories.length === 0 ||
        filters.categories.some(category => job.category === category);
      
      const matchesSalary = filters.salaryRanges.length === 0 || 
        filters.salaryRanges.some(range => {
          const jobSalary = parseInt(job.salary.replace(/[^0-9]/g, ''));
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
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SearchHeader searchTerm={searchTerm} onSearchChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }} />
        
        <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
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
            
            <div className="flex border rounded-md overflow-hidden">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'outline'} 
                className={`rounded-none ${viewMode === 'grid' ? 'bg-hirely hover:bg-hirely-dark' : ''}`}
                onClick={() => setViewMode('grid')}
                size="sm"
              >
                Grid
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'outline'} 
                className={`rounded-none ${viewMode === 'list' ? 'bg-hirely hover:bg-hirely-dark' : ''}`}
                onClick={() => setViewMode('list')}
                size="sm"
              >
                List
              </Button>
            </div>
          </div>
        </div>
        
        <ActiveFilters filters={filters} onFilterChange={handleFilterChange} />
        
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Card key={n} className="animate-pulse">
                <CardHeader className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-xl font-medium text-gray-900">Error loading jobs</h3>
            <p className="mt-2 text-gray-600">Please try again later</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        ) : (
          <>
            <Tabs defaultValue="all" className="mb-6">
              <TabsList>
                <TabsTrigger value="all">All Jobs</TabsTrigger>
                <TabsTrigger value="recent">Recently Added</TabsTrigger>
                <TabsTrigger value="remote">Remote Jobs</TabsTrigger>
                <TabsTrigger value="featured">Featured</TabsTrigger>
                {favoriteJobs.length > 0 && (
                  <TabsTrigger value="favorites">Saved Jobs ({favoriteJobs.length})</TabsTrigger>
                )}
              </TabsList>
            </Tabs>
            
            {currentJobs.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-xl font-medium text-gray-900">No jobs found</h3>
                <p className="mt-2 text-gray-600">Try adjusting your search or filters</p>
              </div>
            ) : viewMode === 'grid' ? (
              <JobsGrid 
                jobs={currentJobs}
                favoriteJobs={favoriteJobs}
                onFavorite={toggleFavorite}
              />
            ) : (
              <div className="space-y-4">
                {currentJobs.map(job => (
                  <JobListItem 
                    key={job.id} 
                    job={job} 
                    onFavorite={toggleFavorite}
                    isFavorite={favoriteJobs.includes(job.id)} 
                  />
                ))}
              </div>
            )}
            
            {totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNumber = index + 1;
                    if (
                      pageNumber === 1 || 
                      pageNumber === totalPages || 
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
                      (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
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
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Jobs;


import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building, MapPin, Clock, DollarSign, Search, Briefcase, Filter, Heart } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { featuredJobs } from '@/data/jobs';
import JobFilters, { JobFilters as JobFiltersType } from '@/components/JobFilters';
import { Badge } from '@/components/ui/badge';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 6; // Number of jobs to display per page

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<JobFiltersType>({
    jobTypes: [],
    locations: [],
    salaryRanges: [],
    categories: [], // Add categories to filters
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [favoriteJobs, setFavoriteJobs] = useState<number[]>([]);
  
  // Filter jobs based on all criteria
  const filteredJobs = useMemo(() => {
    return featuredJobs.filter(job => {
      // Text search filter
      const matchesSearch = 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Job type filter
      const matchesJobType = filters.jobTypes.length === 0 || 
        filters.jobTypes.some(type => job.type === type);
      
      // Location filter
      const matchesLocation = filters.locations.length === 0 || 
        filters.locations.some(location => job.location === location);
      
      // Category filter
      const matchesCategory = filters.categories.length === 0 ||
        filters.categories.some(category => job.category === category);
      
      // Salary range filter (simplified implementation)
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
  }, [searchTerm, filters]);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  
  // Get current page's jobs
  const currentJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredJobs, currentPage]);
  
  const handleFilterChange = (newFilters: JobFiltersType) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };
  
  const toggleFavorite = (jobId: number) => {
    setFavoriteJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId) 
        : [...prev, jobId]
    );
  };
  
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Find Your Dream Job</h1>
          <p className="mt-4 text-xl text-gray-600">
            Browse through our current openings and discover your perfect career opportunity
          </p>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by title, company, location or keywords..."
              className="pl-10 py-6"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when search changes
              }}
            />
          </div>
          <div className="flex gap-2">
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
        
        {/* Applied Filters */}
        {(filters.jobTypes.length > 0 || filters.locations.length > 0 || filters.salaryRanges.length > 0 || filters.categories.length > 0) && (
          <div className="mb-6 flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-500 mr-2">Active filters:</span>
            {filters.jobTypes.map(type => (
              <Badge key={type} variant="secondary" className="flex items-center gap-1">
                {type}
                <button 
                  className="ml-1" 
                  onClick={() => handleFilterChange({...filters, jobTypes: filters.jobTypes.filter(t => t !== type)})}
                >
                  ×
                </button>
              </Badge>
            ))}
            {filters.locations.map(location => (
              <Badge key={location} variant="secondary" className="flex items-center gap-1">
                {location}
                <button 
                  className="ml-1" 
                  onClick={() => handleFilterChange({...filters, locations: filters.locations.filter(l => l !== location)})}
                >
                  ×
                </button>
              </Badge>
            ))}
            {filters.salaryRanges.map(range => (
              <Badge key={range} variant="secondary" className="flex items-center gap-1">
                {range}
                <button 
                  className="ml-1" 
                  onClick={() => handleFilterChange({...filters, salaryRanges: filters.salaryRanges.filter(r => r !== range)})}
                >
                  ×
                </button>
              </Badge>
            ))}
            {filters.categories.map(category => (
              <Badge key={category} variant="secondary" className="flex items-center gap-1">
                {category}
                <button 
                  className="ml-1" 
                  onClick={() => handleFilterChange({...filters, categories: filters.categories.filter(c => c !== category)})}
                >
                  ×
                </button>
              </Badge>
            ))}
            <Button 
              variant="link" 
              size="sm" 
              className="text-hirely"
              onClick={() => handleFilterChange({
                jobTypes: [],
                locations: [],
                salaryRanges: [],
                categories: [],
              })}
            >
              Clear all
            </Button>
          </div>
        )}
        
        {/* Job Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
          </p>
        </div>
        
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-xl font-medium text-gray-900">No jobs found</h3>
            <p className="mt-2 text-gray-600">Try adjusting your search or browse all jobs</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchTerm('');
                setFilters({
                  jobTypes: [],
                  locations: [],
                  salaryRanges: [],
                  categories: [],
                });
              }}
            >
              Clear All Filters
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
            
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentJobs.map(job => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e) => {
                            e.preventDefault();
                            toggleFavorite(job.id);
                          }}
                          className="text-gray-400 hover:text-hirely"
                        >
                          <Heart 
                            className={`h-5 w-5 ${favoriteJobs.includes(job.id) ? 'fill-hirely text-hirely' : ''}`} 
                          />
                        </Button>
                      </div>
                      <div className="flex items-center text-gray-500 mt-2">
                        <Building className="h-4 w-4 mr-2" />
                        <span>{job.company}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="flex flex-col gap-2 text-gray-500 text-sm">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{job.type} • {job.postedDate}</span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2" />
                          <span>{job.salary}</span>
                        </div>
                        <Badge className="w-fit mt-2">{job.category}</Badge>
                        <p className="mt-4 text-gray-600 line-clamp-3">{job.description}</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link to={`/job/${job.id}`} className="w-full">
                        <Button className="w-full bg-hirely hover:bg-hirely-dark">
                          View Details
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {currentJobs.map(job => (
                  <Card key={job.id} className="hover:shadow-md transition-shadow">
                    <div className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center">
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="text-lg font-medium">{job.title}</h3>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => {
                              e.preventDefault();
                              toggleFavorite(job.id);
                            }}
                            className="text-gray-400 hover:text-hirely"
                          >
                            <Heart 
                              className={`h-5 w-5 ${favoriteJobs.includes(job.id) ? 'fill-hirely text-hirely' : ''}`} 
                            />
                          </Button>
                        </div>
                        <div className="flex items-center text-gray-500 mt-1">
                          <Building className="h-4 w-4 mr-1" />
                          <span className="mr-3">{job.company}</span>
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-sm">
                          <Badge variant="outline">{job.type}</Badge>
                          <Badge>{job.category}</Badge>
                          <span className="text-gray-500">{job.postedDate}</span>
                          <span className="text-hirely font-medium">{job.salary}</span>
                        </div>
                      </div>
                      <Link to={`/job/${job.id}`}>
                        <Button className="whitespace-nowrap bg-hirely hover:bg-hirely-dark">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            
            {/* Pagination */}
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
                    // Show first page, last page, and pages around current page
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
                    
                    // Show ellipsis
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

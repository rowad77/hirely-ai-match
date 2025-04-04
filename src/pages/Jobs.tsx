
import { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building, MapPin, Clock, DollarSign, Search } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { featuredJobs } from '@/data/jobs';
import JobFilters, { JobFilters as JobFiltersType } from '@/components/JobFilters';

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<JobFiltersType>({
    jobTypes: [],
    locations: [],
    salaryRanges: [],
  });
  
  const filteredJobs = featuredJobs.filter(job => {
    // Text search filter
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Job type filter
    const matchesJobType = filters.jobTypes.length === 0 || 
      filters.jobTypes.some(type => job.type === type);
    
    // Location filter
    const matchesLocation = filters.locations.length === 0 || 
      filters.locations.some(location => job.location === location);
    
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
    
    return matchesSearch && matchesJobType && matchesLocation && matchesSalary;
  });
  
  const handleFilterChange = (newFilters: JobFiltersType) => {
    setFilters(newFilters);
  };
  
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Job Listings</h1>
          <p className="mt-4 text-xl text-gray-600">
            Browse through our current openings and find your perfect role
          </p>
        </div>
        
        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by title, company or location..."
              className="pl-10 py-6"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <JobFilters onFilterChange={handleFilterChange} />
        
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600">Try adjusting your search or browse all jobs</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchTerm('');
                setFilters({
                  jobTypes: [],
                  locations: [],
                  salaryRanges: [],
                });
              }}
            >
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.map(job => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{job.title}</CardTitle>
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
        )}
      </div>
    </MainLayout>
  );
};

export default Jobs;

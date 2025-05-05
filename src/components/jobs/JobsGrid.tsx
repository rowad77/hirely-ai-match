
import { Link } from 'react-router-dom';
import { Heart, Building, MapPin, Clock, DollarSign, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  category: string;
  postedDate: string;
  description: string;
  source?: string;
  url?: string;
}

interface JobsGridProps {
  jobs: Job[];
  favoriteJobs: string[];
  onFavorite: (jobId: string) => void;
  isLoading?: boolean;
  viewMode?: 'grid' | 'list';
}

const JobCard = ({ job, isFavorite, onFavorite }: { 
  job: Job;
  isFavorite: boolean;
  onFavorite: (jobId: string) => void;
}) => (
  <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <CardTitle className="text-xl">{job.title}</CardTitle>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={(e) => {
            e.preventDefault();
            onFavorite(job.id);
          }}
          className="text-gray-400 hover:text-hirely"
        >
          <Heart 
            className={`h-5 w-5 ${isFavorite ? 'fill-hirely text-hirely' : ''}`} 
          />
        </Button>
      </div>
      <div className="flex items-center text-gray-500 mt-2">
        <Building className="h-4 w-4 mr-2" />
        <span>{job.company}</span>
      </div>
    </CardHeader>
    <CardContent className="pb-4 flex-grow">
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
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge className="w-fit">{job.category}</Badge>
          {job.source && (
            <Badge 
              variant="outline" 
              className={`w-fit ${
                job.source === 'theirstack' 
                  ? 'bg-blue-50 text-blue-700 border-blue-200' 
                  : job.source === 'firecrawl' 
                    ? 'bg-green-50 text-green-700 border-green-200' 
                    : 'bg-gray-50 text-gray-700 border-gray-200'
              }`}
            >
              {job.source === 'theirstack' 
                ? 'API' 
                : job.source === 'firecrawl' 
                  ? 'Web Scraped' 
                  : 'Demo'}
            </Badge>
          )}
        </div>
        <p className="mt-4 text-gray-600 line-clamp-3">{job.description}</p>
      </div>
    </CardContent>
    <CardFooter className="flex flex-wrap gap-2 justify-between mt-auto">
      <Link to={`/job/${job.id}`} className="flex-1">
        <Button className="w-full bg-hirely hover:bg-hirely-dark">
          View Details
        </Button>
      </Link>
      
      {job.url && (
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => window.open(job.url, '_blank')}
          className="ml-2"
          title="Visit original job posting"
        >
          <Globe className="h-4 w-4" />
        </Button>
      )}
    </CardFooter>
  </Card>
);

const JobsGrid = ({ jobs, favoriteJobs, onFavorite, isLoading = false, viewMode = 'grid' }: JobsGridProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  
  // Handle loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="h-full">
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
                <div className="pt-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <Skeleton className="h-24 w-full mt-4" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
  
  // If no jobs, show empty state
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-medium text-gray-600 mb-3">No jobs found</h3>
        <p className="text-gray-500">Try adjusting your search criteria or check back later for new postings.</p>
      </div>
    );
  }
  
  // Only use virtualization for larger lists
  const shouldVirtualize = jobs.length > 20 && viewMode === 'grid';
  
  const virtualizer = useVirtualizer({
    count: shouldVirtualize ? jobs.length : 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 420, // Approximate card height
    overscan: 5,
  });

  if (!shouldVirtualize) {
    return (
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        : "space-y-4"
      }>
        {jobs.map(job => (
          <JobCard 
            key={job.id} 
            job={job} 
            isFavorite={favoriteJobs.includes(job.id)}
            onFavorite={onFavorite}
          />
        ))}
      </div>
    );
  }
  
  return (
    <div 
      ref={parentRef} 
      className="max-h-[800px] overflow-auto"
      style={{
        height: '800px',
        width: '100%'
      }}
    >
      <div
        className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const job = jobs[virtualItem.index];
          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              className="absolute top-0 left-0 w-full"
              style={{
                transform: `translateY(${virtualItem.start}px)`,
                gridColumn: `span 1`,
              }}
            >
              <JobCard 
                job={job} 
                isFavorite={favoriteJobs.includes(job.id)}
                onFavorite={onFavorite}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JobsGrid;

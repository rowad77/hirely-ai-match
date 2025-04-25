
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, MapPin, Heart, DollarSign, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface JobListItemProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string;
    category: string;
    postedDate: string;
    description?: string;
  };
  onFavorite: (id: string) => void;
  isFavorite: boolean;
  isLoading?: boolean;
}

// Skeleton loader component for JobListItem
export const JobListItemSkeleton = () => (
  <Card className="animate-pulse">
    <div className="p-4 flex flex-col gap-4">
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
      
      <div className="flex flex-wrap gap-2 items-center">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-20" />
        <div className="ml-auto">
          <Skeleton className="h-4 w-16" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mt-2">
        <Skeleton className="h-4 w-36 sm:hidden mb-2" />
        <Skeleton className="h-9 w-full sm:w-32" />
      </div>
    </div>
  </Card>
);

const JobListItem = ({ job, onFavorite, isFavorite, isLoading = false }: JobListItemProps) => {
  if (isLoading) {
    return <JobListItemSkeleton />;
  }
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="p-4 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium truncate">{job.title}</h3>
            <div className="flex flex-wrap items-center gap-2 text-gray-500 mt-1">
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="truncate">{job.company}</span>
              </div>
              <div className="hidden sm:flex items-center">
                <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="truncate">{job.location}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="text-sm">{job.postedDate}</span>
              </div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onFavorite(job.id);
            }}
            className="text-gray-400 hover:text-hirely self-start"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              className={`h-5 w-5 transition-colors ${isFavorite ? 'fill-hirely text-hirely' : ''}`}
            />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <Badge variant="outline" className="whitespace-nowrap">{job.type}</Badge>
          <Badge className="whitespace-nowrap">{job.category}</Badge>
          <div className="flex items-center ml-auto">
            <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
            <span className="text-hirely font-medium">{job.salary}</span>
          </div>
        </div>

        {job.description && (
          <p className="text-sm text-gray-600 line-clamp-2 hidden sm:block">
            {job.description}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          <div className="sm:hidden flex items-center text-gray-500">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{job.location}</span>
          </div>
          <Link to={`/job/${job.id}`} className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-hirely hover:bg-hirely-dark">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default JobListItem;


import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, MapPin, Heart, DollarSign } from 'lucide-react';

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
  };
  onFavorite: (id: string) => void;
  isFavorite: boolean;
}

const JobListItem = ({ job, onFavorite, isFavorite }: JobListItemProps) => {
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
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => {
              e.preventDefault();
              onFavorite(job.id);
            }}
            className="text-gray-400 hover:text-hirely self-start"
          >
            <Heart 
              className={`h-5 w-5 ${isFavorite ? 'fill-hirely text-hirely' : ''}`} 
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

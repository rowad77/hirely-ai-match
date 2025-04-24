
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
      <div className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex-1">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">{job.title}</h3>
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
          <div className="flex items-center text-gray-500 mt-1">
            <Building className="h-4 w-4 mr-1" />
            <span className="mr-3">{job.company}</span>
            <MapPin className="h-4 w-4 mr-1" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-3 mt-2 text-sm">
            <Badge variant="outline">{job.type}</Badge>
            <Badge>{job.category}</Badge>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
              <span className="text-hirely font-medium">{job.salary}</span>
            </div>
          </div>
        </div>
        <Link to={`/job/${job.id}`}>
          <Button className="whitespace-nowrap bg-hirely hover:bg-hirely-dark">
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default JobListItem;

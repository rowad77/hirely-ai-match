
import { Link } from 'react-router-dom';
import { Heart, Building, MapPin, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
}

interface JobsGridProps {
  jobs: Job[];
  favoriteJobs: string[];
  onFavorite: (jobId: string) => void;
}

const JobsGrid = ({ jobs, favoriteJobs, onFavorite }: JobsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {jobs.map(job => (
        <Card key={job.id} className="hover:shadow-lg transition-shadow">
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
  );
};

export default JobsGrid;

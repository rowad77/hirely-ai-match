
import { Link } from 'react-router-dom';
import { Heart, Building, MapPin, Clock, DollarSign, Globe } from 'lucide-react';
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
  source?: string;
  url?: string;
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
          <CardFooter className="flex flex-wrap gap-2 justify-between">
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
      ))}
    </div>
  );
};

export default JobsGrid;

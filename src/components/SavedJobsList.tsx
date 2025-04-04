
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, MapPin, DollarSign, Heart, Trash2 } from 'lucide-react';
import { featuredJobs } from '@/data/jobs';

type SavedJobsListProps = {
  savedJobIds: number[];
  onRemove: (id: number) => void;
};

const SavedJobsList = ({ savedJobIds, onRemove }: SavedJobsListProps) => {
  const [savedJobs, setSavedJobs] = useState<typeof featuredJobs>([]);

  useEffect(() => {
    // Get all jobs that match the saved IDs
    const jobs = featuredJobs.filter(job => savedJobIds.includes(job.id));
    setSavedJobs(jobs);
  }, [savedJobIds]);

  if (savedJobs.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="mx-auto h-12 w-12 text-gray-300" />
        <h3 className="mt-4 text-xl font-medium text-gray-900">No saved jobs</h3>
        <p className="mt-2 text-gray-600">
          Save jobs you're interested in to review them later
        </p>
        <Link to="/jobs">
          <Button className="mt-4 bg-hirely hover:bg-hirely-dark">
            Browse Jobs
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Saved Jobs</h2>
      {savedJobs.map(job => (
        <Card key={job.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium">{job.title}</h3>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onRemove(job.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
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
                <p className="mt-3 text-gray-600 line-clamp-2">{job.description}</p>
              </div>
              <Link to={`/job/${job.id}`}>
                <Button className="whitespace-nowrap bg-hirely hover:bg-hirely-dark">
                  View Details
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SavedJobsList;

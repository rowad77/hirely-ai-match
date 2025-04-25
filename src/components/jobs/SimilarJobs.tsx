import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, MapPin, DollarSign } from 'lucide-react';
import { featuredJobs } from '@/data/jobs';

const SimilarJobs = ({ 
  currentJobId, 
  currentJobTitle, 
  currentJobCategory 
}: { 
  currentJobId: string;
  currentJobTitle: string;
  currentJobCategory: string;
}) => {
  const [similarJobs, setSimilarJobs] = useState([]);

  useEffect(() => {
    // Simulate fetching similar jobs based on category
    // In a real app, this would be an API call
    const fetchedJobs = featuredJobs.filter(job => job.category === currentJobCategory);
    setSimilarJobs(filterJobs(fetchedJobs));
  }, [currentJobCategory, currentJobId]);

  const filterJobs = (jobs: any[]) => {
    return jobs
      .filter(job => job.id.toString() !== currentJobId.toString())
      .slice(0, 3);
  };

  if (!similarJobs.length) {
    return <p>No similar jobs found.</p>;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Similar Jobs</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {similarJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <h4 className="text-md font-medium mb-2">{job.title}</h4>
              <div className="flex items-center text-gray-500 mb-2">
                <Building className="h-4 w-4 mr-1" />
                <span>{job.company}</span>
              </div>
              <div className="flex items-center text-gray-500 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{job.type}</Badge>
                <Badge>{job.category}</Badge>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                <span className="text-hirely font-medium">{job.salary}</span>
              </div>
              <Link to={`/job/${job.id}`}>
                <Button className="w-full mt-4 bg-hirely hover:bg-hirely-dark">View Details</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SimilarJobs;

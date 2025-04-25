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
    const fetchedJobs = featuredJobs.filter(job => job.category === currentJobCategory);
    setSimilarJobs(filterJobs(fetchedJobs));
  }, [currentJobCategory, currentJobId]);

  const filterJobs = (jobs: any[]) => {
    return jobs
      .filter(job => job.id.toString() !== currentJobId.toString())
      .slice(0, 3);
  };

  if (!similarJobs.length) {
    return (
      <div className="text-center py-8 text-apple-gray-400">
        No similar jobs found.
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-2xl font-display font-semibold text-apple-gray-600 mb-6">Similar Jobs</h3>
      <div className="grid grid-cols-1 gap-4">
        {similarJobs.map((job) => (
          <Card key={job.id} className="apple-card group">
            <CardContent className="p-6">
              <h4 className="text-xl font-medium mb-3 text-apple-gray-600">{job.title}</h4>
              <div className="flex flex-wrap items-center gap-4 text-apple-gray-500">
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-2" />
                  <span>{job.company}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{job.location}</span>
                </div>
              </div>
              <div className="mt-4">
                <Link to={`/job/${job.id}`}>
                  <Button className="apple-button w-full group-hover:bg-apple-blue-dark">
                    View Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SimilarJobs;

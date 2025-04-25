
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, MapPin } from 'lucide-react';
import { featuredJobs } from '@/data/jobs';

interface JobRecommendationsProps {
  userId?: string;
  currentJobId: string;
  userInterests?: string[];
  limit?: number;
}

const JobRecommendations = ({ 
  userId, 
  currentJobId, 
  userInterests = [], 
  limit = 3 
}: JobRecommendationsProps) => {
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const recommendations = featuredJobs.filter(job => job.category === 'Engineering');
        setRecommendedJobs(filterRecommendations(recommendations));
      } catch (err: any) {
        setError(err.message || 'Failed to fetch job recommendations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId, currentJobId]);

  const filterRecommendations = (jobs: any[]) => {
    return jobs
      // Fixed: Ensure consistent string comparison by converting both to strings
      .filter(job => job.id.toString() !== currentJobId.toString())
      .slice(0, limit);
  };

  const handleFavorite = (jobId: string) => {
    console.log(`Job ${jobId} favorited`);
    // Implement your favorite logic here
  };

  if (isLoading) {
    return <p>Loading job recommendations...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (recommendedJobs.length === 0) {
    return <p>No job recommendations found.</p>;
  }

  return (
    <div>
      <h3 className="text-2xl font-display font-semibold text-apple-gray-600 mb-6">
        Recommended Jobs
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendedJobs.map(job => (
          <Card key={job.id} className="apple-card hover:transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex flex-col h-full">
                <h4 className="text-xl font-medium mb-3 text-apple-gray-600">{job.title}</h4>
                <div className="text-apple-gray-500 flex-grow space-y-2">
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
                    <Button className="apple-button w-full">View Details</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default JobRecommendations;

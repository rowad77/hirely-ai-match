import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, MapPin } from 'lucide-react';
import { featuredJobs } from '@/data/jobs';

const JobRecommendations = ({ userId, currentJobId }: { userId?: string; currentJobId: string }) => {
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate fetching recommended jobs based on user or current job
        // In a real app, this would be an API call
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
      .filter(job => job.id.toString() !== currentJobId.toString()) // Fix type comparison
      .slice(0, 3);
  };

  const handleFavorite = (jobId: string) => {  // Ensure jobId is treated as string
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
      <h3 className="text-lg font-semibold mb-4">Recommended Jobs</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendedJobs.map(job => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col h-full">
                <h4 className="text-md font-medium mb-2">{job.title}</h4>
                <div className="text-gray-500 flex-grow">
                  <div className="flex items-center mb-1">
                    <Building className="h-4 w-4 mr-1" />
                    <span>{job.company}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{job.location}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <Link to={`/job/${job.id}`}>
                    <Button className="bg-hirely hover:bg-hirely-dark w-full">View Details</Button>
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


import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, ThumbsUp, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { featuredJobs } from '@/data/jobs';

interface JobRecommendationsProps {
  currentJobId?: string;
  userInterests?: string[];
  limit?: number;
}

const JobRecommendations = ({ 
  currentJobId, 
  userInterests = [], 
  limit = 4
}: JobRecommendationsProps) => {
  const [viewedJobs, setViewedJobs] = useState<string[]>([]);
  
  // Load viewed jobs from localStorage
  useEffect(() => {
    const savedViewedJobs = localStorage.getItem('viewedJobs');
    if (savedViewedJobs) {
      try {
        setViewedJobs(JSON.parse(savedViewedJobs));
      } catch (e) {
        console.error('Failed to parse viewed jobs', e);
      }
    }
  }, []);
  
  // Simulate fetching recommended jobs
  const { data: recommendedJobs, isLoading } = useQuery({
    queryKey: ['jobRecommendations', currentJobId, userInterests, viewedJobs],
    queryFn: async () => {
      // In a real app, this would fetch from an API based on user behavior
      // For now, we'll simulate recommendations based on the dummy data
      
      // Filter out current job and recently viewed jobs
      let filtered = featuredJobs.filter(job => job.id !== currentJobId);
      
      if (viewedJobs.length > 0) {
        filtered = filtered.filter(job => !viewedJobs.includes(job.id));
      }
      
      // Prioritize jobs matching user interests if any
      if (userInterests && userInterests.length > 0) {
        filtered.sort((a, b) => {
          const aMatches = userInterests.some(interest => 
            a.title.toLowerCase().includes(interest.toLowerCase()) || 
            a.category.toLowerCase().includes(interest.toLowerCase())
          );
          const bMatches = userInterests.some(interest => 
            b.title.toLowerCase().includes(interest.toLowerCase()) || 
            b.category.toLowerCase().includes(interest.toLowerCase())
          );
          
          if (aMatches && !bMatches) return -1;
          if (!aMatches && bMatches) return 1;
          return 0;
        });
      }
      
      return filtered.slice(0, limit);
    },
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: limit }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  // No recommendations available
  if (!recommendedJobs || recommendedJobs.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
          Recommended for You
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendedJobs.map((job) => (
            <div 
              key={job.id} 
              className="border rounded-md p-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-500">{job.company}</p>
                </div>
                <Badge>{job.category}</Badge>
              </div>
              
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {job.postedDate}
                </div>
                <div>
                  {job.location}
                </div>
              </div>
              
              <div className="flex mt-3">
                <Link to={`/job/${job.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">View Job</Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="ml-2"
                  title="This matches your profile"
                >
                  <ThumbsUp className="h-4 w-4 text-hirely" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobRecommendations;

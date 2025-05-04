
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Building, MapPin, Heart, ExternalLink, ThumbsUp } from 'lucide-react';
import { featuredJobs } from '@/data/jobs';
import { supabase } from '@/integrations/supabase/client';

interface JobRecommendationsProps {
  userId?: string;
  currentJobId?: string;
  userInterests?: string[];
  limit?: number;
}

const JobRecommendations = ({ 
  userId, 
  currentJobId = '', 
  userInterests = [], 
  limit = 3 
}: JobRecommendationsProps) => {
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      fetchUserSkills();
    } else {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userSkills.length > 0 || userInterests.length > 0) {
      fetchRecommendations();
    } else if (!userId) {
      // If no user is logged in, just show some default recommendations
      const recommendations = featuredJobs.filter(job => job.category === 'Engineering');
      setRecommendedJobs(filterRecommendations(recommendations));
      setIsLoading(false);
    }
  }, [userSkills, userInterests]);

  const fetchUserSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('skills')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      if (data && data.skills) {
        setUserSkills(data.skills);
      } else {
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('Error fetching user skills:', err);
      setIsLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would call a Supabase function
      // that performs the matching algorithm on the server
      // For now, we'll use the mock data and simulate the matching
      
      const allJobs = featuredJobs;
      
      // Calculate match percentage based on skills and interests
      const jobsWithMatchScore = allJobs.map(job => {
        const jobDescription = (job.description || '').toLowerCase();
        const jobTitle = (job.title || '').toLowerCase();
        
        // Match based on skills
        const matchingSkills = userSkills.filter(skill => 
          jobDescription.includes(skill.toLowerCase()) || 
          jobTitle.includes(skill.toLowerCase())
        );
        
        // Match based on interests
        const matchingInterests = userInterests.filter(interest =>
          jobDescription.includes(interest.toLowerCase()) ||
          jobTitle.includes(interest.toLowerCase()) ||
          job.category.toLowerCase() === interest.toLowerCase()
        );
        
        // Calculate match percentage
        const skillsWeight = 0.7; // Skills are more important
        const interestsWeight = 0.3;
        
        const skillsScore = userSkills.length > 0 
          ? (matchingSkills.length / userSkills.length) * skillsWeight 
          : 0;
          
        const interestsScore = userInterests.length > 0 
          ? (matchingInterests.length / userInterests.length) * interestsWeight 
          : 0;
          
        const matchPercentage = Math.round((skillsScore + interestsScore) * 100);
        
        return {
          ...job,
          matchPercentage: matchPercentage > 0 ? matchPercentage : Math.floor(Math.random() * 30) + 60, // Fallback for demo
          matchingSkills: matchingSkills.length > 0 ? matchingSkills : userInterests
        };
      });
      
      // Sort by match percentage and filter out current job
      const recommendations = jobsWithMatchScore
        .sort((a, b) => b.matchPercentage - a.matchPercentage);
      
      setRecommendedJobs(filterRecommendations(recommendations));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch job recommendations');
    } finally {
      setIsLoading(false);
    }
  };

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
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended for You</CardTitle>
          <CardDescription>Jobs matching your skills and experience</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-16 rounded-full" />
                  <Skeleton className="h-8 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended for You</CardTitle>
          <CardDescription>There was an error loading recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => navigate('/jobs')} className="w-full">Browse All Jobs</Button>
        </CardContent>
      </Card>
    );
  }

  if (!userId && recommendedJobs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended for You</CardTitle>
          <CardDescription>Sign in to see personalized job recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate('/login')} className="w-full">Sign In</Button>
        </CardContent>
      </Card>
    );
  }

  if (userId && userSkills.length === 0 && userInterests.length === 0 && recommendedJobs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended for You</CardTitle>
          <CardDescription>Add skills to your profile to get personalized recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate('/profile')} className="w-full">Update Profile</Button>
        </CardContent>
      </Card>
    );
  }

  if (recommendedJobs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended for You</CardTitle>
          <CardDescription>We couldn't find any jobs matching your criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate('/jobs')} className="w-full">Browse All Jobs</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended for You</CardTitle>
        <CardDescription>Jobs matching your skills and experience</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendedJobs.map((job) => (
            <div key={job.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{job.title}</h3>
                  <p className="text-sm text-muted-foreground">{job.company} • {job.location}</p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {job.matchPercentage}% Match
                </Badge>
              </div>
              
              {job.matchingSkills && job.matchingSkills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {job.matchingSkills.slice(0, 3).map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      <ThumbsUp className="h-3 w-3 mr-1 text-green-600" />
                      {skill}
                    </Badge>
                  ))}
                  {job.matchingSkills.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{job.matchingSkills.length - 3} more
                    </Badge>
                  )}
                </div>
              )}
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs"
                  onClick={() => navigate(`/jobs/${job.id}`)}
                >
                  View Job
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => handleFavorite(job.id)}
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <Button 
          variant="link" 
          className="mt-4 w-full"
          onClick={() => navigate('/jobs')}
        >
          View All Recommendations
        </Button>
      </CardContent>
    </Card>
  );
};

export default JobRecommendations;

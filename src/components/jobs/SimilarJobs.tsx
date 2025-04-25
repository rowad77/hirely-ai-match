
import { Link } from 'react-router-dom';
import { Clock, MapPin, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { featuredJobs } from '@/data/jobs';

interface SimilarJobsProps {
  currentJobId: string;
  currentJobTitle?: string;
  currentJobCategory?: string;
  limit?: number;
}

const SimilarJobs = ({ 
  currentJobId, 
  currentJobTitle = '', 
  currentJobCategory = '', 
  limit = 5 
}: SimilarJobsProps) => {
  // In a real app, this would be a API call with parameters
  // For now, let's simulate similar jobs
  const similarJobs = featuredJobs
    .filter(job => job.id !== currentJobId)
    .filter(job => {
      // Match by category or title keywords
      const titleWords = currentJobTitle.toLowerCase().split(/\s+/);
      const matchesTitle = titleWords.some(word => 
        word.length > 3 && job.title.toLowerCase().includes(word)
      );
      
      const matchesCategory = job.category === currentJobCategory;
      
      return matchesTitle || matchesCategory;
    })
    .slice(0, limit);

  if (similarJobs.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Similar Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {similarJobs.map(job => (
              <div key={job.id} className="border rounded-md p-3 hover:bg-gray-50 transition-colors">
                <h3 className="font-medium text-gray-900">{job.title}</h3>
                <div className="flex items-center text-gray-500 text-sm mt-1">
                  <Building className="h-3.5 w-3.5 mr-1" />
                  <span>{job.company}</span>
                </div>
                
                <div className="flex flex-wrap gap-y-1 gap-x-3 items-center mt-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    {job.location}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    {job.postedDate}
                  </div>
                </div>
                
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">{job.type}</Badge>
                  <Badge className="text-xs">{job.category}</Badge>
                </div>
                
                <Link to={`/job/${job.id}`} className="block mt-3">
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SimilarJobs;


import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tables } from '@/integrations/supabase/types';
import { Bookmark, MapPin, Building, Clock } from 'lucide-react';

interface JobCardProps {
  job: Tables<'jobs'>;
  isCompact?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, isCompact = false }) => {
  const formattedDate = new Date(job.posted_date).toLocaleDateString();
  
  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardContent className={`${isCompact ? 'p-4' : 'p-5'}`}>
        <div className="flex flex-col space-y-3">
          <div>
            <div className="flex justify-between items-start">
              <Link 
                to={`/jobs/${job.id}`} 
                className="text-lg font-semibold text-blue-700 hover:text-blue-800 line-clamp-2"
              >
                {job.title}
              </Link>
              <Bookmark className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </div>
            
            <Link to={`/companies/${job.company_id}`} className="text-sm text-gray-500 flex items-center mt-1">
              <Building className="h-4 w-4 mr-1" />
              {job.company_id || 'Unknown Company'}
            </Link>
          </div>
          
          {job.location && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              {job.location}
            </div>
          )}
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{job.type}</Badge>
            {job.salary && <Badge variant="outline">{job.salary}</Badge>}
            {job.is_featured && <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Featured</Badge>}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className={`${isCompact ? 'px-4 py-3' : 'px-5 pt-0 pb-4'} flex justify-between border-t`}>
        <div className="text-xs text-gray-500 flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          Posted {formattedDate}
        </div>
        
        <Link to={`/jobs/${job.id}`} className="text-xs text-blue-600 hover:underline">
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
};

export default JobCard;


import React from 'react';
import { motion } from 'framer-motion';
import { Job } from '@/pages/Jobs';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, MapPin, BriefcaseBusiness, CalendarDays, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSavedJobs } from '@/hooks/use-saved-jobs';

interface AnimatedJobCardProps {
  job: Job;
  onSaveToRecentlyViewed: (job: Job) => void;
}

const AnimatedJobCard: React.FC<AnimatedJobCardProps> = ({ job, onSaveToRecentlyViewed }) => {
  const navigate = useNavigate();
  const { savedJobs, toggleSavedJob, isSaving } = useSavedJobs();
  
  const isSaved = savedJobs.some(savedJob => savedJob.id === job.id);

  const handleJobClick = () => {
    onSaveToRecentlyViewed(job);
    navigate(`/jobs/${job.id}`);
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      variants={cardVariants}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card 
        className="h-full flex flex-col cursor-pointer border-gray-200 hover:border-blue-300 transition-colors"
        onClick={handleJobClick}
      >
        <CardHeader className="p-4 pb-2 flex flex-row justify-between">
          <div>
            <h3 className="font-semibold text-lg line-clamp-2">{job.title}</h3>
            <p className="text-gray-600 text-sm">{job.company}</p>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              toggleSavedJob(job);
            }}
            disabled={isSaving}
          >
            <Bookmark 
              className={`h-5 w-5 ${isSaved ? 'fill-blue-500 text-blue-500' : 'text-gray-400'}`} 
            />
          </Button>
        </CardHeader>
        
        <CardContent className="p-4 pt-2 pb-2 flex-grow">
          <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <BriefcaseBusiness className="h-4 w-4 text-gray-500" />
              <span>{job.type}</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4 text-gray-500" />
              <span>Posted {job.postedDate}</span>
            </div>
          </div>
          
          <div className="mt-3">
            <p className="text-sm text-gray-700 line-clamp-3">
              {job.description}
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-2 border-t flex flex-wrap gap-2">
          {job.salary && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {job.salary}
            </Badge>
          )}
          
          {job.category && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {job.category}
            </Badge>
          )}
          
          <motion.div 
            className="ml-auto" 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="outline" 
              size="sm" 
              className="text-sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/jobs/${job.id}`);
              }}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              View Details
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default AnimatedJobCard;

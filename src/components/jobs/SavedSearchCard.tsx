
import React from 'react';
import { 
  Card,
  CardContent,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, ExternalLink, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Tables } from '@/integrations/supabase/types';
import { JobFilters } from '@/pages/Jobs';

interface SavedSearchCardProps {
  search: Tables<'saved_searches'>;
  onApply: () => void;
  onDelete: () => void;
}

const SavedSearchCard: React.FC<SavedSearchCardProps> = ({ search, onApply, onDelete }) => {
  // Format the search filters into a readable string
  const formatFilterSummary = (searchParams: any): string => {
    if (!searchParams) return "No filters";
    
    const filters = searchParams as unknown as JobFilters;
    const parts = [];

    if (filters.query) {
      parts.push(`"${filters.query}"`);
    }
    
    if (filters.jobTypes && filters.jobTypes.length > 0) {
      parts.push(`${filters.jobTypes.length} job type${filters.jobTypes.length !== 1 ? 's' : ''}`);
    }
    
    if (filters.locations && filters.locations.length > 0) {
      parts.push(`${filters.locations.length} location${filters.locations.length !== 1 ? 's' : ''}`);
    }

    if (filters.salaryRanges && filters.salaryRanges.length > 0) {
      parts.push(`${filters.salaryRanges.length} salary range${filters.salaryRanges.length !== 1 ? 's' : ''}`);
    }
    
    if (filters.categories && filters.categories.length > 0) {
      parts.push(`${filters.categories.length} categor${filters.categories.length !== 1 ? 'ies' : 'y'}`);
    }
    
    if (filters.skills && filters.skills.length > 0) {
      parts.push(`${filters.skills.length} skill${filters.skills.length !== 1 ? 's' : ''}`);
    }
    
    if (filters.experienceLevels && filters.experienceLevels.length > 0) {
      parts.push(`${filters.experienceLevels.length} experience level${filters.experienceLevels.length !== 1 ? 's' : ''}`);
    }
    
    return parts.length > 0 ? parts.join(", ") : "No filters";
  };

  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{search.search_name}</h3>
            <p className="text-xs text-gray-500 mt-1">
              {search.created_at && formatDistanceToNow(new Date(search.created_at), { addSuffix: true })}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {formatFilterSummary(search.search_params)}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="h-8 w-8 p-0"
            title="Delete search"
          >
            <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between px-4 py-2 border-t">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onApply}
          className="text-xs"
        >
          <Search className="h-3 w-3 mr-1" />
          Apply
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onApply}
          className="text-xs"
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          View Jobs
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SavedSearchCard;

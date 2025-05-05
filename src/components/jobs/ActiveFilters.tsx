
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { JobFilters } from '@/components/JobFilters';

interface ActiveFiltersProps {
  filters: JobFilters;
  onFilterChange: (filters: JobFilters) => void;
}

const ActiveFilters = ({ filters, onFilterChange }: ActiveFiltersProps) => {
  if (
    (filters.jobTypes || []).length === 0 &&
    (filters.locations || []).length === 0 &&
    (filters.salaryRanges || []).length === 0 &&
    (filters.categories || []).length === 0
  ) {
    return null;
  }

  return (
    <div className="mb-6 flex flex-wrap gap-2 items-center">
      <span className="text-sm text-gray-500 mr-2">Active filters:</span>
      {(filters.jobTypes || []).map(type => (
        <Badge key={type} variant="secondary" className="flex items-center gap-1">
          {type}
          <button 
            className="ml-1" 
            onClick={() => onFilterChange({
              ...filters, 
              jobTypes: filters.jobTypes.filter(t => t !== type)
            })}
          >
            ×
          </button>
        </Badge>
      ))}
      {(filters.locations || []).map(location => (
        <Badge key={location} variant="secondary" className="flex items-center gap-1">
          {location}
          <button 
            className="ml-1" 
            onClick={() => onFilterChange({
              ...filters, 
              locations: filters.locations.filter(l => l !== location)
            })}
          >
            ×
          </button>
        </Badge>
      ))}
      {(filters.salaryRanges || []).map(range => (
        <Badge key={range} variant="secondary" className="flex items-center gap-1">
          {range}
          <button 
            className="ml-1" 
            onClick={() => onFilterChange({
              ...filters, 
              salaryRanges: filters.salaryRanges.filter(r => r !== range)
            })}
          >
            ×
          </button>
        </Badge>
      ))}
      {(filters.categories || []).map(category => (
        <Badge key={category} variant="secondary" className="flex items-center gap-1">
          {category}
          <button 
            className="ml-1" 
            onClick={() => onFilterChange({
              ...filters, 
              categories: filters.categories.filter(c => c !== category)
            })}
          >
            ×
          </button>
        </Badge>
      ))}
      <Button 
        variant="link" 
        size="sm" 
        className="text-hirely"
        onClick={() => onFilterChange({
          jobTypes: [],
          locations: [],
          salaryRanges: [],
          categories: [],
          skills: [],
          experienceLevels: []
        })}
      >
        Clear all
      </Button>
    </div>
  );
};

export default ActiveFilters;

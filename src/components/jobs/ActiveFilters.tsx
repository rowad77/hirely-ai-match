
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { JobFilters } from '@/components/JobFilters';

interface ActiveFiltersProps {
  filters: JobFilters;
  onFilterChange: (filters: JobFilters) => void;
}

const ActiveFilters = ({ filters, onFilterChange }: ActiveFiltersProps) => {
  if (
    filters.jobTypes.length === 0 &&
    filters.locations.length === 0 &&
    filters.salaryRanges.length === 0 &&
    filters.categories.length === 0
  ) {
    return null;
  }

  return (
    <div className="mb-6 flex flex-wrap gap-2 items-center">
      <span className="text-sm text-gray-500 mr-2">Active filters:</span>
      {filters.jobTypes.map(type => (
        <Badge key={type.name} variant="secondary" className="flex items-center gap-1">
          {type.name}
          <button 
            className="ml-1" 
            onClick={() => onFilterChange({
              ...filters, 
              jobTypes: filters.jobTypes.filter(t => t.name !== type.name)
            })}
          >
            ×
          </button>
        </Badge>
      ))}
      {filters.locations.map(location => (
        <Badge key={location.name} variant="secondary" className="flex items-center gap-1">
          {location.name}
          <button 
            className="ml-1" 
            onClick={() => onFilterChange({
              ...filters, 
              locations: filters.locations.filter(l => l.name !== location.name)
            })}
          >
            ×
          </button>
        </Badge>
      ))}
      {filters.salaryRanges.map(range => (
        <Badge key={range.name} variant="secondary" className="flex items-center gap-1">
          {range.name}
          <button 
            className="ml-1" 
            onClick={() => onFilterChange({
              ...filters, 
              salaryRanges: filters.salaryRanges.filter(r => r.name !== range.name)
            })}
          >
            ×
          </button>
        </Badge>
      ))}
      {filters.categories.map(category => (
        <Badge key={category.name} variant="secondary" className="flex items-center gap-1">
          {category.name}
          <button 
            className="ml-1" 
            onClick={() => onFilterChange({
              ...filters, 
              categories: filters.categories.filter(c => c.name !== category.name)
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

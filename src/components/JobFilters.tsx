
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';

type JobFilterProps = {
  onFilterChange: (filters: JobFilters) => void;
};

export type JobFilters = {
  jobTypes: string[];
  locations: string[];
  salaryRanges: string[];
};

const JobFilters = ({ onFilterChange }: JobFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<JobFilters>({
    jobTypes: [],
    locations: [],
    salaryRanges: [],
  });

  const jobTypes = ["Full-time", "Part-time", "Contract", "Remote"];
  const locations = ["San Francisco, CA", "New York, NY", "Chicago, IL", "Seattle, WA", "Remote"];
  const salaryRanges = ["Under $50k", "$50k - $100k", "$100k - $150k", "$150k+"];

  const handleFilterChange = (
    category: keyof JobFilters,
    value: string,
    checked: boolean
  ) => {
    const updatedFilters = { ...filters };
    
    if (checked) {
      updatedFilters[category] = [...updatedFilters[category], value];
    } else {
      updatedFilters[category] = updatedFilters[category].filter(
        (item) => item !== value
      );
    }
    
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      jobTypes: [],
      locations: [],
      salaryRanges: [],
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters = () => {
    return filters.jobTypes.length > 0 || 
           filters.locations.length > 0 || 
           filters.salaryRanges.length > 0;
  };

  return (
    <div className="md:block mb-8">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <div className="flex justify-between items-center mb-2 p-3 border rounded-lg bg-white">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="font-medium">Filters</span>
            {hasActiveFilters() && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-hirely rounded-full">
                {filters.jobTypes.length + filters.locations.length + filters.salaryRanges.length}
              </span>
            )}
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-1">
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent>
          <div className="grid md:grid-cols-3 gap-6 p-4 bg-white rounded-lg border border-t-0 rounded-t-none">
            <div>
              <h3 className="font-medium mb-2">Job Type</h3>
              <div className="space-y-2">
                {jobTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`job-type-${type}`} 
                      checked={filters.jobTypes.includes(type)}
                      onCheckedChange={(checked) => 
                        handleFilterChange('jobTypes', type, checked === true)
                      }
                    />
                    <Label htmlFor={`job-type-${type}`} className="cursor-pointer">{type}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Location</h3>
              <div className="space-y-2">
                {locations.map((location) => (
                  <div key={location} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`location-${location}`} 
                      checked={filters.locations.includes(location)}
                      onCheckedChange={(checked) => 
                        handleFilterChange('locations', location, checked === true)
                      }
                    />
                    <Label htmlFor={`location-${location}`} className="cursor-pointer">{location}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Salary Range</h3>
              <div className="space-y-2">
                {salaryRanges.map((range) => (
                  <div key={range} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`salary-${range}`}
                      checked={filters.salaryRanges.includes(range)}
                      onCheckedChange={(checked) => 
                        handleFilterChange('salaryRanges', range, checked === true)
                      }
                    />
                    <Label htmlFor={`salary-${range}`} className="cursor-pointer">{range}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end p-4 bg-white rounded-lg border border-t-0 rounded-t-none">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearFilters}
              disabled={!hasActiveFilters()}
            >
              Clear Filters
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default JobFilters;

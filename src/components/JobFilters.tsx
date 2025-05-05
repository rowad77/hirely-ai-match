
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ExperienceLevelFilter } from '@/components/jobs/ExperienceLevelFilter';
import { SkillsFilter } from '@/components/jobs/SkillsFilter';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FilterIcon, X } from 'lucide-react';

export interface JobFilters {
  jobTypes: { name: string; required: boolean }[];
  locations: { name: string; required: boolean }[];
  categories: { name: string; required: boolean }[];
  salaryRanges: { name: string; required: boolean }[];
  skills?: { name: string; required: boolean }[];
  experienceLevels?: { name: string; required: boolean }[];
}

interface JobFiltersProps {
  onFilterChange: (filters: JobFilters) => void;
  initialFilters?: JobFilters;
  inModal?: boolean;
  filterCounts?: {[key: string]: number};
}

export const JobFiltersComponent: React.FC<JobFiltersProps> = ({
  onFilterChange,
  initialFilters,
  inModal = false,
  filterCounts = {}
}) => {
  const [filters, setFilters] = useState<JobFilters>({
    jobTypes: initialFilters?.jobTypes || [],
    locations: initialFilters?.locations || [],
    categories: initialFilters?.categories || [],
    salaryRanges: initialFilters?.salaryRanges || [],
    skills: initialFilters?.skills || [],
    experienceLevels: initialFilters?.experienceLevels || []
  });

  // Common filter options
  const jobTypeOptions = [
    'Full-time', 
    'Part-time', 
    'Contract', 
    'Remote', 
    'Freelance', 
    'Internship'
  ];
  
  const locationOptions = [
    'New York', 
    'San Francisco', 
    'London', 
    'Berlin', 
    'Toronto', 
    'Remote'
  ];
  
  const categoryOptions = [
    'Engineering', 
    'Design', 
    'Marketing', 
    'Sales', 
    'Customer Support', 
    'Finance'
  ];
  
  const salaryRangeOptions = [
    'Under $50k', 
    '$50k - $100k', 
    '$100k - $150k', 
    '$150k+'
  ];

  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  const updateFilter = (filterType: keyof JobFilters, name: string, add: boolean, required: boolean = false) => {
    setFilters(prevFilters => {
      const currentFilters = prevFilters[filterType] || [];
      let updatedFilters;
      
      if (add) {
        // Only add if it doesn't already exist
        if (!currentFilters.some(item => item.name === name)) {
          updatedFilters = [...currentFilters, { name, required }];
        } else {
          updatedFilters = currentFilters;
        }
      } else {
        // Remove the filter
        updatedFilters = currentFilters.filter(item => item.name !== name);
      }
      
      const newFilters = {
        ...prevFilters,
        [filterType]: updatedFilters
      };
      
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const isSelected = (filterType: keyof JobFilters, name: string) => {
    return filters[filterType]?.some(filter => filter.name === name) || false;
  };

  const renderFilterCount = (type: string) => {
    const count = filterCounts[type.toLowerCase()];
    if (!count) return null;
    
    return <span className="text-xs text-gray-500 ml-1">({count})</span>;
  };

  const handleSkillsChange = (skills: { name: string; required: boolean }[]) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        skills
      };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const handleExperienceLevelsChange = (experienceLevels: { name: string; required: boolean }[]) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        experienceLevels
      };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const clearFilters = () => {
    const emptyFilters = {
      jobTypes: [],
      locations: [],
      salaryRanges: [],
      categories: [],
      skills: [],
      experienceLevels: []
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const activeFilterCount = Object.values(filters).reduce(
    (count, filterArray) => count + (filterArray?.length || 0), 
    0
  );

  const filterContent = (
    <div className={`space-y-6 ${inModal ? 'p-1' : 'p-4'}`}>
      <div className="flex justify-between items-center">
        <h3 className="font-medium flex items-center">
          <FilterIcon className="h-4 w-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <Badge className="ml-2" variant="secondary">{activeFilterCount}</Badge>
          )}
        </h3>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
            Clear all
          </Button>
        )}
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Job Type {renderFilterCount('jobtype')}</h4>
        <div className="space-y-2">
          {jobTypeOptions.map(jobType => (
            <div key={jobType} className="flex items-center">
              <Checkbox
                id={`jobType-${jobType}`}
                checked={isSelected('jobTypes', jobType)}
                onCheckedChange={(checked) => updateFilter('jobTypes', jobType, !!checked)}
              />
              <label
                htmlFor={`jobType-${jobType}`}
                className="ml-2 text-sm cursor-pointer"
              >
                {jobType}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h4 className="text-sm font-medium mb-2">Location {renderFilterCount('location')}</h4>
        <div className="space-y-2">
          {locationOptions.map(location => (
            <div key={location} className="flex items-center">
              <Checkbox
                id={`location-${location}`}
                checked={isSelected('locations', location)}
                onCheckedChange={(checked) => updateFilter('locations', location, !!checked)}
              />
              <label
                htmlFor={`location-${location}`}
                className="ml-2 text-sm cursor-pointer"
              >
                {location}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h4 className="text-sm font-medium mb-2">Category {renderFilterCount('category')}</h4>
        <div className="space-y-2">
          {categoryOptions.map(category => (
            <div key={category} className="flex items-center">
              <Checkbox
                id={`category-${category}`}
                checked={isSelected('categories', category)}
                onCheckedChange={(checked) => updateFilter('categories', category, !!checked)}
              />
              <label
                htmlFor={`category-${category}`}
                className="ml-2 text-sm cursor-pointer"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h4 className="text-sm font-medium mb-2">Salary Range</h4>
        <div className="space-y-2">
          {salaryRangeOptions.map(range => (
            <div key={range} className="flex items-center">
              <Checkbox
                id={`salary-${range}`}
                checked={isSelected('salaryRanges', range)}
                onCheckedChange={(checked) => updateFilter('salaryRanges', range, !!checked)}
              />
              <label
                htmlFor={`salary-${range}`}
                className="ml-2 text-sm cursor-pointer"
              >
                {range}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <Separator />
      
      <SkillsFilter 
        selectedSkills={filters.skills || []} 
        onChange={handleSkillsChange}
      />
      
      <Separator />
      
      <ExperienceLevelFilter
        selectedLevels={filters.experienceLevels || []}
        onChange={handleExperienceLevelsChange}
      />
    </div>
  );

  if (inModal) {
    return filterContent;
  }

  return (
    <Card>
      <ScrollArea className="h-[calc(100vh-200px)]">
        {filterContent}
      </ScrollArea>
    </Card>
  );
};

export default JobFiltersComponent;

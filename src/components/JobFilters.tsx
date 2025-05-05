
import React, { useState, useEffect } from 'react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import SkillsFilter from './jobs/SkillsFilter';
import ExperienceLevelFilter from './jobs/ExperienceLevelFilter';

// Update JobFilters type to include skills and experienceLevels as arrays of strings
export type JobFilters = {
  jobTypes: string[];
  locations: string[];
  salaryRanges: string[];
  categories: string[];
  skills: string[];
  experienceLevels: string[];
  query?: string;
};

export type JobFiltersComponentProps = {
  initialFilters?: JobFilters;
  onApplyFilters: (filters: JobFilters) => void;
  showClearButton?: boolean;
  onFilterChange?: (filters: JobFilters) => void;
};

const DEFAULT_FILTERS: JobFilters = {
  jobTypes: [],
  locations: [],
  salaryRanges: [],
  categories: [],
  skills: [],
  experienceLevels: []
};

export const JobFiltersComponent: React.FC<JobFiltersComponentProps> = ({ 
  initialFilters, 
  onApplyFilters,
  onFilterChange,
  showClearButton = true
}) => {
  const [currentFilters, setCurrentFilters] = useState<JobFilters>(initialFilters || DEFAULT_FILTERS);
  const [searchQuery, setSearchQuery] = useState(initialFilters?.query || '');

  const handleFilterChange = (filterType: keyof JobFilters, value: string, checked: boolean) => {
    setCurrentFilters(prev => {
      const currentValues = prev[filterType] as string[] || [];
      const newValues = checked
        ? [...currentValues, value]
        : currentValues.filter(item => item !== value);
      
      const updatedFilters = { ...prev, [filterType]: newValues };
      
      // Call onFilterChange if provided
      if (onFilterChange) {
        onFilterChange(updatedFilters);
      }
      
      return updatedFilters;
    });
  };

  const handleSalaryChange = (value: string, checked: boolean) => {
    handleFilterChange('salaryRanges', value, checked);
  };

  const handleCategoryChange = (value: string, checked: boolean) => {
    handleFilterChange('categories', value, checked);
  };

  const handleJobTypeChange = (value: string, checked: boolean) => {
    handleFilterChange('jobTypes', value, checked);
  };

  const handleLocationChange = (value: string, checked: boolean) => {
    handleFilterChange('locations', value, checked);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Update to directly set skills as string array
  const handleSkillsChange = (skills: { name: string; required: boolean }[]) => {
    // Convert the skill objects to a string array of skill names
    const skillNames = skills.map(skill => skill.name);
    const updatedFilters = { ...currentFilters, skills: skillNames };
    setCurrentFilters(updatedFilters);
    
    // Call onFilterChange if provided
    if (onFilterChange) {
      onFilterChange(updatedFilters);
    }
  };

  const handleExperienceChange = (experienceLevels: string[]) => {
    const updatedFilters = { ...currentFilters, experienceLevels };
    setCurrentFilters(updatedFilters);
    
    // Call onFilterChange if provided
    if (onFilterChange) {
      onFilterChange(updatedFilters);
    }
  };

  const clearFilters = () => {
    setCurrentFilters(DEFAULT_FILTERS);
    setSearchQuery('');
    toast.success('Filters cleared');
    
    // Call onFilterChange if provided
    if (onFilterChange) {
      onFilterChange(DEFAULT_FILTERS);
    }
  };

  const applyFilters = () => {
    const filtersToApply = { ...currentFilters, query: searchQuery };
    onApplyFilters(filtersToApply);
    toast.success('Filters applied');
  };

  useEffect(() => {
    if (initialFilters) {
      setCurrentFilters({
        ...DEFAULT_FILTERS,
        ...initialFilters
      });
      setSearchQuery(initialFilters.query || '');
    }
  }, [initialFilters]);

  // Convert string skills array to the format expected by SkillsFilter
  const selectedSkillObjects = (currentFilters.skills || []).map(skillName => ({
    name: skillName,
    required: true
  }));

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="search">Search</Label>
        <Input
          type="text"
          id="search"
          placeholder="Search jobs..."
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
      </div>
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="jobTypes">
          <AccordionTrigger className="text-left">Job Types</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-2">
              {['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'].map(type => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`job-type-${type}`}
                    checked={(currentFilters.jobTypes || []).includes(type.toLowerCase())}
                    onCheckedChange={(checked) => handleJobTypeChange(type.toLowerCase(), checked === true)}
                  />
                  <Label htmlFor={`job-type-${type}`}>{type}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="locations">
          <AccordionTrigger className="text-left">Locations</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-2">
              {['New York', 'San Francisco', 'Los Angeles', 'Chicago', 'Austin'].map(location => (
                <div key={location} className="flex items-center space-x-2">
                  <Checkbox
                    id={`location-${location}`}
                    checked={(currentFilters.locations || []).includes(location.toLowerCase())}
                    onCheckedChange={(checked) => handleLocationChange(location.toLowerCase(), checked === true)}
                  />
                  <Label htmlFor={`location-${location}`}>{location}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="salaries">
          <AccordionTrigger className="text-left">Salary Ranges</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-2">
              {['$40,000 - $60,000', '$60,000 - $80,000', '$80,000 - $100,000', '$100,000+'].map(salary => (
                <div key={salary} className="flex items-center space-x-2">
                  <Checkbox
                    id={`salary-${salary.replace(/\s/g, '')}`}
                    checked={(currentFilters.salaryRanges || []).includes(salary)}
                    onCheckedChange={(checked) => handleSalaryChange(salary, checked === true)}
                  />
                  <Label htmlFor={`salary-${salary.replace(/\s/g, '')}`}>{salary}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="categories">
          <AccordionTrigger className="text-left">Categories</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-2">
              {['Technology', 'Marketing', 'Sales', 'Finance', 'Human Resources'].map(category => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.toLowerCase()}`}
                    checked={(currentFilters.categories || []).includes(category.toLowerCase())}
                    onCheckedChange={(checked) => handleCategoryChange(category.toLowerCase(), checked === true)}
                  />
                  <Label htmlFor={`category-${category.toLowerCase()}`}>{category}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <Accordion type="single" collapsible defaultValue="skills" className="w-full">
        <AccordionItem value="skills">
          <AccordionTrigger className="text-left">Skills</AccordionTrigger>
          <AccordionContent>
            <SkillsFilter 
              selectedSkills={selectedSkillObjects} 
              onSkillsChange={handleSkillsChange} 
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <Accordion type="single" collapsible defaultValue="experience" className="w-full">
        <AccordionItem value="experience">
          <AccordionTrigger className="text-left">Experience Levels</AccordionTrigger>
          <AccordionContent>
            <ExperienceLevelFilter
              selectedLevels={currentFilters.experienceLevels || []}
              onLevelsChange={handleExperienceChange}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="flex justify-between pt-4">
        {showClearButton && (
          <Button 
            variant="outline" 
            onClick={clearFilters}
            className="border-gray-300"
          >
            Clear Filters
          </Button>
        )}
        <Button onClick={applyFilters}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default JobFiltersComponent;

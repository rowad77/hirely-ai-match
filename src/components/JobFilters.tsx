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
import { Badge } from '@/components/ui/badge';
import { XCircle } from 'lucide-react';
import { toast } from 'sonner';
import SkillsFilter from './jobs/SkillsFilter';
import ExperienceLevelFilter from './jobs/ExperienceLevelFilter';

// Update JobFilters type to include skills as string[] to match expected type
export type JobFilters = {
  jobTypes?: string[];
  locations?: string[];
  salaryRanges?: string[];
  categories?: string[];
  search?: string;
  skills?: string[];
  experienceLevels?: string[];
};

export type JobFiltersComponentProps = {
  initialFilters?: JobFilters;
  onApplyFilters: (filters: JobFilters) => void;
  showClearButton?: boolean;
};

export const JobFiltersComponent: React.FC<JobFiltersComponentProps> = ({ 
  initialFilters, 
  onApplyFilters,
  showClearButton = true
}) => {
  const [currentFilters, setCurrentFilters] = useState<JobFilters>(initialFilters || {});
  const [searchQuery, setSearchQuery] = useState(initialFilters?.search || '');

  const handleFilterChange = (filterType: keyof JobFilters, value: string, checked: boolean) => {
    setFilters(prev => {
      const currentValues = prev[filterType] || [];
      const newValues = checked
        ? [...(currentValues as string[]), value]
        : (currentValues as string[]).filter(item => item !== value);
      return { ...prev, [filterType]: newValues };
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

  // Update the setFilters function to ensure skills is stored as string[]
  const setFilters = (newFilters: Partial<JobFilters>) => {
    setCurrentFilters(prev => {
      // Convert skills to string[] if it's in another format
      if (newFilters.skills && Array.isArray(newFilters.skills)) {
        const stringSkills = newFilters.skills.map(skill => {
          if (typeof skill === 'string') {
            return skill;
          } else if (typeof skill === 'object' && skill !== null && 'name' in skill) {
            return (skill as any).name;
          }
          return String(skill);
        });
        
        return { ...prev, ...newFilters, skills: stringSkills };
      }
      
      return { ...prev, ...newFilters };
    });
  };

  // Update handleSkillsChange to convert from skill objects to string array
  const handleSkillsChange = (skills: { name: string; required: boolean }[]) => {
    // Convert the skill objects to a string array of skill names
    const skillNames = skills.map(skill => skill.name);
    setFilters({ skills: skillNames });
  };

  const handleExperienceChange = (experienceLevels: string[]) => {
    setFilters({ experienceLevels });
  };

  const clearFilters = () => {
    setCurrentFilters({});
    setSearchQuery('');
    toast.success('Filters cleared');
  };

  const applyFilters = () => {
    const filtersToApply = { ...currentFilters, search: searchQuery };
    onApplyFilters(filtersToApply);
    toast.success('Filters applied');
  };

  useEffect(() => {
    if (initialFilters) {
      setCurrentFilters(initialFilters);
      setSearchQuery(initialFilters.search || '');
    }
  }, [initialFilters]);

  // Convert string skills array to the format expected by SkillsFilter
  const selectedSkillObjects = currentFilters.skills?.map(skillName => ({
    name: skillName,
    required: true
  })) || [];

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
      <Accordion type="multiple" collapsible className="w-full">
        <AccordionItem value="jobTypes">
          <AccordionTrigger className="text-left">Job Types</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-2">
              {['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'].map(type => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`job-type-${type}`}
                    checked={currentFilters.jobTypes?.includes(type.toLowerCase()) || false}
                    onCheckedChange={(checked) => handleJobTypeChange(type.toLowerCase(), checked || false)}
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
                    checked={currentFilters.locations?.includes(location.toLowerCase()) || false}
                    onCheckedChange={(checked) => handleLocationChange(location.toLowerCase(), checked || false)}
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
                    checked={currentFilters.salaryRanges?.includes(salary) || false}
                    onCheckedChange={(checked) => handleSalaryChange(salary, checked || false)}
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
                    checked={currentFilters.categories?.includes(category.toLowerCase()) || false}
                    onCheckedChange={(checked) => handleCategoryChange(category.toLowerCase(), checked || false)}
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
              selectedExperienceLevels={currentFilters.experienceLevels || []}
              onExperienceChange={handleExperienceChange}
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

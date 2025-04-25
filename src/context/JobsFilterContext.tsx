
import { createContext, useContext, useState, ReactNode } from 'react';
import { JobFilters } from '@/components/JobFilters';

type JobsFilterContextType = {
  filters: JobFilters;
  setFilters: (filters: JobFilters) => void;
  clearFilters: () => void;
  activeFiltersCount: number;
};

const JobsFilterContext = createContext<JobsFilterContextType | undefined>(undefined);

interface JobsFilterProviderProps {
  children: ReactNode;
}

export function JobsFilterProvider({ children }: JobsFilterProviderProps) {
  const [filters, setFilters] = useState<JobFilters>({
    jobTypes: [],
    locations: [],
    salaryRanges: [],
    categories: [],
  });

  const clearFilters = () => {
    setFilters({
      jobTypes: [],
      locations: [],
      salaryRanges: [],
      categories: [],
    });
  };

  const activeFiltersCount =
    filters.jobTypes.length + 
    filters.locations.length + 
    filters.salaryRanges.length + 
    filters.categories.length;

  return (
    <JobsFilterContext.Provider
      value={{
        filters,
        setFilters,
        clearFilters,
        activeFiltersCount,
      }}
    >
      {children}
    </JobsFilterContext.Provider>
  );
}

export const useJobsFilter = () => {
  const context = useContext(JobsFilterContext);
  
  if (context === undefined) {
    throw new Error('useJobsFilter must be used within a JobsFilterProvider');
  }
  
  return context;
};

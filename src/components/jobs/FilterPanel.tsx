
import React from 'react';
import JobFilters from '@/components/JobFilters';
import SavedSearches from '@/components/jobs/SavedSearches';
import { JobFilters as JobFiltersType } from '@/pages/Jobs';

interface FilterPanelProps {
  filters: JobFiltersType;
  onApplyFilters: (filters: JobFiltersType) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onApplyFilters }) => {
  return (
    <div className="lg:col-span-1 space-y-6">
      <JobFilters
        initialFilters={filters}
        onApplyFilters={onApplyFilters}
      />
      
      <div className="hidden lg:block">
        <SavedSearches 
          currentFilters={filters} 
          onApplySearch={onApplyFilters}
        />
      </div>
    </div>
  );
};

export default FilterPanel;

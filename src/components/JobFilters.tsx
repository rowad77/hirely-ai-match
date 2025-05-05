
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

const JobFiltersComponent: React.FC<JobFiltersProps> = ({
  onFilterChange,
  initialFilters,
  inModal = false,
  filterCounts = {}
}) => {
  // Component implementation would go here
  // This is a stub implementation - you would need to replace this with actual implementation
  return (
    <div>
      {/* Job filters UI would go here */}
      <div>Job Filters Component</div>
    </div>
  );
};

export default JobFiltersComponent;

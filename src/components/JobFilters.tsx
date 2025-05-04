export interface JobFilters {
  jobTypes: { name: string; required: boolean }[];
  locations: { name: string; required: boolean }[];
  categories: { name: string; required: boolean }[];
  salaryRanges: { name: string; required: boolean }[];
  skills?: { name: string; required: boolean }[];
  experienceLevels?: { name: string; required: boolean }[];
}

// You would also need to update all places that create these objects to use the proper format
// For example, when initializing filters:

const initialFilters: JobFilters = {
  jobTypes: [],
  locations: [], 
  categories: [],
  salaryRanges: [],
  skills: [],
  experienceLevels: []
};

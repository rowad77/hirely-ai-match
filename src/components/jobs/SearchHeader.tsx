
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';

export interface SearchHeaderProps {
  query: string;
  onQueryChange: (query: string) => void;
  totalJobs: number;
  isLoading: boolean;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  query,
  onQueryChange,
  totalJobs,
  isLoading
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Additional submit logic could go here
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading jobs...
            </span>
          ) : (
            <>
              <span className="text-blue-600">{totalJobs.toLocaleString()}</span> jobs available
            </>
          )}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="relative w-full md:max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          type="search"
          placeholder="Search job titles..."
          className="pl-10 pr-16"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
        <Button 
          type="submit"
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8"
        >
          Search
        </Button>
      </form>
    </div>
  );
};

export default SearchHeader;

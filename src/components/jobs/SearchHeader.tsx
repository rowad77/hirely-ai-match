
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SearchHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchHeader = ({ searchTerm, onSearchChange }: SearchHeaderProps) => {
  const quickFilters = [
    { label: 'Remote', query: 'remote' },
    { label: 'Full-time', query: 'full-time' },
    { label: 'Engineering', query: 'engineering' },
    { label: 'Design', query: 'design' },
    { label: 'Marketing', query: 'marketing' },
  ];

  const recentSearches = [
    'Software Engineer',
    'Product Designer',
    'Marketing Manager',
  ];

  return (
    <div className="text-center mb-12 space-y-6">
      <h1 className="text-4xl font-bold text-gray-900">Find Your Dream Job</h1>
      <p className="mt-4 text-xl text-gray-600">
        Browse through our current openings in Saudi Arabia from the last 4 days
      </p>
      
      <div className="relative max-w-3xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by title, company, location or keywords..."
            className="pl-10 py-6"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        {searchTerm && (
          <div className="absolute w-full bg-white mt-1 rounded-lg border shadow-lg p-4 z-10 text-left">
            <div className="space-y-2">
              {recentSearches.map((search) => (
                <Button
                  key={search}
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:text-hirely hover:bg-gray-50"
                  onClick={() => onSearchChange(search)}
                >
                  <Search className="h-4 w-4 mr-2" />
                  {search}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {quickFilters.map((filter) => (
          <Badge
            key={filter.query}
            variant="outline"
            className="px-4 py-2 cursor-pointer hover:bg-hirely hover:text-white transition-colors"
            onClick={() => onSearchChange(filter.query)}
          >
            {filter.label}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default SearchHeader;

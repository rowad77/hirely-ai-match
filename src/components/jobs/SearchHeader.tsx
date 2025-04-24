
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchHeader = ({ searchTerm, onSearchChange }: SearchHeaderProps) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-gray-900">Find Your Dream Job</h1>
      <p className="mt-4 text-xl text-gray-600">
        Browse through our current openings in Saudi Arabia from the last 4 days
      </p>
      <div className="relative flex-1 mt-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by title, company, location or keywords..."
          className="pl-10 py-6"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchHeader;

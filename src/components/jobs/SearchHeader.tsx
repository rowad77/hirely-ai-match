
import { useState, useEffect } from 'react';
import { Search, History, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface SearchHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  popularSearches?: string[];
  filterCounts?: {
    [key: string]: number;
  };
}

const SearchHeader = ({ 
  searchTerm, 
  onSearchChange,
  popularSearches = [],
  filterCounts = {} 
}: SearchHeaderProps) => {
  const [inputValue, setInputValue] = useState(searchTerm);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  // Smart filter suggestions based on current trends
  const quickFilters = [
    { label: 'Remote', query: 'remote', count: filterCounts['remote'] || 24 },
    { label: 'Full-time', query: 'full-time', count: filterCounts['full-time'] || 18 },
    { label: 'Engineering', query: 'engineering', count: filterCounts['engineering'] || 12 },
    { label: 'Design', query: 'design', count: filterCounts['design'] || 8 },
    { label: 'Marketing', query: 'marketing', count: filterCounts['marketing'] || 6 },
  ];

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentJobSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      } catch (e) {
        console.error('Failed to parse recent searches', e);
      }
    }
  }, []);

  // Save search term to recent searches
  const saveSearchTerm = (term: string) => {
    if (!term.trim()) return;
    
    const updated = [
      term,
      ...recentSearches.filter(s => s !== term)
    ].slice(0, 5);
    
    setRecentSearches(updated);
    localStorage.setItem('recentJobSearches', JSON.stringify(updated));
  };

  // Handle input changes with debounce for type-ahead
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== searchTerm) {
        onSearchChange(inputValue);
        if (inputValue.trim()) {
          saveSearchTerm(inputValue);
        }
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [inputValue, searchTerm, onSearchChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowSuggestions(!!e.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    onSearchChange(suggestion);
    saveSearchTerm(suggestion);
    setShowSuggestions(false);
  };

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
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(!!inputValue)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
        </div>
        
        {showSuggestions && (
          <div className="absolute w-full bg-white mt-1 rounded-lg border shadow-lg p-4 z-10 text-left">
            <div className="space-y-2">
              {inputValue && popularSearches
                .filter(search => search.toLowerCase().includes(inputValue.toLowerCase()))
                .map((search) => (
                  <Button
                    key={search}
                    variant="ghost"
                    className="w-full justify-start text-gray-700 hover:text-hirely hover:bg-gray-50"
                    onClick={() => handleSuggestionClick(search)}
                  >
                    <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
                    {search}
                  </Button>
                ))
              }
              
              {recentSearches.length > 0 && (
                <>
                  <h3 className="text-sm font-medium text-gray-500 pt-2">Recent Searches</h3>
                  {recentSearches.map((search) => (
                    <Button
                      key={search}
                      variant="ghost"
                      className="w-full justify-start text-gray-700 hover:text-hirely hover:bg-gray-50"
                      onClick={() => handleSuggestionClick(search)}
                    >
                      <History className="h-4 w-4 mr-2" />
                      {search}
                    </Button>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {quickFilters.map((filter) => (
          <Badge
            key={filter.query}
            variant="outline"
            className="px-4 py-2 cursor-pointer hover:bg-hirely hover:text-white transition-colors flex items-center gap-2"
            onClick={() => onSearchChange(filter.query)}
          >
            <span>{filter.label}</span>
            <span className="bg-gray-100 text-gray-600 text-xs rounded-full px-2 py-0.5">
              {filter.count}
            </span>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default SearchHeader;

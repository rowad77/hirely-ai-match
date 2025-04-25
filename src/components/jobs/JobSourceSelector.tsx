
import React from 'react';
import { Check, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface JobSource {
  id: string;
  name: string;
  description: string;
}

interface JobSourceSelectorProps {
  selectedSources: string[];
  onSourceChange: (sources: string[]) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

const availableSources: JobSource[] = [
  {
    id: 'theirstack',
    name: 'TheirStack',
    description: 'Jobs from TheirStack API'
  },
  {
    id: 'firecrawl',
    name: 'Web Scraping',
    description: 'Jobs from various career websites'
  },
  {
    id: 'fallback',
    name: 'Demo Data',
    description: 'Sample job listings for testing'
  }
];

const JobSourceSelector: React.FC<JobSourceSelectorProps> = ({ 
  selectedSources, 
  onSourceChange,
  onRefresh,
  isRefreshing = false
}) => {
  const toggleSource = (sourceId: string) => {
    if (selectedSources.includes(sourceId)) {
      // Don't allow deselecting if it's the last selected source
      if (selectedSources.length > 1) {
        onSourceChange(selectedSources.filter(id => id !== sourceId));
      }
    } else {
      onSourceChange([...selectedSources, sourceId]);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Data Sources ({selectedSources.length})
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Job Data Sources</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {availableSources.map(source => (
            <DropdownMenuItem
              key={source.id}
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSource(source.id)}
            >
              <div>
                <div>{source.name}</div>
                <div className="text-xs text-gray-500">{source.description}</div>
              </div>
              {selectedSources.includes(source.id) && (
                <Check className="h-4 w-4 text-green-500" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onRefresh}
        disabled={isRefreshing}
        className={isRefreshing ? "animate-spin" : ""}
      >
        <RefreshCcw className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default JobSourceSelector;

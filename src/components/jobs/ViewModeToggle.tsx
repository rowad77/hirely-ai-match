
import { Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ViewModeToggleProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const ViewModeToggle = ({ viewMode, onViewModeChange }: ViewModeToggleProps) => {
  return (
    <div className="flex border rounded-md overflow-hidden">
      <Button
        variant={viewMode === 'grid' ? 'default' : 'outline'}
        className={cn(
          'rounded-none transition-all duration-200',
          viewMode === 'grid' ? 'bg-hirely hover:bg-hirely-dark' : ''
        )}
        onClick={() => onViewModeChange('grid')}
        size="sm"
      >
        <Grid className="h-4 w-4 mr-2" />
        Grid
      </Button>
      <Button
        variant={viewMode === 'list' ? 'default' : 'outline'}
        className={cn(
          'rounded-none transition-all duration-200',
          viewMode === 'list' ? 'bg-hirely hover:bg-hirely-dark' : ''
        )}
        onClick={() => onViewModeChange('list')}
        size="sm"
      >
        <List className="h-4 w-4 mr-2" />
        List
      </Button>
    </div>
  );
};

export default ViewModeToggle;

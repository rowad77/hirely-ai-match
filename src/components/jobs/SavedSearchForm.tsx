
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { JobFilters } from '@/components/JobFilters';

interface SavedSearchFormProps {
  currentFilters: JobFilters;
  formatFilterSummary: (filters: JobFilters) => string;
  onSave: (name: string, notifyMatches: boolean) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const SavedSearchForm: React.FC<SavedSearchFormProps> = ({
  currentFilters,
  formatFilterSummary,
  onSave,
  onCancel,
  isLoading
}) => {
  const [searchName, setSearchName] = useState('');
  const [notifyNewMatches, setNotifyNewMatches] = useState(false);

  const handleSave = () => {
    onSave(searchName, notifyNewMatches);
  };

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="search-name">Search Name</Label>
        <Input
          id="search-name"
          placeholder="e.g., Remote Developer Jobs"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="notify"
          checked={notifyNewMatches}
          onCheckedChange={setNotifyNewMatches}
        />
        <Label htmlFor="notify">Notify me about new matching jobs</Label>
      </div>
      <div className="bg-muted p-3 rounded-md">
        <h4 className="text-sm font-medium mb-2">Current Filters</h4>
        <p className="text-sm text-muted-foreground">
          {formatFilterSummary(currentFilters)}
        </p>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isLoading || !searchName.trim()}>
          {isLoading ? 'Saving...' : 'Save Search'}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default SavedSearchForm;

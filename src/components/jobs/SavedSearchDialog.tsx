
import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { JobFilters } from '@/pages/Jobs';

interface SavedSearchDialogProps {
  currentFilters: JobFilters;
  hasActiveFilters: boolean;
  onSave: (searchName: string, notifyNewMatches: boolean) => void;
}

const SavedSearchDialog: React.FC<SavedSearchDialogProps> = ({
  currentFilters,
  hasActiveFilters,
  onSave
}) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newSearchName, setNewSearchName] = useState('');
  const [notifyNewMatches, setNotifyNewMatches] = useState(false);

  const handleSave = () => {
    onSave(newSearchName, notifyNewMatches);
    setShowSaveDialog(false);
    setNewSearchName('');
    setNotifyNewMatches(false);
  };

  return (
    <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2"
          disabled={!hasActiveFilters}
          title={!hasActiveFilters ? 'Apply some filters first' : 'Save current search'}
        >
          <Plus className="h-4 w-4 mr-1" /> Save
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Search</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="search-name">Search Name</Label>
            <Input 
              id="search-name" 
              placeholder="e.g., Remote Developer Jobs"
              value={newSearchName}
              onChange={(e) => setNewSearchName(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="notify"
              checked={notifyNewMatches}
              onChange={(e) => setNotifyNewMatches(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="notify">Notify me about new matches</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowSaveDialog(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!newSearchName.trim()}>Save Search</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SavedSearchDialog;

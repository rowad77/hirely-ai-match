
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Bell, TagIcon } from 'lucide-react';
import { JobFilters } from '@/components/JobFilters';

interface SavedSearchFormProps {
  currentFilters: JobFilters;
  formatFilterSummary: (filters: JobFilters) => string;
  onSave: (name: string, notifyMatches: boolean, tags: string[], frequency: string) => void;
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
  const [notifyNewMatches, setNotifyNewMatches] = useState(true);
  const [notificationFrequency, setNotificationFrequency] = useState('daily');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    onSave(searchName, notifyNewMatches, tags, notificationFrequency);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="search-name">Search Name</Label>
        <Input
          id="search-name"
          placeholder="My search"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="mt-1"
        />
      </div>
      
      <div>
        <Label>Filters</Label>
        <div className="mt-1 p-3 bg-muted rounded-md text-sm">
          {formatFilterSummary(currentFilters)}
        </div>
      </div>
      
      <div>
        <Label className="block mb-2">Tags</Label>
        <div className="flex gap-2 mb-2">
          <Input
            placeholder="Add tags (press Enter)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            className="flex-1"
          />
          <Button type="button" variant="outline" onClick={addTag} disabled={!tagInput.trim()}>
            Add
          </Button>
        </div>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map(tag => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <button className="ml-1" onClick={() => removeTag(tag)}>×</button>
              </Badge>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="notify-toggle" className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-muted-foreground" />
          Notify me of new matches
        </Label>
        <Switch
          id="notify-toggle"
          checked={notifyNewMatches}
          onCheckedChange={setNotifyNewMatches}
        />
      </div>
      
      {notifyNewMatches && (
        <div className="pl-6 border-l-2 border-muted">
          <Label className="block mb-2">Notification Frequency</Label>
          <RadioGroup value={notificationFrequency} onValueChange={setNotificationFrequency}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="realtime" id="r1" />
              <Label htmlFor="r1">Real-time</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="daily" id="r2" />
              <Label htmlFor="r2">Daily digest</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="weekly" id="r3" />
              <Label htmlFor="r3">Weekly summary</Label>
            </div>
          </RadioGroup>
        </div>
      )}
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!searchName.trim() || isLoading}>
          {isLoading ? 'Saving...' : 'Save Search'}
        </Button>
      </div>
    </div>
  );
};

export default SavedSearchForm;

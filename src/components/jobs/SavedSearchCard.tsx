
import React, { useState } from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { 
  Bell,
  Calendar,
  Clock,
  Edit,
  ExternalLink,
  MoreVertical,
  Search,
  Tag,
  Trash,
  Check
} from 'lucide-react';
import { JobFilters } from '@/components/JobFilters';

interface SavedSearchCardProps {
  id: string;
  name: string;
  filters: JobFilters;
  notifyNewMatches: boolean;
  notificationFrequency?: string;
  tags?: string[];
  formatFilterSummary: (filters: JobFilters) => string;
  onApply: (filters: JobFilters) => void;
  onToggleNotification: (id: string, notify: boolean) => void;
  onDelete: (id: string) => void;
  onUpdateTags?: (id: string, tags: string[]) => void;
  onUpdateFrequency?: (id: string, frequency: string) => void;
  newMatchesCount?: number;
}

const SavedSearchCard: React.FC<SavedSearchCardProps> = ({
  id,
  name,
  filters,
  notifyNewMatches,
  notificationFrequency = 'daily',
  tags = [],
  formatFilterSummary,
  onApply,
  onToggleNotification,
  onDelete,
  onUpdateTags,
  onUpdateFrequency,
  newMatchesCount = 0
}) => {
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [localTags, setLocalTags] = useState([...tags]);

  const addTag = () => {
    if (tagInput.trim() && !localTags.includes(tagInput.trim())) {
      const updatedTags = [...localTags, tagInput.trim()];
      setLocalTags(updatedTags);
      setTagInput('');
      
      if (onUpdateTags) {
        onUpdateTags(id, updatedTags);
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = localTags.filter(tag => tag !== tagToRemove);
    setLocalTags(updatedTags);
    
    if (onUpdateTags) {
      onUpdateTags(id, updatedTags);
    }
  };

  const handleFrequencyChange = (frequency: string) => {
    if (onUpdateFrequency) {
      onUpdateFrequency(id, frequency);
    }
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Card className="relative overflow-hidden">
      {newMatchesCount > 0 && (
        <div className="absolute top-0 right-0">
          <Badge className="bg-hirely text-white m-3 relative z-10">
            {newMatchesCount} new {newMatchesCount === 1 ? 'match' : 'matches'}
          </Badge>
        </div>
      )}
      
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              {name}
            </CardTitle>
            <CardDescription>
              Created {formatDistanceToNow(new Date(id), { addSuffix: true })}
            </CardDescription>
          </div>
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditingTags(!isEditingTags)}>
                  <Tag className="mr-2 h-4 w-4" />
                  {isEditingTags ? "Done editing tags" : "Edit tags"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(id)}>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {formatFilterSummary(filters)}
          </div>
          
          {isEditingTags ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Add tag (press Enter)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  className="flex-1"
                />
                <Button variant="outline" size="sm" onClick={addTag} disabled={!tagInput.trim()}>
                  Add
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {localTags.map(tag => (
                  <Badge key={tag} variant="outline" className="flex items-center gap-1">
                    {tag}
                    <button 
                      className="ml-1 hover:text-destructive" 
                      onClick={() => removeTag(tag)}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                {localTags.length === 0 && (
                  <span className="text-xs text-muted-foreground">No tags yet</span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-1">
              {localTags.map(tag => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
              {localTags.length === 0 && (
                <span className="text-xs text-muted-foreground">No tags</span>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Notifications</span>
            </div>
            <Switch
              checked={notifyNewMatches}
              onCheckedChange={(checked) => onToggleNotification(id, checked)}
            />
          </div>
          
          {notifyNewMatches && onUpdateFrequency && (
            <div className="flex items-center justify-between pl-6 border-l-2 border-muted">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Frequency</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {notificationFrequency === 'realtime' ? 'Real-time' : 
                     notificationFrequency === 'daily' ? 'Daily' : 'Weekly'}
                    <MoreVertical className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleFrequencyChange('realtime')}>
                    {notificationFrequency === 'realtime' && <Check className="h-4 w-4 mr-2" />}
                    Real-time
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFrequencyChange('daily')}>
                    {notificationFrequency === 'daily' && <Check className="h-4 w-4 mr-2" />}
                    Daily digest
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFrequencyChange('weekly')}>
                    {notificationFrequency === 'weekly' && <Check className="h-4 w-4 mr-2" />}
                    Weekly summary
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4 pb-2">
        <Button 
          variant="outline" 
          className="text-xs"
          size="sm"
          onClick={() => onApply(filters)}
        >
          <Search className="h-3 w-3 mr-1" />
          Apply
        </Button>
        <Button 
          variant="ghost" 
          className="text-xs"
          size="sm" 
          onClick={() => onApply(filters)}
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          View Matches
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SavedSearchCard;

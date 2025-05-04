
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Trash2 } from 'lucide-react';
import { JobFilters } from '@/components/JobFilters';

interface SavedSearchCardProps {
  id: string;
  name: string;
  filters: JobFilters;
  notifyNewMatches: boolean;
  formatFilterSummary: (filters: JobFilters) => string;
  onApply: (filters: JobFilters) => void;
  onToggleNotification: (id: string, notify: boolean) => void;
  onDelete: (id: string) => void;
}

const SavedSearchCard: React.FC<SavedSearchCardProps> = ({
  id,
  name,
  filters,
  notifyNewMatches,
  formatFilterSummary,
  onApply,
  onToggleNotification,
  onDelete
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{name}</CardTitle>
            <CardDescription>
              {formatFilterSummary(filters)}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleNotification(id, !notifyNewMatches)}
              title={notifyNewMatches ? "Disable notifications" : "Enable notifications"}
            >
              <Bell className={`h-4 w-4 ${notifyNewMatches ? 'text-hirely' : 'text-muted-foreground'}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(id)}
              title="Delete search"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onApply(filters)}
          className="w-full"
        >
          Apply This Search
        </Button>
      </CardContent>
    </Card>
  );
};

export default SavedSearchCard;

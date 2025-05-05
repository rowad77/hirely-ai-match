import React from 'react';
import SavedSearchCard from './SavedSearchCard';
import { JobFilters } from '@/components/JobFilters';

// Include the SavedSearchDB type to match the now updated saved_searches table schema
export type SavedSearchDB = {
  id: string;
  profile_id?: string;
  search_name: string;
  search_params: any;
  created_at?: string;
  notify_new_matches?: boolean;
  notification_frequency?: string;
  tags?: string[];
  last_viewed_at?: string;
  last_notified_at?: string;
};

// Update the SavedSearch model to include the notification fields
export type SavedSearch = {
  id: string;
  name: string;
  filters: any;
  created_at?: string;
  notify_new_matches: boolean;
  notification_frequency: string;
  tags: string[];
  last_viewed_at?: string;
  last_notified_at?: string;
};

interface SavedSearchListProps {
  searches: SavedSearch[];
  formatFilterSummary: (filters: JobFilters) => string;
  onApplySearch: (filters: JobFilters) => void;
  onToggleNotification: (id: string, notify: boolean) => void;
  onDeleteSearch: (id: string) => void;
  onUpdateTags?: (id: string, tags: string[]) => void;
  onUpdateFrequency?: (id: string, frequency: string) => void;
  newMatches?: Record<string, number>;
}

const SavedSearchList: React.FC<SavedSearchListProps> = ({
  searches,
  formatFilterSummary,
  onApplySearch,
  onToggleNotification,
  onDeleteSearch,
  onUpdateTags,
  onUpdateFrequency,
  newMatches = {}
}) => {
  if (searches.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">You don't have any saved searches yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {searches.map((search) => (
        <SavedSearchCard
          key={search.id}
          id={search.id}
          name={search.name}
          filters={search.filters}
          notifyNewMatches={search.notify_new_matches}
          notificationFrequency={search.notification_frequency}
          tags={search.tags || []}
          formatFilterSummary={formatFilterSummary}
          onApply={onApplySearch}
          onToggleNotification={onToggleNotification}
          onDelete={onDeleteSearch}
          onUpdateTags={onUpdateTags}
          onUpdateFrequency={onUpdateFrequency}
          newMatchesCount={newMatches[search.id] || 0}
        />
      ))}
    </div>
  );
};

export default SavedSearchList;

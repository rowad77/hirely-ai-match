
import React from 'react';
import SavedSearchCard from './SavedSearchCard';
import { JobFilters } from '@/components/JobFilters';
import { Tables } from '@/integrations/supabase/types';

// Include the SavedSearchDB type to match the now updated saved_searches table schema
export type SavedSearchDB = Tables<'saved_searches'>;

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
  searches: SavedSearchDB[];
  onApplySearch: (filters: JobFilters) => void;
  onDeleteSearch: (id: string) => void;
  newMatches?: Record<string, number>;
}

const SavedSearchList: React.FC<SavedSearchListProps> = ({
  searches,
  onApplySearch,
  onDeleteSearch,
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
          search={search}
          onApply={() => {
            if (search.search_params) {
              onApplySearch(search.search_params as unknown as JobFilters);
            }
          }}
          onDelete={() => onDeleteSearch(search.id)}
        />
      ))}
    </div>
  );
};

export default SavedSearchList;

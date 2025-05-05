
import React from 'react';
import SavedSearchCard from './SavedSearchCard';
import { JobFilters } from '@/pages/Jobs';
import { Tables } from '@/integrations/supabase/types';

interface SavedSearchListProps {
  searches: Tables<'saved_searches'>[];
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
    <div className="space-y-2">
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


import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BookmarkPlus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { JobFilters } from '@/components/JobFilters';
import SavedSearchForm from './SavedSearchForm';
import SavedSearchList, { SavedSearch } from './SavedSearchList';
import { query } from '@/utils/supabase-api';
import { ErrorResponse, ErrorType } from '@/utils/error-handling';
import { ApiErrorMessage } from '@/components/ui/ApiErrorMessage';

type SavedSearchesProps = {
  currentFilters: JobFilters;
  onApplySearch: (filters: JobFilters) => void;
  userId?: string;
};

const SavedSearches: React.FC<SavedSearchesProps> = ({
  currentFilters,
  onApplySearch,
  userId,
}) => {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [manageDialogOpen, setManageDialogOpen] = useState(false);
  const [error, setError] = useState<ErrorResponse | null>(null);

  // Fetch saved searches when component mounts or userId changes
  useEffect(() => {
    if (userId) {
      fetchSavedSearches();
    }
  }, [userId]);

  const fetchSavedSearches = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    
    const { data, error } = await query<SavedSearch[]>(
      'saved_searches',
      (query) => query
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
    );

    setIsLoading(false);
    
    if (error) {
      setError(error);
      return;
    }
    
    setSavedSearches(data || []);
  };

  const saveSearch = async (searchName: string, notifyNewMatches: boolean) => {
    if (!userId) {
      toast.error('You must be logged in to save searches');
      return;
    }

    if (!searchName.trim()) {
      toast.error('Please enter a name for your search');
      return;
    }

    // Check if there are any active filters
    const hasActiveFilters = 
      currentFilters.jobTypes.length > 0 || 
      currentFilters.locations.length > 0 || 
      currentFilters.salaryRanges.length > 0 || 
      currentFilters.categories.length > 0 ||
      (currentFilters.skills && currentFilters.skills.length > 0) ||
      (currentFilters.experienceLevels && currentFilters.experienceLevels.length > 0);

    if (!hasActiveFilters) {
      toast.error('Please apply some filters before saving');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('saved_searches')
        .insert({
          user_id: userId,
          name: searchName.trim(),
          filters: currentFilters,
          notify_new_matches: notifyNewMatches,
        })
        .select();

      if (error) throw error;
      
      setSavedSearches([...(data || []), ...savedSearches]);
      setSaveDialogOpen(false);
      toast.success('Search saved successfully');
    } catch (error: any) {
      console.error('Error saving search:', error);
      setError({
        type: ErrorType.SERVER,
        message: 'Failed to save search',
        userMessage: 'We could not save your search. Please try again.',
        originalError: error,
        retryable: true
      });
      toast.error('Failed to save search');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSearch = async (id: string) => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('saved_searches')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setSavedSearches(savedSearches.filter(search => search.id !== id));
      toast.success('Search deleted successfully');
    } catch (error: any) {
      console.error('Error deleting search:', error);
      toast.error('Failed to delete search');
    } finally {
      setIsLoading(false);
    }
  };

  const applySearch = (filters: JobFilters) => {
    onApplySearch(filters);
    setManageDialogOpen(false);
    toast.success('Search applied');
  };

  const toggleNotification = async (id: string, notify: boolean) => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('saved_searches')
        .update({ notify_new_matches: notify })
        .eq('id', id);

      if (error) throw error;
      
      setSavedSearches(savedSearches.map(search => 
        search.id === id ? { ...search, notify_new_matches: notify } : search
      ));
      
      toast.success(notify ? 'Notifications enabled' : 'Notifications disabled');
    } catch (error: any) {
      console.error('Error updating notification settings:', error);
      toast.error('Failed to update notification settings');
    } finally {
      setIsLoading(false);
    }
  };

  const formatFilterSummary = (filters: JobFilters) => {
    const parts = [];
    
    if (filters.jobTypes?.length) {
      parts.push(`${filters.jobTypes.length} job types`);
    }
    
    if (filters.locations?.length) {
      parts.push(`${filters.locations.length} locations`);
    }
    
    if (filters.categories?.length) {
      parts.push(`${filters.categories.length} categories`);
    }
    
    if (filters.salaryRanges?.length) {
      parts.push(`${filters.salaryRanges.length} salary ranges`);
    }
    
    if (filters.skills?.length) {
      parts.push(`${filters.skills.length} skills`);
    }
    
    if (filters.experienceLevels?.length) {
      parts.push(`${filters.experienceLevels.length} experience levels`);
    }
    
    return parts.join(', ') || 'No filters';
  };

  const handleRetry = () => {
    fetchSavedSearches();
  };

  return (
    <div>
      {error && (
        <ApiErrorMessage 
          error={error}
          onRetry={handleRetry}
          className="mb-4"
        />
      )}
      
      <div className="flex justify-between items-center mb-4">
        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <BookmarkPlus className="h-4 w-4" />
              <span>Save Current Search</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Search</DialogTitle>
            </DialogHeader>
            <SavedSearchForm
              currentFilters={currentFilters}
              formatFilterSummary={formatFilterSummary}
              onSave={(name, notifyMatches) => saveSearch(name, notifyMatches)}
              onCancel={() => setSaveDialogOpen(false)}
              isLoading={isLoading}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={manageDialogOpen} onOpenChange={setManageDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>Manage Saved Searches</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Saved Searches</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <SavedSearchList
                searches={savedSearches}
                formatFilterSummary={formatFilterSummary}
                onApplySearch={applySearch}
                onToggleNotification={toggleNotification}
                onDeleteSearch={deleteSearch}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SavedSearches;

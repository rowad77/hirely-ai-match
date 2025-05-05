
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BookmarkPlus, Search, Bell, Tag, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { JobFilters as JobFiltersType } from '@/pages/Jobs';
import SavedSearchForm from './SavedSearchForm';
import SavedSearchList, { SavedSearch } from './SavedSearchList';
import { ErrorResponse, ErrorType } from '@/utils/error-handling';
import { ApiErrorMessage } from '@/components/ui/ApiErrorMessage';
import { Badge } from '@/components/ui/badge';

type SavedSearchesProps = {
  currentFilters: JobFiltersType;
  onApplySearch: (filters: JobFiltersType) => void;
  userId?: string;
};

// Add missing fields to match the database schema
type SavedSearchInsertType = {
  profile_id: string;
  search_name: string;
  search_params: any;
  notify_new_matches?: boolean;
  notification_frequency?: string;
  tags?: string[];
  last_notified_at?: string;
  last_viewed_at?: string;
};

const DEFAULT_FILTERS: JobFiltersType = {
  jobTypes: [],
  locations: [],
  salaryRanges: [],
  categories: [],
  skills: [],
  experienceLevels: []
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
  const [newMatches, setNewMatches] = useState<Record<string, number>>({});
  
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
    
    try {
      // Use direct query instead of RPC for compatibility
      const { data, error } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('profile_id', userId)
        .order('created_at', { ascending: false });
      
      setIsLoading(false);
      
      if (error) {
        setError({
          type: ErrorType.SERVER,
          message: error.message,
          userMessage: 'Failed to load saved searches',
          retryable: true,
          originalError: error
        });
        return;
      }
      
      // Transform database records to application model
      const transformedSearches: SavedSearch[] = (data || []).map((dbRecord: any) => ({
        id: dbRecord.id,
        name: dbRecord.search_name || 'Unnamed Search',
        filters: dbRecord.search_params as JobFiltersType || {
          jobTypes: [],
          locations: [],
          salaryRanges: [],
          categories: [],
          skills: [],
          experienceLevels: []
        },
        notify_new_matches: Boolean(dbRecord.notify_new_matches || false),
        notification_frequency: dbRecord.notification_frequency || 'daily',
        tags: dbRecord.tags || [],
        created_at: dbRecord.created_at,
        last_viewed_at: dbRecord.last_viewed_at,
        last_notified_at: dbRecord.last_notified_at
      }));
      
      setSavedSearches(transformedSearches);
      
      // Calculate new matches for each saved search (mock implementation)
      const mockNewMatches: Record<string, number> = {};
      transformedSearches.forEach(search => {
        // Simulate some searches having new matches
        if (Math.random() > 0.5) {
          mockNewMatches[search.id] = Math.floor(Math.random() * 10) + 1;
        }
      });
      setNewMatches(mockNewMatches);
    } catch (error: any) {
      setIsLoading(false);
      setError({
        type: ErrorType.UNKNOWN,
        message: error.message || 'Unknown error',
        userMessage: 'An unexpected error occurred',
        retryable: true,
        originalError: error
      });
    }
  };

  const saveSearch = async (searchName: string, notifyNewMatches: boolean, tags: string[] = [], frequency: string = 'daily') => {
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
      (currentFilters.jobTypes && currentFilters.jobTypes.length > 0) || 
      (currentFilters.locations && currentFilters.locations.length > 0) || 
      (currentFilters.salaryRanges && currentFilters.salaryRanges.length > 0) || 
      (currentFilters.categories && currentFilters.categories.length > 0) ||
      (currentFilters.skills && currentFilters.skills.length > 0) ||
      (currentFilters.experienceLevels && currentFilters.experienceLevels.length > 0);

    if (!hasActiveFilters) {
      toast.error('Please apply some filters before saving');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Create the search data object with all required fields
      const searchData: SavedSearchInsertType = {
        profile_id: userId,
        search_name: searchName.trim(),
        search_params: currentFilters,
        notify_new_matches: notifyNewMatches,
        tags: tags,
        notification_frequency: frequency,
        last_viewed_at: new Date().toISOString()
      };
      
      // Insert the search
      const { data, error } = await supabase
        .from('saved_searches')
        .insert(searchData)
        .select();
          
      if (error) throw error;
      
      // Transform the database record to our application model
      const newSearches: SavedSearch[] = (data || []).map((dbRecord: any) => ({
        id: dbRecord.id,
        name: dbRecord.search_name || 'Unnamed Search',
        filters: dbRecord.search_params as JobFiltersType || DEFAULT_FILTERS,
        notify_new_matches: Boolean(dbRecord.notify_new_matches || false),
        notification_frequency: dbRecord.notification_frequency || 'daily',
        tags: dbRecord.tags || [],
        created_at: dbRecord.created_at,
        last_viewed_at: dbRecord.last_viewed_at,
        last_notified_at: dbRecord.last_notified_at
      }));
      
      setSavedSearches([...newSearches, ...savedSearches]);
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

  const applySearch = (filters: JobFiltersType) => {
    onApplySearch(filters);
    setManageDialogOpen(false);
    toast.success('Search applied');
  };

  const toggleNotification = async (id: string, notify: boolean) => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Update the notification setting
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

  const updateNotificationFrequency = async (id: string, frequency: string) => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Update the notification frequency
      const { error } = await supabase
        .from('saved_searches')
        .update({ notification_frequency: frequency })
        .eq('id', id);

      if (error) throw error;
      
      setSavedSearches(savedSearches.map(search => 
        search.id === id ? { ...search, notification_frequency: frequency } : search
      ));
      
      toast.success(`Notification frequency updated to ${frequency}`);
    } catch (error: any) {
      console.error('Error updating notification frequency:', error);
      toast.error('Failed to update notification settings');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTags = async (id: string, tags: string[]) => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Update the tags
      const { error } = await supabase
        .from('saved_searches')
        .update({ tags: tags })
        .eq('id', id);

      if (error) throw error;
      
      setSavedSearches(savedSearches.map(search => 
        search.id === id ? { ...search, tags } : search
      ));
      
      toast.success('Tags updated successfully');
    } catch (error: any) {
      console.error('Error updating tags:', error);
      toast.error('Failed to update tags');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsViewed = async (id: string) => {
    if (!userId) return;
    
    try {
      // Update last viewed timestamp
      const { error } = await supabase
        .from('saved_searches')
        .update({ last_viewed_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      // Clear new matches count for this search
      setNewMatches(prev => {
        const updated = {...prev};
        delete updated[id];
        return updated;
      });
    } catch (error: any) {
      console.error('Error marking search as viewed:', error);
    }
  };

  const formatFilterSummary = (searchParams: any) => {
    const parts = [];
    
    if (searchParams.query) parts.push(`"${searchParams.query}"`);
    
    if (searchParams.locations && searchParams.locations.length > 0) {
      parts.push(`in ${searchParams.locations.join(', ')}`);
    }
    
    if (searchParams.jobTypes && searchParams.jobTypes.length > 0) {
      parts.push(`${searchParams.jobTypes.join(', ')} roles`);
    }
    
    if (parts.length === 0) return "All jobs";
    return parts.join(' ');
  };

  const handleRetry = async () => {
    await fetchSavedSearches();
    return null;
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
              onSave={(name, notifyMatches, tags, frequency) => saveSearch(name, notifyMatches, tags, frequency)}
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
                onApplySearch={(filters) => {
                  applySearch(filters);
                  // Find the search id by matching filters
                  const searchId = savedSearches.find(s => s.filters === filters)?.id;
                  if (searchId) markAsViewed(searchId);
                }}
                onToggleNotification={toggleNotification}
                onDeleteSearch={deleteSearch}
                onUpdateTags={updateTags}
                onUpdateFrequency={updateNotificationFrequency}
                newMatches={newMatches}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SavedSearches;

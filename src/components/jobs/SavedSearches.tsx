
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Save, Plus, BookmarkCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { JobFilters } from '@/pages/Jobs';

interface SavedSearchesProps {
  currentFilters: JobFilters;
  onApplySearch: (filters: JobFilters) => void;
}

// Import SavedSearchCard component
import SavedSearchCard from './SavedSearchCard';

const SavedSearches: React.FC<SavedSearchesProps> = ({ currentFilters, onApplySearch }) => {
  const [savedSearches, setSavedSearches] = useState<Tables<'saved_searches'>[]>([]);
  const [loading, setLoading] = useState(false);
  const [newSearchName, setNewSearchName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [notifyNewMatches, setNotifyNewMatches] = useState(false);

  // Check if current filters are applied and not empty
  const hasActiveFilters = () => {
    return (
      currentFilters.jobTypes.length > 0 ||
      currentFilters.locations.length > 0 ||
      currentFilters.salaryRanges.length > 0 ||
      currentFilters.categories.length > 0 ||
      currentFilters.skills.length > 0 ||
      currentFilters.experienceLevels.length > 0 ||
      currentFilters.query !== ''
    );
  };

  useEffect(() => {
    const fetchSavedSearches = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('saved_searches')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching saved searches:', error);
          toast.error('Failed to load saved searches');
          return;
        }

        setSavedSearches(data || []);
      } catch (err) {
        console.error('Unexpected error:', err);
        toast.error('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedSearches();
  }, []);

  const handleSaveSearch = async () => {
    if (!newSearchName.trim()) {
      toast.error('Please enter a name for your search');
      return;
    }

    try {
      // Convert JobFilters to plain object to store as JSON
      const searchParamsJson = JSON.stringify(currentFilters);
      
      const { data, error } = await supabase
        .from('saved_searches')
        .insert({
          search_name: newSearchName.trim(),
          search_params: JSON.parse(searchParamsJson),
          notify_new_matches: notifyNewMatches
        })
        .select();

      if (error) {
        console.error('Error saving search:', error);
        toast.error('Failed to save search');
        return;
      }

      setSavedSearches(prev => [data[0], ...prev]);
      toast.success('Search saved successfully');
      setShowSaveDialog(false);
      setNewSearchName('');
      setNotifyNewMatches(false);
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('An unexpected error occurred');
    }
  };

  const handleDeleteSearch = async (id: string) => {
    try {
      const { error } = await supabase
        .from('saved_searches')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting search:', error);
        toast.error('Failed to delete search');
        return;
      }

      setSavedSearches(prev => prev.filter(search => search.id !== id));
      toast.success('Search deleted successfully');
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('An unexpected error occurred');
    }
  };

  const handleApplySearch = (search: Tables<'saved_searches'>) => {
    if (search.search_params) {
      // Update last_viewed_at
      supabase
        .from('saved_searches')
        .update({ last_viewed_at: new Date().toISOString() })
        .eq('id', search.id)
        .then(({ error }) => {
          if (error) {
            console.error('Error updating last viewed:', error);
          }
        });
      
      // Apply the search filters
      const searchFilters = search.search_params as unknown as JobFilters;
      
      // Make sure all required properties are present
      const filtersToApply: JobFilters = {
        jobTypes: searchFilters.jobTypes || [],
        locations: searchFilters.locations || [],
        salaryRanges: searchFilters.salaryRanges || [],
        categories: searchFilters.categories || [],
        skills: searchFilters.skills || [],
        experienceLevels: searchFilters.experienceLevels || [],
        query: searchFilters.query || '',
      };
      
      onApplySearch(filtersToApply);
      toast.info(`Applied search: ${search.search_name}`);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Saved Searches</CardTitle>
          <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2"
                disabled={!hasActiveFilters()}
                title={!hasActiveFilters() ? 'Apply some filters first' : 'Save current search'}
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
                <Button onClick={handleSaveSearch}>Save Search</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="px-2">
        {loading ? (
          <div className="py-4 text-center text-gray-500">Loading saved searches...</div>
        ) : savedSearches.length === 0 ? (
          <div className="py-4 text-center text-gray-500">
            No saved searches yet. Save a search to see it here.
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {savedSearches.map((search) => (
              <SavedSearchCard 
                key={search.id} 
                search={search}
                onApply={() => handleApplySearch(search)}
                onDelete={() => handleDeleteSearch(search.id)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavedSearches;

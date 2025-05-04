import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookmarkPlus, Trash2, Bell, Search } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { JobFilters } from '@/components/JobFilters';

type SavedSearch = {
  id: string;
  name: string;
  filters: JobFilters;
  notify_new_matches: boolean;
  created_at: string;
};

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
  const [searchName, setSearchName] = useState('');
  const [notifyNewMatches, setNotifyNewMatches] = useState(false);

  // Fetch saved searches when component mounts or userId changes
  useEffect(() => {
    if (userId) {
      fetchSavedSearches();
    }
  }, [userId]);

  const fetchSavedSearches = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedSearches(data || []);
    } catch (error) {
      console.error('Error fetching saved searches:', error);
      toast.error('Failed to load saved searches');
    } finally {
      setIsLoading(false);
    }
  };

  const saveSearch = async () => {
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
      setSearchName('');
      setNotifyNewMatches(false);
      toast.success('Search saved successfully');
    } catch (error) {
      console.error('Error saving search:', error);
      toast.error('Failed to save search');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSearch = async (id: string) => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('saved_searches')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setSavedSearches(savedSearches.filter(search => search.id !== id));
      toast.success('Search deleted successfully');
    } catch (error) {
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
    } catch (error) {
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

  return (
    <div>
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
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="search-name">Search Name</Label>
                <Input
                  id="search-name"
                  placeholder="e.g., Remote Developer Jobs"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="notify"
                  checked={notifyNewMatches}
                  onCheckedChange={setNotifyNewMatches}
                />
                <Label htmlFor="notify">Notify me about new matching jobs</Label>
              </div>
              <div className="bg-muted p-3 rounded-md">
                <h4 className="text-sm font-medium mb-2">Current Filters</h4>
                <p className="text-sm text-muted-foreground">
                  {formatFilterSummary(currentFilters)}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveSearch} disabled={isLoading || !searchName.trim()}>
                {isLoading ? 'Saving...' : 'Save Search'}
              </Button>
            </DialogFooter>
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
              {savedSearches.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">You don't have any saved searches yet.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {savedSearches.map((search) => (
                    <Card key={search.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{search.name}</CardTitle>
                            <CardDescription>
                              {formatFilterSummary(search.filters)}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleNotification(search.id, !search.notify_new_matches)}
                              title={search.notify_new_matches ? "Disable notifications" : "Enable notifications"}
                            >
                              <Bell className={`h-4 w-4 ${search.notify_new_matches ? 'text-hirely' : 'text-muted-foreground'}`} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteSearch(search.id)}
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
                          onClick={() => applySearch(search.filters)}
                          className="w-full"
                        >
                          Apply This Search
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SavedSearches;
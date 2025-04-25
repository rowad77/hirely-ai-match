import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Briefcase, Pencil, Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

interface ProfileExperienceProps {
  experiences: Tables<'work_experiences'>[];
  setExperiences: (experiences: Tables<'work_experiences'>[]) => void;
}

type Experience = {
  id?: string;
  company_name: string;
  job_title: string;
  start_date: string;
  end_date?: string;
  is_current?: boolean;
  description?: string;
};

const ProfileExperience = ({ experiences, setExperiences }: ProfileExperienceProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<Experience>({
    company_name: '',
    job_title: '',
    start_date: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentExperience(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setCurrentExperience(prev => {
      const updated = { ...prev, is_current: checked };
      if (checked) {
        delete updated.end_date;
      }
      return updated;
    });
  };

  const handleAddExperience = () => {
    setIsEditing(false);
    setCurrentExperience({
      company_name: '',
      job_title: '',
      start_date: '',
    });
    setIsDialogOpen(true);
  };

  const handleEditExperience = (exp: Experience) => {
    setIsEditing(true);
    setCurrentExperience(exp);
    setIsDialogOpen(true);
  };

  const handleDeleteExperience = async (id: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('work_experiences')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setExperiences(prev => prev.filter(exp => exp.id !== id));
      toast.success('Experience deleted');
    } catch (error) {
      console.error('Error deleting experience:', error);
      toast.error('Failed to delete experience');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!currentExperience.company_name || !currentExperience.job_title || !currentExperience.start_date) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isEditing && currentExperience.id) {
        // Update existing experience
        const { error } = await supabase
          .from('work_experiences')
          .update({
            company_name: currentExperience.company_name,
            job_title: currentExperience.job_title,
            start_date: currentExperience.start_date,
            end_date: currentExperience.end_date,
            is_current: currentExperience.is_current,
            description: currentExperience.description
          })
          .eq('id', currentExperience.id);
          
        if (error) throw error;
        
        setExperiences(prev => 
          prev.map(exp => (exp.id === currentExperience.id ? currentExperience as Tables<'work_experiences'> : exp))
        );
        
        toast.success('Experience updated successfully');
      } else {
        // Create new experience
        const { data, error } = await supabase
          .from('work_experiences')
          .insert({
            company_name: currentExperience.company_name,
            job_title: currentExperience.job_title,
            start_date: currentExperience.start_date,
            end_date: currentExperience.end_date,
            is_current: currentExperience.is_current || false,
            description: currentExperience.description
          })
          .select()
          .single();
          
        if (error) throw error;
        
        setExperiences(prev => [...prev, data as Tables<'work_experiences'>]);
        toast.success('Experience added successfully');
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving experience:', error);
      toast.error('Failed to save experience');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Work Experience</h2>
        <Button onClick={handleAddExperience} size="sm" className="bg-hirely hover:bg-hirely-dark">
          <Plus className="mr-2 h-4 w-4" /> Add Experience
        </Button>
      </div>

      {experiences.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No work experience added yet. Add your professional experience to improve your profile.
          </CardContent>
        </Card>
      ) : (
        experiences.map((exp) => (
          <Card key={exp.id} className="overflow-hidden">
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{exp.job_title}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Briefcase className="h-3 w-3 mr-1" />
                    {exp.company_name}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditExperience(exp)}
                    className="h-8 w-8 p-0"
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => exp.id && handleDeleteExperience(exp.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 pt-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">
                  {format(new Date(exp.start_date), 'MMM yyyy')} - 
                  {exp.is_current 
                    ? ' Present'
                    : exp.end_date
                      ? ` ${format(new Date(exp.end_date), 'MMM yyyy')}`
                      : ''
                  }
                </Badge>
                {exp.is_current && <Badge>Current</Badge>}
              </div>
              
              {exp.description && (
                <p className="text-sm text-muted-foreground mt-2">{exp.description}</p>
              )}
            </CardContent>
          </Card>
        ))
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <Label htmlFor="job_title">Job Title*</Label>
                <Input
                  id="job_title"
                  name="job_title"
                  value={currentExperience.job_title}
                  onChange={handleInputChange}
                  placeholder="Software Engineer, Project Manager, etc."
                />
              </div>
              
              <div className="col-span-1">
                <Label htmlFor="company_name">Company*</Label>
                <Input
                  id="company_name"
                  name="company_name"
                  value={currentExperience.company_name}
                  onChange={handleInputChange}
                  placeholder="Company Name"
                />
              </div>
              
              <div className="col-span-1">
                <Label htmlFor="start_date">Start Date*</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  value={currentExperience.start_date}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="col-span-1">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_current"
                      checked={currentExperience.is_current || false}
                      onCheckedChange={handleSwitchChange}
                    />
                    <Label htmlFor="is_current" className="text-sm">
                      I currently work here
                    </Label>
                  </div>
                </div>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  value={currentExperience.end_date || ''}
                  onChange={handleInputChange}
                  disabled={currentExperience.is_current}
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={currentExperience.description || ''}
                  onChange={handleInputChange}
                  placeholder="Describe your responsibilities and achievements"
                  rows={4}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileExperience;

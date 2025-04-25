
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface ProfileEducationProps {
  education: Tables<'education'>[];
  setEducation: (education: Tables<'education'>[] | ((prev: Tables<'education'>[]) => Tables<'education'>[])) => void;
}

type Education = {
  id?: string;
  institution: string;
  degree: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  description?: string;
};

const ProfileEducation = ({ education, setEducation }: ProfileEducationProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentEducation, setCurrentEducation] = useState<Education>({
    institution: '',
    degree: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentEducation(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setCurrentEducation(prev => {
      const updated = { ...prev, is_current: checked };
      if (checked) {
        delete updated.end_date;
      }
      return updated;
    });
  };

  const handleAddEducation = () => {
    setIsEditing(false);
    setCurrentEducation({
      institution: '',
      degree: '',
    });
    setIsDialogOpen(true);
  };

  const handleEditEducation = (edu: Education) => {
    setIsEditing(true);
    setCurrentEducation(edu);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      if (isEditing && currentEducation.id) {
        const { error } = await supabase
          .from('education')
          .update({
            institution: currentEducation.institution,
            degree: currentEducation.degree,
            field_of_study: currentEducation.field_of_study,
            start_date: currentEducation.start_date,
            end_date: currentEducation.end_date,
            is_current: currentEducation.is_current,
            description: currentEducation.description
          })
          .eq('id', currentEducation.id);

        if (error) throw error;

        setEducation((prev: Tables<'education'>[]) => 
          prev.map(edu => edu.id === currentEducation.id 
            ? { ...edu, ...currentEducation } as Tables<'education'> 
            : edu
          )
        );
        
        toast.success('Education updated successfully');
      } else {
        const { data, error } = await supabase
          .from('education')
          .insert({
            institution: currentEducation.institution,
            degree: currentEducation.degree,
            field_of_study: currentEducation.field_of_study,
            start_date: currentEducation.start_date,
            end_date: currentEducation.end_date,
            is_current: currentEducation.is_current,
            description: currentEducation.description
          })
          .select()
          .single();

        if (error) throw error;

        setEducation((prev: Tables<'education'>[]) => [...prev, data as Tables<'education'>]);
        toast.success('Education added successfully');
      }

      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving education:', error);
      toast.error('Failed to save education');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('education')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setEducation((prev: Tables<'education'>[]) => prev.filter(edu => edu.id !== id));
      toast.success('Education deleted successfully');
    } catch (error) {
      console.error('Error deleting education:', error);
      toast.error('Failed to delete education');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Education</h2>
        <Button onClick={handleAddEducation} size="sm" className="bg-hirely hover:bg-hirely-dark">
          <Plus className="mr-2 h-4 w-4" /> Add Education
        </Button>
      </div>

      {education.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No education added yet. Add your educational background to improve your profile.
          </CardContent>
        </Card>
      ) : (
        education.map((edu) => (
          <Card key={edu.id} className="overflow-hidden">
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{edu.degree}</CardTitle>
                  <div className="text-sm text-muted-foreground mt-1">{edu.institution}</div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditEducation(edu)}
                    className="h-8 w-8 p-0"
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => edu.id && handleDelete(edu.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 pt-0">
              {edu.field_of_study && (
                <p className="text-sm text-muted-foreground mt-2">Field of Study: {edu.field_of_study}</p>
              )}
              {edu.start_date && edu.end_date ? (
                <p className="text-sm text-muted-foreground mt-2">
                  {edu.start_date} - {edu.end_date}
                </p>
              ) : null}
              {edu.description && (
                <p className="text-sm text-muted-foreground mt-2">{edu.description}</p>
              )}
            </CardContent>
          </Card>
        ))
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Education' : 'Add Education'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="institution">Institution</Label>
                <Input
                  id="institution"
                  name="institution"
                  value={currentEducation.institution}
                  onChange={handleInputChange}
                  placeholder="University, College, etc."
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="degree">Degree</Label>
                <Input
                  id="degree"
                  name="degree"
                  value={currentEducation.degree}
                  onChange={handleInputChange}
                  placeholder="Bachelor's, Master's, etc."
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="field_of_study">Field of Study</Label>
                <Input
                  id="field_of_study"
                  name="field_of_study"
                  value={currentEducation.field_of_study || ''}
                  onChange={handleInputChange}
                  placeholder="Computer Science, Engineering, etc."
                />
              </div>
              
              <div className="col-span-1">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  value={currentEducation.start_date || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="col-span-1">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_current"
                      checked={currentEducation.is_current || false}
                      onCheckedChange={handleSwitchChange}
                    />
                    <Label htmlFor="is_current" className="text-sm">
                      I currently study here
                    </Label>
                  </div>
                </div>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  value={currentEducation.end_date || ''}
                  onChange={handleInputChange}
                  disabled={currentEducation.is_current}
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={currentEducation.description || ''}
                  onChange={handleInputChange}
                  placeholder="Describe your achievements and courses"
                  rows={4}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileEducation;

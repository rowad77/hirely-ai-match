
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Pencil, Trash2, GraduationCap, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ProfileEducationProps {
  education: Tables<'education'>[];
  setEducation: (education: Tables<'education'>[]) => void;
}

const educationSchema = z.object({
  institution: z.string().min(1, { message: 'Institution is required' }),
  degree: z.string().min(1, { message: 'Degree is required' }),
  field_of_study: z.string().optional(),
  start_date: z.date({ required_error: "Start date is required" }),
  end_date: z.date().optional().nullable(),
  is_current: z.boolean().default(false),
  description: z.string().optional(),
});

type EducationFormValues = z.infer<typeof educationSchema>;

const ProfileEducation = ({ education, setEducation }: ProfileEducationProps) => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentEducation, setCurrentEducation] = useState<Tables<'education'> | null>(null);
  const [saving, setSaving] = useState(false);

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: '',
      degree: '',
      field_of_study: '',
      start_date: new Date(),
      end_date: null,
      is_current: false,
      description: '',
    }
  });

  const openEditDialog = (edu: Tables<'education'>) => {
    setCurrentEducation(edu);
    form.reset({
      institution: edu.institution,
      degree: edu.degree,
      field_of_study: edu.field_of_study || '',
      start_date: edu.start_date ? new Date(edu.start_date) : new Date(),
      end_date: edu.end_date ? new Date(edu.end_date) : null,
      is_current: edu.is_current || false,
      description: edu.description || '',
    });
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setCurrentEducation(null);
    form.reset({
      institution: '',
      degree: '',
      field_of_study: '',
      start_date: new Date(),
      end_date: null,
      is_current: false,
      description: '',
    });
    setIsDialogOpen(true);
  };

  const watchIsCurrent = form.watch('is_current');

  const onSubmit = async (values: EducationFormValues) => {
    if (!user) return;
    
    setSaving(true);
    
    try {
      // Format dates for database
      const formattedValues = {
        ...values,
        profile_id: user.id,
        start_date: format(values.start_date, 'yyyy-MM-dd'),
        end_date: values.is_current ? null : values.end_date ? format(values.end_date, 'yyyy-MM-dd') : null,
      };
      
      if (currentEducation) {
        // Update existing education
        const { error } = await supabase
          .from('education')
          .update(formattedValues)
          .eq('id', currentEducation.id);
          
        if (error) throw error;
        
        setEducation(education.map(edu => 
          edu.id === currentEducation.id ? { ...edu, ...formattedValues } : edu
        ));
        
        toast.success('Education updated successfully');
      } else {
        // Add new education
        const { data, error } = await supabase
          .from('education')
          .insert(formattedValues)
          .select();
          
        if (error) throw error;
        
        if (data && data[0]) {
          setEducation([...education, data[0]]);
          toast.success('Education added successfully');
        }
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving education:', error);
      toast.error('Failed to save education');
    } finally {
      setSaving(false);
    }
  };

  const deleteEducation = async (edu: Tables<'education'>) => {
    if (!confirm('Are you sure you want to delete this education record?')) return;
    
    try {
      const { error } = await supabase
        .from('education')
        .delete()
        .eq('id', edu.id);
        
      if (error) throw error;
      
      setEducation(education.filter(e => e.id !== edu.id));
      toast.success('Education deleted successfully');
    } catch (error) {
      console.error('Error deleting education:', error);
      toast.error('Failed to delete education');
    }
  };

  return (
    <div>
      <div className="space-y-4 mb-6">
        {education.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <GraduationCap className="mx-auto h-12 w-12 mb-4 text-muted-foreground/70" />
            <h3 className="text-lg font-medium">No education added yet</h3>
            <p className="text-sm mt-1 mb-4">Add your educational background to enhance your profile</p>
          </div>
        ) : (
          education.map((edu) => (
            <Card key={edu.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="flex-grow p-6">
                    <h3 className="text-lg font-semibold">{edu.degree}</h3>
                    <p className="text-muted-foreground">{edu.institution}</p>
                    {edu.field_of_study && (
                      <p className="text-sm">{edu.field_of_study}</p>
                    )}
                    <div className="text-sm text-muted-foreground mt-1">
                      {edu.start_date && format(new Date(edu.start_date), 'MMM yyyy')} - {' '}
                      {edu.is_current ? 'Present' : edu.end_date && format(new Date(edu.end_date), 'MMM yyyy')}
                    </div>
                    {edu.description && (
                      <p className="text-sm mt-2">{edu.description}</p>
                    )}
                  </div>
                  <div className="flex justify-end p-4 md:p-6 gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEditDialog(edu)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => deleteEducation(edu)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={openNewDialog} 
          className="bg-hirely hover:bg-hirely-dark"
        >
          Add Education
        </Button>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{currentEducation ? 'Edit Education' : 'Add Education'}</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution</FormLabel>
                    <FormControl>
                      <Input placeholder="University or school name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="degree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Degree</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Bachelor's, Master's, Certificate" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="field_of_study"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field of Study</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Computer Science" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "MMM yyyy")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {!watchIsCurrent && (
                  <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "MMM yyyy")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value || undefined}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              
              <FormField
                control={form.control}
                name="is_current"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-start space-x-3 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>I'm currently studying here</FormLabel>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Additional information about your education" 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-hirely hover:bg-hirely-dark"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileEducation;

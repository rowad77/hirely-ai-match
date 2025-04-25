
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
import { Pencil, Trash2, Briefcase, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ProfileExperienceProps {
  experiences: Tables<'work_experiences'>[];
  setExperiences: (experiences: Tables<'work_experiences'>[]) => void;
}

const experienceSchema = z.object({
  job_title: z.string().min(1, { message: 'Job title is required' }),
  company_name: z.string().min(1, { message: 'Company name is required' }),
  start_date: z.date({ required_error: "Start date is required" }),
  end_date: z.date().optional().nullable(),
  is_current: z.boolean().default(false),
  description: z.string().optional(),
});

type ExperienceFormValues = z.infer<typeof experienceSchema>;

const ProfileExperience = ({ experiences, setExperiences }: ProfileExperienceProps) => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<Tables<'work_experiences'> | null>(null);
  const [saving, setSaving] = useState(false);

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      job_title: '',
      company_name: '',
      start_date: new Date(),
      end_date: null,
      is_current: false,
      description: '',
    }
  });

  const openEditDialog = (exp: Tables<'work_experiences'>) => {
    setCurrentExperience(exp);
    form.reset({
      job_title: exp.job_title,
      company_name: exp.company_name,
      start_date: exp.start_date ? new Date(exp.start_date) : new Date(),
      end_date: exp.end_date ? new Date(exp.end_date) : null,
      is_current: exp.is_current || false,
      description: exp.description || '',
    });
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setCurrentExperience(null);
    form.reset({
      job_title: '',
      company_name: '',
      start_date: new Date(),
      end_date: null,
      is_current: false,
      description: '',
    });
    setIsDialogOpen(true);
  };

  const watchIsCurrent = form.watch('is_current');

  const onSubmit = async (values: ExperienceFormValues) => {
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
      
      if (currentExperience) {
        // Update existing experience
        const { error } = await supabase
          .from('work_experiences')
          .update(formattedValues)
          .eq('id', currentExperience.id);
          
        if (error) throw error;
        
        setExperiences(experiences.map(exp => 
          exp.id === currentExperience.id ? { ...exp, ...formattedValues } : exp
        ));
        
        toast.success('Experience updated successfully');
      } else {
        // Add new experience
        const { data, error } = await supabase
          .from('work_experiences')
          .insert(formattedValues)
          .select();
          
        if (error) throw error;
        
        if (data && data[0]) {
          setExperiences([...experiences, data[0]]);
          toast.success('Experience added successfully');
        }
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving experience:', error);
      toast.error('Failed to save experience');
    } finally {
      setSaving(false);
    }
  };

  const deleteExperience = async (exp: Tables<'work_experiences'>) => {
    if (!confirm('Are you sure you want to delete this work experience?')) return;
    
    try {
      const { error } = await supabase
        .from('work_experiences')
        .delete()
        .eq('id', exp.id);
        
      if (error) throw error;
      
      setExperiences(experiences.filter(e => e.id !== exp.id));
      toast.success('Experience deleted successfully');
    } catch (error) {
      console.error('Error deleting experience:', error);
      toast.error('Failed to delete experience');
    }
  };

  return (
    <div>
      <div className="space-y-4 mb-6">
        {experiences.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Briefcase className="mx-auto h-12 w-12 mb-4 text-muted-foreground/70" />
            <h3 className="text-lg font-medium">No work experience added yet</h3>
            <p className="text-sm mt-1 mb-4">Add your work history to enhance your profile</p>
          </div>
        ) : (
          experiences.map((exp) => (
            <Card key={exp.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="flex-grow p-6">
                    <h3 className="text-lg font-semibold">{exp.job_title}</h3>
                    <p className="text-muted-foreground">{exp.company_name}</p>
                    <div className="text-sm text-muted-foreground mt-1">
                      {exp.start_date && format(new Date(exp.start_date), 'MMM yyyy')} - {' '}
                      {exp.is_current ? 'Present' : exp.end_date && format(new Date(exp.end_date), 'MMM yyyy')}
                    </div>
                    {exp.description && (
                      <p className="text-sm mt-2">{exp.description}</p>
                    )}
                  </div>
                  <div className="flex justify-end p-4 md:p-6 gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEditDialog(exp)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => deleteExperience(exp)}
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
          Add Experience
        </Button>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{currentExperience ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="job_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Software Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Acme Corporation" {...field} />
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
                    <FormLabel>I'm currently working here</FormLabel>
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
                        placeholder="Describe your responsibilities and achievements" 
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

export default ProfileExperience;

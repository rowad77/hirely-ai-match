
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      applicationId, 
      status, 
      interviewRequirements = null 
    }: { 
      applicationId: string; 
      status: string; 
      interviewRequirements?: string | null;
    }) => {
      const { error } = await supabase
        .from('applications')
        .update({ 
          status,
          interview_requirements: interviewRequirements,
          status_updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application-notifications'] });
      toast.success('Application status updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update application status', {
        description: error.message
      });
    }
  });
};

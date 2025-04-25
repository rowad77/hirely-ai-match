
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useApplicationNotifications = () => {
  return useQuery({
    queryKey: ['application-notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('application_notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Failed to fetch notifications');
        throw error;
      }

      return data;
    }
  });
};

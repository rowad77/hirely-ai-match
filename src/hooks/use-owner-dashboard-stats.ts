
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DashboardStats {
  companies: number;
  jobs: number;
  users: number;
  applications: number;
  recentUploads: number;
}

interface ActivityItem {
  id: string;
  user_id: string;
  activity_type: string;
  timestamp: string;
  data?: any;
}

export const useOwnerDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    companies: 0,
    jobs: 0,
    users: 0,
    applications: 0,
    recentUploads: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // First approach: Use the get_dashboard_stats function
      const { data: dashboardStats, error: statsError } = await supabase
        .rpc('get_dashboard_stats');
      
      if (statsError) {
        console.error('Error fetching dashboard stats:', statsError);
        // Fallback to direct queries if the function fails
        const [
          { count: companiesCount },
          { count: jobsCount },
          { count: usersCount },
          { count: applicationsCount }
        ] = await Promise.all([
          supabase.from('companies').select('*', { count: 'exact', head: true }),
          supabase.from('jobs').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('applications').select('*', { count: 'exact', head: true })
        ]);

        setStats({
          companies: companiesCount || 0,
          jobs: jobsCount || 0,
          users: usersCount || 0,
          applications: applicationsCount || 0,
          recentUploads: 0
        });
      } else {
        // Use data from the function
        setStats({
          companies: dashboardStats?.companies_count || 0,
          jobs: dashboardStats?.jobs_count || 0,
          users: dashboardStats?.users_count || 0,
          applications: dashboardStats?.applications_count || 0,
          recentUploads: 0
        });

        // Set recent activity from the dashboard stats
        if (dashboardStats?.recent_activity) {
          setRecentActivity(dashboardStats.recent_activity);
        }
      }
      
      // Get recent resume uploads for the count
      const { data: resumeUploads } = await supabase
        .from('user_activity')
        .select('*')
        .eq('activity_type', 'resume_upload')
        .order('timestamp', { ascending: false })
        .limit(10);
        
      if (resumeUploads) {
        setStats(prev => ({
          ...prev,
          recentUploads: resumeUploads.length
        }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Set up realtime subscription for dashboard updates
    const channel = supabase
      .channel('dashboard-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_activity' },
        (payload) => {
          // Refresh dashboard data on new activity
          fetchDashboardData();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { 
    stats, 
    loading, 
    recentActivity,
    refetchData: fetchDashboardData 
  };
};

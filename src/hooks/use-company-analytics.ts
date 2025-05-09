
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AnalyticsData {
  applications: {
    name: string;
    applications: number;
    interviews: number;
  }[];
  sources: {
    name: string;
    value: number;
  }[];
  skills: {
    name: string;
    count: number;
  }[];
  hiringFunnel: {
    stage: string;
    count: number;
  }[];
  engagementMetrics: {
    category: string;
    value: number;
    average: number;
  }[];
  timeToHire: number;
  applicationsByDemographic: {
    name: string;
    value: number;
  }[];
}

export const useCompanyAnalytics = (dateRange: '7d' | '30d' | '90d' = '30d') => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('company_id')
          .single();

        if (profileError || !profileData) {
          throw new Error('Company not found');
        }

        const companyId = profileData.company_id;

        // Get date range
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - (dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90));

        // Fetch applications data
        const { data: applicationsData, error: applicationsError } = await supabase
          .from('applications')
          .select(`
            id,
            created_at,
            status,
            jobs(company_id)
          `)
          .gte('created_at', startDate.toISOString())
          .eq('jobs.company_id', companyId);

        if (applicationsError) throw applicationsError;

        // Process applications data into time series
        const applicationsByDate = new Map();
        const interviewsByDate = new Map();
        const applicationsByStatus = new Map();

        applicationsData.forEach(app => {
          const date = new Date(app.created_at).toLocaleDateString();
          applicationsByDate.set(date, (applicationsByDate.get(date) || 0) + 1);
          
          if (app.status === 'interview_scheduled') {
            interviewsByDate.set(date, (interviewsByDate.get(date) || 0) + 1);
          }
          
          applicationsByStatus.set(app.status, (applicationsByStatus.get(app.status) || 0) + 1);
        });

        // Fetch application sources
        const { data: sourcesData, error: sourcesError } = await supabase
          .from('user_activity')
          .select('activity_data')
          .eq('activity_type', 'application_source')
          .gte('timestamp', startDate.toISOString());

        if (sourcesError) throw sourcesError;

        const sourceStats = new Map();
        sourcesData.forEach(activity => {
          if (activity.activity_data && typeof activity.activity_data === 'object') {
            // Check if activity_data is an object and has a source property
            const activityData = activity.activity_data as Record<string, any>;
            if (activityData.source) {
              sourceStats.set(activityData.source, (sourceStats.get(activityData.source) || 0) + 1);
            }
          }
        });

        // Fetch candidate skills
        // First, get applications related to the company
        const { data: applicationsForSkills, error: applicationsForSkillsError } = await supabase
          .from('applications')
          .select('candidate_id')
          .eq('jobs.company_id', companyId)
          .gte('created_at', startDate.toISOString());

        if (applicationsForSkillsError) throw applicationsForSkillsError;

        // Then get the skills from those candidates' profiles
        const candidateIds = applicationsForSkills.map(app => app.candidate_id);
        
        const { data: skillsData, error: skillsError } = await supabase
          .from('profiles')
          .select('skills')
          .in('id', candidateIds);

        if (skillsError) throw skillsError;

        const skillStats = new Map();
        skillsData.forEach(profile => {
          if (profile.skills && Array.isArray(profile.skills)) {
            profile.skills.forEach((skill: string) => {
              skillStats.set(skill, (skillStats.get(skill) || 0) + 1);
            });
          }
        });
        
        // Calculate time to hire (mock data for now)
        const timeToHire = Math.floor(Math.random() * 10) + 12; // 12-21 days
        
        // Create hiring funnel data
        const hiringFunnel = [
          { stage: 'Applied', count: applicationsData.length },
          { stage: 'Screened', count: Math.floor(applicationsData.length * 0.7) },
          { stage: 'Interview', count: Math.floor(applicationsData.length * 0.4) },
          { stage: 'Technical', count: Math.floor(applicationsData.length * 0.25) },
          { stage: 'Offer', count: Math.floor(applicationsData.length * 0.15) },
          { stage: 'Hired', count: Math.floor(applicationsData.length * 0.1) },
        ];
        
        // Create engagement metrics data (mock data)
        const engagementMetrics = [
          { category: 'Response Rate', value: 75, average: 62 },
          { category: 'Interview Accept', value: 68, average: 55 },
          { category: 'Offer Accept', value: 82, average: 70 },
          { category: 'Profile Views', value: 95, average: 80 },
        ];
        
        // Mock demographic data
        const applicationsByDemographic = [
          { name: 'Frontend', value: 35 },
          { name: 'Backend', value: 30 },
          { name: 'Fullstack', value: 20 },
          { name: 'DevOps', value: 10 },
          { name: 'Design', value: 5 },
        ];

        // Format data for charts
        setData({
          applications: Array.from(applicationsByDate.entries()).map(([name, applications]) => ({
            name,
            applications,
            interviews: interviewsByDate.get(name) || 0
          })),
          sources: Array.from(sourceStats.entries()).map(([name, value]) => ({
            name,
            value: value as number
          })),
          skills: Array.from(skillStats.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => ({
              name,
              count: count as number
            })),
          hiringFunnel,
          engagementMetrics,
          timeToHire,
          applicationsByDemographic
        });

      } catch (err: any) {
        console.error('Error fetching analytics:', err);
        setError(err.message);
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [dateRange]);

  return { data, loading, error };
};

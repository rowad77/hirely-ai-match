import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import OwnerLayout from '@/components/layout/OwnerLayout';
import { Building, Briefcase, Users, LineChart, Upload } from 'lucide-react';
import { featuredJobs } from '@/data/jobs';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const OwnerDashboard = () => {
  const [stats, setStats] = useState({
    companies: 15,
    jobs: featuredJobs.length,
    users: 120,
    applications: 354,
    recentUploads: 0
  });
  
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const { data: resumeUploads, error: uploadsError } = await supabase
          .from('user_activity')
          .select('*')
          .eq('activity_type', 'resume_upload')
          .order('timestamp', { ascending: false })
          .limit(5);
          
        if (uploadsError) throw uploadsError;
        
        const { count, error: countError } = await supabase
          .from('user_activity')
          .select('*', { count: 'exact', head: true })
          .eq('activity_type', 'resume_upload');
          
        if (countError) throw countError;
        
        if (count !== null) {
          setStats(prev => ({
            ...prev,
            recentUploads: count
          }));
        }
        
        if (resumeUploads) {
          const formattedActivity = await Promise.all(resumeUploads.map(async (activity) => {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', activity.user_id)
              .single();
              
            return {
              id: activity.id,
              type: 'resume_upload',
              userName: profileData?.full_name || 'Anonymous User',
              details: activity.activity_data,
              timestamp: activity.timestamp
            };
          }));
          
          setRecentActivity(formattedActivity);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    
    fetchRecentActivity();
  }, []);
  
  const getRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    const diffHours = Math.round(diffMins / 60);
    if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    const diffDays = Math.round(diffHours / 24);
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  };

  return (
    <OwnerLayout title="Owner Dashboard">
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Companies</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.companies}</h3>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Building className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-6">
                <span className="text-sm font-medium text-green-500">+12%</span>
                <span className="text-sm font-medium text-gray-500 ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Jobs</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.jobs}</h3>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-6">
                <span className="text-sm font-medium text-green-500">+7%</span>
                <span className="text-sm font-medium text-gray-500 ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Users</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.users}</h3>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-6">
                <span className="text-sm font-medium text-green-500">+18%</span>
                <span className="text-sm font-medium text-gray-500 ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Applications</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.applications}</h3>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <LineChart className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-6">
                <span className="text-sm font-medium text-green-500">+24%</span>
                <span className="text-sm font-medium text-gray-500 ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">CV Uploads</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.recentUploads}</h3>
                </div>
                <div className="bg-indigo-100 p-3 rounded-full">
                  <Upload className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <div className="mt-6">
                <span className="text-sm font-medium text-green-500">+15%</span>
                <span className="text-sm font-medium text-gray-500 ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4">
                    <div className="bg-indigo-100 p-2 rounded-full">
                      <Upload className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium">Resume uploaded</p>
                      <p className="text-sm text-gray-500">{activity.userName} uploaded their resume</p>
                      <p className="text-xs text-gray-400 mt-1">{getRelativeTime(activity.timestamp)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-start space-x-4">
                  <div className="bg-indigo-100 p-2 rounded-full">
                    <Upload className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium">No recent resume uploads</p>
                    <p className="text-sm text-gray-500">Users haven't uploaded any resumes recently</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Building className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">New company registered</p>
                  <p className="text-sm text-gray-500">TechCorp Inc. created an account</p>
                  <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <Briefcase className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">New job posted</p>
                  <p className="text-sm text-gray-500">Senior Developer position at Acme Inc.</p>
                  <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </OwnerLayout>
  );
};

export default OwnerDashboard;

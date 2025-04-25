
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import OwnerLayout from '@/components/layout/OwnerLayout';
import { Building, Briefcase, Users, LineChart, Upload } from 'lucide-react';
import { LoadingState } from '@/components/ui/loading-state';
import { supabase } from '@/integrations/supabase/client';

const OwnerDashboard = () => {
  const [stats, setStats] = useState({
    companies: 0,
    jobs: 0,
    users: 0,
    applications: 0,
    recentUploads: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
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
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <OwnerLayout title="Owner Dashboard">
        <LoadingState message="Loading dashboard data..." />
      </OwnerLayout>
    );
  }

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

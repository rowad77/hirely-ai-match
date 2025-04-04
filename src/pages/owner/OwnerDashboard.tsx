
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import OwnerLayout from '@/components/layout/OwnerLayout';
import { Building, Briefcase, Users, LineChart } from 'lucide-react';
import { featuredJobs } from '@/data/jobs';

const OwnerDashboard = () => {
  // Mock statistics
  const stats = {
    companies: 15,
    jobs: featuredJobs.length,
    users: 120,
    applications: 354
  };

  return (
    <OwnerLayout title="Owner Dashboard">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
              
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">New user registered</p>
                  <p className="text-sm text-gray-500">Jane Smith created a candidate account</p>
                  <p className="text-xs text-gray-400 mt-1">1 day ago</p>
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


import { useState } from 'react';
import { Link } from 'react-router-dom';
import CompanyLayout from '@/components/layout/CompanyLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Users, LineChart, Clock, ArrowUp, ArrowDown, Plus } from 'lucide-react';
import { featuredJobs } from '@/data/jobs';

const CompanyDashboard = () => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');
  const activeJobs = featuredJobs.length;
  const totalApplications = 124;
  const newApplications = 17;
  
  // Mock statistics
  const stats = [
    {
      name: 'Active Jobs',
      value: activeJobs,
      icon: Briefcase,
      change: 2,
      trend: 'up',
      description: 'jobs currently open',
      link: '/company/jobs',
      linkText: 'View all jobs'
    },
    {
      name: 'Total Applications',
      value: totalApplications,
      icon: Users,
      change: 12,
      trend: 'up',
      description: 'applications received',
      link: '/company/applications',
      linkText: 'View all applications'
    },
    {
      name: 'Application Rate',
      value: '89%',
      icon: LineChart,
      change: 5,
      trend: 'up',
      description: 'applicants complete the process',
      link: '/company/analytics',
      linkText: 'View analytics'
    },
    {
      name: 'Average Time to Hire',
      value: '9.2',
      icon: Clock,
      change: 1.5,
      trend: 'down',
      description: 'days to hire (improved)',
      link: '/company/analytics',
      linkText: 'View analytics'
    },
  ];

  return (
    <CompanyLayout title="Company Dashboard">
      <div className="grid gap-6">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold mb-1">Welcome back, TechCorp</h2>
            <p className="text-gray-600">Here's what's happening with your job postings today.</p>
          </div>
          <div className="flex gap-2">
            <Link to="/company/jobs/new">
              <Button className="bg-hirely hover:bg-hirely-dark flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Post New Job
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.name} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2 flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-medium text-gray-700">{stat.name}</CardTitle>
                  </div>
                  <Icon className="h-5 w-5 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="flex items-center gap-1 text-sm mb-4">
                    <div className={`flex items-center ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.trend === 'up' ? (
                        <ArrowUp className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDown className="h-4 w-4 mr-1" />
                      )}
                      {stat.change}%
                    </div>
                    <span className="text-gray-500">vs last {timeframe === 'weekly' ? 'week' : 'month'}</span>
                  </div>
                  <CardDescription className="flex justify-between items-center">
                    <span>{stat.description}</span>
                    <Link to={stat.link} className="text-xs text-hirely hover:underline">
                      {stat.linkText}
                    </Link>
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>
                You have {newApplications} new applications to review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="p-4 border rounded-md flex justify-between items-center hover:bg-gray-50">
                    <div>
                      <h4 className="font-medium">{`Applicant ${item}`}</h4>
                      <div className="text-sm text-gray-500">Applied for Senior Frontend Developer</div>
                      <div className="text-xs text-gray-400">2 hours ago</div>
                    </div>
                    <Link to={`/company/applications/${item}`}>
                      <Button variant="outline" size="sm">Review</Button>
                    </Link>
                  </div>
                ))}
                <div className="text-center mt-4">
                  <Link to="/company/applications" className="text-hirely hover:underline text-sm">
                    View all {totalApplications} applications
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Active Job Postings</CardTitle>
              <CardDescription>
                Your {activeJobs} most recent job listings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {featuredJobs.slice(0, 3).map((job) => (
                  <div key={job.id} className="p-3 border rounded-md hover:bg-gray-50">
                    <h4 className="font-medium">{job.title}</h4>
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-xs text-gray-500">{job.location} • {job.type}</div>
                      <div className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {Math.floor(Math.random() * 20) + 1} applicants
                      </div>
                    </div>
                  </div>
                ))}
                <div className="text-center mt-4">
                  <Link to="/company/jobs" className="text-hirely hover:underline text-sm">
                    View all {activeJobs} job postings
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CompanyLayout>
  );
};

export default CompanyDashboard;

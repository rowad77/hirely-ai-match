
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Building, Briefcase, Users, Upload } from 'lucide-react';

interface ActivityItem {
  id: string;
  user_id: string;
  activity_type: string;
  timestamp: string;
  data?: any;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export const RecentActivity = ({ activities }: RecentActivityProps) => {
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <Users className="h-4 w-4 text-indigo-600" />;
      case 'resume_upload':
        return <Upload className="h-4 w-4 text-indigo-600" />;
      case 'job_post':
        return <Briefcase className="h-4 w-4 text-green-600" />;
      case 'company_register':
        return <Building className="h-4 w-4 text-blue-600" />;
      default:
        return <Briefcase className="h-4 w-4 text-indigo-600" />;
    }
  };

  const getActivityTitle = (activity: ActivityItem) => {
    switch (activity.activity_type) {
      case 'login':
        return 'User Login';
      case 'resume_upload':
        return 'Resume uploaded';
      case 'job_post':
        return 'New job posted';
      case 'company_register':
        return 'New company registered';
      default:
        return 'User Activity';
    }
  };

  const getActivityDescription = (activity: ActivityItem) => {
    switch (activity.activity_type) {
      case 'login':
        return 'User logged into the system';
      case 'resume_upload':
        return 'User uploaded their resume';
      case 'job_post':
        return activity.data?.job_title 
          ? `${activity.data.job_title} at ${activity.data.company_name}` 
          : 'A new job was posted';
      case 'company_register':
        return activity.data?.company_name 
          ? `${activity.data.company_name} created an account` 
          : 'A new company was registered';
      default:
        return 'User performed an action';
    }
  };
  
  const getIconBackground = (type: string) => {
    switch (type) {
      case 'login':
        return 'bg-indigo-100';
      case 'resume_upload':
        return 'bg-indigo-100';
      case 'job_post':
        return 'bg-green-100';
      case 'company_register':
        return 'bg-blue-100';
      default:
        return 'bg-indigo-100';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className={`${getIconBackground(activity.activity_type)} p-2 rounded-full`}>
                  {getActivityIcon(activity.activity_type)}
                </div>
                <div>
                  <p className="font-medium">{getActivityTitle(activity)}</p>
                  <p className="text-sm text-gray-500">{getActivityDescription(activity)}</p>
                  <p className="text-xs text-gray-400 mt-1">{getRelativeTime(activity.timestamp)}</p>
                </div>
              </div>
            ))
          ) : (
            <>
              <div className="flex items-start space-x-4">
                <div className="bg-indigo-100 p-2 rounded-full">
                  <Upload className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium">No recent activity</p>
                  <p className="text-sm text-gray-500">No user activity has been recorded recently</p>
                </div>
              </div>
              
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
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};


import { Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link } from 'react-router-dom';

interface RecentJob {
  id: string;
  title: string;
  company: string;
  viewedAt: string;
}

const RecentlyViewed = () => {
  // This would typically come from a context or local storage
  const recentJobs: RecentJob[] = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      viewedAt: '2 hours ago'
    },
    {
      id: '2',
      title: 'UX Designer',
      company: 'DesignCo',
      viewedAt: '3 hours ago'
    },
    {
      id: '3',
      title: 'Product Manager',
      company: 'ProductLabs',
      viewedAt: '5 hours ago'
    }
  ];

  if (recentJobs.length === 0) return null;

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-4 w-4 text-gray-500" />
          <h3 className="font-medium">Recently Viewed</h3>
        </div>
        <ScrollArea className="h-[120px]">
          <div className="space-y-2">
            {recentJobs.map((job) => (
              <Link
                key={job.id}
                to={`/job/${job.id}`}
                className="block p-2 hover:bg-gray-50 rounded-md transition-colors"
              >
                <div className="font-medium text-sm">{job.title}</div>
                <div className="text-sm text-gray-500 flex justify-between">
                  <span>{job.company}</span>
                  <span>{job.viewedAt}</span>
                </div>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RecentlyViewed;

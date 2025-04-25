
import { useOwnerDashboardStats } from '@/hooks/use-owner-dashboard-stats';
import OwnerLayout from '@/components/layout/OwnerLayout';
import { Building, Briefcase, Users, LineChart, Upload } from 'lucide-react';
import { LoadingState } from '@/components/ui/loading-state';
import { StatCard } from '@/components/owner/StatCard';
import { RecentActivity } from '@/components/owner/RecentActivity';

const OwnerDashboard = () => {
  const { stats, loading, recentActivity } = useOwnerDashboardStats();

  if (loading) {
    return (
      <OwnerLayout title="Owner Dashboard">
        <LoadingState message="Loading dashboard data..." />
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout title="Owner Dashboard">
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard 
            title="Total Companies"
            value={stats.companies}
            icon={Building}
            color="purple"
            change={{
              value: "+12%",
              timeframe: "from last month"
            }}
          />

          <StatCard 
            title="Total Jobs"
            value={stats.jobs}
            icon={Briefcase}
            color="blue"
            change={{
              value: "+7%",
              timeframe: "from last month"
            }}
          />

          <StatCard 
            title="Total Users"
            value={stats.users}
            icon={Users}
            color="green"
            change={{
              value: "+18%",
              timeframe: "from last month"
            }}
          />

          <StatCard 
            title="Applications"
            value={stats.applications}
            icon={LineChart}
            color="orange"
            change={{
              value: "+24%",
              timeframe: "from last month"
            }}
          />

          <StatCard 
            title="CV Uploads"
            value={stats.recentUploads}
            icon={Upload}
            color="indigo"
            change={{
              value: "+15%",
              timeframe: "from last month"
            }}
          />
        </div>

        <RecentActivity activities={recentActivity} />
      </div>
    </OwnerLayout>
  );
};

export default OwnerDashboard;

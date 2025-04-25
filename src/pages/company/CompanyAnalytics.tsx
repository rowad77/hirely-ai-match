import { useState, useEffect } from 'react';
import CompanyLayout from '@/components/layout/CompanyLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Analytics from '@/components/company/Analytics';
import { LoadingState } from '@/components/ui/loading-state';
import { useCompanyAnalytics } from '@/hooks/useCompanyAnalytics';

const CompanyAnalytics = () => {
  const [activeTab, setActiveTab] = useState('applications');
  const { data, loading, error } = useCompanyAnalytics('30d');

  if (loading) {
    return (
      <CompanyLayout title="Company Analytics">
        <LoadingState message="Loading analytics data..." />
      </CompanyLayout>
    );
  }

  if (error) {
    return (
      <CompanyLayout title="Company Analytics">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-800">Error loading analytics: {error}</p>
        </div>
      </CompanyLayout>
    );
  }

  return (
    <CompanyLayout title="Company Analytics">
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium">Performance Overview</h2>
          <p className="text-sm text-muted-foreground">
            Track your company's metrics, hiring funnel, and candidate engagement.
          </p>
        </div>

        <Tabs 
          defaultValue="applications" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="hiring">Hiring Funnel</TabsTrigger>
            <TabsTrigger value="engagement">Candidate Engagement</TabsTrigger>
          </TabsList>
          
          {data && (
            <>
              <TabsContent value="applications">
                <Analytics dataType="applications" data={data} />
              </TabsContent>
              
              <TabsContent value="hiring">
                <Analytics dataType="hiring" data={data} />
              </TabsContent>
              
              <TabsContent value="engagement">
                <Analytics dataType="engagement" data={data} />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </CompanyLayout>
  );
};

export default CompanyAnalytics;

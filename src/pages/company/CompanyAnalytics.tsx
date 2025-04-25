
import { useState, useEffect } from 'react';
import CompanyLayout from '@/components/layout/CompanyLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Analytics from '@/components/company/Analytics';
import { LoadingState } from '@/components/ui/loading-state';

const CompanyAnalytics = () => {
  const [activeTab, setActiveTab] = useState('applications');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading when tab changes
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [activeTab]);

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
          
          {isLoading ? (
            <LoadingState message="Loading analytics data..." />
          ) : (
            <>
              <TabsContent value="applications">
                <Analytics dataType="applications" />
              </TabsContent>
              
              <TabsContent value="hiring">
                <Analytics dataType="hiring" />
              </TabsContent>
              
              <TabsContent value="engagement">
                <Analytics dataType="engagement" />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </CompanyLayout>
  );
};

export default CompanyAnalytics;

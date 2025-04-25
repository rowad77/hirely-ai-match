
import CompanyLayout from "@/components/layout/CompanyLayout";
import Analytics from "@/components/company/Analytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

const CompanyAnalytics = () => {
  const [activeTab, setActiveTab] = useState<string>("applications");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Simulate data loading
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [activeTab]);

  return (
    <CompanyLayout title="Analytics Dashboard">
      <div className="space-y-6">
        <p className="text-gray-600">
          Track your company's performance metrics, application trends, and hiring efficiency.
        </p>
        
        <Card className="p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="hiring">Hiring Funnel</TabsTrigger>
              <TabsTrigger value="engagement">Candidate Engagement</TabsTrigger>
            </TabsList>
            
            <TabsContent value="applications" className="space-y-4">
              <Analytics isLoading={isLoading} />
            </TabsContent>
            
            <TabsContent value="hiring" className="space-y-4">
              <Analytics isLoading={isLoading} dataType="hiring" />
            </TabsContent>
            
            <TabsContent value="engagement" className="space-y-4">
              <Analytics isLoading={isLoading} dataType="engagement" />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </CompanyLayout>
  );
};

export default CompanyAnalytics;

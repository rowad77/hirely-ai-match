
import { useState } from 'react';
import CompanyLayout from '@/components/layout/CompanyLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Analytics from '@/components/company/Analytics';

const CompanyAnalytics = () => {
  const [activeTab, setActiveTab] = useState('applications');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <CompanyLayout title="Company Analytics">
      <Tabs 
        defaultValue="applications" 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="hiring">Hiring Funnel</TabsTrigger>
          <TabsTrigger value="engagement">Candidate Engagement</TabsTrigger>
        </TabsList>
        
        <TabsContent value="applications">
          <Analytics isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="hiring">
          <Analytics isLoading={isLoading} dataType="hiring" />
        </TabsContent>
        
        <TabsContent value="engagement">
          <Analytics isLoading={isLoading} dataType="engagement" />
        </TabsContent>
      </Tabs>
    </CompanyLayout>
  );
};

export default CompanyAnalytics;

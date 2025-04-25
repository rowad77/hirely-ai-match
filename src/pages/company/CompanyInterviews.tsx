
import { useState } from 'react';
import CompanyLayout from '@/components/layout/CompanyLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InterviewSchedule from '@/components/company/InterviewSchedule';
import CandidatePipeline from '@/components/company/CandidatePipeline';

const CompanyInterviews = () => {
  const [activeTab, setActiveTab] = useState('schedule');

  return (
    <CompanyLayout title="Interview Management">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <p className="text-gray-600">Manage your interviews and track candidate progress throughout the hiring process.</p>
          <Button className="bg-hirely hover:bg-hirely-dark">
            Schedule New Interview
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="schedule">Interview Schedule</TabsTrigger>
            <TabsTrigger value="pipeline">Candidate Pipeline</TabsTrigger>
          </TabsList>
          <TabsContent value="schedule" className="mt-4">
            <InterviewSchedule />
          </TabsContent>
          <TabsContent value="pipeline" className="mt-4">
            <CandidatePipeline />
          </TabsContent>
        </Tabs>
      </div>
    </CompanyLayout>
  );
};

export default CompanyInterviews;

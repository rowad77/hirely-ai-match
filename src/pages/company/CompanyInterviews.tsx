
import { useState } from 'react';
import CompanyLayout from '@/components/layout/CompanyLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InterviewSchedule from '@/components/company/InterviewSchedule';
import CandidatePipeline from '@/components/company/CandidatePipeline';
import { useTranslation } from '@/translations';

const CompanyInterviews = () => {
  const [activeTab, setActiveTab] = useState('schedule');
  const { t } = useTranslation();

  return (
    <CompanyLayout title={t('interviews.title')}>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <p className="text-gray-600">
            {t('interviews.description')}
          </p>
          <Button className="bg-hirely hover:bg-hirely-dark">
            {t('interviews.scheduleNew')}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="schedule">
              {t('interviews.tabs.schedule')}
            </TabsTrigger>
            <TabsTrigger value="pipeline">
              {t('interviews.tabs.pipeline')}
            </TabsTrigger>
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


import { useState } from 'react';
import CompanyLayout from '@/components/layout/CompanyLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InterviewSchedule from '@/components/company/InterviewSchedule';
import CandidatePipeline from '@/components/company/CandidatePipeline';
import { useLanguage } from '@/context/LanguageContext';
import { useRtlDirection, useRtlTextAlign } from '@/lib/rtl-utils';
import { CalendarPlus } from 'lucide-react';

const CompanyInterviews = () => {
  const [activeTab, setActiveTab] = useState('schedule');
  const { t, language } = useLanguage();
  const rtlDirection = useRtlDirection();
  const rtlTextAlign = useRtlTextAlign();

  return (
    <CompanyLayout title={t('interview_management')}>
      <div className="space-y-6">
        <div className={`flex flex-wrap gap-4 justify-between items-center ${rtlDirection}`}>
          <p className={`text-gray-600 ${rtlTextAlign}`}>{t('manage_interviews')}</p>
          <Button className="bg-hirely hover:bg-hirely-dark flex items-center gap-2">
            <CalendarPlus className="h-4 w-4" />
            {t('schedule_new')}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className={`grid w-full grid-cols-2 ${rtlDirection}`}>
            <TabsTrigger value="schedule">{t('interview_schedule')}</TabsTrigger>
            <TabsTrigger value="pipeline">{t('candidate_pipeline')}</TabsTrigger>
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

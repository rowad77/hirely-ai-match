import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import MainLayout from '@/components/layout/MainLayout';
import SavedJobs from '@/components/dashboard/SavedJobs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const { t } = useLanguage();
  
  useEffect(() => {
    // Load saved jobs from localStorage
    const savedJobsString = localStorage.getItem('savedJobs');
    if (savedJobsString) {
      try {
        const parsedJobs = JSON.parse(savedJobsString);
        setSavedJobs(Array.isArray(parsedJobs) ? parsedJobs : []);
      } catch (e) {
        console.error('Error parsing saved jobs:', e);
        setSavedJobs([]);
      }
    }
  }, []);
  
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">{t('dashboard')}</h1>
        
        <Tabs defaultValue="saved_jobs">
          <TabsList className="mb-6">
            <TabsTrigger value="saved_jobs">{t('saved_jobs')}</TabsTrigger>
            <TabsTrigger value="applications">{t('my_applications')}</TabsTrigger>
            <TabsTrigger value="profile">{t('profile')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="saved_jobs">
            <SavedJobs />
          </TabsContent>
          
          <TabsContent value="applications">
            <div className="p-8 text-center bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium">{t('no_applications')}</h3>
              <p className="text-gray-600 mt-2">{t('applications_appear')}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="profile">
            <div className="p-8 text-center bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium">{t('profile_settings')}</h3>
              <p className="text-gray-600 mt-2">{t('profile_available')}</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Dashboard;

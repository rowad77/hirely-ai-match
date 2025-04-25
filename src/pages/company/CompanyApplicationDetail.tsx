
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CompanyLayout from '@/components/layout/CompanyLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import ApplicantProfile from '@/components/company/application/ApplicantProfile';
import ApplicationTabs from '@/components/company/application/ApplicationTabs';
import { useApplicationStatus } from '@/hooks/use-application-status';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const CompanyApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isInterviewDialogOpen, setIsInterviewDialogOpen] = useState(false);
  
  const { data: application, isLoading } = useQuery({
    queryKey: ['application', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          candidate:candidate_id(
            id,
            email,
            full_name,
            avatar_url,
            phone_text
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const { mutate: updateStatus } = useApplicationStatus();
  
  const handleUpdateStatus = (newStatus: string) => {
    if (!id) return;
    updateStatus({ applicationId: id, status: newStatus });
  };
  
  const handleSendInterviewInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setIsInterviewDialogOpen(false);
    if (!id) return;
    
    updateStatus({ 
      applicationId: id, 
      status: 'interview_scheduled',
      interviewRequirements: 'Interview scheduled' // You might want to make this dynamic
    });
  };

  if (isLoading) {
    return <CompanyLayout title="Loading...">Loading...</CompanyLayout>;
  }

  if (!application) {
    return <CompanyLayout title="Not Found">Application not found</CompanyLayout>;
  }

  return (
    <CompanyLayout title="Application Review">
      <div className="space-y-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-4"
            onClick={() => navigate('/company/applications')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            Application Review
          </h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ApplicantProfile 
            application={application}
            applicationStatus={application.status}
            setApplicationStatus={handleUpdateStatus}
            isInterviewDialogOpen={isInterviewDialogOpen}
            setIsInterviewDialogOpen={setIsInterviewDialogOpen}
            handleSendInterviewInvite={handleSendInterviewInvite}
          />
          <ApplicationTabs application={application} />
        </div>
      </div>
    </CompanyLayout>
  );
};

export default CompanyApplicationDetail;

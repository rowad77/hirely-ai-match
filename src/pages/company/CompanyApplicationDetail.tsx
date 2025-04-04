
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CompanyLayout from '@/components/layout/CompanyLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import ApplicantProfile from '@/components/company/application/ApplicantProfile';
import ApplicationTabs from '@/components/company/application/ApplicationTabs';

const CompanyApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [applicationStatus, setApplicationStatus] = useState('New');
  const [isInterviewDialogOpen, setIsInterviewDialogOpen] = useState(false);
  
  // Mock application data for the selected application id
  const application = {
    id: parseInt(id || '1'),
    applicant: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    jobTitle: 'Senior Frontend Developer',
    company: 'TechCorp',
    salary: '$120,000 - $150,000',
    appliedDate: '2023-04-02',
    status: applicationStatus,
    resumeUrl: '/placeholder.svg',
    coverLetter: 'I am excited to apply for the Senior Frontend Developer position at TechCorp. With over 5 years of experience in React, TypeScript, and modern frontend frameworks, I believe I have the skills and expertise to contribute to your team and help build exceptional user experiences.',
    score: 92,
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'GraphQL', 'Node.js'],
    education: 'Bachelor of Science in Computer Science, Stanford University',
    experience: [
      {
        role: 'Frontend Developer',
        company: 'Tech Solutions Inc.',
        period: 'Jan 2020 - Present',
        description: 'Lead frontend development for multiple client projects, focusing on React, TypeScript, and state management solutions.'
      },
      {
        role: 'Junior Developer',
        company: 'WebApps Co.',
        period: 'Jun 2018 - Dec 2019',
        description: 'Contributed to the development of responsive web applications using React and JavaScript.'
      }
    ],
    videoAnswers: [
      {
        question: 'Tell us about yourself and your experience with similar roles.',
        videoUrl: '#'
      },
      {
        question: 'What are your strengths and how would they contribute to this position?',
        videoUrl: '#'
      },
      {
        question: 'Describe a challenging situation you faced at work and how you handled it.',
        videoUrl: '#'
      }
    ],
    aiInsights: [
      'Strong problem-solving skills demonstrated in past projects',
      'Excellent communication skills evident in video interviews',
      'Experience with required tech stack is above average',
      'Candidate shows leadership potential based on past roles',
      'Cultural fit score: 88%'
    ]
  };
  
  const handleSendInterviewInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setIsInterviewDialogOpen(false);
    toast.success('Interview invitation sent successfully!');
  };

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
            Application: {application.jobTitle}
          </h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ApplicantProfile 
            application={application}
            applicationStatus={applicationStatus}
            setApplicationStatus={setApplicationStatus}
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

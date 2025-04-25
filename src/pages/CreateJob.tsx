
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useRtlDirection, useRtlTextAlign } from '@/lib/rtl-utils';

const CreateJob = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);
  const { t, language } = useLanguage();
  const rtlDirection = useRtlDirection();
  const rtlTextAlign = useRtlTextAlign();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // This is where we would integrate with the backend
    // For the MVP, we'll just simulate a loading state
    
    setTimeout(() => {
      setLoading(false);
      alert(t('job_creation_notice') || 'Job creation feature will be implemented with backend integration!');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className={`mb-8 flex items-center ${rtlDirection}`}>
          <Link to="/dashboard" className={`text-hirely hover:text-hirely-dark flex items-center ${rtlDirection}`}>
            <ArrowLeft className="h-5 w-5 mx-1" />
            {t('back_to_dashboard') || 'Back to Dashboard'}
          </Link>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className={`text-2xl ${rtlTextAlign}`}>{t('add_job') || 'Create New Job'}</CardTitle>
            <CardDescription className={rtlTextAlign}>
              {t('job_form_description') || 'Fill out the form below to create a new job posting. Our AI will optimize your job description for better visibility.'}
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title" className={rtlTextAlign}>{t('job_title') || 'Job Title'}</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder={t('job_title_placeholder') || 'e.g. Senior Frontend Developer'}
                  className={`mt-1 ${rtlTextAlign}`}
                />
              </div>
              
              <div>
                <Label htmlFor="location" className={rtlTextAlign}>{t('location') || 'Location'}</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={t('location_placeholder') || 'e.g. Remote, New York, NY'}
                  className={`mt-1 ${rtlTextAlign}`}
                />
              </div>
              
              <div>
                <Label htmlFor="description" className={rtlTextAlign}>{t('job_description') || 'Job Description'}</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder={t('job_description_placeholder') || 'Describe the role, responsibilities, requirements...'}
                  className={`mt-1 h-40 ${rtlTextAlign}`}
                />
              </div>
              
              <div>
                <Label htmlFor="skills" className={rtlTextAlign}>{t('required_skills') || 'Required Skills (comma separated)'}</Label>
                <Textarea
                  id="skills"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder={t('skills_placeholder') || 'e.g. React, TypeScript, Node.js'}
                  className={`mt-1 ${rtlTextAlign}`}
                />
              </div>
              
              <div className={`bg-gray-50 p-4 rounded-md ${rtlTextAlign}`}>
                <h3 className="text-sm font-medium text-gray-900">{t('interview_setup') || 'Interview Setup'}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {t('ai_interview_generation') || 'Our AI will automatically generate relevant interview questions based on the job description and required skills.'}
                </p>
                <div className={`mt-4 flex items-center ${rtlDirection}`}>
                  <input
                    id="ai-interviews"
                    name="ai-interviews"
                    type="checkbox"
                    className="h-4 w-4 text-hirely focus:ring-hirely-dark border-gray-300 rounded"
                    defaultChecked
                  />
                  <label htmlFor="ai-interviews" className={`mx-2 text-sm text-gray-700 ${rtlTextAlign}`}>
                    {t('enable_ai_interviews') || 'Enable AI-generated video interviews'}
                  </label>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className={`flex ${language === 'ar' ? 'justify-start' : 'justify-end'} space-x-4`}>
              <Button variant="outline" type="button">
                {t('save_as_draft') || 'Save as Draft'}
              </Button>
              <Button className="bg-hirely hover:bg-hirely-dark" type="submit" disabled={loading}>
                <Save className="mx-2 h-4 w-4" />
                {loading ? (t('publishing') || 'Publishing...') : (t('publish_job') || 'Publish Job')}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateJob;

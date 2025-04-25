
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/context/LanguageContext';
import { useRtlTextAlign } from '@/lib/rtl-utils';

const Documentation = () => {
  const { t, language } = useLanguage();
  const rtlTextAlign = useRtlTextAlign();

  // Additional translations that may not be in the main translation object
  const docTranslations = {
    en: {
      title: 'Hirely Documentation',
      welcome: 'Welcome to the Hirely documentation. Here you\'ll find detailed information about using our platform.',
      getting_started: 'Getting Started',
      features: 'Features',
      ai_resume: 'AI Resume Analysis',
      ai_resume_desc: 'Our AI-powered resume analysis tool helps you understand your strengths and weaknesses as a candidate.',
      video_interview: 'Video Interview Preparation',
      video_interview_desc: 'Practice your interview skills with our AI-powered video interview preparation tool.',
      job_matching: 'Job Matching',
      job_matching_desc: 'Our AI algorithm matches you with jobs that fit your skills and experience.',
      cv_extraction: 'CV Extraction and Profile Updates',
      cv_extraction_desc: 'When you upload your CV, our AI not only analyzes it but also extracts key information to enhance your profile:',
      extraction_info: 'This information helps us match you more accurately with job opportunities and saves you time when applying for positions.'
    },
    ar: {
      title: 'توثيق هايرلي',
      welcome: 'مرحبًا بك في توثيق هايرلي. ستجد هنا معلومات مفصلة حول استخدام منصتنا.',
      getting_started: 'البدء',
      features: 'الميزات',
      ai_resume: 'تحليل السيرة الذاتية بالذكاء الاصطناعي',
      ai_resume_desc: 'تساعدك أداة تحليل السيرة الذاتية المدعومة بالذكاء الاصطناعي على فهم نقاط القوة والضعف لديك كمرشح.',
      video_interview: 'التحضير لمقابلة الفيديو',
      video_interview_desc: 'مارس مهارات المقابلة الخاصة بك مع أداة التحضير للمقابلة المدعومة بالذكاء الاصطناعي.',
      job_matching: 'مطابقة الوظائف',
      job_matching_desc: 'تقوم خوارزمية الذكاء الاصطناعي لدينا بمطابقتك مع الوظائف التي تناسب مهاراتك وخبرتك.',
      cv_extraction: 'استخراج السيرة الذاتية وتحديثات الملف الشخصي',
      cv_extraction_desc: 'عندما تقوم بتحميل سيرتك الذاتية، لا يقوم الذكاء الاصطناعي لدينا بتحليلها فحسب، بل يستخرج أيضًا معلومات أساسية لتحسين ملفك الشخصي:',
      extraction_info: 'تساعدنا هذه المعلومات على مطابقتك بشكل أكثر دقة مع فرص العمل وتوفير الوقت عند التقدم للوظائف.'
    }
  };

  const d = language === 'ar' ? docTranslations.ar : docTranslations.en;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className={`text-3xl font-bold mb-6 ${rtlTextAlign}`}>{d.title}</h1>
        <div className={`prose max-w-none ${rtlTextAlign}`}>
          <p className="text-lg">{d.welcome}</p>
          
          <h2 className="text-2xl mt-10 mb-4 font-bold">{d.getting_started}</h2>
          <ul className={`list-disc ${language === 'ar' ? 'pr-6' : 'pl-6'} space-y-2`}>
            <li>{t('profile_creation') || 'Creating a Profile'}</li>
            <li>{t('search_jobs') || 'Searching for Jobs'}</li>
            <li>{t('apply_for_job') || 'Applying to Positions'}</li>
          </ul>
          
          <h2 className="text-2xl mt-10 mb-4 font-bold">{d.features}</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mt-6 mb-2">{d.ai_resume}</h3>
              <p className="mb-2">{d.ai_resume_desc}</p>
              <ul className={`list-disc ${language === 'ar' ? 'pr-6' : 'pl-6'} space-y-1`}>
                <li>{t('upload_resume_formats') || 'Upload your resume in PDF, DOC, DOCX, or TXT format'}</li>
                <li>{t('receive_ai_feedback') || 'Receive AI-generated feedback on your resume'}</li>
                <li>{t('get_suggestions') || 'Get suggestions for improvements'}</li>
                <li>{t('extract_info') || 'Automatically extract your skills, education, and work experience'}</li>
                <li>{t('update_profile') || 'Update your profile with the extracted information'}</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mt-6 mb-2">{d.video_interview}</h3>
              <p>{d.video_interview_desc}</p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mt-6 mb-2">{d.job_matching}</h3>
              <p>{d.job_matching_desc}</p>
            </div>
          </div>
          
          <h2 className="text-2xl mt-10 mb-4 font-bold">{d.cv_extraction}</h2>
          <p className="mb-4">
            {d.cv_extraction_desc}
          </p>
          <ul className={`list-disc ${language === 'ar' ? 'pr-6' : 'pl-6'} space-y-1`}>
            <li>
              <span className="font-medium">{t('skills')}:</span> {t('skills_identified') || 'Technical and soft skills are identified and added to your profile'}
            </li>
            <li>
              <span className="font-medium">{t('education')}:</span> {t('education_extracted') || 'Your educational background, degrees, and certifications are extracted'}
            </li>
            <li>
              <span className="font-medium">{t('work_experience')}:</span> {t('experience_extracted') || 'Your job history including titles, companies, and dates is automatically populated'}
            </li>
            <li>
              <span className="font-medium">{t('personal_information')}:</span> {t('basic_info_extracted') || 'Basic information like your name may be extracted if not already in your profile'}
            </li>
          </ul>
          <p className="mt-4">
            {d.extraction_info}
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Documentation;

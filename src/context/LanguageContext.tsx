
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.body.className = language === 'ar' ? 'font-arabic rtl' : 'ltr';
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // General
    'search': 'Search',
    'loading': 'Loading...',
    'not_found': 'Not found',
    'no_results': 'No results found.',
    'back': 'Back',
    'next': 'Next',
    'previous': 'Previous',
    'submit': 'Submit',
    'cancel': 'Cancel',
    'delete': 'Delete',
    'edit': 'Edit',
    'view': 'View',
    'save': 'Save',
    'clear': 'Clear',
    'close': 'Close',
    'yes': 'Yes',
    'no': 'No',
    'success': 'Success',
    'error': 'Error',
    'warning': 'Warning',
    'info': 'Info',
    'all': 'All',
    'applied': 'Applied',
    'screening': 'Screening',
    'interview': 'Interview',
    'final': 'Final',
    'rejected': 'Rejected',
    'match_score': 'Match Score',
    'hiring_progress': 'Hiring Progress',
    'view_details': 'View Details',
    'no_candidates': 'No candidates found with the selected filter.',
    
    // Auth
    'welcome_back': 'Welcome Back!',
    'sign_in_message': 'Sign in to access your dashboard and continue your journey with Hirely\'s AI-powered recruitment platform.',
    'sign_in_account': 'Sign in to your account',
    'dont_have_account': 'Don\'t have an account?',
    'email_address': 'Email address',
    'password': 'Password',
    'forgot_password': 'Forgot your password?',
    'signing_in': 'Signing in...',
    'sign_up': 'Sign up',
    'log_in': 'Log in',
    'sign_out': 'Sign Out',
    'logout': 'Logout',
    
    // Navigation
    'home': 'Home',
    'jobs': 'Jobs',
    'dashboard': 'Dashboard',
    'saved_jobs': 'Saved Jobs',
    'my_applications': 'My Applications',
    'profile': 'Profile',
    'settings': 'Settings',
    'company_portal': 'Company Portal',
    'admin_panel': 'Admin Panel',
    
    // Dashboard
    'no_applications': 'No applications yet',
    'applications_appear': 'Once you apply for jobs, they will appear here',
    'profile_settings': 'Profile settings',
    'profile_available': 'Profile settings will be available soon',
    
    // User Profile
    'personal_information': 'Personal Information',
    'update_personal_details': 'Update your personal details',
    'skills': 'Skills',
    'manage_skills': 'Manage your skills and proficiency levels',
    'work_experience': 'Work Experience',
    'manage_experience': 'Manage your professional experience',
    'education': 'Education',
    'manage_education': 'Manage your educational background',
    'resume': 'Resume',
    'analyze_resume': 'Upload and analyze your resume',
    'basic_info': 'Basic Info',
    'loading_profile': 'Loading profile...',
    'profile_not_found': 'Profile not found. Please contact support.',
    'upload': 'Upload',
    'full_name': 'Full Name',
    'phone_number': 'Phone Number',
    'address': 'Address',
    'birthdate': 'Birthdate',
    'update_profile': 'Update Profile',
    
    // Jobs
    'job_title': 'Title',
    'company': 'Company',
    'date_posted': 'Date Posted',
    'status': 'Status',
    'actions': 'Actions',
    'apply_now': 'Apply Now',
    'job_description': 'Job Description',
    'requirements': 'Requirements',
    'responsibilities': 'Responsibilities',
    'benefits': 'Benefits',
    'location': 'Location',
    'job_type': 'Job Type',
    'salary_range': 'Salary Range',
    'experience_level': 'Experience Level',
    'education_level': 'Education Level',
    'apply_for_job': 'Apply for this Job',
    'share_job': 'Share Job',
    'save_job': 'Save Job',
    'job_saved': 'Job Saved',
    'remove_job': 'Remove Job',
    'similar_jobs': 'Similar Jobs',
    'recommended_jobs': 'Recommended Jobs',
    'recently_viewed': 'Recently Viewed',
    'search_jobs': 'Search jobs...',
    'total_jobs': 'Total Jobs',
    'active_jobs': 'Active Jobs',
    'featured_jobs': 'Featured Jobs',
    'pending_approval': 'Pending Approval',
    'import_jobs': 'Import Jobs',
    'export_jobs': 'Export Jobs',
    'add_job': 'Add Job',
    'no_jobs_found': 'No jobs found. Try importing some jobs or creating a new one.',
    
    // Application
    'application_submitted': 'Application Submitted!',
    'application_analyzing': 'Our AI is analyzing your application and will match you with relevant positions.',
    'application_notify': 'We\'ll notify you once your application has been reviewed.',
    'what_happens_next': 'What happens next?',
    'browse_more_jobs': 'Browse More Jobs',
    'view_dashboard': 'View Your Dashboard',
    'application_step_1': 'Our AI analyzes your resume and video responses',
    'application_step_2': 'Your application is matched with the job requirements',
    'application_step_3': 'The hiring team reviews your application',
    'application_step_4': 'You\'ll receive an email about next steps',
    
    // Company Settings
    'company_settings': 'Company Settings',
    'company_profile': 'Company Profile',
    'update_company_info': 'Update your company information that will be displayed to job applicants.',
    'company_name': 'Company Name',
    'industry': 'Industry',
    'company_size': 'Company Size',
    'website': 'Website',
    'contact_email': 'Contact Email',
    'contact_phone': 'Contact Phone (optional)',
    'company_description': 'Company Description',
    'save_changes': 'Save Changes',
    'saving': 'Saving...',
    
    // Interview Management
    'interview_management': 'Interview Management',
    'manage_interviews': 'Manage your interviews and track candidate progress throughout the hiring process.',
    'schedule_new': 'Schedule New Interview',
    'interview_schedule': 'Interview Schedule',
    'candidate_pipeline': 'Candidate Pipeline',
    'no_interviews': 'No interviews scheduled for this day.',
    'pick_date': 'Pick a date',
    'view_notes': 'View Notes',
    'reschedule': 'Reschedule',
    'complete': 'Complete',
    
    // Removed duplicate 'cancel' key as it appears in General section
    
    'time': 'Time',
    'candidate': 'Candidate',
    'position': 'Position',
    'interview_type': 'Interview Type',
    'scheduled_by': 'Scheduled By',
    'interviews_today': 'Interviews Today',
    'upcoming_interviews': 'Upcoming Interviews',
    'past_interviews': 'Past Interviews',
    'schedule_interview': 'Schedule Interview',
    'interview_details': 'Interview Details',
    'video_link': 'Video Link',
    'in_person': 'In Person',
    'phone_interview': 'Phone Interview',
    'interview_notes': 'Interview Notes',
    'add_notes': 'Add Notes',
    
    // Analytics
    'analytics': 'Analytics',
    'performance_overview': 'Performance Overview',
    'track_metrics': 'Track your company\'s metrics, hiring funnel, and candidate engagement.',
    
    // Removed duplicate 'applications' key as it appears in Application section
    
    'hiring': 'Hiring Funnel',
    'engagement': 'Candidate Engagement',
    'last_month': 'Last Month',
    'this_month': 'This Month',
    'last_quarter': 'Last Quarter',
    'this_quarter': 'This Quarter',
    'last_year': 'Last Year',
    'this_year': 'This Year',
    'total_applications': 'Total Applications',
    'application_sources': 'Application Sources',
    'conversion_rate': 'Conversion Rate',
    
    // Candidates
    'candidate_search': 'Candidate Search',
    'search_candidates': 'Search candidates by name or skills...',
    'invite': 'Invite',
    'candidate_invited': 'Candidate invited successfully!',
    'view_profile': 'View Profile',
    'send_message': 'Send Message',
    'skills_match': 'Skills Match',
    'experience': 'Experience',
    'top_skills': 'Top Skills',
    'quick_actions': 'Quick Actions',
    
    // Owner Dashboard
    'owner_dashboard': 'Owner Dashboard',
    'total_companies': 'Total Companies',
    'total_users': 'Total Users',
    'applications': 'Applications',
    'cv_uploads': 'CV Uploads',
    'recent_activity': 'Recent Activity',
    'platform_overview': 'Platform Overview',
    'user_growth': 'User Growth',
    'job_activity': 'Job Activity',
    'job_categories': 'Job Categories',
  },
  ar: {
    // General
    'search': 'بحث',
    'loading': 'جاري التحميل...',
    'not_found': 'غير موجود',
    'no_results': 'لم يتم العثور على نتائج.',
    'back': 'رجوع',
    'next': 'التالي',
    'previous': 'السابق',
    'submit': 'إرسال',
    'cancel': 'إلغاء',
    'delete': 'حذف',
    'edit': 'تعديل',
    'view': 'عرض',
    'save': 'حفظ',
    'clear': 'مسح',
    'close': 'إغلاق',
    'yes': 'نعم',
    'no': 'لا',
    'success': 'نجاح',
    'error': 'خطأ',
    'warning': 'تحذير',
    'info': 'معلومات',
    'all': 'الكل',
    'applied': 'تم التقديم',
    'screening': 'فحص',
    'interview': 'مقابلة',
    'final': 'نهائي',
    'rejected': 'مرفوض',
    'match_score': 'نسبة التطابق',
    'hiring_progress': 'تقدم التوظيف',
    'view_details': 'عرض التفاصيل',
    'no_candidates': 'لم يتم العثور على مرشحين بالفلتر المحدد.',
    
    // Auth
    'welcome_back': 'مرحبا بعودتك!',
    'sign_in_message': 'قم بتسجيل الدخول للوصول إلى لوحة التحكم الخاصة بك ومواصلة رحلتك مع منصة التوظيف المدعومة بالذكاء الاصطناعي.',
    'sign_in_account': 'تسجيل الدخول إلى حسابك',
    'dont_have_account': 'ليس لديك حساب؟',
    'email_address': 'البريد الإلكتروني',
    'password': 'كلمة المرور',
    'forgot_password': 'نسيت كلمة المرور؟',
    'signing_in': 'جاري تسجيل الدخول...',
    'sign_up': 'إنشاء حساب',
    'log_in': 'تسجيل الدخول',
    'sign_out': 'تسجيل الخروج',
    'logout': 'تسجيل الخروج',
    
    // Navigation
    'home': 'الرئيسية',
    'jobs': 'الوظائف',
    'dashboard': 'لوحة التحكم',
    'saved_jobs': 'الوظائف المحفوظة',
    'my_applications': 'طلبات التوظيف',
    'profile': 'الملف الشخصي',
    'settings': 'الإعدادات',
    'company_portal': 'بوابة الشركة',
    'admin_panel': 'لوحة الإدارة',
    
    // Dashboard
    'no_applications': 'لا توجد طلبات بعد',
    'applications_appear': 'عندما تتقدم للوظائف، ستظهر هنا',
    'profile_settings': 'إعدادات الملف الشخصي',
    'profile_available': 'ستكون إعدادات الملف الشخصي متاحة قريبًا',
    
    // User Profile
    'personal_information': 'المعلومات الشخصية',
    'update_personal_details': 'تحديث معلوماتك الشخصية',
    'skills': 'المهارات',
    'manage_skills': 'إدارة مهاراتك ومستويات الكفاءة',
    'work_experience': 'الخبرة العملية',
    'manage_experience': 'إدارة خبرتك المهنية',
    'education': 'التعليم',
    'manage_education': 'إدارة خلفيتك التعليمية',
    'resume': 'السيرة الذاتية',
    'analyze_resume': 'تحليل وتحميل السيرة الذاتية',
    'basic_info': 'المعلومات الأساسية',
    'loading_profile': 'جاري تحميل الملف الشخصي...',
    'profile_not_found': 'لم يتم العثور على الملف الشخصي. يرجى الاتصال بالدعم.',
    'upload': 'تحميل',
    'full_name': 'الاسم الكامل',
    'phone_number': 'رقم الهاتف',
    'address': 'العنوان',
    'birthdate': 'تاريخ الميلاد',
    'update_profile': 'تحديث الملف الشخصي',
    
    // Jobs
    'job_title': 'المسمى الوظيفي',
    'company': 'الشركة',
    'date_posted': 'تاريخ النشر',
    'status': 'الحالة',
    'actions': 'الإجراءات',
    'apply_now': 'تقدم الآن',
    'job_description': 'وصف الوظيفة',
    'requirements': 'المتطلبات',
    'responsibilities': 'المسؤوليات',
    'benefits': 'المزايا',
    'location': 'الموقع',
    'job_type': 'نوع الوظيفة',
    'salary_range': 'نطاق الراتب',
    'experience_level': 'مستوى الخبرة',
    'education_level': 'المستوى التعليمي',
    'apply_for_job': 'التقدم لهذه الوظيفة',
    'share_job': 'مشاركة الوظيفة',
    'save_job': 'حفظ الوظيفة',
    'job_saved': 'تم حفظ الوظيفة',
    'remove_job': 'إزالة الوظيفة',
    'similar_jobs': 'وظائف مشابهة',
    'recommended_jobs': 'وظائف موصى بها',
    'recently_viewed': 'تمت مشاهدتها مؤخرًا',
    'search_jobs': 'البحث عن وظائف...',
    'total_jobs': 'إجمالي الوظائف',
    'active_jobs': 'الوظائف النشطة',
    'featured_jobs': 'الوظائف المميزة',
    'pending_approval': 'في انتظار الموافقة',
    'import_jobs': 'استيراد وظائف',
    'export_jobs': 'تصدير الوظائف',
    'add_job': 'إضافة وظيفة',
    'no_jobs_found': 'لم يتم العثور على وظائف. جرب استيراد بعض الوظائف أو إنشاء وظيفة جديدة.',
    
    // Application
    'application_submitted': 'تم تقديم الطلب!',
    'application_analyzing': 'يقوم الذكاء الاصطناعي الخاص بنا بتحليل طلبك ومطابقتك مع الوظائف ذات الصلة.',
    'application_notify': 'سنخطرك بمجرد مراجعة طلبك.',
    'what_happens_next': 'ماذا يحدث بعد ذلك؟',
    'browse_more_jobs': 'تصفح المزيد من الوظائف',
    'view_dashboard': 'عرض لوحة التحكم الخاصة بك',
    'application_step_1': 'يقوم الذكاء الاصطناعي لدينا بتحليل سيرتك الذاتية واستجابات الفيديو',
    'application_step_2': 'يتم مطابقة طلبك مع متطلبات الوظيفة',
    'application_step_3': 'يقوم فريق التوظيف بمراجعة طلبك',
    'application_step_4': 'ستتلقى بريدًا إلكترونيًا حول الخطوات التالية',
    
    // Company Settings
    'company_settings': 'إعدادات الشركة',
    'company_profile': 'ملف الشركة',
    'update_company_info': 'تحديث معلومات شركتك التي سيتم عرضها للمتقدمين للوظائف.',
    'company_name': 'اسم الشركة',
    'industry': 'الصناعة',
    'company_size': 'حجم الشركة',
    'website': 'الموقع الإلكتروني',
    'contact_email': 'البريد الإلكتروني للتواصل',
    'contact_phone': 'رقم الهاتف (اختياري)',
    'company_description': 'وصف الشركة',
    'save_changes': 'حفظ التغييرات',
    'saving': 'جاري الحفظ...',
    
    // Interview Management
    'interview_management': 'إدارة المقابلات',
    'manage_interviews': 'إدارة المقابلات الخاصة بك وتتبع تقدم المرشحين خلال عملية التوظيف.',
    'schedule_new': 'جدولة مقابلة جديدة',
    'interview_schedule': 'جدول المقابلات',
    'candidate_pipeline': 'مسار المرشحين',
    'no_interviews': 'لا توجد مقابلات مجدولة لهذا اليوم.',
    'pick_date': 'اختر تاريخًا',
    'view_notes': 'عرض الملاحظات',
    'reschedule': 'إعادة جدولة',
    'complete': 'اكتمل',
    
    // Removed duplicate 'cancel' key as it appears in General section
    
    'time': 'الوقت',
    'candidate': 'المرشح',
    'position': 'المنصب',
    'interview_type': 'نوع المقابلة',
    'scheduled_by': 'تمت جدولته بواسطة',
    'interviews_today': 'مقابلات اليوم',
    'upcoming_interviews': 'المقابلات القادمة',
    'past_interviews': 'المقابلات السابقة',
    'schedule_interview': 'جدولة مقابلة',
    'interview_details': 'تفاصيل المقابلة',
    'video_link': 'رابط الفيديو',
    'in_person': 'شخصياً',
    'phone_interview': 'مقابلة هاتفية',
    'interview_notes': 'ملاحظات المقابلة',
    'add_notes': 'إضافة ملاحظات',
    
    // Analytics
    'analytics': 'التحليلات',
    'performance_overview': 'نظرة عامة على الأداء',
    'track_metrics': 'تتبع مقاييس شركتك، ومسار التوظيف، ومشاركة المرشحين.',
    
    // Removed duplicate 'applications' key as it appears in Application section
    
    'hiring': 'مسار التوظيف',
    'engagement': 'مشاركة المرشحين',
    'last_month': 'الشهر الماضي',
    'this_month': 'هذا الشهر',
    'last_quarter': 'الربع الماضي',
    'this_quarter': 'هذا الربع',
    'last_year': 'العام الماضي',
    'this_year': 'هذا العام',
    'total_applications': 'إجمالي الطلبات',
    'application_sources': 'مصادر الطلبات',
    'conversion_rate': 'معدل التحويل',
    
    // Candidates
    'candidate_search': 'البحث عن مرشحين',
    'search_candidates': 'البحث عن مرشحين بالاسم أو المهارات...',
    'invite': 'دعوة',
    'candidate_invited': 'تمت دعوة المرشح بنجاح!',
    'view_profile': 'عرض الملف الشخصي',
    'send_message': 'إرسال رسالة',
    'skills_match': 'تطابق المهارات',
    'experience': 'الخبرة',
    'top_skills': 'أهم المهارات',
    'quick_actions': 'إجراءات سريعة',
    
    // Owner Dashboard
    'owner_dashboard': 'لوحة تحكم المالك',
    'total_companies': 'إجمالي الشركات',
    'total_users': 'إجمالي المستخدمين',
    'applications': 'الطلبات',
    'cv_uploads': 'تحميلات السير الذاتية',
    'recent_activity': 'النشاط الأخير',
    'platform_overview': 'نظرة عامة على المنصة',
    'user_growth': 'نمو المستخدمين',
    'job_activity': 'نشاط الوظائف',
    'job_categories': 'فئات الوظائف',
  }
};

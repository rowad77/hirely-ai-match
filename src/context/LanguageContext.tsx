
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
    // Dashboard
    'dashboard': 'Dashboard',
    'saved_jobs': 'Saved Jobs',
    'my_applications': 'My Applications',
    'profile': 'Profile',
    'no_applications': 'No applications yet',
    'applications_appear': 'Once you apply for jobs, they will appear here',
    'profile_settings': 'Profile settings',
    'profile_available': 'Profile settings will be available soon',
    
    // Company Settings
    'company_settings': 'Company Settings',
    'company_profile': 'Company Profile',
    'update_company_info': 'Update your company information that will be displayed to job applicants.',
    'company_name': 'Company Name',
    'industry': 'Industry',
    'company_size': 'Company Size',
    'website': 'Website',
    'location': 'Location',
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
    'cancel': 'Cancel',
    
    // Navigation
    'home': 'Home',
    'jobs': 'Jobs',
    'company_portal': 'Company Portal',
    'admin_panel': 'Admin Panel',
    'settings': 'Settings',
    'sign_out': 'Sign Out',
    'log_in': 'Log in',
    'sign_up': 'Sign up',
  },
  ar: {
    // Dashboard
    'dashboard': 'لوحة التحكم',
    'saved_jobs': 'الوظائف المحفوظة',
    'my_applications': 'طلباتي',
    'profile': 'الملف الشخصي',
    'no_applications': 'لا توجد طلبات حتى الآن',
    'applications_appear': 'عندما تتقدم للوظائف، ستظهر هنا',
    'profile_settings': 'إعدادات الملف الشخصي',
    'profile_available': 'إعدادات الملف الشخصي ستكون متاحة قريباً',
    
    // Company Settings
    'company_settings': 'إعدادات الشركة',
    'company_profile': 'ملف الشركة',
    'update_company_info': 'قم بتحديث معلومات شركتك التي سيتم عرضها للمتقدمين للوظائف.',
    'company_name': 'اسم الشركة',
    'industry': 'الصناعة',
    'company_size': 'حجم الشركة',
    'website': 'الموقع الإلكتروني',
    'location': 'الموقع',
    'contact_email': 'البريد الإلكتروني للتواصل',
    'contact_phone': 'رقم الهاتف (اختياري)',
    'company_description': 'وصف الشركة',
    'save_changes': 'حفظ التغييرات',
    'saving': 'جاري الحفظ...',
    
    // Interview Management
    'interview_management': 'إدارة المقابلات',
    'manage_interviews': 'إدارة المقابلات وتتبع تقدم المرشحين خلال عملية التوظيف.',
    'schedule_new': 'جدولة مقابلة جديدة',
    'interview_schedule': 'جدول المقابلات',
    'candidate_pipeline': 'مسار المرشحين',
    'no_interviews': 'لا توجد مقابلات مجدولة لهذا اليوم.',
    'pick_date': 'اختر تاريخاً',
    'view_notes': 'عرض الملاحظات',
    'reschedule': 'إعادة جدولة',
    'complete': 'اكتمل',
    'cancel': 'إلغاء',
    
    // Navigation
    'home': 'الرئيسية',
    'jobs': 'الوظائف',
    'company_portal': 'بوابة الشركة',
    'admin_panel': 'لوحة الإدارة',
    'settings': 'الإعدادات',
    'sign_out': 'تسجيل الخروج',
    'log_in': 'تسجيل الدخول',
    'sign_up': 'إنشاء حساب',
  }
};

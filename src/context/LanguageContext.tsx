
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';
type Direction = 'ltr' | 'rtl';

// Define translation keys
interface Translations {
  // Common
  login: string;
  signup: string;
  logout: string;
  dashboard: string;
  profile: string;
  settings: string;
  search: string;
  home: string;
  findJobs: string;
  save: string;
  cancel: string;
  applications: string;
  companyPortal: string;
  adminPanel: string;
  
  // Jobs
  jobs: string;
  jobTitle: string;
  company: string;
  location: string;
  salary: string;
  jobType: string;
  appliedJobs: string;
  savedJobs: string;
  applyNow: string;
  application: string;
  
  // Owner Dashboard
  totalCompanies: string;
  totalJobs: string;
  totalUsers: string;
  cvUploads: string;
  
  // Settings
  generalSettings: string;
  securitySettings: string;
  emailSettings: string;
  featureSettings: string;
  apiSettings: string;
  
  // Company
  candidates: string;
  interviews: string;
  analytics: string;
  
  // Language Management
  languageManagement: string;
  downloadTranslations: string;
  uploadTranslations: string;
  currentLanguage: string;
  switchLanguage: string;
}

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations) => string;
}

// English translations
const enTranslations: Translations = {
  // Common
  login: "Log in",
  signup: "Sign up",
  logout: "Log out",
  dashboard: "Dashboard",
  profile: "Profile",
  settings: "Settings",
  search: "Search",
  home: "Home",
  findJobs: "Find Jobs",
  save: "Save",
  cancel: "Cancel",
  applications: "Applications",
  companyPortal: "Company Portal",
  adminPanel: "Admin Panel",

  // Jobs
  jobs: "Jobs",
  jobTitle: "Job Title",
  company: "Company",
  location: "Location",
  salary: "Salary",
  jobType: "Job Type",
  appliedJobs: "Applied Jobs",
  savedJobs: "Saved Jobs",
  applyNow: "Apply Now",
  application: "Application",
  
  // Owner Dashboard
  totalCompanies: "Total Companies",
  totalJobs: "Total Jobs",
  totalUsers: "Total Users",
  cvUploads: "CV Uploads",
  
  // Settings
  generalSettings: "General Settings",
  securitySettings: "Security Settings",
  emailSettings: "Email Settings",
  featureSettings: "Feature Settings",
  apiSettings: "API Settings",
  
  // Company
  candidates: "Candidates",
  interviews: "Interviews",
  analytics: "Analytics",
  
  // Language Management
  languageManagement: "Language Management",
  downloadTranslations: "Download Translations",
  uploadTranslations: "Upload Translations",
  currentLanguage: "Current Language",
  switchLanguage: "Switch Language"
};

// Arabic translations
const arTranslations: Translations = {
  // Common
  login: "تسجيل الدخول",
  signup: "إنشاء حساب",
  logout: "تسجيل الخروج",
  dashboard: "لوحة التحكم",
  profile: "الملف الشخصي",
  settings: "الإعدادات",
  search: "بحث",
  home: "الرئيسية",
  findJobs: "البحث عن وظائف",
  save: "حفظ",
  cancel: "إلغاء",
  applications: "الطلبات",
  companyPortal: "بوابة الشركة",
  adminPanel: "لوحة المسؤول",
  
  // Jobs
  jobs: "الوظائف",
  jobTitle: "عنوان الوظيفة",
  company: "الشركة",
  location: "الموقع",
  salary: "الراتب",
  jobType: "نوع الوظيفة",
  appliedJobs: "الوظائف المتقدم لها",
  savedJobs: "الوظائف المحفوظة",
  applyNow: "تقدم الآن",
  application: "طلب التوظيف",
  
  // Owner Dashboard
  totalCompanies: "إجمالي الشركات",
  totalJobs: "إجمالي الوظائف",
  totalUsers: "إجمالي المستخدمين",
  cvUploads: "السير الذاتية المرفوعة",
  
  // Settings
  generalSettings: "الإعدادات العامة",
  securitySettings: "إعدادات الأمان",
  emailSettings: "إعدادات البريد الإلكتروني",
  featureSettings: "إعدادات الميزات",
  apiSettings: "إعدادات API",
  
  // Company
  candidates: "المرشحون",
  interviews: "المقابلات",
  analytics: "التحليلات",
  
  // Language Management
  languageManagement: "إدارة اللغات",
  downloadTranslations: "تنزيل الترجمات",
  uploadTranslations: "رفع الترجمات",
  currentLanguage: "اللغة الحالية",
  switchLanguage: "تغيير اللغة"
};

const translations = {
  en: enTranslations,
  ar: arTranslations,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [direction, setDirection] = useState<Direction>('ltr');

  useEffect(() => {
    // Get saved language from localStorage or use browser language
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    } else {
      const browserLanguage = navigator.language.startsWith('ar') ? 'ar' : 'en';
      setLanguage(browserLanguage);
    }
  }, []);

  useEffect(() => {
    // Set direction based on language
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    setDirection(dir);
    
    // Save language to localStorage
    localStorage.setItem('language', language);
    
    // Set HTML dir and lang attributes
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: keyof Translations): string => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    direction,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};


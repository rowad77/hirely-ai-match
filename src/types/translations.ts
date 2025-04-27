
export type Language = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

// Define translation keys
export interface Translations {
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
  loading: string; // Added missing loading key
  
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
  companies: string;
  
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

export interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations) => string;
  isChangingLanguage: boolean;
  setCustomTranslations: (translations: {
    en: Record<string, string>;
    ar: Record<string, string>;
  }) => void;
}

// Utility type for validating translation completeness
export type TranslationCompleteness = {
  [L in Language]: {
    missingKeys: Array<keyof Translations>;
    completionPercentage: number;
  }
};


export type Language = 'en';

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
  loading: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  companyName: string;
  individual: string;
  company: string;
  accountType: string;
  signupAs: string;
  pendingApproval: string;
  approved: string;
  rejected: string;
  approve: string;
  reject: string;
  approvalStatus: string;
  userManagement: string;
  companyRequests: string;
  
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
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations) => string;
  isChangingLanguage: boolean;
  setCustomTranslations: (translations: {
    en: Record<string, string>;
  }) => void;
  direction: 'ltr';
}

// Utility type for validating translation completeness
export type TranslationCompleteness = {
  [L in Language]: {
    missingKeys: Array<keyof Translations>;
    completionPercentage: number;
  }
};

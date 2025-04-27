
import { useState, useEffect } from 'react';
import { Language, Direction } from '@/types/translations';

export const useTranslationState = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [direction, setDirection] = useState<Direction>('ltr');
  const [customTranslations, setCustomTranslations] = useState<{
    en: Record<string, string>;
    ar: Record<string, string>;
  }>({ en: {}, ar: {} });

  // Initialize from localStorage or browser preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    } else {
      const browserLanguage = navigator.language.startsWith('ar') ? 'ar' : 'en';
      setLanguage(browserLanguage);
    }
  }, []);

  // Update direction and HTML attributes when language changes
  useEffect(() => {
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    setDirection(dir);
    
    localStorage.setItem('language', language);
    
    document.documentElement.dir = dir;
    document.documentElement.lang = language;

    // Add or remove the RTL class on the body for global styling
    if (dir === 'rtl') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [language]);

  return {
    language,
    setLanguage,
    direction,
    customTranslations,
    setCustomTranslations,
  };
};

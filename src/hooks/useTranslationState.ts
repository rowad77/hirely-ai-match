
import { useState, useEffect } from 'react';
import { Language, Direction } from '@/types/translations';

export const useTranslationState = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [direction, setDirection] = useState<Direction>('ltr');
  const [customTranslations, setCustomTranslations] = useState<{
    en: Record<string, string>;
    ar: Record<string, string>;
  }>({ en: {}, ar: {} });

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    } else {
      const browserLanguage = navigator.language.startsWith('ar') ? 'ar' : 'en';
      setLanguage(browserLanguage);
    }
  }, []);

  useEffect(() => {
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    setDirection(dir);
    
    localStorage.setItem('language', language);
    
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language]);

  return {
    language,
    setLanguage,
    direction,
    customTranslations,
    setCustomTranslations,
  };
};



import { useState, useEffect, useCallback } from 'react';
import { Language, Direction } from '@/types/translations';

// Channel for cross-tab synchronization
const langSyncChannel = typeof window !== 'undefined' ? new BroadcastChannel('language_sync') : null;

export const useTranslationState = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [direction, setDirection] = useState<Direction>('ltr');
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const [customTranslations, setCustomTranslations] = useState<{
    en: Record<string, string>;
    ar: Record<string, string>;
  }>({ en: {}, ar: {} });

  // Safely change language with proper state tracking
  const changeLanguage = useCallback((newLanguage: Language) => {
    setIsChangingLanguage(true);
    setLanguage(newLanguage);
    
    // Notify other tabs
    langSyncChannel?.postMessage({ language: newLanguage });
    
    // Artificial delay to ensure smooth transitions
    setTimeout(() => {
      setIsChangingLanguage(false);
    }, 300);
  }, []);

  // Initialize from localStorage or browser preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      changeLanguage(savedLanguage);
    } else {
      const browserLanguage = navigator.language.startsWith('ar') ? 'ar' : 'en';
      changeLanguage(browserLanguage);
    }
    
    // Listen for language changes from other tabs
    langSyncChannel?.addEventListener('message', (event) => {
      if (event.data?.language && event.data.language !== language) {
        setLanguage(event.data.language);
      }
    });
    
    return () => {
      langSyncChannel?.close();
    };
  }, [changeLanguage]);

  // Update direction and HTML attributes when language changes
  useEffect(() => {
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    setDirection(dir);
    
    localStorage.setItem('language', language);
    
    // Update HTML document attributes
    document.documentElement.dir = dir;
    document.documentElement.lang = language;

    // Add or remove the RTL class on the body for global styling
    if (dir === 'rtl') {
      document.body.classList.add('rtl');
      document.body.style.fontFamily = "'IBM Plex Sans Arabic', sans-serif";
    } else {
      document.body.classList.remove('rtl');
      document.body.style.fontFamily = "'IBM Plex Sans', sans-serif";
    }
    
    // Add the CSS transition class for smooth direction changes
    document.body.classList.add('dir-transition');
    setTimeout(() => {
      document.body.classList.remove('dir-transition');
    }, 300);
  }, [language]);

  return {
    language,
    setLanguage: changeLanguage,
    direction,
    isChangingLanguage,
    customTranslations,
    setCustomTranslations,
  };
};

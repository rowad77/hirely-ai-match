
import { useState, useEffect, useCallback } from 'react';
import { Language, Direction } from '@/types/translations';

// Create a safe BroadcastChannel implementation
const createSafeBroadcastChannel = (channelName: string) => {
  if (typeof window === 'undefined') return null;
  
  try {
    return new BroadcastChannel(channelName);
  } catch (error) {
    console.warn('BroadcastChannel API not supported in this browser', error);
    return null;
  }
};

export const useTranslationState = () => {
  // Initialize state
  const [language, setLanguage] = useState<Language>('en');
  const [direction, setDirection] = useState<Direction>('ltr');
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const [customTranslations, setCustomTranslations] = useState<{
    en: Record<string, string>;
    ar: Record<string, string>;
  }>({ en: {}, ar: {} });
  
  // Create broadcast channel reference for language sync
  const [langSyncChannel, setLangSyncChannel] = useState(() => 
    createSafeBroadcastChannel('language_sync')
  );
  
  // Recreate channel if it was closed
  useEffect(() => {
    if (!langSyncChannel) {
      setLangSyncChannel(createSafeBroadcastChannel('language_sync'));
    }
    
    return () => {
      // Properly clean up the channel when component unmounts
      if (langSyncChannel) {
        langSyncChannel.close();
        setLangSyncChannel(null);
      }
    };
  }, [langSyncChannel]);

  // Safely change language with proper state tracking
  const changeLanguage = useCallback((newLanguage: Language) => {
    setIsChangingLanguage(true);
    setLanguage(newLanguage);
    
    // Safely notify other tabs
    if (langSyncChannel) {
      try {
        langSyncChannel.postMessage({ language: newLanguage });
      } catch (error) {
        console.warn('Failed to post message to BroadcastChannel', error);
        // Recreate the channel if there was an error
        setLangSyncChannel(createSafeBroadcastChannel('language_sync'));
      }
    }
    
    // Save to localStorage for persistence
    try {
      localStorage.setItem('language', newLanguage);
    } catch (error) {
      console.warn('Failed to save language to localStorage', error);
    }
    
    // Artificial delay to ensure smooth transitions
    setTimeout(() => {
      setIsChangingLanguage(false);
    }, 300);
  }, [langSyncChannel]);

  // Initialize from localStorage or browser preference
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem('language') as Language;
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
        changeLanguage(savedLanguage);
      } else {
        const browserLanguage = navigator.language.startsWith('ar') ? 'ar' : 'en';
        changeLanguage(browserLanguage);
      }
    } catch (error) {
      console.warn('Failed to initialize language from localStorage', error);
      // Use a fallback if localStorage fails
      changeLanguage('en');
    }
    
    // Listen for language changes from other tabs
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.language && event.data.language !== language) {
        setLanguage(event.data.language);
      }
    };
    
    if (langSyncChannel) {
      langSyncChannel.addEventListener('message', handleMessage);
    }
    
    return () => {
      if (langSyncChannel) {
        langSyncChannel.removeEventListener('message', handleMessage);
      }
    };
  }, [changeLanguage, language, langSyncChannel]);

  // Update direction and HTML attributes when language changes
  useEffect(() => {
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    setDirection(dir);
    
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
    
    // Remove transition class after animation completes to avoid affecting other animations
    const timeoutId = setTimeout(() => {
      document.body.classList.remove('dir-transition');
    }, 300);
    
    return () => {
      clearTimeout(timeoutId);
    };
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

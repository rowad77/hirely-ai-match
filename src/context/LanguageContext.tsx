
import React, { createContext, useContext, ReactNode, useMemo, useCallback, useEffect } from 'react';
import { translations } from '@/data/translations';
import { useTranslationState } from '@/hooks/useTranslationState';
import { LanguageContextType, Translations, Language } from '@/types/translations';

// Create a context with a meaningful default value for better type safety
const defaultContextValue: LanguageContextType = {
  language: 'en',
  direction: 'ltr',
  setLanguage: () => console.warn('LanguageContext not initialized'),
  t: (key) => String(key),
  isChangingLanguage: false,
  setCustomTranslations: () => console.warn('LanguageContext not initialized'),
};

const LanguageContext = createContext<LanguageContextType>(defaultContextValue);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    language,
    setLanguage,
    direction,
    isChangingLanguage,
    customTranslations,
    setCustomTranslations,
    translationCacheRef,
    trackKeyUsage,
    getTranslationTracker
  } = useTranslationState();

  // Preload commonly used translations for faster switching
  useEffect(() => {
    // Identify the "other" language to preload
    const otherLanguage: Language = language === 'en' ? 'ar' : 'en';
    
    // Get a list of frequently used keys (mock implementation - in reality this would be based on usage)
    const commonKeys = ['login', 'signup', 'search', 'settings', 'dashboard'];
    
    // Preload translations in a non-blocking way
    setTimeout(() => {
      commonKeys.forEach(key => {
        if (translations[otherLanguage] && translations[otherLanguage][key as keyof Translations]) {
          const cacheKey = `${otherLanguage}:${String(key)}`;
          if (!translationCacheRef.current[cacheKey]) {
            translationCacheRef.current[cacheKey] = {
              value: translations[otherLanguage][key as keyof Translations],
              timestamp: Date.now(),
              version: '1.0.0'
            };
          }
        }
      });
    }, 1000); // Delay preloading to not interfere with initial rendering
  }, [language, translationCacheRef]);

  // Optimized translation function with better fallback handling and caching
  const t = useCallback((key: keyof Translations): string => {
    // Create a cache key that combines the language and translation key
    const cacheKey = `${language}:${String(key)}`;
    
    // Track key usage for future preloading
    trackKeyUsage(cacheKey);
    
    // Check if we already have this translation cached
    if (translationCacheRef.current[cacheKey]) {
      return translationCacheRef.current[cacheKey].value;
    }
    
    let result: string;
    
    // First check custom translations
    if (customTranslations[language] && customTranslations[language][String(key)]) {
      result = customTranslations[language][String(key)];
    }
    // Then check default translations
    else if (translations[language] && translations[language][key]) {
      result = translations[language][key];
    }
    // If we can't find in current language, try English as fallback
    else if (language !== 'en' && translations.en && translations.en[key]) {
      result = translations.en[key];
      // Log missing translation in development
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Translation missing for key: ${String(key)} in ${language}, falling back to English`);
      }
    }
    // Final fallback to key
    else {
      result = String(key);
      // Log missing translation in development
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Translation missing for key: ${String(key)} in both ${language} and fallback language`);
      }
    }
    
    // Cache the result
    translationCacheRef.current[cacheKey] = {
      value: result,
      timestamp: Date.now(),
      version: '1.0.0'
    };
    
    return result;
  }, [language, customTranslations, trackKeyUsage, translationCacheRef]);
  
  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    language,
    direction,
    setLanguage,
    t,
    isChangingLanguage,
    setCustomTranslations,
  }), [language, direction, setLanguage, t, isChangingLanguage, setCustomTranslations]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
};

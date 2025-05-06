
import React, { createContext, useContext, ReactNode, useMemo, useCallback, useEffect } from 'react';
import { translations } from '@/data/translations';
import { useTranslationState } from '@/hooks/useTranslationState';
import { LanguageContextType, Translations, Language } from '@/types/translations';

// Create a context with a meaningful default value for better type safety
const defaultContextValue: LanguageContextType = {
  language: 'en',
  setLanguage: () => console.warn('LanguageContext not initialized'),
  t: (key) => String(key),
  isChangingLanguage: false,
  setCustomTranslations: () => console.warn('LanguageContext not initialized'),
  direction: 'ltr',
};

const LanguageContext = createContext<LanguageContextType>(defaultContextValue);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    language,
    setLanguage,
    isChangingLanguage,
    customTranslations,
    setCustomTranslations,
    translationCacheRef,
    trackKeyUsage
  } = useTranslationState();

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
    // Final fallback to key
    else {
      result = String(key);
      // Log missing translation in development
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Translation missing for key: ${String(key)} in ${language}`);
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
  
  // Always use 'ltr' as the direction
  const direction: 'ltr' = 'ltr';

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    language,
    setLanguage,
    t,
    isChangingLanguage,
    setCustomTranslations,
    direction,
  }), [language, setLanguage, t, isChangingLanguage, setCustomTranslations, direction]);

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

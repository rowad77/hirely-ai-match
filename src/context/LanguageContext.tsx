
import React, { createContext, useContext, ReactNode, useMemo, useCallback } from 'react';
import { translations } from '@/data/translations';
import { useTranslationState } from '@/hooks/useTranslationState';
import { LanguageContextType, Translations, Language } from '@/types/translations';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    language,
    setLanguage,
    direction,
    isChangingLanguage,
    customTranslations,
    setCustomTranslations,
  } = useTranslationState();

  // Optimized translation function with better fallback handling
  const t = useCallback((key: keyof Translations): string => {
    // First check custom translations
    if (customTranslations[language] && customTranslations[language][key]) {
      return customTranslations[language][key];
    }
    // Then check default translations
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    // Log missing translation in development
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Translation missing for key: ${String(key)} in ${language}`);
    }
    // Final fallback to key
    return String(key);
  }, [language, customTranslations]);
  
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
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};


import React, { createContext, useContext, ReactNode } from 'react';
import { translations } from '@/data/translations';
import { useTranslationState } from '@/hooks/useTranslationState';
import { LanguageContextType, Translations } from '@/types/translations';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    language,
    setLanguage,
    direction,
    customTranslations,
    setCustomTranslations,
  } = useTranslationState();

  const t = (key: keyof Translations): string => {
    // First check custom translations
    if (customTranslations[language] && customTranslations[language][key]) {
      return customTranslations[language][key];
    }
    // Fallback to default translations
    return translations[language][key] || key;
  };

  const value = {
    language,
    direction,
    setLanguage,
    t,
    setCustomTranslations,
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


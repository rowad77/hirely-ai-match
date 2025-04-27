
import { translations } from '@/data/translations';
import { Translations, TranslationCompleteness, Language } from '@/types/translations';

/**
 * Validates translation completeness and reports missing keys
 */
export function checkTranslationCompleteness(): TranslationCompleteness {
  const result: TranslationCompleteness = {
    en: { missingKeys: [], completionPercentage: 100 },
    ar: { missingKeys: [], completionPercentage: 100 }
  };
  
  // Get all possible keys from the Translations interface
  const allKeys: (keyof Translations)[] = [];
  
  // Collect all keys from all languages
  Object.values(translations).forEach((langTranslations) => {
    Object.keys(langTranslations).forEach((key) => {
      if (!allKeys.includes(key as keyof Translations)) {
        allKeys.push(key as keyof Translations);
      }
    });
  });
  
  // Check each language for missing keys
  Object.keys(translations).forEach((langKey) => {
    const lang = langKey as Language;
    const langTranslations = translations[lang];
    
    allKeys.forEach((key) => {
      if (!langTranslations[key]) {
        result[lang].missingKeys.push(key);
      }
    });
    
    // Calculate completion percentage
    const totalKeys = allKeys.length;
    const missingCount = result[lang].missingKeys.length;
    result[lang].completionPercentage = Math.round(((totalKeys - missingCount) / totalKeys) * 100);
  });
  
  return result;
}

/**
 * Formats a translated string with variables
 * Example: formatTranslation("Hello {name}", { name: "John" }) => "Hello John"
 */
export function formatTranslation(text: string, vars?: Record<string, string | number>): string {
  if (!vars) return text;
  
  return Object.entries(vars).reduce((result, [key, value]) => {
    const regex = new RegExp(`{${key}}`, 'g');
    return result.replace(regex, String(value));
  }, text);
}

/**
 * Creates a memoized translation function that caches results
 */
export function createCachedTranslator(
  getTranslation: (key: keyof Translations) => string
): (key: keyof Translations) => string {
  const cache = new Map<keyof Translations, string>();
  
  return (key: keyof Translations): string => {
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const translation = getTranslation(key);
    cache.set(key, translation);
    return translation;
  };
}

/**
 * Check if a language needs RTL support
 */
export function isRtlLanguage(language: string): boolean {
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  return rtlLanguages.includes(language);
}

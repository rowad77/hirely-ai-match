
import { useLanguage } from "@/context/LanguageContext";

/**
 * Utility function that returns different styles based on the current language direction
 * @param ltrStyles styles to apply in LTR mode
 * @param rtlStyles styles to apply in RTL mode
 * @returns appropriate styles based on current language
 */
export const useRtlStyles = (ltrStyles: string, rtlStyles: string): string => {
  const { language } = useLanguage();
  return language === 'ar' ? rtlStyles : ltrStyles;
};

/**
 * Utility function to get the appropriate flex direction based on language
 */
export const useRtlDirection = (): string => {
  const { language } = useLanguage();
  return language === 'ar' ? 'flex-row-reverse' : 'flex-row';
};

/**
 * Utility function to get the appropriate text alignment based on language
 */
export const useRtlTextAlign = (): string => {
  const { language } = useLanguage();
  return language === 'ar' ? 'text-right' : 'text-left';
};

/**
 * Utility to reverse an array based on language direction
 */
export const useRtlArray = <T>(array: T[]): T[] => {
  const { language } = useLanguage();
  return language === 'ar' ? [...array].reverse() : array;
};

/**
 * Utility function to get margin classes based on language direction
 * @param ltrMargin margin class for LTR (e.g. "mr-2")
 * @param rtlMargin margin class for RTL (e.g. "ml-2")
 */
export const useRtlMargin = (ltrMargin: string, rtlMargin: string): string => {
  const { language } = useLanguage();
  return language === 'ar' ? rtlMargin : ltrMargin;
};

/**
 * Utility function to get appropriate justify content based on language
 */
export const useRtlJustify = (ltrJustify: string, rtlJustify: string): string => {
  const { language } = useLanguage();
  return language === 'ar' ? rtlJustify : ltrJustify;
};

/**
 * Utility to transform RTL specific styles for components
 */
export const getRtlClassNames = (baseClasses: string, language: string): string => {
  if (language === 'ar') {
    // Replace left/right specific classes for RTL
    return baseClasses
      .replace(/mr-(\d+)/g, 'ml-$1-temp')
      .replace(/ml-(\d+)/g, 'mr-$1')
      .replace(/ml-(\d+)-temp/g, 'ml-$1')
      .replace(/pr-(\d+)/g, 'pl-$1-temp')
      .replace(/pl-(\d+)/g, 'pr-$1')
      .replace(/pl-(\d+)-temp/g, 'pl-$1')
      .replace(/text-left/g, 'text-right')
      .replace(/text-right/g, 'text-right')
      .replace(/right-(\d+)/g, 'left-$1-temp')
      .replace(/left-(\d+)/g, 'right-$1')
      .replace(/left-(\d+)-temp/g, 'left-$1');
  }
  
  return baseClasses;
};

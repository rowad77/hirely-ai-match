
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


/**
 * Utility for advanced font loading strategies to improve language switching performance
 */

// Predefined fonts that might be needed for different languages
const languageFonts = {
  ar: [
    'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600&display=swap'
  ],
  en: [
    'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&display=swap'
  ]
};

/**
 * Preloads fonts for a specific language
 * @param language Language code to preload fonts for
 */
export const preloadFonts = (language: string) => {
  if (!languageFonts[language as keyof typeof languageFonts]) {
    console.warn(`No predefined fonts for language: ${language}`);
    return;
  }

  // Create preload links for each font
  languageFonts[language as keyof typeof languageFonts].forEach(fontUrl => {
    // Check if this link already exists
    const existingLink = document.querySelector(`link[href="${fontUrl}"]`);
    if (existingLink) return;
    
    // Preload font
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = fontUrl;
    link.as = 'style';
    link.onload = function() {
      // Once preloaded, add as stylesheet
      const styleLink = document.createElement('link');
      styleLink.rel = 'stylesheet';
      styleLink.href = fontUrl;
      document.head.appendChild(styleLink);
    };
    document.head.appendChild(link);
  });
};

/**
 * Preloads font for the next language that might be selected
 * e.g., If current language is English, preload Arabic fonts
 * @param currentLanguage Current active language
 */
export const preloadNextLanguageFonts = (currentLanguage: string) => {
  // If current language is English, preload Arabic fonts and vice versa
  const nextLanguage = currentLanguage === 'en' ? 'ar' : 'en';
  preloadFonts(nextLanguage);
};

/**
 * Apply optimized font-display strategy to improve perceived performance
 */
export const optimizeFontDisplay = () => {
  // Add CSS to ensure smooth font transitions
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-display: swap;
    }
    
    /* Smooth transitions for language changes */
    .language-transition {
      transition: all 0.3s ease-in-out;
    }
  `;
  document.head.appendChild(style);
};

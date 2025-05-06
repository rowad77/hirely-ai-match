
/**
 * Utility for font loading strategies to improve performance
 */

// Predefined fonts for English
const languageFonts = {
  en: [
    'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&display=swap'
  ]
};

/**
 * Preloads fonts for English
 */
export const preloadFonts = () => {
  // Create preload links for each font
  languageFonts.en.forEach(fontUrl => {
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
 * Apply optimized font-display strategy to improve perceived performance
 */
export const optimizeFontDisplay = () => {
  // Add CSS to ensure smooth font transitions
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
};

// These functions are no longer needed but kept as empty stubs to prevent any errors
export const preloadNextLanguageFonts = () => {};

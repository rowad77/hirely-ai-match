
import React from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

// Create a default context value for better type safety
const defaultThemeContext: ThemeContextType = {
  theme: "system",
  setTheme: () => console.warn("ThemeContext not initialized"),
  toggleTheme: () => console.warn("ThemeContext not initialized"),
};

const ThemeContext = React.createContext<ThemeContextType>(defaultThemeContext);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  // Safely get the theme from localStorage with fallback
  const getInitialTheme = React.useCallback((): Theme => {
    if (typeof window === "undefined") return defaultTheme;
    
    try {
      const savedTheme = localStorage.getItem(storageKey) as Theme;
      // Validate the theme is one of the allowed values
      if (savedTheme && ["dark", "light", "system"].includes(savedTheme)) {
        return savedTheme;
      }
    } catch (error) {
      console.warn("Failed to read theme from localStorage", error);
    }
    
    return defaultTheme;
  }, [defaultTheme, storageKey]);

  const [theme, setTheme] = React.useState<Theme>(getInitialTheme);

  // Apply theme to the document
  React.useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove("light", "dark");
    
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      
      root.classList.add(systemTheme);
      return;
    }
    
    root.classList.add(theme);
  }, [theme]);

  // Watch for system theme changes if using system preference
  React.useEffect(() => {
    if (theme !== "system") return;
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(mediaQuery.matches ? "dark" : "light");
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);
  
  // Toggle through themes (light → dark → system → light)
  const toggleTheme = React.useCallback(() => {
    setTheme((prev) => {
      const nextTheme = prev === "light" ? "dark" : prev === "dark" ? "system" : "light";
      
      try {
        localStorage.setItem(storageKey, nextTheme);
      } catch (error) {
        console.warn("Failed to save theme to localStorage", error);
      }
      
      return nextTheme;
    });
  }, [storageKey]);

  // Safe setTheme with localStorage handling 
  const setThemeSafe = React.useCallback((newTheme: Theme) => {
    try {
      localStorage.setItem(storageKey, newTheme);
    } catch (error) {
      console.warn("Failed to save theme to localStorage", error);
    }
    setTheme(newTheme);
  }, [storageKey]);

  const value = React.useMemo(() => ({
    theme,
    setTheme: setThemeSafe,
    toggleTheme,
  }), [theme, setThemeSafe, toggleTheme]);

  return (
    <ThemeContext.Provider {...props} value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  
  return context;
};

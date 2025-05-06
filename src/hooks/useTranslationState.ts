
import { useState, useEffect, useCallback, useRef } from 'react';
import { Language } from '@/types/translations';
import { optimizeFontDisplay } from '@/utils/font-preload';

// Cache version to invalidate when translations change
const CACHE_VERSION = '1.0.0';

// Type for our cache entries
interface CacheEntry<T> {
  value: T;
  timestamp: number;
  version: string;
}

// Create a safe BroadcastChannel implementation
const createSafeBroadcastChannel = (channelName: string) => {
  if (typeof window === 'undefined') return null;
  
  try {
    return new BroadcastChannel(channelName);
  } catch (error) {
    console.warn('BroadcastChannel API not supported in this browser', error);
    return null;
  }
};

// Storage helper with localStorage fallback
const storageHelper = {
  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn(`Failed to get item from localStorage: ${key}`, error);
      return null;
    }
  },
  
  set<T>(key: string, value: T): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const item = JSON.stringify(value);
      localStorage.setItem(key, item);
      return true;
    } catch (error) {
      console.warn(`Failed to set item in localStorage: ${key}`, error);
      return false;
    }
  },
  
  remove(key: string): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Failed to remove item from localStorage: ${key}`, error);
      return false;
    }
  }
};

// Alternative communication mechanism using localStorage
const storageEventEmitter = {
  emit(eventName: string, data: any) {
    if (typeof window === 'undefined') return;
    
    try {
      const event = {
        name: eventName,
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(`event_${eventName}`, JSON.stringify(event));
      localStorage.removeItem(`event_${eventName}`);
    } catch (error) {
      console.warn('Failed to emit storage event', error);
    }
  },
  
  listen(eventName: string, callback: (data: any) => void) {
    if (typeof window === 'undefined') return () => {};
    
    const handler = (e: StorageEvent) => {
      if (e.key === `event_${eventName}` && e.newValue) {
        try {
          const event = JSON.parse(e.newValue);
          callback(event.data);
        } catch (error) {
          console.warn('Failed to parse storage event', error);
        }
      }
    };
    
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }
};

export const useTranslationState = () => {
  // Initialize state
  const [language, setLanguageState] = useState<Language>('en');
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const [customTranslations, setCustomTranslations] = useState<{
    en: Record<string, string>;
  }>({ en: {} });
  
  // Create broadcast channel reference for language sync
  const [langSyncChannel, setLangSyncChannel] = useState(() => 
    createSafeBroadcastChannel('language_sync')
  );
  
  // Create memory cache using ref
  const translationCacheRef = useRef<Record<string, CacheEntry<string>>>({});
  const frequentlyUsedKeys = useRef<Set<string>>(new Set());
  
  // Cache initialization and warming
  useEffect(() => {
    // Try to load cached frequently used keys
    const cachedFrequentKeys = storageHelper.get<string[]>('translation_frequent_keys');
    if (cachedFrequentKeys) {
      frequentlyUsedKeys.current = new Set(cachedFrequentKeys);
    }
    
    // Warm the cache with previously stored translations
    const cachedTranslations = storageHelper.get<Record<string, CacheEntry<string>>>('translation_cache');
    if (cachedTranslations) {
      // Only use cache entries that match our version
      Object.entries(cachedTranslations).forEach(([key, entry]) => {
        if (entry.version === CACHE_VERSION) {
          translationCacheRef.current[key] = entry;
        }
      });
    }
    
    // Set an interval to periodically save frequently used keys
    const intervalId = setInterval(() => {
      storageHelper.set('translation_frequent_keys', Array.from(frequentlyUsedKeys.current));
    }, 60000); // Save every minute
    
    return () => {
      clearInterval(intervalId);
      // Save one last time on unmount
      storageHelper.set('translation_frequent_keys', Array.from(frequentlyUsedKeys.current));
    };
  }, []);
  
  // Save cache to localStorage periodically
  useEffect(() => {
    const intervalId = setInterval(() => {
      storageHelper.set('translation_cache', translationCacheRef.current);
    }, 30000); // Save every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Recreate channel if it was closed
  useEffect(() => {
    if (!langSyncChannel) {
      setLangSyncChannel(createSafeBroadcastChannel('language_sync'));
    }
    
    return () => {
      // Properly clean up the channel when component unmounts
      if (langSyncChannel) {
        langSyncChannel.close();
        setLangSyncChannel(null);
      }
    };
  }, [langSyncChannel]);

  // Apply font optimization when the hook is first used
  useEffect(() => {
    optimizeFontDisplay();
  }, []);

  // Safely change language with proper state tracking
  const changeLanguage = useCallback((newLanguage: Language) => {
    setIsChangingLanguage(true);
    setLanguageState(newLanguage);
    
    // Clear translation cache when language changes
    translationCacheRef.current = {};
    
    // Safely notify other tabs using BroadcastChannel
    if (langSyncChannel) {
      try {
        langSyncChannel.postMessage({ language: newLanguage });
      } catch (error) {
        console.warn('Failed to post message to BroadcastChannel', error);
        // Use storage event fallback
        storageEventEmitter.emit('language_change', { language: newLanguage });
        // Recreate the channel if there was an error
        setLangSyncChannel(createSafeBroadcastChannel('language_sync'));
      }
    } else {
      // Use storage event fallback if BroadcastChannel is not available
      storageEventEmitter.emit('language_change', { language: newLanguage });
    }
    
    // Save to localStorage for persistence
    try {
      localStorage.setItem('language', newLanguage);
    } catch (error) {
      console.warn('Failed to save language to localStorage', error);
    }
    
    // Artificial delay to ensure smooth transitions
    setTimeout(() => {
      setIsChangingLanguage(false);
    }, 300);
  }, [langSyncChannel]);

  // Always initialize with English
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem('language') as Language;
      if (savedLanguage === 'en') {
        changeLanguage(savedLanguage);
      } else {
        changeLanguage('en');
      }
    } catch (error) {
      console.warn('Failed to initialize language from localStorage', error);
      // Use a fallback if localStorage fails
      changeLanguage('en');
    }
    
    // Set up BroadcastChannel listener
    const handleChannelMessage = (event: MessageEvent) => {
      if (event.data?.language && event.data.language !== language) {
        setLanguageState(event.data.language);
      }
    };
    
    if (langSyncChannel) {
      langSyncChannel.addEventListener('message', handleChannelMessage);
    }
    
    // Set up localStorage event listener as fallback
    const unsubscribeStorage = storageEventEmitter.listen('language_change', (data) => {
      if (data?.language && data.language !== language) {
        setLanguageState(data.language);
      }
    });
    
    return () => {
      if (langSyncChannel) {
        langSyncChannel.removeEventListener('message', handleChannelMessage);
      }
      unsubscribeStorage();
    };
  }, [changeLanguage, language, langSyncChannel]);

  // Update HTML attributes when language changes
  useEffect(() => {
    // Update HTML document attributes
    document.documentElement.lang = language;
    document.body.style.fontFamily = "'IBM Plex Sans', sans-serif";
  }, [language]);

  const trackKeyUsage = useCallback((key: string) => {
    frequentlyUsedKeys.current.add(key);
  }, []);

  // Returns a function to track translation usage
  const getTranslationTracker = useCallback(() => {
    return trackKeyUsage;
  }, [trackKeyUsage]);

  // Clear cache
  const clearLanguageCache = useCallback(() => {
    translationCacheRef.current = {};
    
    // Also update localStorage
    storageHelper.set('translation_cache', translationCacheRef.current);
  }, []);

  return {
    language,
    setLanguage: changeLanguage,
    isChangingLanguage,
    customTranslations,
    setCustomTranslations,
    translationCacheRef,
    trackKeyUsage,
    getTranslationTracker,
    clearLanguageCache
  };
};

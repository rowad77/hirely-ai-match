
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage, t, isChangingLanguage } = useLanguage();
  const [isHovered, setIsHovered] = React.useState(false);
  
  // Enhanced toggle with fallback
  const toggleLanguage = React.useCallback(() => {
    try {
      setLanguage(language === 'en' ? 'ar' : 'en');
    } catch (error) {
      console.error('Failed to toggle language:', error);
      // Attempt recovery by forcing English
      setLanguage('en');
    }
  }, [language, setLanguage]);

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocus={() => setIsHovered(true)}
            onBlur={() => setIsHovered(false)}
            className={cn(
              "relative transition-all duration-300 flex items-center gap-1",
              isChangingLanguage && "opacity-70 pointer-events-none"
            )}
            aria-label={t('switchLanguage')}
            disabled={isChangingLanguage}
          >
            {isChangingLanguage ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Globe className="h-4 w-4" aria-hidden="true" />
            )}
            <span className={cn(
              "transition-opacity",
              isHovered ? "opacity-100" : ""
            )}>
              {language === 'en' ? 'العربية' : 'English'}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>{t('switchLanguage')}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LanguageToggle;

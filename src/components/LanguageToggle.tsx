
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage, t, direction, isChangingLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className={cn(
              "relative transition-all duration-300 flex items-center gap-1",
              direction === 'rtl' ? 'flex-row-reverse' : '',
              isChangingLanguage && "opacity-70 pointer-events-none"
            )}
            flipIconRtl
            disabled={isChangingLanguage}
          >
            {isChangingLanguage ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Globe className="h-4 w-4" />
            )}
            <span className="transition-opacity">
              {language === 'en' ? 'العربية' : 'English'}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t('switchLanguage')}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LanguageToggle;

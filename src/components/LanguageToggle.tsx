
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const LanguageToggle: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="relative transition-all duration-300 flex items-center gap-1"
            aria-label={t('currentLanguage')}
            disabled={true}
          >
            <Globe className="h-4 w-4" aria-hidden="true" />
            <span className="opacity-100">
              English
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>{t('currentLanguage')}: English</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LanguageToggle;

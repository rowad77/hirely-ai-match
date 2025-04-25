
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { Globe, Languages } from "lucide-react";
import { useRtlMargin } from "@/lib/rtl-utils";

export const LanguageToggle = () => {
  const { language, setLanguage, t } = useLanguage();
  const iconMargin = useRtlMargin("mr-2", "ml-2");

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
      className="flex items-center gap-2"
    >
      <Globe className={`h-4 w-4 ${iconMargin}`} />
      <span>{language === 'en' ? 'العربية' : 'English'}</span>
    </Button>
  );
};

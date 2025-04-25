
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { Language } from "lucide-react";

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
      className="flex items-center gap-2"
    >
      <Language className="h-4 w-4" />
      <span>{language === 'en' ? 'العربية' : 'English'}</span>
    </Button>
  );
};

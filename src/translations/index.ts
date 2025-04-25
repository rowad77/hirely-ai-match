
export const translations = {
  en: {
    interviews: {
      title: "Interview Management",
      description: "Manage your interviews and track candidate progress throughout the hiring process.",
      scheduleNew: "Schedule New Interview",
      tabs: {
        schedule: "Interview Schedule",
        pipeline: "Candidate Pipeline"
      },
      noInterviews: "No interviews scheduled for this day.",
      status: {
        scheduled: "Scheduled",
        completed: "Completed",
        cancelled: "Cancelled"
      },
      actions: {
        complete: "Complete",
        cancel: "Cancel",
        viewNotes: "View Notes",
        reschedule: "Reschedule",
        back: "Back"
      }
    }
  },
  ar: {
    interviews: {
      title: "إدارة المقابلات",
      description: "إدارة المقابلات وتتبع تقدم المرشحين خلال عملية التوظيف",
      scheduleNew: "جدولة مقابلة جديدة",
      tabs: {
        schedule: "جدول المقابلات",
        pipeline: "مسار المرشحين"
      },
      noInterviews: "لا توجد مقابلات مجدولة لهذا اليوم",
      status: {
        scheduled: "مجدولة",
        completed: "مكتملة",
        cancelled: "ملغاة"
      },
      actions: {
        complete: "إكمال",
        cancel: "إلغاء",
        viewNotes: "عرض الملاحظات",
        reschedule: "إعادة جدولة",
        back: "رجوع"
      }
    }
  }
};

export type Language = 'ar' | 'en';
export type TranslationKey = keyof typeof translations.en;

export const useTranslation = () => {
  const { language } = useLanguage();
  
  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return { t };
};

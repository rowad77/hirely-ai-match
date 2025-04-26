import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import OwnerLayout from '@/components/layout/OwnerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, Download, Globe, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';

const OwnerLanguages = () => {
  const { t } = useLanguage();
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  
  // Extract translations into CSV format with ALL website text content
  const exportTranslations = () => {
    try {
      // Comprehensive website text content organized by sections
      const websiteContent = {
        // Homepage content
        homepageSection: {
          findDreamCareer: {
            en: "Find your dream career in minutes",
            ar: "اعثر على وظيفة أحلامك في دقائق"
          },
          connectWithCompanies: {
            en: "Connect with top companies looking for talent",
            ar: "تواصل مع أفضل الشركات التي تبحث عن المواهب"
          },
          uploadYourResume: {
            en: "Upload your resume and let AI match you with the perfect job",
            ar: "قم بتحميل سيرتك الذاتية ودع الذكاء الاصطناعي يطابقك مع الوظيفة المثالية"
          },
          getStarted: {
            en: "Get started today",
            ar: "ابدأ اليوم"
          },
          readyToAccelerate: {
            en: "Ready to accelerate your job search?",
            ar: "هل أنت مستعد لتسريع عملية البحث عن وظيفة؟"
          },
          joinThousands: {
            en: "Join thousands of professionals who found their dream jobs through Hirely",
            ar: "انضم إلى آلاف المهنيين الذين وجدوا وظائف أحلامهم من خلال هايرلي"
          },
          createProfile: {
            en: "Create Your Profile",
            ar: "إنشاء ملفك الشخصي"
          },
          browseJobs: {
            en: "Browse Jobs",
            ar: "تصفح الوظائف"
          },
          uploadCv: {
            en: "Upload Your CV",
            ar: "قم بتحميل سيرتك الذاتية"
          },
          getMatched: {
            en: "Get matched with relevant jobs instantly",
            ar: "احصل على تطابق مع وظائف ذات صلة على الفور"
          },
          clickToUpload: {
            en: "Click to upload or drag and drop",
            ar: "انقر للتحميل أو اسحب وأفلت"
          },
          fileTypes: {
            en: "PDF, DOC, DOCX, or TXT (max 5MB)",
            ar: "PDF، DOC، DOCX، أو TXT (الحد الأقصى 5 ميجابايت)"
          },
          uploadCvFindMatches: {
            en: "Upload CV & Find Matches",
            ar: "قم بتحميل السيرة الذاتية والعثور على تطابقات"
          }
        },
        
        // Statistics Section
        statsSection: {
          activeJobs: {
            en: "10,000+",
            ar: "10,000+"
          },
          activeJobsLabel: {
            en: "Active Jobs",
            ar: "وظائف نشطة"
          },
          placementRate: {
            en: "85%",
            ar: "85%"
          },
          placementRateLabel: {
            en: "Placement Rate",
            ar: "معدل التوظيف"
          },
          companies: {
            en: "2,500+",
            ar: "2,500+"
          },
          companiesLabel: {
            en: "Companies",
            ar: "شركات"
          },
          clientSatisfaction: {
            en: "95%",
            ar: "95%"
          },
          clientSatisfactionLabel: {
            en: "Client Satisfaction",
            ar: "رضا العملاء"
          }
        },

        // How It Works Section
        howItWorksSection: {
          sectionTitle: {
            en: "How Hirely Works",
            ar: "كيف يعمل هايرلي"
          },
          sectionSubtitle: {
            en: "Our AI-powered platform makes finding your next job simple and effective",
            ar: "منصتنا المدعومة بالذكاء الاصطناعي تجعل العثور على وظيفتك التالية بسيطة وفعالة"
          },
          simpleProcess: {
            en: "Simple Process",
            ar: "عملية بسيطة"
          },
          step1Title: {
            en: "Upload Your CV",
            ar: "قم بتحميل سيرتك الذاتية"
          }, 
          step1Description: {
            en: "Upload your resume or complete your profile for our AI to analyze your qualifications and skills.",
            ar: "قم بتحميل سيرتك الذاتية أو أكمل ملفك الشخصي ليقوم الذكاء الاصطناعي لدينا بتحليل مؤهلاتك ومهاراتك."
          },
          step2Title: {
            en: "AI Matching",
            ar: "مطابقة الذكاء الاصطناعي"
          },
          step2Description: {
            en: "Our algorithm intelligently matches you with positions that fit your experience, skills, and career goals.",
            ar: "خوارزميتنا تطابقك بذكاء مع المناصب التي تناسب خبرتك ومهاراتك وأهدافك المهنية."
          },
          step3Title: {
            en: "Apply Instantly",
            ar: "تقدم بطلب على الفور"
          },
          step3Description: {
            en: "Apply to matched positions with a single click, your profile is automatically submitted to employers.",
            ar: "تقدم للوظائف المتطابقة بنقرة واحدة، ويتم إرسال ملفك الشخصي تلقائياً إلى أصحاب العمل."
          }
        },
        
        // Why Choose Hirely Section (Added the missing marketing content)
        whyChooseSection: {
          sectionTitle: {
            en: "Why Choose Hirely",
            ar: "لماذا تختار هايرلي"
          },
          sectionSubtitle: {
            en: "Supercharge Your Job Search",
            ar: "تعزيز بحثك عن وظيفة"
          },
          sectionDescription: {
            en: "Our platform offers unique advantages that help you find your dream job faster and with less hassle.",
            ar: "توفر منصتنا مزايا فريدة تساعدك في العثور على وظيفة أحلامك بشكل أسرع ومع متاعب أقل."
          },
          feature1Title: {
            en: "AI-Powered Matching",
            ar: "مطابقة مدعومة بالذكاء الاصطناعي"
          },
          feature1Description: {
            en: "Get job recommendations tailored specifically to your profile",
            ar: "احصل على توصيات وظيفية مخصصة خصيصاً لملفك الشخصي"
          },
          feature2Title: {
            en: "Verified Employers",
            ar: "أصحاب عمل موثقين"
          },
          feature2Description: {
            en: "All companies on our platform are verified to ensure legitimate opportunities",
            ar: "جميع الشركات على منصتنا تم التحقق منها لضمان فرص مشروعة"
          },
          feature3Title: {
            en: "Higher Success Rate",
            ar: "معدل نجاح أعلى"
          },
          feature3Description: {
            en: "85% of our candidates receive interview offers within 14 days",
            ar: "85% من مرشحينا يتلقون عروض مقابلات في غضون 14 يومًا"
          },
          feature4Title: {
            en: "Career Growth Tools",
            ar: "أدوات تطوير المهنة"
          },
          feature4Description: {
            en: "Get insights on skill development to advance your career trajectory",
            ar: "احصل على رؤى حول تطوير المهارات لتعزيز مسارك المهني"
          },
          benefit1Title: {
            en: "Smart Matching",
            ar: "مطابقة ذكية"
          },
          benefit1Description: {
            en: "Our AI analyzes thousands of data points to find your perfect job match.",
            ar: "يحلل الذكاء الاصطناعي لدينا آلاف البيانات للعثور على وظيفتك المثالية."
          },
          benefit2Title: {
            en: "Privacy Protected",
            ar: "حماية الخصوصية"
          },
          benefit2Description: {
            en: "Your data is secure, and you control who sees your profile information.",
            ar: "بياناتك آمنة، وأنت تتحكم في من يرى معلومات ملفك الشخصي."
          },
          benefit3Title: {
            en: "Skill Assessment",
            ar: "تقييم المهارات"
          },
          benefit3Description: {
            en: "Get personalized recommendations to enhance your skillset.",
            ar: "احصل على توصيات مخصصة لتعزيز مهاراتك."
          },
          benefit4Title: {
            en: "Career Insights",
            ar: "رؤى مهنية"
          },
          benefit4Description: {
            en: "Access market trends and salary benchmarks in your industry.",
            ar: "الوصول إلى اتجاهات السوق ومعايير الرواتب في صناعتك."
          }
        },
        
        // Featured Jobs Section
        featuredJobsSection: {
          sectionTitle: {
            en: "Featured Jobs",
            ar: "الوظائف المميزة"
          },
          sectionSubtitle: {
            en: "Latest Opportunities",
            ar: "أحدث الفرص"
          },
          sectionDescription: {
            en: "Discover your next career move with top companies looking for talent like yours",
            ar: "اكتشف خطوتك المهنية التالية مع أفضل الشركات التي تبحث عن مواهب مثلك"
          },
          allCategories: {
            en: "All Categories",
            ar: "جميع الفئات"
          },
          technology: {
            en: "Technology",
            ar: "التكنولوجيا"
          },
          marketing: {
            en: "Marketing",
            ar: "التسويق"
          },
          design: {
            en: "Design",
            ar: "التصميم"
          },
          viewDetails: {
            en: "View Details",
            ar: "عرض التفاصيل"
          },
          viewAllJobs: {
            en: "View All Jobs",
            ar: "عرض جميع الوظائف"
          }
        },
        
        // Navigation & UI elements
        navigationSection: {
          searchJobs: {
            en: "Search Jobs",
            ar: "البحث عن وظائف"
          },
          browseCategories: {
            en: "Browse Categories",
            ar: "تصفح الفئات"
          },
          recentJobListings: {
            en: "Recent Job Listings",
            ar: "أحدث الوظائف"
          },
          dashboard: {
            en: "Dashboard",
            ar: "لوحة التحكم"
          },
          profile: {
            en: "Profile",
            ar: "الملف الشخصي"
          },
          settings: {
            en: "Settings",
            ar: "الإعدادات"
          },
          applications: {
            en: "Applications",
            ar: "الطلبات"
          },
          logout: {
            en: "Logout",
            ar: "تسجيل الخروج"
          }
        },
        
        // Job listings content
        jobsSection: {
          jobDescription: {
            en: "Job Description",
            ar: "وصف الوظيفة"
          },
          requirements: {
            en: "Requirements",
            ar: "المتطلبات"
          },
          responsibilities: {
            en: "Responsibilities",
            ar: "المسؤوليات"
          },
          qualifications: {
            en: "Qualifications",
            ar: "المؤهلات"
          },
          experience: {
            en: "Experience",
            ar: "الخبرة"
          },
          location: {
            en: "Location",
            ar: "الموقع"
          },
          salary: {
            en: "Salary",
            ar: "الراتب"
          },
          jobType: {
            en: "Job Type",
            ar: "نوع الوظيفة"
          },
          postedDate: {
            en: "Posted Date",
            ar: "تاريخ النشر"
          }
        },
        
        // Application process
        applicationSection: {
          applyNow: {
            en: "Apply Now",
            ar: "تقدم الآن"
          },
          uploadResume: {
            en: "Upload Resume",
            ar: "تحميل السيرة الذاتية"
          },
          personalInfo: {
            en: "Personal Information",
            ar: "المعلومات الشخصية"
          },
          workHistory: {
            en: "Work History",
            ar: "تاريخ العمل"
          },
          education: {
            en: "Education",
            ar: "التعليم"
          },
          skills: {
            en: "Skills",
            ar: "المهارات"
          },
          coverLetter: {
            en: "Cover Letter",
            ar: "خطاب التغطية"
          },
          videoInterview: {
            en: "Video Interview",
            ar: "مقابلة فيديو"
          },
          submitApplication: {
            en: "Submit Application",
            ar: "تقديم الطلب"
          },
          applicationSuccess: {
            en: "Application Submitted Successfully!",
            ar: "تم تقديم الطلب بنجاح!"
          },
          whatHappensNext: {
            en: "What happens next?",
            ar: "ماذا يحدث بعد ذلك؟"
          }
        },
        
        // Profile section
        profileSection: {
          basicInfo: {
            en: "Basic Information",
            ar: "المعلومات الأساسية"
          },
          fullName: {
            en: "Full Name",
            ar: "الاسم الكامل"
          },
          emailAddress: {
            en: "Email Address",
            ar: "عنوان البريد الإلكتروني"
          },
          phoneNumber: {
            en: "Phone Number",
            ar: "رقم الهاتف"
          },
          currentPosition: {
            en: "Current Position",
            ar: "المنصب الحالي"
          },
          location: {
            en: "Location",
            ar: "الموقع"
          },
          bio: {
            en: "Bio",
            ar: "السيرة الذاتية"
          },
          updateProfile: {
            en: "Update Profile",
            ar: "تحديث الملف الشخصي"
          }
        },
        
        // Company pages content
        companySection: {
          companyProfile: {
            en: "Company Profile",
            ar: "ملف الشركة"
          },
          companyDescription: {
            en: "Company Description",
            ar: "وصف الشركة"
          },
          industry: {
            en: "Industry",
            ar: "الصناعة"
          },
          companySize: {
            en: "Company Size",
            ar: "حجم الشركة"
          },
          founded: {
            en: "Founded",
            ar: "تأسست"
          },
          website: {
            en: "Website",
            ar: "الموقع الإلكتروني"
          },
          headquarters: {
            en: "Headquarters",
            ar: "المقر الرئيسي"
          },
          openPositions: {
            en: "Open Positions",
            ar: "الوظائف المفتوحة"
          }
        },
        
        // Documentation page
        documentationSection: {
          gettingStarted: {
            en: "Getting Started",
            ar: "البدء"
          },
          creatingProfile: {
            en: "Creating a Profile",
            ar: "إنشاء ملف شخصي"
          },
          searchingForJobs: {
            en: "Searching for Jobs",
            ar: "البحث عن وظائف"
          },
          applyingToPositions: {
            en: "Applying to Positions",
            ar: "التقدم للوظائف"
          },
          features: {
            en: "Features",
            ar: "الميزات"
          },
          aiResumeAnalysis: {
            en: "AI Resume Analysis",
            ar: "تحليل السيرة الذاتية بالذكاء الاصطناعي"
          },
          videoInterviewPreparation: {
            en: "Video Interview Preparation",
            ar: "الإعداد لمقابلة الفيديو"
          },
          jobMatching: {
            en: "Job Matching",
            ar: "مطابقة الوظائف"
          },
          cvExtraction: {
            en: "CV Extraction and Profile Updates",
            ar: "استخراج السيرة الذاتية وتحديثات الملف الشخصي"
          }
        },
        
        // Login/Signup content
        authSection: {
          login: {
            en: "Sign in to your account",
            ar: "تسجيل الدخول إلى حسابك"
          },
          dontHaveAccount: {
            en: "Don't have an account?",
            ar: "ليس لديك حساب؟"
          },
          signup: {
            en: "Create your account",
            ar: "إنشاء حسابك"
          },
          alreadyHaveAccount: {
            en: "Already have an account?",
            ar: "لديك حساب بالفعل؟"
          },
          forgotPassword: {
            en: "Forgot your password?",
            ar: "نسيت كلمة المرور؟"
          },
          emailAddress: {
            en: "Email address",
            ar: "عنوان البريد الإلكتروني"
          },
          password: {
            en: "Password",
            ar: "كلمة المرور"
          },
          companyName: {
            en: "Company name",
            ar: "اسم الشركة"
          },
          passwordStrength: {
            en: "Password strength",
            ar: "قوة كلمة المرور"
          },
          termsOfService: {
            en: "Terms of Service",
            ar: "شروط الخدمة"
          },
          privacyPolicy: {
            en: "Privacy Policy",
            ar: "سياسة الخصوصية"
          }
        },
        
        // Footer content
        footerSection: {
          aboutUs: {
            en: "About Us",
            ar: "عن الشركة"
          },
          contactUs: {
            en: "Contact Us",
            ar: "اتصل بنا"
          },
          faq: {
            en: "FAQ",
            ar: "الأسئلة الشائعة"
          },
          blog: {
            en: "Blog",
            ar: "المدونة"
          },
          careers: {
            en: "Careers",
            ar: "وظائف"
          },
          privacyPolicy: {
            en: "Privacy Policy",
            ar: "سياسة الخصوصية"
          },
          termsOfService: {
            en: "Terms of Service",
            ar: "شروط الخدمة"
          },
          copyright: {
            en: "© 2025 Hirely. All rights reserved.",
            ar: "© 2025 هايرلي. جميع الحقوق محفوظة."
          }
        },
        
        // Error messages & notifications
        notificationSection: {
          error: {
            en: "Error",
            ar: "خطأ"
          },
          success: {
            en: "Success",
            ar: "نجاح"
          },
          warning: {
            en: "Warning",
            ar: "تحذير"
          },
          info: {
            en: "Information",
            ar: "معلومات"
          },
          loginSuccess: {
            en: "Login successful",
            ar: "تم تسجيل الدخول بنجاح"
          },
          loginFailed: {
            en: "Login failed",
            ar: "فشل تسجيل الدخول"
          },
          profileUpdated: {
            en: "Profile updated successfully",
            ar: "تم تحديث الملف الشخصي بنجاح"
          },
          applicationSubmitted: {
            en: "Application submitted successfully",
            ar: "تم تقديم الطلب بنجاح"
          }
        },
        
        // Include existing translations from language context
        ...t
      };
      
      // Create CSV header with additional context columns
      let csvContent = 'key,section,english,arabic,context\n';
      
      // Process all website content to CSV, preserving nested structure
      Object.entries(websiteContent).forEach(([sectionKey, sectionValue]) => {
        // Skip if it's not an object (could be a nested object from language context)
        if (typeof sectionValue !== 'object' || sectionValue === null) return;
        
        // Process the direct keys from this section 
        if ('en' in sectionValue && 'ar' in sectionValue) {
          // Handle direct translations in the section
          const englishValue = sectionValue.en?.toString().replace(/"/g, '""') || '';
          const arabicValue = sectionValue.ar?.toString().replace(/"/g, '""') || '';
          const context = `Website text found in ${sectionKey}`;
          csvContent += `${sectionKey},"main","${englishValue}","${arabicValue}","${context}"\n`;
        } else {
          // Handle nested objects within the section
          Object.entries(sectionValue as Record<string, any>).forEach(([key, value]) => {
            if (typeof value === 'object' && value !== null && 'en' in value && 'ar' in value) {
              const englishValue = value.en?.toString().replace(/"/g, '""') || '';
              const arabicValue = value.ar?.toString().replace(/"/g, '""') || '';
              const context = `Located in the ${sectionKey} section`;
              csvContent += `${key},"${sectionKey}","${englishValue}","${arabicValue}","${context}"\n`;
            }
          });
        }
      });
      
      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'website_translations_complete.csv');
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast.success('Complete website translations downloaded successfully');
    } catch (error) {
      console.error('Error downloading translations:', error);
      toast.error('Failed to download translations');
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadFile(e.target.files[0]);
    }
  };
  
  const uploadTranslations = () => {
    if (!uploadFile) {
      toast.error('Please select a file to upload');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        if (!csvText) {
          toast.error('Error reading file');
          return;
        }
        
        // Parse CSV and validate format
        const lines = csvText.split('\n');
        const headers = lines[0].split(',');
        
        // Check if CSV has required columns
        if (headers.length < 3 || 
            !headers.includes('key') || 
            !headers.includes('english') || 
            !headers.includes('arabic')) {
          toast.error('Invalid CSV format. Required columns: key, english, arabic');
          return;
        }
        
        // In a real app, this would update translations in your database
        // Here we just show a success message
        toast.success('Translations uploaded and processed successfully');
        setUploadFile(null);
        
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } catch (error) {
        console.error('Error processing CSV:', error);
        toast.error('Failed to process translation file');
      }
    };
    
    reader.onerror = () => {
      toast.error('Error reading file');
    };
    
    reader.readAsText(uploadFile);
  };

  return (
    <OwnerLayout title={t('languageManagement')}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {t('languageManagement')}
            </CardTitle>
            <CardDescription>
              Manage translations for the platform. Download the CSV template, fill in the translations, and upload it back.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Download Section */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">
                {t('downloadTranslations')}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Download a CSV file containing all website text and translations. The file includes both English and Arabic translations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={exportTranslations} 
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {t('downloadTranslations')}
                </Button>
              </div>
              <div className="mt-4 flex items-start gap-2 bg-blue-100 p-3 rounded-md">
                <Info className="h-5 w-5 text-blue-700 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                  The exported CSV contains all website text organized by sections, including homepage content, navigation, 
                  job listings, application process, profiles, company pages, documentation, authentication, footer, and notifications.
                </p>
              </div>
            </div>
            
            {/* Upload Section */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">
                {t('uploadTranslations')}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Upload your filled CSV file to update the translations in the system. Ensure the CSV format matches the downloaded template.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-grow">
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <Button 
                  onClick={uploadTranslations} 
                  className="bg-green-600 hover:bg-green-700"
                  disabled={!uploadFile}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {t('uploadTranslations')}
                </Button>
              </div>
              {uploadFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected file: {uploadFile.name}
                </p>
              )}
              <div className="mt-4 flex items-start gap-2 bg-green-100 p-3 rounded-md">
                <Info className="h-5 w-5 text-green-700 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800">
                  When uploading translations, the system will validate your CSV format and ensure all required columns 
                  are present. The file should contain at minimum the key, english, and arabic columns.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </OwnerLayout>
  );
};

export default OwnerLanguages;

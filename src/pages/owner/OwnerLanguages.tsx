import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import OwnerLayout from '@/components/layout/OwnerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, Download, Globe, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';

const OwnerLanguages = () => {
  const { t, setCustomTranslations } = useLanguage();
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  
  // Export translations to CSV format
  const exportTranslations = () => {
    try {
      // Comprehensive website text content organized by sections
      const websiteContent = {
        // Homepage content
        homepageSection: {
          findDreamCareer: {
            en: "Find your dream career in minutes",
          },
          connectWithCompanies: {
            en: "Connect with top companies looking for talent",
          },
          uploadYourResume: {
            en: "Upload your resume and let AI match you with the perfect job",
          },
          getStarted: {
            en: "Get started today",
          },
          readyToAccelerate: {
            en: "Ready to accelerate your job search?",
          },
          joinThousands: {
            en: "Join thousands of professionals who found their dream jobs through Hirely",
          },
          createProfile: {
            en: "Create Your Profile",
          },
          browseJobs: {
            en: "Browse Jobs",
          },
          uploadCv: {
            en: "Upload Your CV",
          },
          getMatched: {
            en: "Get matched with relevant jobs instantly",
          },
          clickToUpload: {
            en: "Click to upload or drag and drop",
          },
          fileTypes: {
            en: "PDF, DOC, DOCX, or TXT (max 5MB)",
          },
          uploadCvFindMatches: {
            en: "Upload CV & Find Matches",
          }
        },
        
        // Statistics Section
        statsSection: {
          activeJobs: {
            en: "10,000+",
          },
          activeJobsLabel: {
            en: "Active Jobs",
          },
          placementRate: {
            en: "85%",
          },
          placementRateLabel: {
            en: "Placement Rate",
          },
          companies: {
            en: "2,500+",
          },
          companiesLabel: {
            en: "Companies",
          },
          clientSatisfaction: {
            en: "95%",
          },
          clientSatisfactionLabel: {
            en: "Client Satisfaction",
          }
        },

        // How It Works Section
        howItWorksSection: {
          sectionTitle: {
            en: "How Hirely Works",
          },
          sectionSubtitle: {
            en: "Our AI-powered platform makes finding your next job simple and effective",
          },
          simpleProcess: {
            en: "Simple Process",
          },
          step1Title: {
            en: "Upload Your CV",
          }, 
          step1Description: {
            en: "Upload your resume or complete your profile for our AI to analyze your qualifications and skills.",
          },
          step2Title: {
            en: "AI Matching",
          },
          step2Description: {
            en: "Our algorithm intelligently matches you with positions that fit your experience, skills, and career goals.",
          },
          step3Title: {
            en: "Apply Instantly",
          },
          step3Description: {
            en: "Apply to matched positions with a single click, your profile is automatically submitted to employers.",
          }
        },
        
        // Why Choose Hirely Section (Added the missing marketing content)
        whyChooseSection: {
          sectionTitle: {
            en: "Why Choose Hirely",
          },
          sectionSubtitle: {
            en: "Supercharge Your Job Search",
          },
          sectionDescription: {
            en: "Our platform offers unique advantages that help you find your dream job faster and with less hassle.",
          },
          feature1Title: {
            en: "AI-Powered Matching",
          },
          feature1Description: {
            en: "Get job recommendations tailored specifically to your profile",
          },
          feature2Title: {
            en: "Verified Employers",
          },
          feature2Description: {
            en: "All companies on our platform are verified to ensure legitimate opportunities",
          },
          feature3Title: {
            en: "Higher Success Rate",
          },
          feature3Description: {
            en: "85% of our candidates receive interview offers within 14 days",
          },
          feature4Title: {
            en: "Career Growth Tools",
          },
          feature4Description: {
            en: "Get insights on skill development to advance your career trajectory",
          },
          benefit1Title: {
            en: "Smart Matching",
          },
          benefit1Description: {
            en: "Our AI analyzes thousands of data points to find your perfect job match.",
          },
          benefit2Title: {
            en: "Privacy Protected",
          },
          benefit2Description: {
            en: "Your data is secure, and you control who sees your profile information.",
          },
          benefit3Title: {
            en: "Skill Assessment",
          },
          benefit3Description: {
            en: "Get personalized recommendations to enhance your skillset.",
          },
          benefit4Title: {
            en: "Career Insights",
          },
          benefit4Description: {
            en: "Access market trends and salary benchmarks in your industry.",
          }
        },
        
        // Featured Jobs Section
        featuredJobsSection: {
          sectionTitle: {
            en: "Featured Jobs",
          },
          sectionSubtitle: {
            en: "Latest Opportunities",
          },
          sectionDescription: {
            en: "Discover your next career move with top companies looking for talent like yours",
          },
          allCategories: {
            en: "All Categories",
          },
          technology: {
            en: "Technology",
          },
          marketing: {
            en: "Marketing",
          },
          design: {
            en: "Design",
          },
          viewDetails: {
            en: "View Details",
          },
          viewAllJobs: {
            en: "View All Jobs",
          }
        },
        
        // Navigation & UI elements
        navigationSection: {
          searchJobs: {
            en: "Search Jobs",
          },
          browseCategories: {
            en: "Browse Categories",
          },
          recentJobListings: {
            en: "Recent Job Listings",
          },
          dashboard: {
            en: "Dashboard",
          },
          profile: {
            en: "Profile",
          },
          settings: {
            en: "Settings",
          },
          applications: {
            en: "Applications",
          },
          logout: {
            en: "Logout",
          }
        },
        
        // Job listings content
        jobsSection: {
          jobDescription: {
            en: "Job Description",
          },
          requirements: {
            en: "Requirements",
          },
          responsibilities: {
            en: "Responsibilities",
          },
          qualifications: {
            en: "Qualifications",
          },
          experience: {
            en: "Experience",
          },
          location: {
            en: "Location",
          },
          salary: {
            en: "Salary",
          },
          jobType: {
            en: "Job Type",
          },
          postedDate: {
            en: "Posted Date",
          }
        },
        
        // Application process
        applicationSection: {
          applyNow: {
            en: "Apply Now",
          },
          uploadResume: {
            en: "Upload Resume",
          },
          personalInfo: {
            en: "Personal Information",
          },
          workHistory: {
            en: "Work History",
          },
          education: {
            en: "Education",
          },
          skills: {
            en: "Skills",
          },
          coverLetter: {
            en: "Cover Letter",
          },
          videoInterview: {
            en: "Video Interview",
          },
          submitApplication: {
            en: "Submit Application",
          },
          applicationSuccess: {
            en: "Application Submitted Successfully!",
          },
          whatHappensNext: {
            en: "What happens next?",
          }
        },
        
        // Profile section
        profileSection: {
          basicInfo: {
            en: "Basic Information",
          },
          fullName: {
            en: "Full Name",
          },
          emailAddress: {
            en: "Email Address",
          },
          phoneNumber: {
            en: "Phone Number",
          },
          currentPosition: {
            en: "Current Position",
          },
          location: {
            en: "Location",
          },
          bio: {
            en: "Bio",
          },
          updateProfile: {
            en: "Update Profile",
          }
        },
        
        // Company pages content
        companySection: {
          companyProfile: {
            en: "Company Profile",
          },
          companyDescription: {
            en: "Company Description",
          },
          industry: {
            en: "Industry",
          },
          companySize: {
            en: "Company Size",
          },
          founded: {
            en: "Founded",
          },
          website: {
            en: "Website",
          },
          headquarters: {
            en: "Headquarters",
          },
          openPositions: {
            en: "Open Positions",
          }
        },
        
        // Documentation page
        documentationSection: {
          gettingStarted: {
            en: "Getting Started",
          },
          creatingProfile: {
            en: "Creating a Profile",
          },
          searchingForJobs: {
            en: "Searching for Jobs",
          },
          applyingToPositions: {
            en: "Applying to Positions",
          },
          features: {
            en: "Features",
          },
          aiResumeAnalysis: {
            en: "AI Resume Analysis",
          },
          videoInterviewPreparation: {
            en: "Video Interview Preparation",
          },
          jobMatching: {
            en: "Job Matching",
          },
          cvExtraction: {
            en: "CV Extraction and Profile Updates",
          }
        },
        
        // Login/Signup content
        authSection: {
          login: {
            en: "Sign in to your account",
          },
          dontHaveAccount: {
            en: "Don't have an account?",
          },
          signup: {
            en: "Create your account",
          },
          alreadyHaveAccount: {
            en: "Already have an account?",
          },
          forgotPassword: {
            en: "Forgot your password?",
          },
          emailAddress: {
            en: "Email address",
          },
          password: {
            en: "Password",
          },
          companyName: {
            en: "Company name",
          },
          passwordStrength: {
            en: "Password strength",
          },
          termsOfService: {
            en: "Terms of Service",
          },
          privacyPolicy: {
            en: "Privacy Policy",
          }
        },
        
        // Footer content
        footerSection: {
          aboutUs: {
            en: "About Us",
          },
          contactUs: {
            en: "Contact Us",
          },
          faq: {
            en: "FAQ",
          },
          blog: {
            en: "Blog",
          },
          careers: {
            en: "Careers",
          },
          privacyPolicy: {
            en: "Privacy Policy",
          },
          termsOfService: {
            en: "Terms of Service",
          },
          copyright: {
            en: "© 2025 Hirely. All rights reserved.",
          }
        },
        
        // Error messages & notifications
        notificationSection: {
          error: {
            en: "Error",
          },
          success: {
            en: "Success",
          },
          warning: {
            en: "Warning",
          },
          info: {
            en: "Information",
          },
          loginSuccess: {
            en: "Login successful",
          },
          loginFailed: {
            en: "Login failed",
          },
          profileUpdated: {
            en: "Profile updated successfully",
          },
          applicationSubmitted: {
            en: "Application submitted successfully",
          }
        },
        
        // Include existing translations from language context
        ...t
      };
      
      // Create CSV header with additional context columns
      let csvContent = 'key,section,english,context\n';
      
      // Process all website content to CSV, preserving nested structure
      Object.entries(websiteContent).forEach(([sectionKey, sectionValue]) => {
        // Skip if it's not an object
        if (typeof sectionValue !== 'object' || sectionValue === null) return;
        
        // Process the direct keys from this section 
        if ('en' in sectionValue) {
          // Handle direct translations in the section
          const englishValue = sectionValue.en?.toString().replace(/"/g, '""') || '';
          const context = `Website text found in ${sectionKey}`;
          csvContent += `${sectionKey},"main","${englishValue}","${context}"\n`;
        } else {
          // Handle nested objects within the section
          Object.entries(sectionValue as Record<string, any>).forEach(([key, value]) => {
            if (typeof value === 'object' && value !== null && 'en' in value) {
              const englishValue = value.en?.toString().replace(/"/g, '""') || '';
              const context = `Located in the ${sectionKey} section`;
              csvContent += `${key},"${sectionKey}","${englishValue}","${context}"\n`;
            }
          });
        }
      });
      
      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'website_translations_english.csv');
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast.success('English website translations downloaded successfully');
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
        if (headers.length < 2 || 
            !headers.includes('key') || 
            !headers.includes('english')) {
          toast.error('Invalid CSV format. Required columns: key, english');
          return;
        }

        // Initialize translation objects
        const englishTranslations: Record<string, string> = {};

        // Process each line of the CSV
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          // Split by comma but handle quoted values correctly
          const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          const key = values[headers.indexOf('key')].trim();
          const english = values[headers.indexOf('english')].replace(/^"|"$/g, '').trim();

          if (key && english) {
            englishTranslations[key] = english;
          }
        }

        // Update translations in the context
        setCustomTranslations({
          en: englishTranslations
        });
        
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
              Manage translations for the platform. Download the CSV template, customize the text, and upload it back.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Download Section */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">
                {t('downloadTranslations')}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Download a CSV file containing all website text. You can modify the text and upload it back to customize the platform language.
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
                  job listings, application process, profiles, company pages, and more.
                </p>
              </div>
            </div>
            
            {/* Upload Section */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">
                {t('uploadTranslations')}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Upload your customized CSV file to update the text in the system. Ensure the CSV format matches the downloaded template.
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
                  are present. The file should contain at minimum the key and english columns.
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

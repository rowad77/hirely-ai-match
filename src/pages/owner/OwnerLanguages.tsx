
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import OwnerLayout from '@/components/layout/OwnerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, Download, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { enTranslations, arTranslations } from '@/context/LanguageContext';

const OwnerLanguages = () => {
  const { t } = useLanguage();
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  
  // Extract translations into CSV format
  const exportTranslations = () => {
    try {
      // Use translations directly from the LanguageContext
      const englishTranslations = enTranslations;
      const arabicTranslations = arTranslations;
      
      // Create CSV content with both English and Arabic translations
      let csvContent = 'key,english,arabic\n';
      
      Object.keys(englishTranslations).forEach((key) => {
        const englishValue = englishTranslations[key] || '';
        const arabicValue = arabicTranslations[key] || '';
        
        // Properly escape values for CSV format
        const escapedEnglish = englishValue.replace(/"/g, '""');
        const escapedArabic = arabicValue.replace(/"/g, '""');
        
        csvContent += `${key},"${escapedEnglish}","${escapedArabic}"\n`;
      });
      
      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'website_translations.csv');
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast.success('Website translations downloaded successfully');
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
        
        // Process CSV (in a real app, this would update the translations in your database)
        // For now, just show success message
        toast.success('Translations uploaded successfully');
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
              <Button 
                onClick={exportTranslations} 
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Download className="mr-2 h-4 w-4" />
                {t('downloadTranslations')}
              </Button>
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
            </div>
          </CardContent>
        </Card>
      </div>
    </OwnerLayout>
  );
};

export default OwnerLanguages;

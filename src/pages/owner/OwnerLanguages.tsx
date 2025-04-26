
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import OwnerLayout from '@/components/layout/OwnerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, Download, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';

const OwnerLanguages = () => {
  const { t } = useLanguage();
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  
  // Extract translations into CSV format
  const exportTranslations = () => {
    // Get English translations from LanguageContext
    const translations = require('@/context/LanguageContext').enTranslations;
    
    if (!translations) {
      toast.error('Error extracting translations');
      return;
    }
    
    // Create CSV content
    let csvContent = 'key,english,arabic\n';
    
    Object.entries(translations).forEach(([key, value]) => {
      csvContent += `${key},"${value}",""\n`;
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'translations.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Translations downloaded successfully');
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
    
    // In a real implementation, you would process the CSV file here
    // and update the translations in your database/storage
    
    toast.success('Translations uploaded successfully');
    setUploadFile(null);
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
                Download the CSV template containing all translation keys. Fill in your translations and upload the file back.
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
                Upload your filled CSV file to update the translations in the system.
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

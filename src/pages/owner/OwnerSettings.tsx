import { useState } from 'react';
import OwnerLayout from '@/components/layout/OwnerLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle, Save, Shield, Mail, Globe, Database, Key } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useRtlDirection, useRtlTextAlign } from '@/lib/rtl-utils';

const OwnerSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { t, language } = useLanguage();
  const rtlDirection = useRtlDirection();
  const rtlTextAlign = useRtlTextAlign();
  
  // Mock settings data
  const [settings, setSettings] = useState({
    general: {
      siteName: 'JobConnect Pro',
      siteDescription: 'The ultimate job portal for connecting companies and candidates',
      supportEmail: 'support@jobconnect.com',
      contactPhone: '+1 (555) 123-4567',
      logoUrl: 'https://example.com/logo.png'
    },
    security: {
      requireEmailVerification: true,
      twoFactorAuth: false,
      passwordMinLength: 8,
      passwordRequireSpecialChar: true,
      passwordRequireNumber: true,
      maxLoginAttempts: 5,
      sessionTimeout: 60
    },
    features: {
      allowUserRegistration: true,
      allowCompanyRegistration: true,
      jobApprovalRequired: true,
      enableFeaturedJobs: true,
      enableJobAlerts: true,
      enableCandidateSearch: true,
      enableCompanyAnalytics: true
    },
    email: {
      smtpHost: 'smtp.example.com',
      smtpPort: 587,
      smtpUsername: 'notifications@jobconnect.com',
      smtpPassword: '••••••••••••',
      emailFromName: 'JobConnect Pro',
      emailFromAddress: 'no-reply@jobconnect.com'
    },
    api: {
      enableApiAccess: true,
      rateLimit: 100,
      webhookUrl: 'https://webhook.example.com/jobconnect'
    }
  });

  const handleSaveSettings = () => {
    // In a real app, this would save the settings to the database
    toast.success(t('success'));
  };

  const handleChange = (section: string, field: string, value: string | boolean | number) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section as keyof typeof settings],
        [field]: value
      }
    });
  };

  // Translation mapping for settings sections
  const tabTranslations = {
    general: { title: t('general'), description: t('platform_overview') },
    security: { title: t('security'), description: t('security_settings') },
    features: { title: t('features'), description: t('platform_features') },
    email: { title: t('email_address'), description: t('email_settings') },
    api: { title: 'API', description: t('api_settings') },
  };

  // These translations may not be in the current translation object but should be
  const getTranslationWithFallback = (key: string, fallback: string) => {
    const translation = t(key);
    return translation === key ? fallback : translation;
  };

  return (
    <OwnerLayout title={t('platform_settings') || 'Platform Settings'}>
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className={`grid grid-cols-5 mb-8 ${rtlDirection}`}>
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Globe className="h-4 w-4" /> {tabTranslations.general.title}
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" /> {tabTranslations.security.title}
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" /> {tabTranslations.features.title}
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> {tabTranslations.email.title}
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Key className="h-4 w-4" /> {tabTranslations.api.title}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>{t('general_settings') || 'General Settings'}</CardTitle>
                <CardDescription>{getTranslationWithFallback('configure_basic', 'Configure basic platform settings')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${rtlDirection}`}>
                  <div className={`space-y-2 ${rtlTextAlign}`}>
                    <Label htmlFor="siteName">{t('site_name') || 'Site Name'}</Label>
                    <Input 
                      id="siteName" 
                      value={settings.general.siteName}
                      onChange={(e) => handleChange('general', 'siteName', e.target.value)}
                      className={rtlTextAlign}
                    />
                  </div>
                  <div className={`space-y-2 ${rtlTextAlign}`}>
                    <Label htmlFor="supportEmail">{t('support_email') || 'Support Email'}</Label>
                    <Input 
                      id="supportEmail" 
                      type="email"
                      value={settings.general.supportEmail}
                      onChange={(e) => handleChange('general', 'supportEmail', e.target.value)}
                      className={rtlTextAlign}
                    />
                  </div>
                </div>
                
                <div className={`space-y-2 ${rtlTextAlign}`}>
                  <Label htmlFor="siteDescription">{t('site_description') || 'Site Description'}</Label>
                  <Textarea 
                    id="siteDescription"
                    rows={3}
                    value={settings.general.siteDescription}
                    onChange={(e) => handleChange('general', 'siteDescription', e.target.value)}
                    className={rtlTextAlign}
                  />
                </div>
                
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${rtlDirection}`}>
                  <div className={`space-y-2 ${rtlTextAlign}`}>
                    <Label htmlFor="contactPhone">{t('contact_phone') || 'Contact Phone'}</Label>
                    <Input 
                      id="contactPhone" 
                      value={settings.general.contactPhone}
                      onChange={(e) => handleChange('general', 'contactPhone', e.target.value)}
                      className={rtlTextAlign}
                    />
                  </div>
                  <div className={`space-y-2 ${rtlTextAlign}`}>
                    <Label htmlFor="logoUrl">{t('logo_url') || 'Logo URL'}</Label>
                    <Input 
                      id="logoUrl" 
                      value={settings.general.logoUrl}
                      onChange={(e) => handleChange('general', 'logoUrl', e.target.value)}
                      className={rtlTextAlign}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>{t('security_settings') || 'Security Settings'}</CardTitle>
                <CardDescription>{getTranslationWithFallback('configure_security', 'Configure platform security options')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className={`flex items-center justify-between ${rtlDirection}`}>
                  <div className={rtlTextAlign}>
                    <p className="font-medium">{t('email_verification') || 'Email Verification'}</p>
                    <p className="text-sm text-gray-500">{getTranslationWithFallback('require_email_verification', 'Require email verification for new accounts')}</p>
                  </div>
                  <Switch 
                    checked={settings.security.requireEmailVerification}
                    onCheckedChange={(checked) => handleChange('security', 'requireEmailVerification', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className={`flex items-center justify-between ${rtlDirection}`}>
                  <div className={rtlTextAlign}>
                    <p className="font-medium">{getTranslationWithFallback('two_factor_auth', 'Two-Factor Authentication')}</p>
                    <p className="text-sm text-gray-500">{getTranslationWithFallback('enable_two_factor', 'Enable two-factor authentication for admin accounts')}</p>
                  </div>
                  <Switch 
                    checked={settings.security.twoFactorAuth}
                    onCheckedChange={(checked) => handleChange('security', 'twoFactorAuth', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                    <Input 
                      id="passwordMinLength" 
                      type="number"
                      min={6}
                      max={30}
                      value={settings.security.passwordMinLength}
                      onChange={(e) => handleChange('security', 'passwordMinLength', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input 
                      id="maxLoginAttempts" 
                      type="number"
                      min={1}
                      max={10}
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) => handleChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Require Special Character</p>
                      <p className="text-sm text-gray-500">Passwords must include a special character</p>
                    </div>
                    <Switch 
                      checked={settings.security.passwordRequireSpecialChar}
                      onCheckedChange={(checked) => handleChange('security', 'passwordRequireSpecialChar', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Require Number</p>
                      <p className="text-sm text-gray-500">Passwords must include at least one number</p>
                    </div>
                    <Switch 
                      checked={settings.security.passwordRequireNumber}
                      onCheckedChange={(checked) => handleChange('security', 'passwordRequireNumber', checked)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input 
                    id="sessionTimeout" 
                    type="number"
                    min={15}
                    max={1440}
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleChange('security', 'sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle>{getTranslationWithFallback('feature_settings', 'Feature Settings')}</CardTitle>
                <CardDescription>{getTranslationWithFallback('enable_disable_features', 'Enable or disable platform features')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">User Registration</p>
                      <p className="text-sm text-gray-500">Allow new candidate registrations</p>
                    </div>
                    <Switch 
                      checked={settings.features.allowUserRegistration}
                      onCheckedChange={(checked) => handleChange('features', 'allowUserRegistration', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Company Registration</p>
                      <p className="text-sm text-gray-500">Allow new company registrations</p>
                    </div>
                    <Switch 
                      checked={settings.features.allowCompanyRegistration}
                      onCheckedChange={(checked) => handleChange('features', 'allowCompanyRegistration', checked)}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Job Approval Required</p>
                      <p className="text-sm text-gray-500">Require admin approval for new job listings</p>
                    </div>
                    <Switch 
                      checked={settings.features.jobApprovalRequired}
                      onCheckedChange={(checked) => handleChange('features', 'jobApprovalRequired', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Featured Jobs</p>
                      <p className="text-sm text-gray-500">Enable featured job listings</p>
                    </div>
                    <Switch 
                      checked={settings.features.enableFeaturedJobs}
                      onCheckedChange={(checked) => handleChange('features', 'enableFeaturedJobs', checked)}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Job Alerts</p>
                      <p className="text-sm text-gray-500">Enable email job alerts for candidates</p>
                    </div>
                    <Switch 
                      checked={settings.features.enableJobAlerts}
                      onCheckedChange={(checked) => handleChange('features', 'enableJobAlerts', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Candidate Search</p>
                      <p className="text-sm text-gray-500">Enable candidate search for companies</p>
                    </div>
                    <Switch 
                      checked={settings.features.enableCandidateSearch}
                      onCheckedChange={(checked) => handleChange('features', 'enableCandidateSearch', checked)}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Company Analytics</p>
                    <p className="text-sm text-gray-500">Enable analytics dashboard for companies</p>
                  </div>
                  <Switch 
                    checked={settings.features.enableCompanyAnalytics}
                    onCheckedChange={(checked) => handleChange('features', 'enableCompanyAnalytics', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>{t('email_settings') || 'Email Settings'}</CardTitle>
                <CardDescription>{getTranslationWithFallback('configure_email', 'Configure email server settings')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input 
                      id="smtpHost" 
                      value={settings.email.smtpHost}
                      onChange={(e) => handleChange('email', 'smtpHost', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input 
                      id="smtpPort" 
                      type="number"
                      value={settings.email.smtpPort}
                      onChange={(e) => handleChange('email', 'smtpPort', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpUsername">SMTP Username</Label>
                    <Input 
                      id="smtpUsername" 
                      value={settings.email.smtpUsername}
                      onChange={(e) => handleChange('email', 'smtpUsername', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword">SMTP Password</Label>
                    <Input 
                      id="smtpPassword" 
                      type="password"
                      value={settings.email.smtpPassword}
                      onChange={(e) => handleChange('email', 'smtpPassword', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emailFromName">From Name</Label>
                    <Input 
                      id="emailFromName" 
                      value={settings.email.emailFromName}
                      onChange={(e) => handleChange('email', 'emailFromName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailFromAddress">From Email Address</Label>
                    <Input 
                      id="emailFromAddress" 
                      type="email"
                      value={settings.email.emailFromAddress}
                      onChange={(e) => handleChange('email', 'emailFromAddress', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-md flex items-start gap-3 text-sm">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-yellow-700">Email Credentials</p>
                    <p className="text-yellow-700 mt-1">
                      Email credentials are sensitive information. Make sure your server is secure and these settings are properly
                      protected. Test your email configuration after making changes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>{getTranslationWithFallback('api_settings', 'API Settings')}</CardTitle>
                <CardDescription>{getTranslationWithFallback('configure_api', 'Configure API access and integrations')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable API Access</p>
                    <p className="text-sm text-gray-500">Allow external applications to access the platform API</p>
                  </div>
                  <Switch 
                    checked={settings.api.enableApiAccess}
                    onCheckedChange={(checked) => handleChange('api', 'enableApiAccess', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="rateLimit">API Rate Limit (requests per minute)</Label>
                  <Input 
                    id="rateLimit" 
                    type="number"
                    min={10}
                    max={1000}
                    value={settings.api.rateLimit}
                    onChange={(e) => handleChange('api', 'rateLimit', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input 
                    id="webhookUrl" 
                    value={settings.api.webhookUrl}
                    onChange={(e) => handleChange('api', 'webhookUrl', e.target.value)}
                  />
                  <p className="text-xs text-gray-500">This URL will receive notifications for important events on the platform</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-md flex items-start gap-3 text-sm">
                  <Database className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-green-700">API Keys</p>
                    <p className="text-green-700 mt-1">
                      API keys can be generated and managed in the API Keys section. 
                      Each key can have specific permissions and rate limits assigned.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className={`flex ${language === 'ar' ? 'justify-start' : 'justify-end'}`}>
          <Button 
            onClick={handleSaveSettings} 
            className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {t('save_changes') || 'Save Settings'}
          </Button>
        </div>
      </div>
    </OwnerLayout>
  );
};

export default OwnerSettings;

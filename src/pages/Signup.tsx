
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, Mail, Lock, User, Building } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const Signup = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [accountType, setAccountType] = useState<'individual' | 'company'>('individual');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Simple password strength calculation
    if (password.length === 0) {
      setPasswordStrength(0);
    } else if (password.length < 6) {
      setPasswordStrength(25);
    } else if (password.length < 8) {
      setPasswordStrength(50);
    } else if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      setPasswordStrength(100);
    } else if (/[A-Z]/.test(password) && /[0-9]/.test(password)) {
      setPasswordStrength(75);
    } else {
      setPasswordStrength(60);
    }
  }, [password]);

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 30) return 'bg-red-500';
    if (passwordStrength < 60) return 'bg-orange-500';
    if (passwordStrength < 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const validateForm = () => {
    if (step === 1) {
      if (accountType === 'company' && !companyName) {
        toast.error("Company name is required");
        return false;
      }
      if (accountType === 'individual' && !fullName) {
        toast.error("Full name is required");
        return false;
      }
      return true;
    }
    
    if (step === 2) {
      if (!email) {
        toast.error("Email is required");
        return false;
      }
      
      if (password !== confirmPassword) {
        toast.error("Passwords don't match");
        return false;
      }
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return false;
      }
      return true;
    }
    
    return true;
  };

  const handleNextStep = () => {
    if (validateForm()) {
      setStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Create user using Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: accountType === 'company' ? companyName : fullName,
            role: accountType === 'company' ? 'company' : 'candidate',
            approval_status: accountType === 'company' ? 'pending' : 'approved'
          }
        }
      });
      
      if (error) throw error;
      
      // Create company entry if user is registering as a company
      if (data.user && accountType === 'company') {
        const { error: companyError } = await supabase
          .from('companies')
          .insert({
            name: companyName,
            is_verified: false
          });

        if (companyError) {
          console.error('Error creating company:', companyError);
          // We don't throw here because the user is already created
        }
      }

      // Add activity log
      if (data.user) {
        await supabase.rpc('track_activity', {
          p_user_id: data.user.id,
          p_activity_type: 'signup',
          p_activity_data: accountType === 'company' 
            ? { company_name: companyName, account_type: accountType } 
            : { full_name: fullName, account_type: accountType }
        });
      }
      
      if (accountType === 'company') {
        toast.success("Company account created! Waiting for approval", {
          description: "You'll be notified when your account is approved."
        });
        navigate("/login");
      } else {
        toast.success("Account created successfully!", {
          description: "Welcome to Hirely. Let's start finding jobs."
        });
        // Individual users are automatically approved
        navigate("/dashboard");
      }
      
    } catch (error) {
      toast.error("Error creating account", {
        description: error instanceof Error ? error.message : "Please try again later."
      });
    } finally {
      setLoading(false);
    }
  };

  const benefits = accountType === 'company' 
    ? [
        'Create unlimited job postings',
        'Interview candidates with AI',
        'Get detailed candidate insights',
        'Match candidates to positions automatically',
      ]
    : [
        'Apply to jobs with one click',
        'Track all your applications',
        'AI-powered job recommendations',
        'Access to exclusive career resources',
      ];

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <>
            <div className="mb-6">
              <Label className="text-lg font-medium mb-3 block">{t('signupAs')}</Label>
              <RadioGroup 
                className="grid grid-cols-2 gap-4 mt-2" 
                value={accountType} 
                onValueChange={(value) => setAccountType(value as 'individual' | 'company')}
              >
                <div className={`flex flex-col items-center space-y-2 p-4 rounded-lg border-2 ${accountType === 'individual' ? 'border-hirely bg-hirely/5' : 'border-gray-200'} cursor-pointer transition-all duration-200`}>
                  <User className={`h-8 w-8 ${accountType === 'individual' ? 'text-hirely' : 'text-gray-400'}`} />
                  <RadioGroupItem value="individual" id="individual" className="sr-only" />
                  <Label htmlFor="individual" className={`cursor-pointer text-center ${accountType === 'individual' ? 'font-medium text-hirely' : ''}`}>{t('individual')}</Label>
                  <p className="text-xs text-gray-500 text-center">For job seekers</p>
                </div>
                
                <div className={`flex flex-col items-center space-y-2 p-4 rounded-lg border-2 ${accountType === 'company' ? 'border-hirely bg-hirely/5' : 'border-gray-200'} cursor-pointer transition-all duration-200`}>
                  <Building className={`h-8 w-8 ${accountType === 'company' ? 'text-hirely' : 'text-gray-400'}`} />
                  <RadioGroupItem value="company" id="company" className="sr-only" />
                  <Label htmlFor="company" className={`cursor-pointer text-center ${accountType === 'company' ? 'font-medium text-hirely' : ''}`}>{t('companyAccount')}</Label>
                  <p className="text-xs text-gray-500 text-center">For employers</p>
                </div>
              </RadioGroup>
            </div>
            
            {accountType === 'individual' ? (
              <div className="space-y-4">
                <Label htmlFor="full-name" className="text-base font-medium">{t('fullName')}</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="full-name"
                    name="full-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 block w-full transition-all duration-200 focus:ring-hirely focus:border-hirely"
                    placeholder="Your full name"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Label htmlFor="company-name" className="text-base font-medium">{t('companyName')}</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="company-name"
                    name="company-name"
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="pl-10 block w-full transition-all duration-200 focus:ring-hirely focus:border-hirely"
                    placeholder="Your company name"
                  />
                </div>
              </div>
            )}
          </>
        );
      case 2:
        return (
          <>
            <div className="space-y-4">
              <Label htmlFor="email" className="text-base font-medium">{t('email')}</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 block w-full transition-all duration-200 focus:ring-hirely focus:border-hirely"
                  placeholder="yourname@example.com"
                />
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <Label htmlFor="password" className="text-base font-medium">{t('password')}</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 block w-full transition-all duration-200 focus:ring-hirely focus:border-hirely"
                  placeholder="Create a secure password"
                />
              </div>
              {password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <span>Password strength</span>
                    <span className={passwordStrength > 70 ? "text-green-600" : "text-gray-500"}>
                      {passwordStrength < 30 && "Weak"}
                      {passwordStrength >= 30 && passwordStrength < 60 && "Fair"}
                      {passwordStrength >= 60 && passwordStrength < 80 && "Good"}
                      {passwordStrength >= 80 && "Strong"}
                    </span>
                  </div>
                  <Progress 
                    value={passwordStrength} 
                    className={`h-1 bg-gray-200 ${getPasswordStrengthColor()}`}
                  />
                </div>
              )}
            </div>

            <div className="space-y-4 mt-6">
              <Label htmlFor="confirm-password" className="text-base font-medium">{t('confirmPassword')}</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 block w-full transition-all duration-200 focus:ring-hirely focus:border-hirely"
                  placeholder="Confirm your password"
                />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <MainLayout withFooter={false}>
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="text-center sm:text-left">
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900 relative inline-block">
                {t('signup')}
                <span className="absolute bottom-0 left-0 w-full h-1 bg-hirely rounded-full"></span>
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {t('login')} {' '}
                <Link to="/login" className="font-medium text-hirely hover:text-hirely-dark transition-colors">
                  {t('login')}
                </Link>
              </p>
            </div>

            <div className="mt-8">
              <div className="flex justify-between items-center mb-6">
                <div className="w-1/2 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-hirely rounded-full transition-all duration-300"
                    style={{ width: `${step * 50}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500">Step {step} of 2</span>
              </div>
              
              <form className="space-y-6" onSubmit={step === 2 ? handleSignup : handleNextStep}>
                {renderStep()}

                <div className="flex gap-3 pt-4">
                  {step > 1 && (
                    <Button
                      type="button"
                      onClick={handlePrevStep}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors"
                    >
                      Back
                    </Button>
                  )}
                  
                  {step < 2 ? (
                    <Button
                      type="submit"
                      className="flex-1 bg-hirely hover:bg-hirely-dark text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="flex-1 bg-hirely hover:bg-hirely-dark text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                      disabled={loading}
                    >
                      {loading ? t('loading') : t('signup')}
                    </Button>
                  )}
                </div>
              </form>

              <div className="mt-6">
                <p className="text-xs text-center text-gray-500">
                  By signing up, you agree to our{' '}
                  <Link to="/terms" className="text-hirely hover:text-hirely-dark transition-colors">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-hirely hover:text-hirely-dark transition-colors">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:block relative w-0 flex-1 bg-hirely overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-hirely to-hirely-dark opacity-90"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiPjwvcmVjdD4KPHBhdGggZD0iTTAgNUw1IDBaTTYgNEw0IDZaTS0xIDFMMSAtMVoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-10"></div>
          <div className="absolute inset-0 flex flex-col justify-center px-12">
            <div className="max-w-lg animate-fade-in-right">
              <h2 className="text-3xl font-extrabold text-white">
                {accountType === 'company' 
                  ? 'Start hiring smarter with AI-powered interviews' 
                  : 'Find your dream job with AI-powered matching'}
              </h2>
              <ul className="mt-8 space-y-5">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start animate-slide-in" style={{ animationDelay: `${index * 150}ms` }}>
                    <CheckCircle className="h-6 w-6 text-white flex-shrink-0" />
                    <span className="ml-3 text-white text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-12 bg-white/10 p-6 rounded-lg backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                <p className="text-white font-medium">
                  {accountType === 'company'
                    ? '"Hirely has revolutionized our hiring process, saving us countless hours and helping us find candidates that truly fit our culture."'
                    : '"Hirely helped me land my dream job in just two weeks. The AI matched me with positions I might have otherwise overlooked."'}
                </p>
                <p className="mt-4 text-white">
                  <span className="font-bold">
                    {accountType === 'company' ? 'Sarah Chen • Head of HR, TechCorp' : 'Michael Garcia • Software Engineer'}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="absolute bottom-8 right-8">
            <div className="flex space-x-3">
              <div className="w-3 h-3 rounded-full bg-white/70 animate-pulse" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 rounded-full bg-white/50 animate-pulse" style={{ animationDelay: '500ms' }}></div>
              <div className="w-3 h-3 rounded-full bg-white/30 animate-pulse" style={{ animationDelay: '1000ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Signup;

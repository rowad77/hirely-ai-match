
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle } from 'lucide-react';
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
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    if (accountType === 'company' && !companyName) {
      toast.error("Company name is required");
      return false;
    }
    if (!fullName) {
      toast.error("Full name is required");
      return false;
    }
    return true;
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

  return (
    <MainLayout withFooter={false}>
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="text-center sm:text-left">
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">{t('signup')}</h2>
              <p className="mt-2 text-sm text-gray-600">
                {t('login')} {' '}
                <Link to="/login" className="font-medium text-hirely hover:text-hirely-dark transition-colors">
                  {t('login')}
                </Link>
              </p>
            </div>

            <div className="mt-8">
              <div className="mb-6">
                <Label>{t('signupAs')}</Label>
                <RadioGroup 
                  className="flex gap-4 mt-2" 
                  value={accountType} 
                  onValueChange={(value) => setAccountType(value as 'individual' | 'company')}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="individual" id="individual" />
                    <Label htmlFor="individual" className="cursor-pointer">{t('individual')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="company" id="company" />
                    <Label htmlFor="company" className="cursor-pointer">{t('company')}</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <form className="space-y-6" onSubmit={handleSignup}>
                {accountType === 'individual' ? (
                  <div className="space-y-1">
                    <Label htmlFor="full-name">{t('fullName')}</Label>
                    <Input
                      id="full-name"
                      name="full-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="block w-full transition-all duration-200 focus:ring-hirely focus:border-hirely"
                      placeholder="Your full name"
                    />
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Label htmlFor="company-name">{t('companyName')}</Label>
                    <Input
                      id="company-name"
                      name="company-name"
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="block w-full transition-all duration-200 focus:ring-hirely focus:border-hirely"
                      placeholder="Your company name"
                    />
                  </div>
                )}
                
                <div className="space-y-1">
                  <Label htmlFor="email">{t('email')}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full transition-all duration-200 focus:ring-hirely focus:border-hirely"
                    placeholder="yourname@example.com"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="password">{t('password')}</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full transition-all duration-200 focus:ring-hirely focus:border-hirely"
                    placeholder="Create a secure password"
                  />
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

                <div className="space-y-1">
                  <Label htmlFor="confirm-password">{t('confirmPassword')}</Label>
                  <Input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full transition-all duration-200 focus:ring-hirely focus:border-hirely"
                    placeholder="Confirm your password"
                  />
                </div>

                <div>
                  <Button 
                    type="submit" 
                    className="w-full bg-hirely hover:bg-hirely-dark transition-colors duration-300 transform hover:scale-[1.02] active:scale-[0.98]" 
                    disabled={loading}
                  >
                    {loading ? t('loading') : t('signup')}
                  </Button>
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
        </div>
      </div>
    </MainLayout>
  );
};

export default Signup;


import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import MobileNav from './MobileNav';
import LanguageToggle from '@/components/LanguageToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  UserRound,
  History,
  Moon,
  Sun,
  LogOut
} from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut, userRole } = useAuth();
  const { t } = useLanguage();
  const [profile, setProfile] = useState<Partial<Tables<'profiles'>> | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setProfile(data);
        }
      }
    };

    fetchProfile();
  }, [user]);

  const primaryNavItems = [
    { to: '/', label: t('home') },
    { to: '/jobs', label: t('findJobs') },
  ];

  const conditionalNavItems = [
    userRole === 'company' && { to: '/company', label: t('companyPortal') },
    userRole === 'owner' && { to: '/owner', label: t('adminPanel') },
  ].filter(Boolean);

  return (
    <nav className="bg-background border-b">
      <div className="flex h-14 sm:h-16 items-center px-3 sm:px-4 lg:px-6">
        <Link to="/" className="font-bold text-xl sm:text-2xl text-hirely">
          Hirely
        </Link>

        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {primaryNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-hirely
                  ${isActive ? 'text-hirely font-semibold' : 'text-muted-foreground'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            
            {conditionalNavItems.map((item: any) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-hirely-dark
                  ${isActive ? 'text-hirely-dark font-semibold' : 'text-muted-foreground'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <MobileNav />
          </div>

          {/* Language Toggle */}
          <LanguageToggle />

          {/* User Account / Auth Buttons */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full">
                  <Avatar className="h-7 w-7 sm:h-9 sm:w-9">
                    <AvatarImage
                      src={profile?.avatar_url || undefined}
                      alt={profile?.full_name || "User avatar"}
                    />
                    <AvatarFallback>
                      {profile?.full_name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{t('dashboard')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>{t('dashboard')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <UserRound className="mr-2 h-4 w-4" />
                    <span>{t('profile')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/application-history">
                    <History className="mr-2 h-4 w-4" />
                    <span>{t('applications')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" size={isMobile ? "sm" : "default"} className="text-xs sm:text-sm">
                  {t('login')}
                </Button>
              </Link>
              <Link to="/signup">
                <Button size={isMobile ? "sm" : "default"} className="text-xs sm:text-sm">{t('signup')}</Button>
              </Link>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={toggleTheme} className="hidden sm:flex">
            {theme === "dark" ? (
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            ) : (
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

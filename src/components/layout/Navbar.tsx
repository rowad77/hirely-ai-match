import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import MobileNav from './MobileNav';
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

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut, userRole } = useAuth();
  const [profile, setProfile] = useState<Partial<Tables<'profiles'>> | null>(null);

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
    { to: '/', label: 'Home' },
    { to: '/jobs', label: 'Find Jobs' },
  ];

  const conditionalNavItems = [
    userRole === 'company' && { to: '/company/dashboard', label: 'Company Portal' },
    userRole === 'owner' && { to: '/owner/dashboard', label: 'Admin Panel' },
  ].filter(Boolean);

  return (
    <nav className="bg-background border-b">
      <div className="flex h-16 items-center px-4">
        <Link to="/" className="font-bold text-2xl text-hirely rtl:ml-auto">
          Hirely
        </Link>

        <div className="rtl:mr-auto ltr:ml-auto flex items-center space-x-4 rtl:space-x-reverse">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 rtl:gap-reverse">
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

          {/* User Account / Auth Buttons */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-9 w-9">
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
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <UserRound className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/application-history">
                    <History className="mr-2 h-4 w-4" />
                    <span>Applications</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
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

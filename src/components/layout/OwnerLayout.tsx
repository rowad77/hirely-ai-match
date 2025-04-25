
import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Briefcase, Settings, LogOut, Home, BarChart3, Shield, Database, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import Navbar from './Navbar';
import { useLanguage } from '@/context/LanguageContext';
import { useRtlDirection, useRtlTextAlign } from '@/lib/rtl-utils';

type OwnerLayoutProps = {
  children: ReactNode;
  title: string;
};

const OwnerLayout = ({ children, title }: OwnerLayoutProps) => {
  const location = useLocation();
  const { logout } = useAuth();
  const { t, language } = useLanguage();
  const rtlDirection = useRtlDirection();
  const rtlTextAlign = useRtlTextAlign();
  
  const isActiveRoute = (path: string) => {
    // For exact matches
    if (location.pathname === path) {
      return true;
    }
    
    // For parent paths - check if the current path starts with the nav path
    if (path !== '/owner' && location.pathname.startsWith(path + '/')) {
      return true;
    }
    
    // Special case for the dashboard
    if (path === '/owner' && location.pathname === '/owner') {
      return true;
    }
    
    return false;
  };

  const navItems = [
    { name: t('dashboard'), path: '/owner', icon: LayoutDashboard },
    { name: t('company'), path: '/owner/companies', icon: Briefcase },
    { name: t('total_users'), path: '/owner/users', icon: Users },
    { name: t('jobs'), path: '/owner/jobs', icon: Database },
    { name: t('analytics'), path: '/owner/analytics', icon: BarChart3 },
    { name: t('settings'), path: '/owner/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow border-r border-gray-200 bg-white pt-5 pb-4 overflow-y-auto">
            <div className={`flex items-center flex-shrink-0 px-4 mb-5 ${rtlDirection}`}>
              <Shield className="h-6 w-6 text-purple-600 mx-2" />
              <span className="text-xl font-medium text-gray-900">{t('owner_dashboard')}</span>
            </div>
            <div className="mt-5 flex-grow flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActiveRoute(item.path);
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={cn(
                        active
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                        `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${rtlDirection}`
                      )}
                    >
                      <Icon
                        className={cn(
                          active ? 'text-white' : 'text-gray-400 group-hover:text-gray-500',
                          'mx-3 flex-shrink-0 h-5 w-5'
                        )}
                      />
                      {item.name}
                    </Link>
                  );
                })}
                <div className="pt-8">
                  <button 
                    className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 ${rtlDirection}`}
                    onClick={handleLogout}
                  >
                    <LogOut className="mx-3 flex-shrink-0 h-5 w-5 text-red-400" />
                    {t('sign_out')}
                  </button>
                </div>
              </nav>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              <div className={`pb-5 border-b border-gray-200 mb-5 ${rtlTextAlign}`}>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              </div>
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default OwnerLayout;

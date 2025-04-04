
import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building, Briefcase, Users, Settings, LogOut, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import Navbar from './Navbar';

type CompanyLayoutProps = {
  children: ReactNode;
  title: string;
};

const CompanyLayout = ({ children, title }: CompanyLayoutProps) => {
  const location = useLocation();
  
  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/company', icon: Home },
    { name: 'Jobs', path: '/company/jobs', icon: Briefcase },
    { name: 'Applications', path: '/company/applications', icon: Users },
    { name: 'Company Settings', path: '/company/settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow border-r border-gray-200 bg-white pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 mb-5">
              <Building className="h-6 w-6 text-hirely mr-2" />
              <span className="text-xl font-medium text-gray-900">Company Portal</span>
            </div>
            <div className="mt-5 flex-grow flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={cn(
                        isActiveRoute(item.path)
                          ? 'bg-hirely text-white'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                      )}
                    >
                      <Icon
                        className={cn(
                          isActiveRoute(item.path) ? 'text-white' : 'text-gray-400 group-hover:text-gray-500',
                          'mr-3 flex-shrink-0 h-5 w-5'
                        )}
                      />
                      {item.name}
                    </Link>
                  );
                })}
                <div className="pt-8">
                  <button 
                    className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-red-400" />
                    Sign Out
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
              <div className="pb-5 border-b border-gray-200 mb-5 flex justify-between items-center">
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

export default CompanyLayout;

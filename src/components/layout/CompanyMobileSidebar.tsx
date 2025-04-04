
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Building, Menu, Briefcase, Users, Settings, LogOut, Home, BarChart3, Search, Calendar } from 'lucide-react';

const CompanyMobileSidebar = () => {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', path: '/company', icon: Home },
    { name: 'Jobs', path: '/company/jobs', icon: Briefcase },
    { name: 'Applications', path: '/company/applications', icon: Users },
    { name: 'Interviews', path: '/company/interviews', icon: Calendar },
    { name: 'Analytics', path: '/company/analytics', icon: BarChart3 },
    { name: 'Candidate Search', path: '/company/candidates', icon: Search },
    { name: 'Company Settings', path: '/company/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex flex-col h-full bg-white">
          <div className="flex items-center p-4 border-b">
            <Building className="h-6 w-6 text-hirely mr-2" />
            <span className="text-xl font-medium">Company Portal</span>
          </div>
          <div className="flex-1 py-2">
            <nav className="space-y-1 px-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.name} 
                    to={item.path}
                    className="flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    onClick={handleLinkClick}
                  >
                    <Icon className="mr-4 flex-shrink-0 h-6 w-6 text-gray-400" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="p-4 border-t">
            <button 
              className="w-full flex items-center px-2 py-2 text-base font-medium rounded-md text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-4 flex-shrink-0 h-6 w-6 text-red-400" />
              Sign Out
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CompanyMobileSidebar;

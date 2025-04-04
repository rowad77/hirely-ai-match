
import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Building, Briefcase, Users, Settings, LogOut, Home } from 'lucide-react';
import { Link } from "react-router-dom";

const CompanyMobileSidebar = () => {
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
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center">
            <Building className="h-5 w-5 text-hirely mr-2" />
            <span>Company Portal</span>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  isActiveRoute(item.path)
                    ? "bg-hirely text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  "group flex items-center px-3 py-2 text-sm font-medium"
                )}
              >
                <Icon
                  className={cn(
                    isActiveRoute(item.path) ? "text-white" : "text-gray-400 group-hover:text-gray-500",
                    "mr-3 flex-shrink-0 h-5 w-5"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
          <div className="mt-auto border-t pt-2 mx-2">
            <button 
              className="w-full group flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
            >
              <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-red-400" />
              Sign Out
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CompanyMobileSidebar;

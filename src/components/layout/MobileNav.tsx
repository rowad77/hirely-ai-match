
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  const { userRole } = useAuth();

  const baseNavItems = [
    { to: '/', label: t('home') },
    { to: '/jobs', label: t('findJobs') },
    { to: '/dashboard', label: t('dashboard') },
    { to: '/application-history', label: t('applications') },
  ];

  // Add role-specific items
  const navItems = [
    ...baseNavItems,
    ...(userRole === 'company' ? [{ to: '/company', label: t('companyPortal') }] : []),
    ...(userRole === 'owner' ? [{ to: '/owner', label: t('adminPanel') }] : []),
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon" className="h-8 w-8 p-1">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80%] p-0">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex justify-between items-center">
            <span className="font-bold text-2xl text-hirely">Hirely</span>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 overflow-auto py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-base transition-colors
                  ${isActive 
                    ? 'text-hirely font-medium bg-hirely/5' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;

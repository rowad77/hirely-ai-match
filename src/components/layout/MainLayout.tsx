
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { BreadcrumbNav } from './BreadcrumbNav';
import MobileNav from './MobileNav';

type MainLayoutProps = {
  children: ReactNode;
  withFooter?: boolean;
  fullWidth?: boolean;
};

const MainLayout = ({ children, withFooter = true, fullWidth = false }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="sticky top-0 z-50">
        <Navbar />
        <div className="bg-gray-50 py-2">
          <div className={`${fullWidth ? 'w-full' : 'max-w-7xl mx-auto px-4 sm:px-6'}`}>
            <BreadcrumbNav />
          </div>
        </div>
      </div>
      <main className={`flex-grow ${fullWidth ? 'w-full' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'} py-6`}>
        <div className="w-full">
          {children}
        </div>
      </main>
      {withFooter && <Footer />}
    </div>
  );
};

export default MainLayout;

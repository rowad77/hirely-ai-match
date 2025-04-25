
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
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-50">
        <Navbar />
        <div className="bg-gray-50 py-2 px-4">
          <div className={`${fullWidth ? '' : 'max-w-7xl mx-auto'}`}>
            <BreadcrumbNav />
          </div>
        </div>
      </div>
      <main className={`flex-grow ${fullWidth ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'} rtl:space-reverse`}>
        {children}
      </main>
      {withFooter && <Footer />}
    </div>
  );
};

export default MainLayout;

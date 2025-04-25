
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { BreadcrumbNav } from './BreadcrumbNav';

type MainLayoutProps = {
  children: ReactNode;
  withFooter?: boolean;
  fullWidth?: boolean;
};

const MainLayout = ({ children, withFooter = true, fullWidth = false }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="bg-gray-50 py-2 px-4">
        <div className={`${fullWidth ? '' : 'max-w-7xl mx-auto'}`}>
          <BreadcrumbNav />
        </div>
      </div>
      <main className={`flex-grow ${fullWidth ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
        {children}
      </main>
      {withFooter && <Footer />}
    </div>
  );
};

export default MainLayout;

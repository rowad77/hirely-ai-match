
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

type MainLayoutProps = {
  children: ReactNode;
  withFooter?: boolean;
  fullWidth?: boolean;
};

const MainLayout = ({ children, withFooter = true, fullWidth = false }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className={`flex-grow ${fullWidth ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
        {children}
      </main>
      {withFooter && <Footer />}
    </div>
  );
};

export default MainLayout;

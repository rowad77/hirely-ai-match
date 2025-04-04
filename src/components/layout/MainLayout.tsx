
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

type MainLayoutProps = {
  children: ReactNode;
  withFooter?: boolean;
};

const MainLayout = ({ children, withFooter = true }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-16">
        {children}
      </main>
      {withFooter && <Footer />}
    </div>
  );
};

export default MainLayout;

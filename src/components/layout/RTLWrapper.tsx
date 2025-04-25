
import { ReactNode } from 'react';

interface RTLWrapperProps {
  children: ReactNode;
}

const RTLWrapper = ({ children }: RTLWrapperProps) => {
  return (
    <div dir="rtl" className="font-sans">
      {children}
    </div>
  );
};

export default RTLWrapper;

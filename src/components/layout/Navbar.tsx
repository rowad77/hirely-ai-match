
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const location = useLocation();

  // Handle scroll position for navbar transparency
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };
  
  const isTransparent = scrollPosition < 10 && location.pathname === '/';

  return (
    <nav 
      className={cn(
        "fixed w-full top-0 z-50 transition-all duration-300",
        isTransparent 
          ? "bg-transparent" 
          : "bg-white/80 backdrop-blur-md shadow-sm"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className={cn(
                "font-bold text-2xl transition-colors",
                isTransparent ? "text-white" : "text-hirely-dark"
              )}>hirely</span>
              <span className="text-hirely-accent font-bold">.</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link 
                to="/features" 
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-full transition-colors",
                  isActiveLink('/features') 
                    ? "bg-hirely text-white" 
                    : isTransparent
                      ? "text-white/90 hover:text-white hover:bg-white/10" 
                      : "text-gray-700 hover:text-hirely-dark hover:bg-gray-50"
                )}
              >
                Features
              </Link>
              <Link 
                to="/pricing" 
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-full transition-colors",
                  isActiveLink('/pricing') 
                    ? "bg-hirely text-white" 
                    : isTransparent
                      ? "text-white/90 hover:text-white hover:bg-white/10" 
                      : "text-gray-700 hover:text-hirely-dark hover:bg-gray-50"
                )}
              >
                Pricing
              </Link>
              <Link 
                to="/about" 
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-full transition-colors",
                  isActiveLink('/about') 
                    ? "bg-hirely text-white" 
                    : isTransparent
                      ? "text-white/90 hover:text-white hover:bg-white/10" 
                      : "text-gray-700 hover:text-hirely-dark hover:bg-gray-50"
                )}
              >
                About
              </Link>
              <Link to="/login">
                <Button 
                  variant={isTransparent ? "outline" : "outline"} 
                  size="sm"
                  className={cn(
                    "rounded-full transition-all",
                    isTransparent && "text-white border-white/50 hover:bg-white/10"
                  )}
                >
                  Log in
                </Button>
              </Link>
              <Link to="/signup">
                <Button 
                  className={cn(
                    "rounded-full transition-all",
                    isTransparent 
                      ? "bg-white text-hirely hover:bg-gray-100" 
                      : "bg-hirely hover:bg-hirely-dark text-white"
                  )}
                >
                  Sign up free
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn(
                "inline-flex items-center justify-center p-2 rounded-md focus:outline-none",
                isTransparent 
                  ? "text-white hover:text-white hover:bg-white/10" 
                  : "text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              )}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md shadow-xl rounded-b-xl border-t border-gray-100 animate-fade-in-up">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/features" 
              className={cn(
                "block px-3 py-2 text-base font-medium rounded-lg transition-colors",
                isActiveLink('/features')
                  ? "bg-hirely text-white"
                  : "text-gray-700 hover:text-hirely-dark hover:bg-gray-50"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              to="/pricing" 
              className={cn(
                "block px-3 py-2 text-base font-medium rounded-lg transition-colors",
                isActiveLink('/pricing')
                  ? "bg-hirely text-white"
                  : "text-gray-700 hover:text-hirely-dark hover:bg-gray-50"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              to="/about" 
              className={cn(
                "block px-3 py-2 text-base font-medium rounded-lg transition-colors",
                isActiveLink('/about')
                  ? "bg-hirely text-white"
                  : "text-gray-700 hover:text-hirely-dark hover:bg-gray-50"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <Link 
                to="/login" 
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-hirely-dark hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Log in
              </Link>
              <div className="mt-3 px-3">
                <Link 
                  to="/signup" 
                  className="block w-full bg-hirely hover:bg-hirely-dark text-white py-2 px-4 rounded-full text-center font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign up free
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

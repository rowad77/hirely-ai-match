
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-hirely-dark font-bold text-2xl">hirely</span>
              <span className="text-hirely-accent font-bold">.</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link to="/features" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-hirely-dark">
                Features
              </Link>
              <Link to="/pricing" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-hirely-dark">
                Pricing
              </Link>
              <Link to="/about" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-hirely-dark">
                About
              </Link>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-hirely hover:bg-hirely-dark">
                  Sign up free
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-b-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/features" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-hirely-dark hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              to="/pricing" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-hirely-dark hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              to="/about" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-hirely-dark hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <Link 
                to="/login" 
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-hirely-dark hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Log in
              </Link>
              <div className="mt-3 px-3">
                <Link 
                  to="/signup" 
                  className="block w-full bg-hirely hover:bg-hirely-dark text-white py-2 px-4 rounded text-center font-medium"
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

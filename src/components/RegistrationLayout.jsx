import { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';

export const RegistrationLayout = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine header elements based on path
  const isSuccess = location.pathname.includes('/success');

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col font-inter text-[#1a1c1e]">
      {/* Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#f8f9fc]
        ${isScrolled ? 'shadow-[0_2px_10px_rgba(0,0,0,0.05)]' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold font-manrope tracking-tight text-black">
            GDG Portal
          </Link>

          {!isSuccess ? (
            <>
              <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                <Link to="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                  Home
                </Link>
                <Link to="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                  Timeline
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-[#0058bd] relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-full after:h-0.5 after:bg-[#0058bd] after:rounded-full"
                >
                  Register
                </Link>
              </nav>

              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 hidden md:block">
                Sign In
              </Link>
            </>
          ) : (
            <div className="text-sm font-medium text-gray-600">
              Step 4 of 4
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-28 pb-16 px-4">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-auto bg-[#f8f9fc]">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
            <span className="font-bold font-manrope text-base">GDG Portal</span>
            <span className="text-xs text-gray-500">© 2024 Google Developer Groups</span>
          </div>
          
          <div className="flexItems-center gap-6 text-xs font-medium text-gray-500">
            <a href="#" className="hover:text-gray-900 transition-colors">Resources</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Guidelines</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RegistrationLayout;

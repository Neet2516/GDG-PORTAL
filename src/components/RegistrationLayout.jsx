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

  const isSuccess = location.pathname.includes('/success');

  return (
    <div className="min-h-screen bg-[#02040b] text-white">
      <header
        className={`sticky top-0 z-40 border-b transition-all duration-300 ${
          isScrolled
            ? 'border-cyan-400/20 bg-[rgba(3,8,14,0.92)] backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.35)]'
            : 'border-white/5 bg-[rgba(3,8,14,0.6)] backdrop-blur-md'
        }`}
      >
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="font-manrope text-sm font-semibold uppercase tracking-[0.28em] text-[#9ceff2]">
            GDG Portal
          </Link>

          {!isSuccess ? (
            <>
              <nav className="hidden items-center gap-6 md:flex">
                <Link to="/" className="text-sm font-medium tracking-[0.2em] text-white/70 transition hover:text-white">
                  Home
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium tracking-[0.2em] text-[#18e9ff] transition hover:text-[#8ff8ff]"
                >
                  Register
                </Link>
              </nav>

              <Link
                to="/login"
                className="rounded-full border border-[#18e9ff]/30 bg-[rgba(9,20,24,0.92)] px-4 py-2 text-sm font-semibold tracking-[0.18em] text-[#d9fbff] transition hover:border-[#18e9ff]/50 hover:bg-[rgba(12,30,34,0.96)]"
              >
                Sign In
              </Link>
            </>
          ) : (
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
              Step 4 of 4
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1180px] px-4 py-10 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <footer className="border-t border-white/5 bg-[rgba(2,4,11,0.9)]">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-4 px-4 py-6 text-sm text-white/45 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex flex-col gap-1">
            <span className="font-manrope text-sm font-semibold uppercase tracking-[0.24em] text-white/80">
              GDG Portal
            </span>
            <span className="font-manrope text-xs text-white/40">© 2026 Google Developer Groups</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 uppercase tracking-[0.22em] text-white/45">
            <a href="#" className="transition hover:text-white">
              Resources
            </a>
            <a href="#" className="transition hover:text-white">
              Guidelines
            </a>
            <a href="#" className="transition hover:text-white">
              Privacy
            </a>
            <a href="#" className="transition hover:text-white">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RegistrationLayout;
